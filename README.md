# Knowledge Search

A RAG (Retrieval-Augmented Generation) application that allows you to upload documents and ask questions about them using AI.

## Features

- Upload PDF and TXT documents
- Automatic text extraction and chunking
- Vector embeddings using OpenAI
- Semantic search using ChromaDB
- AI-powered question answering with ChatGPT
- Modern React frontend with Tailwind CSS

## Tech Stack

**Backend:**
- FastAPI
- LangChain
- OpenAI Embeddings & Chat
- ChromaDB (Vector Store)
- PyPDF (PDF parsing)

**Frontend:**
- React 18 with TypeScript
- Vite
- Tailwind CSS

## Prerequisites

- Python 3.13 (recommended) or 3.12
- Node.js 18+
- OpenAI API Key

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd python-react-knowledge-search
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

> **Important:** Replace `your-openai-api-key-here` with your actual OpenAI API key. You can get one from [OpenAI Platform](https://platform.openai.com/api-keys).

### 3. Backend Setup

```bash
# Create virtual environment
python3.13 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On macOS/Linux
# or
.venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server

From the project root directory:

```bash
source .venv/bin/activate  # If not already activated
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

- Swagger UI: `http://127.0.0.1:8000/docs`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Upload a PDF or TXT document using the upload section
3. Wait for the document to be processed (chunked and embedded)
4. Ask questions about your document in the question input
5. View AI-generated answers based on your document content

## Project Structure

```
python-react-knowledge-search/
├── app/
│   ├── api/
│   │   ├── query.py        # Question answering endpoint
│   │   └── upload.py       # Document upload endpoint
│   ├── rag/
│   │   ├── embedding.py    # OpenAI embeddings
│   │   ├── retriever.py    # Similar chunk retrieval
│   │   └── splitter.py     # Text chunking
│   ├── services/
│   │   └── llm.py          # ChatGPT integration
│   └── main.py             # FastAPI app entry point
├── db/
│   └── vectorstore.py      # ChromaDB vector store
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   └── index.css       # Tailwind imports
│   └── package.json
├── .env                    # Environment variables (create this)
├── requirements.txt        # Python dependencies
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-document` | Upload a document (PDF/TXT) |
| GET | `/documents` | List all uploaded documents |
| DELETE | `/delete-document/{id}` | Delete a document |
| POST | `/ask` | Ask a question about uploaded documents |

## License

MIT
