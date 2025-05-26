'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Plus, Users, Lightbulb, Clock, ExternalLink } from 'lucide-react'

interface Task {
  id: string
  description: string
  link?: string
  category: string
  status: string
  notes?: string
  date: string
  createdAt: string
  user: { name: string }
}

interface Event {
  id: string
  title: string
  date: string
  time?: string
  priority: string
  notes?: string
  user: { name: string }
}

interface Idea {
  id: string
  title: string
  description?: string
  priority: string
  category: string
  createdAt: string
  user: { name: string }
}

const categories = [
  { value: 'ARTICLE', label: 'Članak' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'INTERVIEW', label: 'Intervju' },
  { value: 'RESEARCH', label: 'Istraživanje' },
  { value: 'EDITING', label: 'Montaža' },
  { value: 'SOCIAL_MEDIA', label: 'Društvene mreže' },
  { value: 'OTHER', label: 'Ostalo' }
]

const statuses = [
  { value: 'IN_PROGRESS', label: 'U radu' },
  { value: 'COMPLETED', label: 'Završeno' },
  { value: 'PUBLISHED', label: 'Objavljeno' }
]

const priorities = [
  { value: 'HIGH', label: 'Visok' },
  { value: 'MEDIUM', label: 'Srednji' },
  { value: 'LOW', label: 'Nizak' }
]

const users = [
  { id: 'novinar', name: 'Novinar' },
  { id: 'snimatelj', name: 'Snimatelj' },
  { id: 'saradnik', name: 'Saradnik' },
  { id: 'agencija', name: 'Agencija' }
]

