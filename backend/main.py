from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import google.generativeai as genai
from supabase import create_client, Client
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="GUMUNUFU Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
else:
    model = None
    print("WARNING: GEMINI_API_KEY not set. Chat will not work.")


class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: str


class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Message] = []


class ChatResponse(BaseModel):
    response: str
    timestamp: str


def fetch_transactions_from_supabase():
    """Fetch all transactions from Supabase"""
    if not supabase:
        return []
    
    try:
        response = supabase.table('transactions').select('*').order('date', desc=True).execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        return []


def analyze_query_for_filters(query: str):
    """Determine if query needs filtered transactions (date ranges, categories, etc.)"""
    query_lower = query.lower()
    
    filters = {
        'category': None,
        'date_filter': None,
        'amount_filter': None
    }
    
    # Category detection
    categories = ['groceries', 'dining', 'gas', 'shopping', 'entertainment', 
                  'utilities', 'fitness', 'travel', 'insurance', 'healthcare']
    for cat in categories:
        if cat in query_lower:
            filters['category'] = cat.capitalize()
    
    # Date detection
    if 'last month' in query_lower or 'previous month' in query_lower:
        filters['date_filter'] = 'last_month'
    elif 'this month' in query_lower or 'current month' in query_lower:
        filters['date_filter'] = 'this_month'
    elif 'last week' in query_lower:
        filters['date_filter'] = 'last_week'
    
    return filters


def filter_transactions(transactions, filters):
    """Filter transactions based on query analysis"""
    if not transactions:
        return []
    
    filtered = transactions
    
    # Category filter
    if filters['category']:
        filtered = [t for t in filtered if t.get('category', '').lower() == filters['category'].lower()]
    
    # Date filter (simplified - you can enhance this)
    if filters['date_filter']:
        from datetime import datetime, timedelta
        now = datetime.now()
        
        if filters['date_filter'] == 'this_month':
            filtered = [t for t in filtered if t.get('date', '').startswith(f"{now.year}-{now.month:02d}")]
        elif filters['date_filter'] == 'last_month':
            last_month = now.month - 1 if now.month > 1 else 12
            year = now.year if now.month > 1 else now.year - 1
            filtered = [t for t in filtered if t.get('date', '').startswith(f"{year}-{last_month:02d}")]
    
    return filtered


def build_transaction_context(transactions, max_transactions=50):
    """Build context string from transactions"""
    if not transactions:
        return "No transaction data available."
    
    # Limit transactions to avoid context overflow
    limited_transactions = transactions[:max_transactions]
    
    # Calculate summary statistics
    total_spending = sum(abs(t.get('amount', 0)) for t in limited_transactions)
    avg_transaction = total_spending / len(limited_transactions) if limited_transactions else 0
    
    # Category breakdown
    category_totals = {}
    for t in limited_transactions:
        cat = t.get('category', 'Other')
        category_totals[cat] = category_totals.get(cat, 0) + abs(t.get('amount', 0))
    
    # Build context
    context = f"""
TRANSACTION SUMMARY:
- Total Transactions: {len(limited_transactions)}
- Total Spending: ${total_spending:.2f}
- Average Transaction: ${avg_transaction:.2f}

SPENDING BY CATEGORY:
"""
    for cat, total in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
        percentage = (total / total_spending * 100) if total_spending > 0 else 0
        context += f"- {cat}: ${total:.2f} ({percentage:.1f}%)\n"
    
    context += f"\nRECENT TRANSACTIONS (showing {min(20, len(limited_transactions))} most recent):\n"
    for t in limited_transactions[:20]:
        context += f"- {t.get('date')}: {t.get('name')} - ${abs(t.get('amount', 0)):.2f} ({t.get('category', 'Other')})\n"
    
    return context


def build_conversation_context(history: List[Message]):
    """Build conversation history string"""
    if not history:
        return ""
    
    context = "\nCONVERSATION HISTORY:\n"
    for msg in history[-5:]:  # Last 5 messages to keep context manageable
        role = "User" if msg.role == "user" else "Assistant"
        context += f"{role}: {msg.content}\n"
    
    return context


async def generate_response(query: str, transactions, conversation_history: List[Message]):
    """Generate response using Gemini"""
    if not model:
        return "Error: GEMINI_API_KEY not configured. Please set the environment variable."
    
    # Analyze query and filter transactions if needed
    filters = analyze_query_for_filters(query)
    filtered_transactions = filter_transactions(transactions, filters)
    
    # Use filtered transactions if query seems specific, otherwise use all
    context_transactions = filtered_transactions if filtered_transactions and len(filtered_transactions) < len(transactions) else transactions
    
    # Build context
    transaction_context = build_transaction_context(context_transactions)
    conversation_context = build_conversation_context(conversation_history)
    
    # Build prompt
    prompt = f"""You are GUMUNUFU (Get Your Money Up, Not Your Funny Up), a personal finance assistant that helps users understand their spending habits and make better financial decisions.

{transaction_context}

{conversation_context}

User Question: {query}

Instructions:
- Analyze the user's spending data to provide specific, actionable insights
- When discussing purchases, consider the necessity scores (0-1, where 1 is essential)
- Provide concrete numbers and percentages from their actual data
- Be encouraging but honest about spending habits
- Suggest practical alternatives when appropriate
- If the user asks about a specific purchase or category, focus your analysis there
- Keep responses concise but informative (2-4 paragraphs)

Response:"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating response: {e}")
        return f"I apologize, but I encountered an error processing your question. Please try again. Error: {str(e)}"


@app.get("/")
async def root():
    return {"message": "GUMUNUFU Chat API is running", "status": "healthy"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint"""
    try:
        # Fetch transactions
        transactions = fetch_transactions_from_supabase()
        
        if not transactions:
            return ChatResponse(
                response="I don't see any transaction data yet. Please upload your transactions in the 'Upload Data' tab to get started!",
                timestamp=datetime.now().isoformat()
            )
        
        # Generate response
        response_text = await generate_response(
            request.message, 
            transactions, 
            request.conversation_history
        )
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "supabase_configured": supabase is not None,
        "gemini_configured": model is not None,
        "timestamp": datetime.now().isoformat()
    }