'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar, Plus, Users, Lightbulb, Clock,
  ExternalLink, Trash2
} from 'lucide-react'

/* ---------- 1. HELPER KOMPONENTE ---------- */

const Button = ({ children, onClick, disabled, style = {}, ...p }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? '#9ca3af' : (style as any).background || '#2563eb',
      color: 'white',
      padding: '10px 16px',
      borderRadius: 6,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 14,
      fontWeight: 500,
      ...style
    }}
    {...p}
  >{children}</button>
)

const Card = ({ children, style = {} }: any) => (
  <div style={{
    background: 'white',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,.1)',
    ...style
  }}>{children}</div>
)

const Input = ({ type = 'text', value, onChange, ...p }: any) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    style={{
      width: '100%', padding: '8px 12px',
      border: '1px solid #d1d5db', borderRadius: 6,
      fontSize: 14, outline: 'none'
    }}
    {...p}
  />
)

const Select = ({ value, onChange, children, ...p }: any) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: '100%', padding: '8px 12px',
      border: '1px solid #d1d5db', borderRadius: 6,
      fontSize: 14, background: 'white', outline: 'none'
    }}
    {...p}
  >{children}</select>
)

const Textarea = ({ value, onChange, rows = 3, ...p }: any) => (
  <textarea
    value={value}
    onChange={onChange}
    rows={rows}
    style={{
      width: '100%', padding: '8px 12px',
      border: '1px solid #d1d5db', borderRadius: 6,
      fontSize: 14, outline: 'none', resize: 'vertical',
      fontFamily: 'inherit'
    }}
    {...p}
  />
)

/* ---------- 2. TIPOVI & LISTE ---------- */

interface Task {
  id: string; description: string; link?: string;
  category: string; status: string; notes?: string;
  date: string; createdAt: string; user: { name: string }
}
interface Event {
  id: string; title: string; date: string; time?: string;
  priority: string; notes?: string; user: { name: string }
}
interface Idea {
  id: string; title: string; description?: string;
  priority: string; category: string; createdAt: string;
  user: { name: string }
}

const categories = [
  { value: 'ARTICLE', label: 'Članak' }, { value: 'VIDEO', label: 'Video' },
  { value: 'INTERVIEW', label: 'Intervju' }, { value: 'RESEARCH', label: 'Istraživanje' },
  { value: 'EDITING', label: 'Montaža' }, { value: 'SOCIAL_MEDIA', label: 'Društvene mreže' },
  { value: 'OTHER', label: 'Ostalo' }
]
const statuses = [
  { value: 'IN_PROGRESS', label: 'U radu' },
  { value: 'COMPLETED',   label: 'Završeno' },
  { value: 'PUBLISHED',   label: 'Objavljeno' }
]
const priorities = [
  { value: 'HIGH',   label: 'Visok' },
  { value: 'MEDIUM', label: 'Srednji' },
  { value: 'LOW',    label: 'Nizak' }
]
const users = [
  { id: 'novinar', name: 'Novinar' },
  { id: 'snimatelj', name: 'Snimatelj' },
  { id: 'saradnik', name: 'Saradnik' },
  { id: 'agencija', name: 'Agencija' }
]

/* ---------- 3. GLAVNA KOMPONENTA ---------- */

