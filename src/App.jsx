import { useState, useEffect, useRef } from 'react'
import './App.css'

const SECTION_EMOJIS = [
  [/(pros|benefit|advantage|opportunity)/i, '✅'],
  [/(cons|disadvantage|challenge|problem|issue|risk)/i, '⚠️'],
  [/(alternative|option|other|location|region)/i, '🗺️'],
  [/(soil|land|field)/i, '🌱'],
  [/(water|rain|irrigation|drought)/i, '💧'],
  [/(market|price|sell|trade|profit)/i, '💰'],
  [/(government|scheme|subsidy|support)/i, '🏛️'],
  [/(climate|weather|season|temperature)/i, '🌤️'],
  [/(fertilizer|nutrient|chemical)/i, '🧪'],
  [/(crop|plant|harvest|yield|seed)/i, '🌾'],
  [/(pest|disease|insect|fungal)/i, '🐛'],
  [/(storage|transport|infrastructure)/i, '🏭'],
  [/(recommendation|suggest|advice|tip)/i, '💡'],
]

function getEmoji(text) {
  for (const [pattern, emoji] of SECTION_EMOJIS) {
    if (pattern.test(text)) return emoji
  }
  return '📌'
}

const SECTION_COLORS = [
  [/(pros|benefit|advantage|opportunity)/i,  'green'],
  [/(cons|disadvantage|challenge|problem|issue|risk|scarcity|salinity)/i, 'red'],
  [/(alternative|option|other|location|region)/i, 'blue'],
  [/(water|rain|irrigation|drought)/i,        'blue'],
  [/(market|price|sell|trade|profit)/i,        'yellow'],
  [/(government|scheme|subsidy|support)/i,     'purple'],
  [/(climate|weather|season|temperature)/i,    'sky'],
  [/(fertilizer|nutrient|chemical)/i,          'teal'],
  [/(crop|plant|harvest|yield|seed)/i,         'green'],
  [/(pest|disease|insect|fungal)/i,            'red'],
  [/(storage|transport|infrastructure)/i,      'purple'],
  [/(recommendation|suggest|advice|tip)/i,     'yellow'],
]

function getSectionColor(text) {
  for (const [pattern, color] of SECTION_COLORS) {
    if (pattern.test(text)) return color
  }
  return 'green'
}

function renderLine(line, idx) {
  const trimmed = line.trim()
  if (!trimmed) return null

  const headerMatch = trimmed.match(/^\*\*(.+?)\*\*:?\s*$/)
  const isNumbered = /^\d+\.\s/.test(trimmed)

  if (headerMatch) {
    const text = headerMatch[1]
    const emoji = getEmoji(text)
    const color = getSectionColor(text)
    return (
      <div key={idx} className={`kisan-response-section kisan-response-section--${color}`}>
        <span className="kisan-section-emoji">{emoji}</span>
        <span className="kisan-section-title">{text}</span>
      </div>
    )
  }

  if (isNumbered) {
    const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    return (
      <div key={idx} className="kisan-response-item"
        dangerouslySetInnerHTML={{ __html: withBold }} />
    )
  }

  const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return (
    <p key={idx} className="kisan-response-para"
      dangerouslySetInnerHTML={{ __html: withBold }} />
  )
}

const API_BASE = '/api'

const LOADING_STATUSES = [
  '🌾 Checking your fields…',
  '🚜 Ploughing through the data…',
  '🌱 Consulting the soil experts…',
  '💧 Analysing water conditions…',
  '☀️ Reading the weather patterns…',
  '🌿 Studying crop health…',
  '🧑‍🌾 Asking our Kisan experts…',
  '📋 Preparing personalised advice…',
  '🐄 Gathering farm intelligence…',
  '🌻 Almost ready with your answer…',
]

const PROCESSING_STATUSES = [
  '✨ Beautifying response…',
  '🎨 Adding farming insights…',
  '📌 Organising your advice…',
]

