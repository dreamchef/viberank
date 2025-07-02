import { useState } from 'react'
import './index.css'

interface Result {
  provider: string
  text: string
}

function ResultCard({ result }: { result: Result }) {
  const [expanded, setExpanded] = useState(false)
  const lines = result.text.split('\n')
  const preview = lines.slice(0, 3).join('\n')

  return (
    <div className="result-card">
      <div className="result-provider">{result.provider}</div>
      <pre>{expanded ? result.text : preview}</pre>
      {result.text.length > preview.length && (
        <button className="show-more" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  )
}

function App() {
  const [brand, setBrand] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]>([])

  const search = async () => {
    if (!brand) return
    setLoading(true)
    setResults([])
    try {
      const resp = await fetch(`/search?brand=${encodeURIComponent(brand)}`)
      const data = await resp.json()
      if (Array.isArray(data)) {
        setResults(data)
      } else {
        setResults([data])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalLength = results.reduce((acc, r) => acc + r.text.length, 0)

  return (
    <div className="container">
      <h1>VibeRank</h1>
      <div className="search-bar">
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Search brand"
        />
        <button onClick={search}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {results.length > 0 && (
        <>
          <div className="results-grid">
            {results.map((r, i) => (
              <ResultCard key={i} result={r} />
            ))}
          </div>
          <div className="analytics">
            <h2>Analytics</h2>
            <p>Sources: {results.length}</p>
            <p>Total length: {totalLength} characters</p>
          </div>
        </>
      )}
    </div>
  )
}

export default App
