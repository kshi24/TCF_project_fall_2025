# GUMUNUFU: Personal Finance Guidance Tool
### **Team Members:** Kyle Shibata, Otto Cline, Sankalp Mundra, Soham Nighojkar

## Overview
GUMUNUFU (short for "Get Your Money Up, Not Your Funny Up) is a personal finance tool that analyzes individual transaction history to provide tailored spending advice. Our website categorizes each transaction by how essential it is and uses this information to recommend suitable credit cards, suggest substitute goods, and assess whether a purchase is affordable or worthwhile. The end-goal is to create an AI-assistant that helps users understand their spending habits and make better financial decisions based on their own data.

## Key Features (Planned)
- **Transaction categorization:** Classify past expenses by essentiality.
- **Affordability analysis:** Evaluate whether a planned purchase fits within a user’s current budget.
- **Credit card recommendation:** Suggest cards that best match the user’s typical spending categories.
- **Substitute goods:** Recommend cheaper or more practical alternatives for discretionary purchases.
- **Conversational interface:** Allow users to ask financial questions in natural language (plain English).

## Technical Approach
- **Frontend:** React (basic dashboard and input forms)
- **Backend:** FastAPI (Python)
- **Database:** SQL (for MVP)
- **Modeling:** Scikit-learn for transaction classification and affordability predictions
- **Language Model:** Gemma (local via Ollama) for reasoning and natural-language responses

## Example Use Case
*At this moment, the system has a record of the user's available balance and recent transaction history.*
> User: “I spent $180 on new Nike sneakers. Was that a good buy?”  
> System: “This purchase is above your average discretionary budget and categorized as non-essential. You may want to wait or consider lower-cost options.”

## Data and Privacy
All personal data remains local to the user’s device.

---
