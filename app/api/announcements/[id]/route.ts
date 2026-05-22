import { NextResponse } from 'next/server'

import {
  getAnnouncements,
  saveAnnouncements,
} from '@/app/lib/kv'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const announcements = await getAnnouncements()

    const filtered = announcements.filter(
      (a) => a.id !== params.id
    )

    await saveAnnouncements(filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}