function beautifyResponse(text) {
  return text
    .replace(/^##\s+/gm, '**')
    .replace(/^###\s+/gm, '**')
    .split('\n')
    .map(line => {
      const t = line.trim()
      if (!t) return ''
      if (/^\*\s+/.test(t)) return t.replace(/^\*\s+/, '1. ')
      return t
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function App() {
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedStateCode, setSelectedStateCode] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const [error, setError] = useState('')
  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const chatEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE}/regions/states`)
      .then(res => res.json())
      .then(data => {
        setStates(data)
        setLoadingStates(false)
      })
      .catch(() => {
        setError('Failed to load states. Is the backend running?')
        setLoadingStates(false)
      })
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!loading && !processing) { setStatusIdx(0); return }
    const interval = setInterval(() => {
      setStatusIdx(prev => prev + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [loading, processing])

  const handleStateChange = (e) => {
    const option = e.target.options[e.target.selectedIndex]
    const stateName = option.value
    const stateCode = option.dataset.code
    setSelectedState(stateName)
    setSelectedStateCode(stateCode)
    setSelectedDistrict('')
    setDistricts([])
    if (!stateCode) return
    setLoadingDistricts(true)
    fetch(`${API_BASE}/regions/districts/${stateCode}`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data)
        setLoadingDistricts(false)
      })
      .catch(() => {
        setError('Failed to load districts.')
        setLoadingDistricts(false)
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedState || !selectedDistrict || !query.trim()) {
      setError('Please fill in all fields.')
      return
    }
    const userQuery = query.trim()
    setError('')
    setQuery('')
    setMessages(prev => [...prev, { role: 'user', text: userQuery, state: selectedState, district: selectedDistrict }])
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: selectedState, district: selectedDistrict, query: userQuery }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      let aiText = data.response || data.answer || data.message || JSON.stringify(data)
      setLoading(false)
      setProcessing(true)
      await new Promise(r => setTimeout(r, 900))
      setMessages(prev => {
        const isFirstReply = prev.filter(m => m.role === 'ai').length === 0
        if (!isFirstReply) {
          aiText = aiText.replace(/^(Namaste!?|Hello!?|Hi!?)[^\n]*\n*/i, '').trim()
        }
        return [...prev, { role: 'ai', text: beautifyResponse(aiText) }]
      })
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', text: err.message || 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
      setProcessing(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError('')
  }

  return (
    <div className="kisan-root">
      <header className="kisan-header">
        <div className="kisan-header-inner">
          <span className="kisan-logo-icon">🌾</span>
          <div className="kisan-header-text">
            <h1 className="kisan-title">KisanAI</h1>
            <p className="kisan-subtitle">AI-Powered Smart Farming Assistant</p>
          </div>
          {messages.length > 0 && (
            <button className="kisan-clear-btn" onClick={clearChat} title="Clear chat">
              🗑 Clear Chat
            </button>
          )}
        </div>
      </header>

      <main className="kisan-main">
        <div className="kisan-card">
          <div className="kisan-row">
            <div className="kisan-field">
              <label className="kisan-label" htmlFor="state-select">State <span className="kisan-required">*</span></label>
              <select
                id="state-select"
                className="kisan-select"
                value={selectedState}
                onChange={handleStateChange}
                disabled={loadingStates}
              >
                <option value="">{loadingStates ? 'Loading states…' : '— Select State —'}</option>
                {states.map(s => (
                  <option key={s.code ?? s.stateCode ?? s.name} value={s.name ?? s.stateName} data-code={s.code ?? s.stateCode}>
                    {s.name ?? s.stateName}
                  </option>
                ))}
              </select>
            </div>

            <div className="kisan-field">
              <label className="kisan-label" htmlFor="district-select">District <span className="kisan-required">*</span></label>
              <select
                id="district-select"
                className="kisan-select"
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                disabled={!selectedState || loadingDistricts}
              >
                <option value="">
                  {loadingDistricts ? 'Loading districts…' : !selectedState ? '— Select state first —' : '— Select District —'}
                </option>
                {districts.map(d => (
                  <option key={d.code ?? d.districtCode ?? d.name} value={d.name ?? d.districtName}>
                    {d.name ?? d.districtName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="kisan-chat-thread">
            {messages.map((msg, i) => (
              <div key={i} className={`kisan-bubble-wrap kisan-bubble-wrap--${msg.role}`}>
                {msg.role === 'user' && (
                  <div className="kisan-bubble kisan-bubble--user">
                    <div className="kisan-bubble-meta">
                      <span className="kisan-badge">{msg.state}</span>
                      <span className="kisan-badge">{msg.district}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                )}
                {msg.role === 'ai' && (
                  <div className="kisan-bubble kisan-bubble--ai">
                    <div className="kisan-bubble-label">🌱 KisanAI</div>
                    <div className="kisan-bubble-body">
                      {msg.text.split('\n').map((line, j) => renderLine(line, j))}
                    </div>
                  </div>
                )}
                {msg.role === 'error' && (
                  <div className="kisan-bubble kisan-bubble--error">{msg.text}</div>
                )}
              </div>
            ))}
            {(loading || processing) && (
              <div className="kisan-bubble-wrap kisan-bubble-wrap--ai">
                <div className="kisan-bubble kisan-bubble--ai kisan-bubble--typing">
                  <div className="kisan-bubble-label">🌱 KisanAI</div>
                  <div className="kisan-typing-status">
                    <div className="kisan-typing-dots">
                      <span /><span /><span />
                    </div>
                    <span className="kisan-typing-label">
                      {processing
                        ? PROCESSING_STATUSES[statusIdx % PROCESSING_STATUSES.length]
                        : LOADING_STATUSES[statusIdx % LOADING_STATUSES.length]}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {messages.length === 0 && !loading && (
          <div className="kisan-empty-state">
            <div className="kisan-empty-icon">🤖</div>
            <p>Select your state &amp; district above, then ask your farming question below.</p>
          </div>
        )}

        <div className="kisan-input-bar">
          {error && <div className="kisan-error">{error}</div>}
          <form className="kisan-input-form" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className="kisan-input-textarea"
              rows={2}
              placeholder="Ask a farming question… (Enter to send, Shift+Enter for new line)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || processing}
            />
            <button type="submit" className="kisan-send-btn" disabled={loading || processing || !selectedState || !selectedDistrict}>
              {loading ? <span className="kisan-spinner" /> : <span>➤</span>}
            </button>
          </form>
        </div>
      </main>

      <footer className="kisan-footer">
        <p>KisanAI &copy; {new Date().getFullYear()} — Empowering Indian Farmers with AI</p>
      </footer>
    </div>
  )
}

export default App
