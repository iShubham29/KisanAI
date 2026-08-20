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

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

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

function CustomSelect({ id, value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const searchRef = useRef(null)

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus()
  }, [open])

  return (
    <div className={`kisan-custom-select${open ? ' kisan-custom-select--open' : ''}${disabled ? ' kisan-custom-select--disabled' : ''}`} ref={ref}>
      <button
        type="button"
        id={id}
        className="kisan-custom-select__trigger"
        onClick={() => { if (!disabled) { setOpen(o => !o); setSearch('') } }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? '' : 'kisan-custom-select__placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={`kisan-custom-select__chevron${open ? ' kisan-custom-select__chevron--up' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="kisan-custom-select__dropdown" role="listbox">
          <div className="kisan-custom-select__search-wrap">
            <span className="kisan-custom-select__search-icon">🔍</span>
            <input
              ref={searchRef}
              className="kisan-custom-select__search"
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <ul className="kisan-custom-select__list">
            {filtered.length === 0 && (
              <li className="kisan-custom-select__no-result">No results found</li>
            )}
            {filtered.map(o => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                className={`kisan-custom-select__option${o.value === value ? ' kisan-custom-select__option--selected' : ''}`}
                onClick={() => { onChange(o.value); setOpen(false); setSearch('') }}
              >
                {o.value === value && <span className="kisan-custom-select__tick">✓</span>}
                {o.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
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
  const [darkMode, setDarkMode] = useState(true)
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

  const handleStateChange = (stateName) => {
    const s = states.find(s => (s.name ?? s.stateName) === stateName)
    const stateCode = s?.code ?? s?.stateCode ?? ''
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
    <div className="kisan-root" data-theme={darkMode ? 'dark' : 'light'}>
      {/* ── Animated Farm Scene ── */}
      <div className="kisan-scene" aria-hidden="true">

        {/* Sky gradient handled by CSS on .kisan-scene */}

        {/* Sun / Moon — top-left, key forces re-mount & re-animate on mode change */}
        <div key={darkMode ? 'moon' : 'sun'} className={`kisan-celestial ${darkMode ? 'kisan-celestial--moon' : 'kisan-celestial--sun'}`}>
          {darkMode ? (
            /* Full Moon SVG — solid, no crescent */
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer glow ring */}
              <circle cx="40" cy="40" r="38" fill="rgba(241,245,249,0.08)" />
              <circle cx="40" cy="40" r="34" fill="rgba(241,245,249,0.12)" />
              {/* Moon body */}
              <circle cx="40" cy="40" r="30" fill="#f8fafc" />
              <circle cx="40" cy="40" r="30" fill="url(#moonGrad)" />
              {/* Craters */}
              <circle cx="28" cy="30" r="5"   fill="#e2e8f0" opacity="0.6" />
              <circle cx="50" cy="26" r="3.5" fill="#e2e8f0" opacity="0.5" />
              <circle cx="34" cy="50" r="4"   fill="#e2e8f0" opacity="0.45" />
              <circle cx="52" cy="48" r="2.5" fill="#e2e8f0" opacity="0.4" />
              <circle cx="24" cy="46" r="2"   fill="#e2e8f0" opacity="0.35" />
              <defs>
                <radialGradient id="moonGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.15" />
                </radialGradient>
              </defs>
            </svg>
          ) : (
            /* Sun SVG */
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer glow */}
              <circle cx="40" cy="40" r="38" fill="rgba(253,230,138,0.15)" />
              <circle cx="40" cy="40" r="32" fill="rgba(253,230,138,0.2)" />
              {/* Rays */}
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
                <line key={i}
                  x1={40 + 26 * Math.cos(deg * Math.PI/180)}
                  y1={40 + 26 * Math.sin(deg * Math.PI/180)}
                  x2={40 + 36 * Math.cos(deg * Math.PI/180)}
                  y2={40 + 36 * Math.sin(deg * Math.PI/180)}
                  stroke="#fde68a" strokeWidth={i % 2 === 0 ? 3 : 2} strokeLinecap="round"
                />
              ))}
              {/* Sun body */}
              <circle cx="40" cy="40" r="22" fill="#fde68a" />
              <circle cx="40" cy="40" r="18" fill="#fbbf24" />
              <circle cx="33" cy="34" r="6" fill="#fcd34d" opacity="0.4" />
            </svg>
          )}
        </div>

        {/* Stars (night only) */}
        {darkMode && (
          <div className="kisan-stars">
            {Array.from({length: 40}).map((_, i) => (
              <div key={i} className="kisan-star"
                style={{
                  left: `${(i * 2731) % 100}%`,
                  top: `${(i * 1847) % 55}%`,
                  animationDelay: `${(i * 0.37) % 3}s`,
                  width: `${1.5 + (i % 3) * 0.8}px`,
                  height: `${1.5 + (i % 3) * 0.8}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* Clouds */}
        <div className="kisan-clouds">
          {[
            {cls: 'kisan-cloud--1', w: 180, top: '8%'},
            {cls: 'kisan-cloud--2', w: 130, top: '18%'},
            {cls: 'kisan-cloud--3', w: 160, top: '12%'},
            {cls: 'kisan-cloud--4', w: 110, top: '22%'},
          ].map(({cls, w, top}, i) => (
            <svg key={i} className={`kisan-cloud ${cls}`} style={{width: w, top}} viewBox="0 0 180 70" fill="none">
              <ellipse cx="90" cy="50" rx="80" ry="20" fill={darkMode ? 'rgba(148,163,184,0.18)' : 'rgba(255,255,255,0.82)'} />
              <ellipse cx="70" cy="38" rx="45" ry="28" fill={darkMode ? 'rgba(148,163,184,0.15)' : 'rgba(255,255,255,0.9)'} />
              <ellipse cx="110" cy="40" rx="40" ry="26" fill={darkMode ? 'rgba(148,163,184,0.13)' : 'rgba(255,255,255,0.85)'} />
              <ellipse cx="90" cy="34" rx="35" ry="30" fill={darkMode ? 'rgba(148,163,184,0.12)' : 'rgba(255,255,255,0.88)'} />
            </svg>
          ))}
        </div>

        {/* Ground / Horizon */}
        <div className="kisan-ground" />

        {/* Dense Grassland — 4 depth layers, hundreds of blades */}
        <div className="kisan-wheat-field">
          {[
            { count: 80, cls: 'kisan-row--back',  hMin: 60,  hVar: 30, swayAmp: 8  },
            { count: 70, cls: 'kisan-row--mid2',  hMin: 85,  hVar: 35, swayAmp: 10 },
            { count: 60, cls: 'kisan-row--mid',   hMin: 110, hVar: 40, swayAmp: 12 },
            { count: 50, cls: 'kisan-row--front', hMin: 140, hVar: 50, swayAmp: 14 },
          ].map(({ count, cls, hMin, hVar }, rowIdx) =>
            Array.from({ length: count }).map((_, i) => {
              const seed  = rowIdx * 1013 + i * 179
              const delay = `${((seed * 0.047) % 2.6).toFixed(2)}s`
              const dur   = `${(2.2 + (seed % 8) * 0.18).toFixed(2)}s`
              const h     = hMin + (seed % (hVar + 1))
              const left  = `${((i / count) * 100 + ((seed % 7) - 3) * 0.55).toFixed(2)}%`
              // curve direction alternates per blade
              const curl  = (seed % 2 === 0) ? 1 : -1
              // 5 shades of green for variety
              const shades = darkMode
                ? ['#14532d','#166534','#15803d','#16a34a','#22c55e']
                : ['#166534','#15803d','#16a34a','#22c55e','#4ade80']
              const col   = shades[seed % 5]
              const col2  = shades[(seed + 2) % 5]
              // blade width — thin at top, 2-4px
              const bw    = 1.5 + (seed % 3) * 0.8

              return (
                <div key={`${rowIdx}-${i}`}
                  className={`kisan-stalk-wrap ${cls}`}
                  style={{ left, animationDelay: delay, animationDuration: dur }}>
                  <svg
                    style={{ width: Math.ceil(bw * 6), height: h, display: 'block', overflow: 'visible' }}
                    viewBox="0 0 12 100"
                    preserveAspectRatio="none"
                    fill="none">
                    {/* Main blade — curves naturally to one side */}
                    <path
                      d={`M6 100 Q${6 + curl * 3} 70 ${6 + curl * 5} 40 Q${6 + curl * 7} 15 ${6 + curl * 4} 0`}
                      stroke={col} strokeWidth={bw * 1.4} strokeLinecap="round"/>
                    {/* Highlight stripe down the middle */}
                    <path
                      d={`M6 100 Q${6 + curl * 2} 72 ${6 + curl * 4} 44 Q${6 + curl * 5} 18 ${6 + curl * 3} 2`}
                      stroke={col2} strokeWidth={bw * 0.5} strokeLinecap="round" opacity="0.45"/>
                  </svg>
                </div>
              )
            })
          )}
        </div>

      </div>
      <header className="kisan-header">
        <div className="kisan-header-inner">
          <span className="kisan-logo-icon">🌾</span>
          <div className="kisan-header-text">
            <h1 className="kisan-title">KisanAI</h1>
          </div>
          <div className="kisan-header-actions">
            <button className="kisan-theme-btn" onClick={() => setDarkMode(d => !d)} title="Toggle theme">
              {darkMode ? '☀️' : '🌙'}
            </button>
            {messages.length > 0 && (
              <button className="kisan-clear-btn" onClick={clearChat} title="Clear chat">
                🗑 Clear
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="kisan-main">
        <div className="kisan-card kisan-card--shifted">
          <div className="kisan-row">
            <div className="kisan-field">
              <label className="kisan-label" htmlFor="state-select">State <span className="kisan-required">*</span></label>
              <CustomSelect
                id="state-select"
                value={selectedState}
                onChange={handleStateChange}
                options={states.map(s => ({ value: s.name ?? s.stateName, label: s.name ?? s.stateName }))}
                placeholder={loadingStates ? 'Loading states…' : '— Select State —'}
                disabled={loadingStates}
              />
            </div>

            <div className="kisan-field">
              <label className="kisan-label" htmlFor="district-select">District <span className="kisan-required">*</span></label>
              <CustomSelect
                id="district-select"
                value={selectedDistrict}
                onChange={val => setSelectedDistrict(val)}
                options={districts.map(d => ({ value: d.name ?? d.districtName, label: d.name ?? d.districtName }))}
                placeholder={loadingDistricts ? 'Loading districts…' : !selectedState ? '— Select state first —' : '— Select District —'}
                disabled={!selectedState || loadingDistricts}
              />
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
