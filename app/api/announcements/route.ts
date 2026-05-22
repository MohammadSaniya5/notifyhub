import { NextResponse } from 'next/server'
import { deleteAnnouncement } from '@/app/lib/kv'

type Context = {
  params: Promise<{ id: string }>
}

export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const params = await context.params
    await deleteAnnouncement(params.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}