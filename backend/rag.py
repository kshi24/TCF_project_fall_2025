from sentence_transformers import SentenceTransformer
from transformers import pipeline
import numpy as np
import os



def load_documents_from_folder(folder_path):

    documents = []
    filenames = []

    if not os.path.exists(folder_path):
        print("Folder you inputted doesn't exist blud")
        return documents, filenames
    
    for filename in os.listdir(folder_path):
        if filename.endswith('.txt'):
            filepath = os.path.join(folder_path, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
                documents.append(content)
                filenames.append(filename)
    
    print(f"Loaded {len(documents)} documents from '{folder_path}'")
    return documents, filenames



def index_documents(documents):

    model = SentenceTransformer('all-MiniLM-L6-v2')

    print("Creating embeddings...")
    embeddings = model.encode(documents)
    print(f"Indexed {len(documents)} documents\n")

    return model, embeddings



def retrieve(query, model, doc_embeddings, documents, filenames, top_k=2):
    query_embedding = model.encode(query)

    def cos_similarity(vector1, vector2):
        return np.dot(vector1, vector2) / (np.linalg.norm(vector1) * np.linalg.norm(vector2))
    
    similarities = [cos_similarity(query_embedding, doc_embedding) for doc_embedding in doc_embeddings]
    top_indices = np.argsort(similarities)[-top_k:][::-1] #get indices of top k, reversed

    print(f"Top {top_k} relevant documents:")
    for idx in top_indices:
        print(f"  - {filenames[idx]} (similarity: {similarities[idx]:.4f})")
    print()
    
    retrieved_docs = [documents[idx] for idx in top_indices]
    return retrieved_docs



def generate_answer(query, context_docs):
    
    generator = pipeline("text2text-generation", model="google/flan-t5-small")

    combined_context = "\n\n".join(context_docs)
    prompt = f"""Answer the question based on the context below. If the answer is not contained within the text, say "I don't know".
    Context: {combined_context}
    Question: {query}
    Answer:"""

    print("Generating answer...")
    response = generator(prompt, max_length=150)
    return response[0]['generated_text']



def rag_pipeline(query, docs_folder="documents"):

    documents, filenames = load_documents_from_folder(docs_folder)
    if not documents:
        print("No documents to process. Exiting.")
        return
    
    model, doc_embeddings = index_documents(documents)

    retrieved_docs = retrieve(query, model, doc_embeddings, documents, filenames, top_k=2)

    answer = generate_answer(query, retrieved_docs)

    print("="*60)
    print(f"ANSWER: {answer}")
    print("="*60)
    
    return answer



if __name__ == "__main__":
    # Try different queries
    rag_pipeline("How do I activate a virtual environment in python?")
