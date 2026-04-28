import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import type { Guest, RSVP } from '../lib/supabase'

type Tab = 'overview' | 'invitees' | 'add'

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [guests, setGuests] = useState<Guest[]>([])
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  // Add guest form
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [addMsg, setAddMsg] = useState('')
  // Bulk import
  const [bulkText, setBulkText] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)
  // Search
  const [search, setSearch] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: g }, { data: r }] = await Promise.all([
      supabase.from('guests').select('*').order('created_at', { ascending: false }),
      supabase.from('rsvps').select('*, guest:guests(*)').order('responded_at', { ascending: false }),
    ])
    setGuests((g as Guest[]) || [])
    setRsvps((r as RSVP[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  // ── Stats ───────────────────────────────────────────────────────────────────
  const attending = rsvps.filter(r => r.attending)
  const declined  = rsvps.filter(r => !r.attending)
  const pending   = guests.filter(g => !rsvps.find(r => r.guest_id === g.id))
  const totalHeads = attending.reduce((sum, r) => sum + r.guest_count, 0)

  const rsvpMap = new Map(rsvps.map(r => [r.guest_id, r]))

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.phone || '').includes(search)
  )

  // ── Add single guest ────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newName.trim()) return setAddMsg('Please enter a name.')
    setAddLoading(true); setAddMsg('')
    const slug = slugify(newName)
    const { error } = await supabase.from('guests').insert({ name: newName.trim(), slug, phone: newPhone.trim() || null })
    if (error) setAddMsg(error.code === '23505' ? `Slug "${slug}" already exists — try a different name.` : error.message)
    else { setAddMsg(`✓ ${newName} added!`); setNewName(''); setNewPhone(''); fetchAll() }
    setAddLoading(false)
  }

  // ── Bulk import ─────────────────────────────────────────────────────────────
  const handleBulk = async () => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) return
    setBulkLoading(true)
    const rows = lines.map(l => {
      const [name, phone] = l.split(',').map(s => s.trim())
      return { name, slug: slugify(name), phone: phone || null }
    })
    const { error } = await supabase.from('guests').insert(rows)
    if (error) alert(error.message)
    else { setBulkText(''); fetchAll(); alert(`${rows.length} guests imported!`) }
    setBulkLoading(false)
  }

  // ── Delete guest ─────────────────────────────────────────────────────────────
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name}?`)) return
    await supabase.from('guests').delete().eq('id', id)
    fetchAll()
  }

  // ── WhatsApp share ───────────────────────────────────────────────────────────
  const shareViaWhatsApp = (guest: Guest) => {
    const url = `${window.location.origin}/invite/${guest.slug}`
    const msg = `Assalamu Alaikum ${guest.name}! 🌸\n\nYou are cordially invited to the wedding of *Athif Aziz & Namra Shehsy* on *6th June 2026* at Malabar Avenue, Calicut.\n\nOpen your personal invitation here:\n${url}`
    window.open(`https://wa.me/${(guest.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const copyLink = (guest: Guest) => {
    const url = `${window.location.origin}/invite/${guest.slug}`
    navigator.clipboard.writeText(url).then(() => alert('Link copied!'))
  }

  const S = { background: '#0d0404', color: '#c8a882', minHeight: '100vh' }
  const cardS = { background: 'rgba(212,175,122,0.04)', border: '1px solid rgba(212,175,122,0.18)', borderRadius: 2 }
  const inputS: React.CSSProperties = { background: 'rgba(212,175,122,0.06)', border: '1px solid rgba(212,175,122,0.2)', color: '#d4af7a', padding: '10px 14px', width: '100%', fontFamily: 'Montserrat,sans-serif', fontSize: 12, outline: 'none', borderRadius: 2 }
  const btnS: React.CSSProperties = { background: '#9b2335', color: '#fff', border: 'none', padding: '10px 24px', fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }

  return (
    <div style={S}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-5" style={{ borderBottom: '1px solid rgba(212,175,122,0.15)', background: 'rgba(0,0,0,0.3)' }}>
        <div>
          <div className="font-vibes text-gold" style={{ fontSize: 36 }}>Athif Aziz &amp; Namra Shehsy</div>
          <div className="font-montserrat uppercase" style={{ fontSize: 9, letterSpacing: 4, color: 'rgba(212,175,122,0.5)', marginTop: 2 }}>Host Dashboard · 6 June 2026</div>
        </div>
        <a href="/" className="font-montserrat text-gold/50 hover:text-gold text-xs tracking-widest uppercase no-underline transition-colors">← Invitation</a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-6 pb-0">
        {(['overview','invitees','add'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="font-montserrat uppercase transition-all"
            style={{ fontSize: 10, letterSpacing: 3, padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: '2px 2px 0 0', background: tab===t ? 'rgba(212,175,122,0.12)' : 'transparent', color: tab===t ? '#d4af7a' : 'rgba(212,175,122,0.4)', borderBottom: tab===t ? '2px solid #d4af7a' : '2px solid transparent' }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ borderBottom: '1px solid rgba(212,175,122,0.15)' }} />

      <div className="p-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.35 }}>
              {/* Stat cards */}
              <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
                {[
                  { label: 'Total Invited', value: guests.length, icon: '👥', color: '#d4af7a' },
                  { label: 'Attending', value: attending.length, icon: '✅', color: '#27ae60' },
                  { label: 'Total Heads', value: totalHeads, icon: '🧑‍🤝‍🧑', color: '#2980b9' },
                  { label: 'Declined', value: declined.length, icon: '❌', color: '#c0392b' },
                  { label: 'Pending', value: pending.length, icon: '⏳', color: '#f39c12' },
                ].map(s => (
                  <div key={s.label} className="p-5 text-center" style={cardS}>
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="font-cormorant font-light" style={{ fontSize: 42, color: s.color, lineHeight: 1 }}>{loading ? '—' : s.value}</div>
                    <div className="font-montserrat uppercase mt-1" style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(212,175,122,0.5)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Attending list */}
              <div className="mb-8">
                <h3 className="font-vibes text-gold mb-4" style={{ fontSize: 32 }}>Who's Coming 🌸</h3>
                {attending.length === 0 ? (
                  <p className="font-cormorant italic" style={{ color: 'rgba(212,175,122,0.5)', fontSize: 16 }}>No confirmations yet.</p>
                ) : (
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
                    {attending.map(r => (
                      <motion.div key={r.id} initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} className="flex items-center gap-4 p-4" style={cardS}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-vibes text-xl text-dark-bg" style={{ background: '#d4af7a', flexShrink: 0 }}>
                          {(r.guest as Guest)?.name?.[0] ?? '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-cormorant text-gold/90 truncate" style={{ fontSize: 17 }}>{(r.guest as Guest)?.name}</div>
                          <div className="font-montserrat" style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(212,175,122,0.5)', marginTop: 2 }}>{r.guest_count} guest{r.guest_count > 1 ? 's' : ''} · confirmed</div>
                        </div>
                        <div className="text-green-400 text-lg">✓</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Declined */}
              {declined.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-vibes text-gold mb-4" style={{ fontSize: 32 }}>Unable to Attend</h3>
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
                    {declined.map(r => (
                      <div key={r.id} className="flex items-center gap-4 p-4" style={{ ...cardS, opacity: 0.7 }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-vibes text-xl" style={{ background: 'rgba(192,57,43,0.3)', color: '#c0392b', flexShrink: 0 }}>
                          {(r.guest as Guest)?.name?.[0] ?? '?'}
                        </div>
                        <div className="font-cormorant" style={{ fontSize: 17, color: 'rgba(212,175,122,0.6)' }}>{(r.guest as Guest)?.name}</div>
                        <div className="ml-auto text-red-400 text-sm">✗</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending */}
              {pending.length > 0 && (
                <div>
                  <h3 className="font-vibes text-gold mb-4" style={{ fontSize: 32 }}>Awaiting Response</h3>
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
                    {pending.map(g => (
                      <div key={g.id} className="flex items-center gap-4 p-4" style={{ ...cardS, opacity: 0.65 }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-vibes text-xl" style={{ background: 'rgba(212,175,122,0.15)', color: '#d4af7a', flexShrink: 0 }}>
                          {g.name[0]}
                        </div>
                        <div>
                          <div className="font-cormorant" style={{ fontSize: 17, color: 'rgba(212,175,122,0.7)' }}>{g.name}</div>
                          <div className="font-montserrat" style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(212,175,122,0.4)', marginTop: 2 }}>No response yet</div>
                        </div>
                        <div className="ml-auto text-yellow-500 text-sm">⏳</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── INVITEES TAB ── */}
          {tab === 'invitees' && (
            <motion.div key="invitees" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.35 }}>
              <div className="flex flex-wrap gap-3 items-center mb-6">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name or phone..."
                  style={{ ...inputS, maxWidth: 280 }}
                />
                <span className="font-montserrat text-xs" style={{ color:'rgba(212,175,122,0.5)', letterSpacing:2 }}>{filteredGuests.length} guests</span>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Montserrat,sans-serif', fontSize:11 }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(212,175,122,0.2)' }}>
                      {['Name','Slug / Link','Phone','RSVP','Heads','Actions'].map(h => (
                        <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:'rgba(212,175,122,0.5)', letterSpacing:3, textTransform:'uppercase', fontSize:9, fontWeight:500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map(g => {
                      const r = rsvpMap.get(g.id)
                      const inviteUrl = `${window.location.origin}/invite/${g.slug}`
                      return (
                        <tr key={g.id} style={{ borderBottom:'1px solid rgba(212,175,122,0.08)' }} className="hover:bg-gold/5 transition-colors">
                          <td style={{ padding:'14px 12px', color:'#d4af7a', fontFamily:'Cormorant Garamond,serif', fontSize:16 }}>{g.name}</td>
                          <td style={{ padding:'14px 12px', color:'rgba(212,175,122,0.5)', fontSize:10, maxWidth:200 }}>
                            <div className="truncate">{g.slug}</div>
                          </td>
                          <td style={{ padding:'14px 12px', color:'rgba(212,175,122,0.6)' }}>{g.phone || '—'}</td>
                          <td style={{ padding:'14px 12px' }}>
                            {!r ? (
                              <span style={{ color:'#f39c12', fontSize:10, letterSpacing:2 }}>⏳ Pending</span>
                            ) : r.attending ? (
                              <span style={{ color:'#27ae60', fontSize:10, letterSpacing:2 }}>✓ Attending</span>
                            ) : (
                              <span style={{ color:'#c0392b', fontSize:10, letterSpacing:2 }}>✗ Declined</span>
                            )}
                          </td>
                          <td style={{ padding:'14px 12px', color:'rgba(212,175,122,0.8)', textAlign:'center' }}>
                            {r?.attending ? r.guest_count : '—'}
                          </td>
                          <td style={{ padding:'14px 12px' }}>
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => copyLink(g)} style={{ ...btnS, background:'rgba(212,175,122,0.15)', color:'#d4af7a', padding:'6px 12px', fontSize:9 }}>Copy</button>
                              {g.phone && (
                                <button onClick={() => shareViaWhatsApp(g)} style={{ ...btnS, background:'#128C7E', padding:'6px 12px', fontSize:9 }}>WA</button>
                              )}
                              <button onClick={() => handleDelete(g.id, g.name)} style={{ ...btnS, background:'rgba(192,57,43,0.2)', color:'#c0392b', padding:'6px 12px', fontSize:9 }}>✕</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filteredGuests.length === 0 && !loading && (
                  <p className="font-cormorant italic text-center py-12" style={{ color:'rgba(212,175,122,0.4)', fontSize:18 }}>No guests found.</p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── ADD TAB ── */}
          {tab === 'add' && (
            <motion.div key="add" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.35 }} className="grid gap-8" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))' }}>
              {/* Single add */}
              <div className="p-7" style={cardS}>
                <h3 className="font-vibes text-gold mb-1" style={{ fontSize:32 }}>Add Guest</h3>
                <p className="font-montserrat mb-6" style={{ fontSize:10, letterSpacing:3, color:'rgba(212,175,122,0.5)', textTransform:'uppercase' }}>Single invitee</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="font-montserrat block mb-2" style={{ fontSize:9, letterSpacing:3, textTransform:'uppercase', color:'rgba(212,175,122,0.55)' }}>Full Name *</label>
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Ahmed Khan" style={inputS} onKeyDown={e => e.key==='Enter' && handleAdd()} />
                    {newName && <div className="font-montserrat mt-1" style={{ fontSize:9, color:'rgba(212,175,122,0.4)' }}>URL: /invite/{slugify(newName)}</div>}
                  </div>
                  <div>
                    <label className="font-montserrat block mb-2" style={{ fontSize:9, letterSpacing:3, textTransform:'uppercase', color:'rgba(212,175,122,0.55)' }}>WhatsApp Number</label>
                    <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+91 98765 43210" style={inputS} />
                  </div>
                  <motion.button onClick={handleAdd} disabled={addLoading} style={btnS} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
                    {addLoading ? 'Adding...' : 'Add Guest'}
                  </motion.button>
                  {addMsg && <p className="font-montserrat text-xs" style={{ color: addMsg.startsWith('✓')?'#27ae60':'#c0392b' }}>{addMsg}</p>}
                </div>
              </div>

              {/* Bulk import */}
              <div className="p-7" style={cardS}>
                <h3 className="font-vibes text-gold mb-1" style={{ fontSize:32 }}>Bulk Import</h3>
                <p className="font-montserrat mb-6" style={{ fontSize:10, letterSpacing:3, color:'rgba(212,175,122,0.5)', textTransform:'uppercase' }}>Multiple guests</p>
                <label className="font-montserrat block mb-2" style={{ fontSize:9, letterSpacing:3, textTransform:'uppercase', color:'rgba(212,175,122,0.55)' }}>
                  One per line: Name, Phone (phone optional)
                </label>
                <textarea
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  rows={8}
                  placeholder={'Ahmed Khan, +91 9876543210\nFatima Ali\nUsman Sheikh, +91 8765432109'}
                  style={{ ...inputS, resize:'vertical', fontFamily:'monospace' }}
                />
                <motion.button onClick={handleBulk} disabled={bulkLoading} style={{ ...btnS, marginTop:16, width:'100%' }} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
                  {bulkLoading ? 'Importing...' : `Import ${bulkText.split('\n').filter(l=>l.trim()).length} Guests`}
                </motion.button>
                {/* <div className="mt-6 p-4 rounded-sm" style={{ background:'rgba(212,175,122,0.04)', border:'1px solid rgba(212,175,122,0.1)' }}>
                  <p className="font-montserrat text-[10px] tracking-wider uppercase mb-3" style={{ color:'rgba(212,175,122,0.5)' }}>💡 Supabase Setup</p>
                  <p className="font-montserrat text-[10px] leading-relaxed" style={{ color:'rgba(212,175,122,0.4)' }}>
                    1. Create project at supabase.com<br/>
                    2. Run SQL from src/lib/supabase.ts<br/>
                    3. Add VITE_SUPABASE_URL &amp; VITE_SUPABASE_ANON_KEY to .env
                  </p>
                </div> */}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');
      `}</style>
    </div>
  )
}
