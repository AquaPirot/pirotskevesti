import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Dohvati sve ideje
export async function GET() {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 })
  }
}

// POST - Kreiraj novu ideju
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority, category, userId } = body
    
    // Kreiraj ili pronađi korisnika
    let user = await prisma.user.findFirst({
      where: { name: userId }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: { name: userId }
      })
    }
    
    const idea = await prisma.idea.create({
      data: {
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        category: category || 'Priča',
        userId: user.id
      },
      include: {
        user: true
      }
    })
    
    return NextResponse.json(idea)
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 })
  }
}