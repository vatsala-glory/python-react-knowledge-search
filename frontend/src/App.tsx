import { useState, useEffect, ChangeEvent, FormEvent } from 'react'

const API_URL = 'http://127.0.0.1:8000'

interface Document {
  id: number
  filename: string
}

function App() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/documents`)
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/upload-document`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      alert(`Uploaded successfully! ${data.num_chunks} chunks created.`)
      fetchDocuments()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`${API_URL}/delete-document/${docId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchDocuments()
      } else {
        alert('Error deleting document')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Error deleting document')
    }
  }

  const handleAsk = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setAnswer('')

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })
      const data = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      console.error('Error asking question:', error)
      setAnswer('Error getting answer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Knowledge Search
        </h1>

        {/* Upload Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-indigo-500">
            Upload Document
          </h2>
          <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.txt"
              disabled={uploading}
              className="hidden"
            />
            <div className="text-center text-gray-500">
              {uploading ? (
                <span className="text-indigo-500">Uploading...</span>
              ) : (
                <span>Click to select a PDF or TXT file</span>
              )}
            </div>
          </label>
        </section>

        {/* Documents Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-indigo-500">
            Uploaded Documents
          </h2>
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500 flex justify-between items-center"
                >
                  <span>{doc.filename}</span>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete document"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Ask Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-indigo-500">
            Ask a Question
          </h2>
          <form onSubmit={handleAsk} className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question..."
              disabled={loading}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </form>

          {answer && (
            <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-indigo-500">
              <h3 className="text-indigo-600 font-medium mb-2">Answer:</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