export default function NewsroomTracker() {
  /* state */
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-task' | 'calendar' | 'ideas'>('dashboard')
  const [tasks,  setTasks]  = useState<Task[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [ideas,  setIdeas]  = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [isLarge, setIsLarge] = useState(true)

  /* forme */
  const [taskForm, setTaskForm] = useState({
    userId: 'Novinar', category: 'ARTICLE',
    description: '', link: '', status: 'IN_PROGRESS', notes: ''
  })
  const [eventForm, setEventForm] = useState({
    title: '', date: '', time: '',
    priority: 'MEDIUM', userId: 'Novinar', notes: ''
  })
  const [ideaForm, setIdeaForm] = useState({
    title: '', description: '',
    priority: 'MEDIUM', category: 'Priča', userId: 'Novinar'
  })

  /* efekat – prvi fetch + resize listener */
  useEffect(() => {
    Promise.all([fetchTasks(), fetchEvents(), fetchIdeas()])
    const onResize = () => setIsLarge(window.innerWidth >= 1024)
    onResize(); window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* fetch helpers  */
  const fetchTasks  = async () => { try { const r = await fetch('/api/tasks');  r.ok && setTasks(await r.json()) } catch {} }
  const fetchEvents = async () => { try { const r = await fetch('/api/events'); r.ok && setEvents(await r.json()) } catch {} }
  const fetchIdeas  = async () => { try { const r = await fetch('/api/ideas');  r.ok && setIdeas(await r.json()) } catch {} }

  /* addTask – opis NIJE obavezan */
  const addTask = async () => {
    setLoading(true)
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm)
      })
      await fetchTasks()
      setTaskForm({ ...taskForm, description: '', link: '', notes: '' })
    } finally { setLoading(false) }
  }

  /* addEvent */
  const addEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.date) return
    setLoading(true)
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm)
      })
      await fetchEvents()
      setEventForm({ ...eventForm, title: '', date: '', time: '', notes: '' })
    } finally { setLoading(false) }
  }

  /* addIdea */
  const addIdea = async () => {
    if (!ideaForm.title.trim()) return
    setLoading(true)
    try {
      await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaForm)
      })
      await fetchIdeas()
      setIdeaForm({ ...ideaForm, title: '', description: '' })
    } finally { setLoading(false) }
  }

  /* Kalendar helper funkcije */
  const getCurrentMonth = () => new Date().getMonth()
  const getCurrentYear = () => new Date().getFullYear()
  const [calendarMonth, setCalendarMonth] = useState(getCurrentMonth())
  const [calendarYear, setCalendarYear] = useState(getCurrentYear())
  const [calendarView, setCalendarView] = useState<'list' | 'month'>('list')

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()
  
  const getEventsForDate = (day: number, month: number, year: number) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    return events.filter(e => e.date.split('T')[0] === dateStr)
  }

  const monthNames = [
    'Јануар', 'Фебруар', 'Март', 'Април', 'Мај', 'Јун',
    'Јул', 'Август', 'Септембар', 'Октобар', 'Новембар', 'Децембар'
  ]

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear(calendarYear - 1)
    } else {
      setCalendarMonth(calendarMonth - 1)
    }
  }

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear(calendarYear + 1)
    } else {
      setCalendarMonth(calendarMonth + 1)
    }
  }
  const todayISO = new Date().toISOString().split('T')[0]
  const todaysTasks = tasks.filter(t => new Date(t.date).toISOString().split('T')[0] === todayISO)
  const upcomingEvents = events
    .filter(e => {
      const eventDate = new Date(e.date)
      const today = new Date()
      const next7Days = new Date()
      next7Days.setDate(today.getDate() + 7)
      
      // Poređuj samo datume bez vremena
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const next7DaysOnly = new Date(next7Days.getFullYear(), next7Days.getMonth(), next7Days.getDate())
      
      return eventDateOnly >= todayOnly && eventDateOnly <= next7DaysOnly
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sortiraj po datumu
    .slice(0, 5)
  const getCat = (v: string) => categories.find(c => c.value === v)?.label || v
  const getStat = (v: string) => statuses.find(s => s.value === v)?.label || v
  const getPrio = (v: string) => priorities.find(p => p.value === v)?.label || v

  /* delete helpers (skraćeno) */
  const delTask  = async (id: string) => { if (!confirm('Obrisati rad?')) return; setLoading(true); try { await fetch(`/api/tasks/${id}`, { method: 'DELETE' }); await fetchTasks() } finally { setLoading(false) } }
  const delEvent = async (id: string) => { if (!confirm('Obrisati događaj?')) return; setLoading(true); try { await fetch(`/api/events/${id}`, { method: 'DELETE' }); await fetchEvents() } finally { setLoading(false) } }
  const delIdea  = async (id: string) => { if (!confirm('Obrisati ideju?'))  return; setLoading(true); try { await fetch(`/api/ideas/${id}`,  { method: 'DELETE' }); await fetchIdeas()  } finally { setLoading(false) } }

  /* TaskCard – interno */
  const TaskCard = ({ task }: { task: Task }) => (
    <div style={{
      background: 'white', borderRadius: 8, border: '1px solid #e5e7eb',
      padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,.1)',
      position: 'relative',
      isolation: 'isolate',
      paddingRight: 40,
      wordWrap: 'break-word',
      overflowWrap: 'break-word'
    }}>
      <button
        onClick={() => delTask(task.id)}
        disabled={loading}
        style={{
          position: 'absolute', 
          top: 8, 
          right: 8,
          background: '#ef4444', 
          color: 'white',
          border: 'none', 
          borderRadius: 4, 
          padding: 6,
          cursor: 'pointer', 
          opacity: .8,
          zIndex: 1,
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
      ><Trash2 size={14} /></button>

      <div style={{ 
        display: 'flex', 
        gap: 4, 
        marginBottom: 8, 
        flexWrap: 'wrap',
        paddingRight: 0
      }}>
        <span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 6px', borderRadius: 4, fontSize: 11, whiteSpace: 'nowrap' }}>
          {task.user.name}
        </span>
        <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontSize: 11, whiteSpace: 'nowrap' }}>
          {getCat(task.category)}
        </span>
        <span style={{
          background: task.status === 'PUBLISHED' ? '#dcfce7' : task.status === 'COMPLETED' ? '#dbeafe' : '#fef3c7',
          color:     task.status === 'PUBLISHED' ? '#166534' : task.status === 'COMPLETED' ? '#1d4ed8' : '#d97706',
          padding: '2px 6px', borderRadius: 4, fontSize: 11, whiteSpace: 'nowrap'
        }}>{getStat(task.status)}</span>
      </div>

      <small style={{ color: '#6b7280', display: 'block', marginBottom: 8 }}>
        {new Date(task.createdAt).toLocaleString('sr-RS')}
      </small>
      
      {task.description && (
        <p style={{ margin: '8px 0', color: '#374151', lineHeight: 1.4 }}>{task.description}</p>
      )}

      {task.link && (
        <a href={task.link} target="_blank" rel="noopener noreferrer" 
           style={{ 
             color: '#3b82f6', 
             fontSize: 14, 
             display: 'inline-flex', 
             alignItems: 'center', 
             gap: 4,
             wordBreak: 'break-all',
             marginTop: 8
           }}>
          <ExternalLink size={12} /> 
          <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {task.link}
          </span>
        </a>
      )}

      {task.notes && (
        <p style={{ 
          background: '#f9fafb', 
          padding: 8, 
          borderRadius: 4, 
          fontSize: 14, 
          color: '#6b7280',
          marginTop: 8,
          lineHeight: 1.4
        }}>
          {task.notes}
        </p>
      )}
    </div>
  )

  /* ---------- 4. RENDER ---------- */

  const todayNice = new Date().toLocaleDateString('sr-RS', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <Card style={{ border: 'none', borderRadius: 0 }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/logo.png" 
                alt="Pirotske vesti logo" 
                style={{ 
                  width: '40px', 
                  height: '40px',
                  objectFit: 'contain'
                }} 
              />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Pirotske vesti – Redakcija</h1>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>{todayNice}</p>
        </div>
      </Card>

      <div style={{ maxWidth: 1152, margin: '0 auto', padding: 16 }}>
        {/* Dashboard Card - uvek prikazan kao dugme kada nismo na dashboard-u */}
        {activeTab !== 'dashboard' && (
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600,
                width: '100%',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,.1)'
              }}
            >
              <Users size={20} />
              <span>Dashboard</span>
            </button>
          </div>
        )}

        {/* Action Cards - prikazane samo na dashboard-u */}
        {activeTab === 'dashboard' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLarge ? 'repeat(3, 1fr)' : '1fr',
            gap: 16,
            marginBottom: 24
          }}>
            <button
              onClick={() => setActiveTab('add-task')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: '0 4px 6px rgba(0,0,0,.1)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Plus size={24} />
              <span>Dodaj rad</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: '0 4px 6px rgba(0,0,0,.1)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Calendar size={24} />
              <span>Kalendar</span>
            </button>

            <button
              onClick={() => setActiveTab('ideas')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: '0 4px 6px rgba(0,0,0,.1)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Lightbulb size={24} />
              <span>Bank ideja</span>
            </button>
          </div>
        )}

        {/* ---------- GLAVNI SADRŽAJ ---------- */}
        <div style={{ 
          overflow: 'hidden' 
        }}>

          {/* DASHBOARD --------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr',
              gap: 24
            }}>
              {/* Predstojeći događaji - PRVO */}
              <Card>
                <div style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                    <Calendar size={20} style={{ marginRight: 8 }} /> Predstojeći događaji
                  </h2>
                  {upcomingEvents.length
                    ? upcomingEvents.map(e => (
                          <div key={e.id} style={{ 
                          borderLeft: '4px solid #3b82f6', 
                          paddingLeft: 16, 
                          marginBottom: 12, 
                          position: 'relative',
                          paddingRight: 40,
                          isolation: 'isolate',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          <button onClick={() => delEvent(e.id)} disabled={loading}
                            style={{ 
                              position: 'absolute', 
                              top: 4, 
                              right: 4, 
                              background: '#ef4444', 
                              border: 'none',
                              borderRadius: 4, 
                              padding: 6, 
                              color: 'white', 
                              cursor: 'pointer', 
                              opacity: .8,
                              zIndex: 1,
                              width: 28,
                              height: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                          >
                            <Trash2 size={14} />
                          </button>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'flex-start' }}>
                            <strong style={{ flex: '1', minWidth: 0, wordBreak: 'break-word' }}>{e.title}</strong>
                            <span style={{
                              fontSize: 11, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0,
                              background: e.priority === 'HIGH' ? '#fecaca'
                                       : e.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                              color: e.priority === 'HIGH' ? '#991b1b'
                                   : e.priority === 'MEDIUM' ? '#d97706' : '#166534'
                            }}>{getPrio(e.priority)}</span>
                          </div>
                          <small style={{ color: '#6b7280', display: 'block', margin: '4px 0' }}>
                            📅 {new Date(e.date).toLocaleDateString('sr-RS', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}{e.time && ` u ${e.time}`}
                          </small>
                          <div style={{ color: '#3b82f6', fontSize: 14 }}>👤 {e.user.name}</div>
                          {e.notes && (
                            <p style={{ 
                              fontSize: 14, 
                              background: '#f9fafb', 
                              padding: 8, 
                              borderRadius: 4,
                              lineHeight: 1.4,
                              wordBreak: 'break-word',
                              marginTop: 8,
                              color: '#6b7280'
                            }}>{e.notes}</p>
                          )}
                        </div>
                      ))
                    : <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>Nema zakazanih događaja</p>}
                </div>
              </Card>

              {/* Danas urađeno - DRUGO */}
              <Card>
                <div style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                    <Clock size={20} style={{ marginRight: 8 }} /> Danas urađeno ({todaysTasks.length})
                  </h2>
                  {todaysTasks.length
                    ? todaysTasks.map(t => <TaskCard key={t.id} task={t} />)
                    : <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>Još nema unetih radova</p>}
                </div>
              </Card>
            </div>
          )}

          {/* DODAJ RAD --------------------------------------------------- */}
          {activeTab === 'add-task' && (
            <Card style={{ maxWidth: 512, margin: '0 auto' }}>
              <div style={{ padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Dodaj rad</h2>

                {/* Osoba & Kategorija */}
                <div style={{ display: 'grid', gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Osoba</label>
                    <Select value={taskForm.userId}
                            onChange={(e: any) => setTaskForm({ ...taskForm, userId: e.target.value })}>
                      {users.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Kategorija</label>
                    <Select value={taskForm.category}
                            onChange={(e: any) => setTaskForm({ ...taskForm, category: e.target.value })}>
                      {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </Select>
                  </div>
                </div>

                {/* Opis */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Opis rada (opciono)</label>
                  <Textarea value={taskForm.description}
                            onChange={(e: any) => setTaskForm({ ...taskForm, description: e.target.value })} />
                </div>

                {/* Link */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Link (opciono)</label>
                  <Input type="url" value={taskForm.link}
                         onChange={(e: any) => setTaskForm({ ...taskForm, link: e.target.value })} />
                </div>

                {/* Status */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Status</label>
                  <Select value={taskForm.status}
                          onChange={(e: any) => setTaskForm({ ...taskForm, status: e.target.value })}>
                    {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </Select>
                </div>

                {/* Notes */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Beleške (opciono)</label>
                  <Textarea rows={2} value={taskForm.notes}
                            onChange={(e: any) => setTaskForm({ ...taskForm, notes: e.target.value })} />
                </div>

                <Button onClick={addTask} disabled={loading} style={{ width: '100%', marginTop: 24 }}>
                  {loading ? 'Dodajem…' : 'Dodaj rad'}
                </Button>
              </div>
            </Card>
          )}

          {/* KALENDAR --------------------------------------------------- */}
          {activeTab === 'calendar' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr',
              gap: 24
            }}>
              {/* Forma */}
              <Card>
                <div style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Dodaj događaj</h2>

                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Naziv</label>
                  <Input value={eventForm.title}
                         onChange={(e: any) => setEventForm({ ...eventForm, title: e.target.value })} />

                  <div style={{ display: 'grid', gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr', gap: 16, marginTop: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Datum</label>
                      <Input type="date" value={eventForm.date}
                             onChange={(e: any) => setEventForm({ ...eventForm, date: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Vreme</label>
                      <Input type="time" value={eventForm.time}
                             onChange={(e: any) => setEventForm({ ...eventForm, time: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr', gap: 16, marginTop: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Prioritet</label>
                      <Select value={eventForm.priority}
                              onChange={(e: any) => setEventForm({ ...eventForm, priority: e.target.value })}>
                        {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </Select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Odgovorna osoba</label>
                      <Select value={eventForm.userId}
                              onChange={(e: any) => setEventForm({ ...eventForm, userId: e.target.value })}>
                        {users.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                      </Select>
                    </div>
                  </div>

                  <label style={{ marginTop: 16, display: 'block', marginBottom: 4, fontWeight: 500 }}>Napomene</label>
                  <Textarea rows={3} value={eventForm.notes}
                            onChange={(e: any) => setEventForm({ ...eventForm, notes: e.target.value })} />

                  <Button style={{ width: '100%', background: '#16a34a', marginTop: 24 }}
                          onClick={addEvent} disabled={loading}>
                    {loading ? 'Dodajem…' : 'Dodaj događaj'}
                  </Button>
                </div>
              </Card>

              {/* Lista */}
              <Card>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
                      {calendarView === 'list' ? 'Predstojeći događaji' : 'Mesečni kalendar'}
                    </h2>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setCalendarView('list')}
                        style={{
                          background: calendarView === 'list' ? '#f59e0b' : '#e5e7eb',
                          color: calendarView === 'list' ? 'white' : '#6b7280',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 4,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Lista
                      </button>
                      <button
                        onClick={() => setCalendarView('month')}
                        style={{
                          background: calendarView === 'month' ? '#f59e0b' : '#e5e7eb',
                          color: calendarView === 'month' ? 'white' : '#6b7280',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 4,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Mesec
                      </button>
                    </div>
                  </div>

                  {calendarView === 'month' && (
                    <div>
                      {/* Navigacija meseca */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <button onClick={prevMonth} style={{ background: '#6b7280', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>
                          ←
                        </button>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                          {monthNames[calendarMonth]} {calendarYear}
                        </h3>
                        <button onClick={nextMonth} style={{ background: '#6b7280', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>
                          →
                        </button>
                      </div>

                      {/* Kalendar grid */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(7, 1fr)', 
                        gap: 1, 
                        background: '#e5e7eb',
                        borderRadius: 8,
                        overflow: 'hidden'
                      }}>
                        {/* Dani u nedelji */}
                        {['Нед', 'Пон', 'Уто', 'Сре', 'Чет', 'Пет', 'Суб'].map(day => (
                          <div key={day} style={{ 
                            background: '#374151', 
                            color: 'white', 
                            padding: '8px 4px', 
                            textAlign: 'center', 
                            fontSize: 12, 
                            fontWeight: 600 
                          }}>
                            {day}
                          </div>
                        ))}

                        {/* Prazna polja za početak meseca */}
                        {Array.from({ length: getFirstDayOfMonth(calendarMonth, calendarYear) === 0 ? 6 : getFirstDayOfMonth(calendarMonth, calendarYear) - 1 }).map((_, i) => (
                          <div key={`empty-${i}`} style={{ background: '#f9fafb', minHeight: 60 }} />
                        ))}

                        {/* Dani u mesecu */}
                        {Array.from({ length: getDaysInMonth(calendarMonth, calendarYear) }).map((_, i) => {
                          const day = i + 1
                          const dayEvents = getEventsForDate(day, calendarMonth, calendarYear)
                          const isToday = day === new Date().getDate() && 
                                         calendarMonth === new Date().getMonth() && 
                                         calendarYear === new Date().getFullYear()
                          
                          return (
                            <div key={day} style={{ 
                              background: 'white', 
                              minHeight: 60, 
                              padding: 4,
                              border: isToday ? '2px solid #f59e0b' : 'none',
                              position: 'relative'
                            }}>
                              <div style={{ 
                                fontSize: 14, 
                                fontWeight: isToday ? 600 : 400,
                                color: isToday ? '#f59e0b' : '#374151',
                                marginBottom: 2
                              }}>
                                {day}
                              </div>
                              {dayEvents.slice(0, 2).map((event, idx) => (
                                <div key={event.id} style={{
                                  background: event.priority === 'HIGH' ? '#fecaca' : event.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                                  color: event.priority === 'HIGH' ? '#991b1b' : event.priority === 'MEDIUM' ? '#d97706' : '#166534',
                                  fontSize: 10,
                                  padding: '1px 3px',
                                  borderRadius: 2,
                                  marginBottom: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {event.time && `${event.time.substring(0, 5)} `}{event.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 600 }}>
                                  +{dayEvents.length - 2} још
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {calendarView === 'list' && (
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      {events.filter(e => {
                        const eventDate = new Date(e.date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return eventDate >= today;
                      }).length
                        ? events.filter(e => {
                            const eventDate = new Date(e.date);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return eventDate >= today;
                          }).map(e => (
                            <div key={e.id} style={{ 
                              border: '1px solid #e5e7eb', 
                              borderRadius: 8, 
                              padding: 16, 
                              position: 'relative', 
                              marginBottom: 16,
                              paddingRight: 40,
                              isolation: 'isolate',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word'
                            }}>
                              <button onClick={() => delEvent(e.id)} disabled={loading}
                                style={{ 
                                  position: 'absolute', 
                                  top: 8, 
                                  right: 8, 
                                  background: '#ef4444',
                                  border: 'none', 
                                  borderRadius: 4, 
                                  padding: 6, 
                                  color: 'white', 
                                  cursor: 'pointer', 
                                  opacity: .8,
                                  zIndex: 1,
                                  width: 28,
                                  height: 28,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                              >
                                <Trash2 size={14} />
                              </button>
                              <strong style={{ display: 'block', marginBottom: 8, wordBreak: 'break-word' }}>{e.title}</strong>
                              <div style={{ fontSize: 12, color: '#6b7280', margin: '4px 0' }}>
                                📅 {new Date(e.date).toLocaleDateString('sr-RS', { 
                                  weekday: 'long', 
                                  day: 'numeric', 
                                  month: 'long' 
                                })}{e.time && ` u ${e.time}`}
                              </div>
                              <div style={{ fontSize: 12, color: '#3b82f6', marginBottom: 8 }}>👤 {e.user.name}</div>
                              <span style={{
                                fontSize: 11, padding: '2px 6px', borderRadius: 4, marginBottom: 8, display: 'inline-block',
                                background: e.priority === 'HIGH' ? '#fecaca'
                                         : e.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                                color: e.priority === 'HIGH' ? '#991b1b'
                                     : e.priority === 'MEDIUM' ? '#d97706' : '#166534'
                              }}>{getPrio(e.priority)}</span>
                              {e.notes && (
                                <p style={{ 
                                  fontSize: 14, 
                                  background: '#f9fafb', 
                                  padding: 8, 
                                  borderRadius: 4,
                                  lineHeight: 1.4,
                                  wordBreak: 'break-word',
                                  marginTop: 8,
                                  color: '#6b7280'
                                }}>{e.notes}</p>
                              )}
                            </div>
                          ))
                        : <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>Nema predstojećih događaja</p>}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* IDEAS ------------------------------------------------------ */}
          {activeTab === 'ideas' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr',
              gap: 24
            }}>
              {/* Forma */}
              <Card>
                <div style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Dodaj ideju</h2>

                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Naslov</label>
                  <Input value={ideaForm.title}
                         onChange={(e: any) => setIdeaForm({ ...ideaForm, title: e.target.value })} />

                  <label style={{ marginTop: 16, display: 'block', marginBottom: 4, fontWeight: 500 }}>Opis</label>
                  <Textarea rows={4} value={ideaForm.description}
                            onChange={(e: any) => setIdeaForm({ ...ideaForm, description: e.target.value })} />

                  <div style={{ display: 'grid', gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr', gap: 16, marginTop: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Prioritet</label>
                      <Select value={ideaForm.priority}
                              onChange={(e: any) => setIdeaForm({ ...ideaForm, priority: e.target.value })}>
                        {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </Select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Predložio</label>
                      <Select value={ideaForm.userId}
                              onChange={(e: any) => setIdeaForm({ ...ideaForm, userId: e.target.value })}>
                        {users.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                      </Select>
                    </div>
                  </div>

                  <Button style={{ width: '100%', background: '#9333ea', marginTop: 24 }}
                          onClick={addIdea} disabled={loading}>
                    {loading ? 'Dodajem…' : 'Sačuvaj ideju'}
                  </Button>
                </div>
              </Card>

              {/* Lista */}
              <Card>
                <div style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Bank ideja ({ideas.length})</h2>
                  <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {ideas.length
                      ? ideas.map(i => (
                          <div key={i.id} style={{ 
                            border: '1px solid #e5e7eb', 
                            borderRadius: 8, 
                            padding: 16, 
                            position: 'relative', 
                            marginBottom: 16,
                            paddingRight: 40,
                            isolation: 'isolate',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word'
                          }}>
                            <button onClick={() => delIdea(i.id)} disabled={loading}
                              style={{ 
                                position: 'absolute', 
                                top: 8, 
                                right: 8, 
                                background: '#ef4444',
                                border: 'none', 
                                borderRadius: 4, 
                                padding: 6, 
                                color: 'white', 
                                cursor: 'pointer', 
                                opacity: .8,
                                zIndex: 1,
                                width: 28,
                                height: 28,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                            >
                              <Trash2 size={14} />
                            </button>
                            <strong style={{ display: 'block', marginBottom: 8, wordBreak: 'break-word' }}>{i.title}</strong>
                            <div style={{ display: 'flex', gap: 6, margin: '4px 0', flexWrap: 'wrap' }}>
                              <span style={{ 
                                background: '#e879f9', 
                                color: '#581c87', 
                                padding: '2px 6px', 
                                borderRadius: 4, 
                                fontSize: 11,
                                whiteSpace: 'nowrap'  
                              }}>{i.category}</span>
                              <span style={{
                                background: i.priority === 'HIGH' ? '#fecaca' : i.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                                color:     i.priority === 'HIGH' ? '#991b1b' : i.priority === 'MEDIUM' ? '#d97706' : '#166534',
                                padding: '2px 6px', 
                                borderRadius: 4, 
                                fontSize: 11,
                                whiteSpace: 'nowrap'
                              }}>{getPrio(i.priority)}</span>
                            </div>
                            {i.description && (
                              <p style={{ 
                                fontSize: 14, 
                                color: '#6b7280', 
                                marginBottom: 8,
                                lineHeight: 1.4,
                                wordBreak: 'break-word'
                              }}>{i.description}</p>
                            )}
                            <small style={{ color: '#9ca3af', display: 'block', lineHeight: 1.3 }}>
                              Dodao: {i.user.name} · {new Date(i.createdAt).toLocaleDateString('sr-RS')}
                            </small>
                          </div>
                        ))
                      : <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>Nema sačuvanih ideja</p>}
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}