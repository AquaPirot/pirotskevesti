import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Dohvati sve događaje
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        user: true
      },
      orderBy: {
        date: 'asc'
      }
    })
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST - Kreiraj novi događaj
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, time, priority, notes, userId } = body
    
    // Kreiraj ili pronađi korisnika
    let user = await prisma.user.findFirst({
      where: { name: userId }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: { name: userId }
      })
    }
    
    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        time: time || null,
        priority: priority || 'MEDIUM',
        notes: notes || null,
        userId: user.id
      },
      include: {
        user: true
      }
    })
    
    return NextResponse.json(event)
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}