// src/app/api/ideas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - Obriši ideju
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ideaId = params.id
    
    // Proveri da li ideja postoji
    const existingIdea = await prisma.idea.findUnique({
      where: { id: ideaId }
    })
    
    if (!existingIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }
    
    // Obriši ideju
    await prisma.idea.delete({
      where: { id: ideaId }
    })
    
    return NextResponse.json({ message: 'Idea deleted successfully' })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 })
  }
}