export default function NewsroomTracker() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(true) // Default true za server

  // Form states
  const [taskForm, setTaskForm] = useState({
    userId: 'Novinar',
    category: 'ARTICLE',
    description: '',
    link: '',
    status: 'IN_PROGRESS',
    notes: ''
  })

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    priority: 'MEDIUM',
    userId: 'Novinar',
    notes: ''
  })

  const [ideaForm, setIdeaForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'Priča',
    userId: 'Novinar'
  })

  // Fetch data
  useEffect(() => {
    fetchTasks()
    fetchEvents()
    fetchIdeas()
    
    // Proveri screen size
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    
    // Set initial size
    handleResize()
    
    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(Array.isArray(data) ? data : [])
      } else {
        console.error('API Error:', response.status)
        setTasks([])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(Array.isArray(data) ? data : [])
      } else {
        console.error('API Error:', response.status)
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
    }
  }

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas')
      if (response.ok) {
        const data = await response.json()
        setIdeas(Array.isArray(data) ? data : [])
      } else {
        console.error('API Error:', response.status)
        setIdeas([])
      }
    } catch (error) {
      console.error('Error fetching ideas:', error)
      setIdeas([])
    }
  }

  // Add task
  const addTask = async () => {
    // Uklanjamo uslov za obavezno polje description
    setLoading(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm)
      })
      
      if (response.ok) {
        await fetchTasks()
        setTaskForm({
          userId: 'Novinar',
          category: 'ARTICLE',
          description: '',
          link: '',
          status: 'IN_PROGRESS',
          notes: ''
        })
      }
    } catch (error) {
      console.error('Error adding task:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.date) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm)
      })
      
      if (response.ok) {
        await fetchEvents()
        setEventForm({
          title: '',
          date: '',
          time: '',
          priority: 'MEDIUM',
          userId: 'Novinar',
          notes: ''
        })
      }
    } catch (error) {
      console.error('Error adding event:', error)
    } finally {
      setLoading(false)
    }
  }

  const addIdea = async () => {
    if (!ideaForm.title.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaForm)
      })
      
      if (response.ok) {
        await fetchIdeas()
        setIdeaForm({
          title: '',
          description: '',
          priority: 'MEDIUM',
          category: 'Priča',
          userId: 'Novinar'
        })
      }
    } catch (error) {
      console.error('Error adding idea:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const today = new Date().toISOString().split('T')[0]
  const todayFormatted = new Date().toLocaleDateString('sr-RS', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const todaysTasks = (tasks || []).filter(task => 
    new Date(task.date).toISOString().split('T')[0] === today
  )

  const upcomingEvents = (events || []).filter(event => {
    const eventDate = new Date(event.date)
    const now = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    return eventDate >= now && eventDate <= nextWeek
  }).slice(0, 5)

  const getCategoryLabel = (value: string) => 
    categories.find(cat => cat.value === value)?.label || value

  const getStatusLabel = (value: string) => 
    statuses.find(status => status.value === value)?.label || value

  const getPriorityLabel = (value: string) => 
    priorities.find(priority => priority.value === value)?.label || value

  const TaskCard = ({ task }: { task: Task }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#2563eb',
            backgroundColor: '#dbeafe',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {task.user.name}
          </span>
          <span style={{
            fontSize: '12px',
            backgroundColor: '#f3f4f6',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {getCategoryLabel(task.category)}
          </span>
          <span style={{
            fontSize: '12px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: task.status === 'PUBLISHED' ? '#dcfce7' : 
                           task.status === 'COMPLETED' ? '#dbeafe' : '#fef3c7',
            color: task.status === 'PUBLISHED' ? '#166534' : 
                   task.status === 'COMPLETED' ? '#1d4ed8' : '#d97706'
          }}>
            {getStatusLabel(task.status)}
          </span>
        </div>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {new Date(task.createdAt).toLocaleString('sr-RS')}
        </span>
      </div>
      <p style={{ color: '#374151', marginBottom: '8px' }}>{task.description}</p>
      {task.link && (
        <a 
          href={task.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            color: '#3b82f6',
            textDecoration: 'underline',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '8px'
          }}
        >
          <ExternalLink size={12} />
          {task.link}
        </a>
      )}
      {task.notes && (
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          padding: '8px',
          borderRadius: '4px'
        }}>
          {task.notes}
        </p>
      )}
    </div>
  )

  const Button = ({ children, onClick, disabled, style, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#9ca3af' : '#2563eb',
        color: 'white',
        padding: '10px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        ...style
      }}
      onMouseOver={(e: any) => {
      if (!disabled) e.target.style.backgroundColor = '#1d4ed8'
    }}
    onMouseOut={(e: any) => {
      if (!disabled) e.target.style.backgroundColor = '#2563eb'
    }}
    {...props}
    >
      {children}
    </button>
  )

  const Card = ({ children, style }: any) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      ...style
    }}>
      {children}
    </div>
  )

  const Input = ({ type = 'text', value, onChange, placeholder, style, ...props }: any) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        outline: 'none',
        ...style
      }}
      {...props}
    />
  )

  const Select = ({ value, onChange, children, style, ...props }: any) => (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        backgroundColor: 'white',
        outline: 'none',
        ...style
      }}
      {...props}
    >
      {children}
    </select>
  )

  const Textarea = ({ value, onChange, placeholder, rows = 3, style, ...props }: any) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        ...style
      }}
      {...props}
    />
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '16px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0'
          }}>
            Pirotske Vesti - Newsroom Tracker
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>{todayFormatted}</p>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        maxWidth: '1152px',
        margin: '0 auto',
        padding: '16px'
      }}>
        <div style={{
          display: 'flex',
          gap: '4px',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Users },
            { id: 'add-task', label: 'Dodaj rad', icon: Plus },
            { id: 'calendar', label: 'Kalendar', icon: Calendar },
            { id: 'ideas', label: 'Bank ideja', icon: Lightbulb }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  backgroundColor: activeTab === tab.id ? '#dbeafe' : 'transparent',
                  color: activeTab === tab.id ? '#1d4ed8' : '#6b7280'
                }}
                onMouseOver={(e: any) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = '#f3f4f6'
                    e.target.style.color = '#111827'
                  }
                }}
                onMouseOut={(e: any) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = '#6b7280'
                  }
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1152px',
        margin: '0 auto',
        padding: '0 16px 32px'
      }}>
        {activeTab === 'dashboard' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLargeScreen ? '1fr 1fr' : '1fr',
            gap: '24px'
          }}>
            {/* Today's Work */}
            <Card>
              <div style={{ padding: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <Clock style={{ marginRight: '8px' }} size={20} />
                  Danas urađeno ({todaysTasks.length})
                </h2>
                {todaysTasks.length > 0 ? (
                  <div>
                    {todaysTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <p style={{
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '32px 0'
                  }}>
                    Još nema unetih radova za danas
                  </p>
                )}
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <div style={{ padding: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <Calendar style={{ marginRight: '8px' }} size={20} />
                  Predstojeći događaji
                </h2>
                {upcomingEvents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {upcomingEvents.map(event => (
                      <div key={event.id} style={{
                        borderLeft: '4px solid #3b82f6',
                        paddingLeft: '16px',
                        paddingTop: '8px',
                        paddingBottom: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <h3 style={{ fontWeight: '500', margin: 0 }}>{event.title}</h3>
                          <span style={{
                            fontSize: '12px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: event.priority === 'HIGH' ? '#fecaca' : 
                                           event.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                            color: event.priority === 'HIGH' ? '#991b1b' : 
                                   event.priority === 'MEDIUM' ? '#d97706' : '#166534'
                          }}>
                            {getPriorityLabel(event.priority)}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '4px 0'
                        }}>
                          📅 {new Date(event.date).toLocaleDateString('sr-RS')}
                          {event.time && ` u ${event.time}`}
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: '#3b82f6',
                          margin: 0
                        }}>
                          👤 {event.user.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '32px 0'
                  }}>
                    Nema zakazanih događaja
                  </p>
                )}
              </div>
            </Card>

            {/* Team History */}
            <div style={{ gridColumn: isLargeScreen ? 'span 2' : 'span 1' }}>
              <Card>
                <div style={{ padding: '24px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '16px'
                  }}>
                    Istorija rada tima
                  </h2>
                  {users.map(user => {
                    const userTasks = tasks.filter(task => task.user.name === user.name)
                    return (
                      <div key={user.name} style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '500',
                          marginBottom: '12px',
                          color: '#1d4ed8'
                        }}>
                          {user.name} ({userTasks.length})
                        </h3>
                        {userTasks.length > 0 ? (
                          <div>
                            {userTasks.slice(0, 3).map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))}
                            {userTasks.length > 3 && (
                              <p style={{
                                fontSize: '14px',
                                color: '#6b7280',
                                textAlign: 'center'
                              }}>
                                ... i još {userTasks.length - 3} radova
                              </p>
                            )}
                          </div>
                        ) : (
                          <p style={{
                            color: '#6b7280',
                            fontSize: '14px'
                          }}>
                            Nema unetih radova
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'add-task' && (
          <Card style={{ maxWidth: '512px' }}>
            <div style={{ padding: '24px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '24px'
              }}>
                Dodaj rad
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Osoba
                    </label>
                    <Select 
                      value={taskForm.userId}
                      onChange={(e: any) => setTaskForm({...taskForm, userId: e.target.value})}
                    >
                      {users.map(user => (
                        <option key={user.name} value={user.name}>{user.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Kategorija
                    </label>
                    <Select 
                      value={taskForm.category}
                      onChange={(e: any) => setTaskForm({...taskForm, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Opis rada
                  </label>
                  <Textarea
                    value={taskForm.description}
                    onChange={(e: any) => setTaskForm({...taskForm, description: e.target.value})}
                    placeholder="Kratko opišite šta je urađeno..."
                    rows={3}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Link (opcionalno)
                  </label>
                  <Input
                    type="url"
                    value={taskForm.link}
                    onChange={(e: any) => setTaskForm({...taskForm, link: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Status
                  </label>
                  <Select 
                    value={taskForm.status}
                    onChange={(e: any) => setTaskForm({...taskForm, status: e.target.value})}
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Beleške (opcionalno)
                  </label>
                  <Textarea
                    value={taskForm.notes}
                    onChange={(e: any) => setTaskForm({...taskForm, notes: e.target.value})}
                    placeholder="Dodatne napomene, izazovi, uspesi..."
                    rows={2}
                  />
                </div>

                <Button
                  onClick={addTask}
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Dodajem...' : 'Dodaj rad'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'calendar' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLargeScreen ? '1fr 1fr' : '1fr',
            gap: '24px'
          }}>
            {/* Add Event Form */}
            <Card>
              <div style={{ padding: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  Dodaj događaj
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Naziv događaja
                    </label>
                    <Input
                      value={eventForm.title}
                      onChange={(e: any) => setEventForm({...eventForm, title: e.target.value})}
                      placeholder="Intervju, konferencija, rok..."
                    />
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Datum
                      </label>
                      <Input
                        type="date"
                        value={eventForm.date}
                        onChange={(e: any) => setEventForm({...eventForm, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Vreme
                      </label>
                      <Input
                        type="time"
                        value={eventForm.time}
                        onChange={(e: any) => setEventForm({...eventForm, time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Prioritet
                      </label>
                      <Select 
                        value={eventForm.priority}
                        onChange={(e: any) => setEventForm({...eventForm, priority: e.target.value})}
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>{priority.label}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Odgovorna osoba
                      </label>
                      <Select 
                        value={eventForm.userId}
                        onChange={(e: any) => setEventForm({...eventForm, userId: e.target.value})}
                      >
                        {users.map(user => (
                          <option key={user.name} value={user.name}>{user.name}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Napomene
                    </label>
                    <Textarea
                      value={eventForm.notes}
                      onChange={(e: any) => setEventForm({...eventForm, notes: e.target.value})}
                      placeholder="Adresa, kontakt, priprema..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={addEvent}
                    disabled={loading}
                    style={{ 
                      width: '100%',
                      backgroundColor: '#16a34a',
                      ':hover': { backgroundColor: '#15803d' }
                    }}
                  >
                    {loading ? 'Dodajem...' : 'Dodaj događaj'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Events List */}
            <Card>
              <div style={{ padding: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  Kalendar događaja
                </h2>
                {events.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {events.slice(0, 10).map(event => (
                      <div key={event.id} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <h3 style={{ fontWeight: '500', margin: 0 }}>{event.title}</h3>
                          <span style={{
                            fontSize: '12px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: event.priority === 'HIGH' ? '#fecaca' : 
                                           event.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                            color: event.priority === 'HIGH' ? '#991b1b' : 
                                   event.priority === 'MEDIUM' ? '#d97706' : '#166534'
                          }}>
                            {getPriorityLabel(event.priority)}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '4px 0'
                        }}>
                          📅 {new Date(event.date).toLocaleDateString('sr-RS')}
                          {event.time && ` u ${event.time}`}
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: '#3b82f6',
                          marginBottom: '8px'
                        }}>
                          👤 {event.user.name}
                        </p>
                        {event.notes && (
                          <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            backgroundColor: '#f9fafb',
                            padding: '8px',
                            borderRadius: '4px',
                            margin: 0
                          }}>
                            {event.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '32px 0'
                  }}>
                    Nema zakazanih događaja
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLargeScreen ? '1fr 1fr' : '1fr',
            gap: '24px'
          }}>
            {/* Add Idea Form */}
            <Card>
              <div style={{ padding: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  Dodaj ideju
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Naslov
                    </label>
                    <Input
                      value={ideaForm.title}
                      onChange={(e: any) => setIdeaForm({...ideaForm, title: e.target.value})}
                      placeholder="Kratko opisati ideju..."
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Opis
                    </label>
                    <Textarea
                      value={ideaForm.description}
                      onChange={(e: any) => setIdeaForm({...ideaForm, description: e.target.value})}
                      placeholder="Detaljan opis, kontakti, izvori..."
                      rows={4}
                    />
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Prioritet
                      </label>
                      <Select 
                        value={ideaForm.priority}
                        onChange={(e: any) => setIdeaForm({...ideaForm, priority: e.target.value})}
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>{priority.label}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Predložio
                      </label>
                      <Select 
                        value={ideaForm.userId}
                        onChange={(e: any) => setIdeaForm({...ideaForm, userId: e.target.value})}
                      >
                        {users.map(user => (
                          <option key={user.name} value={user.name}>{user.name}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={addIdea}
                    disabled={loading}
                    style={{ 
                      width: '100%',
                      backgroundColor: '#9333ea'
                    }}
                  >
                    {loading ? 'Dodajem...' : 'Sačuvaj ideju'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Ideas List */}
            <Card>
              <div style={{ padding: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  Bank ideja ({ideas.length})
                </h2>
                {ideas.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {ideas.slice(0, 10).map(idea => (
                      <div key={idea.id} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <h3 style={{ fontWeight: '500', margin: 0 }}>{idea.title}</h3>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{
                              fontSize: '12px',
                              backgroundColor: '#e879f9',
                              color: '#581c87',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              {idea.category}
                            </span>
                            <span style={{
                              fontSize: '12px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: idea.priority === 'HIGH' ? '#fecaca' : 
                                             idea.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                              color: idea.priority === 'HIGH' ? '#991b1b' : 
                                     idea.priority === 'MEDIUM' ? '#d97706' : '#166534'
                            }}>
                              {getPriorityLabel(idea.priority)}
                            </span>
                          </div>
                        </div>
                        {idea.description && (
                          <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '8px'
                          }}>
                            {idea.description}
                          </p>
                        )}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <p style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            margin: 0
                          }}>
                            Dodao: {idea.user.name}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            margin: 0
                          }}>
                            {new Date(idea.createdAt).toLocaleDateString('sr-RS')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '32px 0'
                  }}>
                    Nema sačuvanih ideja
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}