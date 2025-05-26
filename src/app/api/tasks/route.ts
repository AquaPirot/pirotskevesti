import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Dohvati sve zadatke
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST - Kreiraj novi zadatak
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, link, category, status, notes, userId } = body
    
    // Kreiraj ili pronađi korisnika
    let user = await prisma.user.findFirst({
      where: { name: userId }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: { name: userId }
      })
    }
    
    const task = await prisma.task.create({
      data: {
        description,
        link: link || null,
        category,
        status: status || 'IN_PROGRESS',
        notes: notes || null,
        userId: user.id
      },
      include: {
        user: true
      }
    })
    
    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}