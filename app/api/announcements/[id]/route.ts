import { NextRequest, NextResponse } from 'next/server'
import { deleteAnnouncement } from '@/app/lib/kv'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteAnnouncement(params.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}