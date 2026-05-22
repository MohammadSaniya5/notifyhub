import { NextRequest, NextResponse } from 'next/server'

import {
  getAnnouncements,
  saveAnnouncements,
  Announcement,
} from '@/app/lib/kv'

import { v4 as uuid } from 'uuid'

export async function GET() {
  try {
    const announcements = await getAnnouncements()

    return NextResponse.json(announcements)
  } catch (error) {
    console.error(error)

    return NextResponse.json([], {
      status: 200,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const announcements = await getAnnouncements()

    const newAnnouncement: Announcement = {
      id: uuid(),
      title: body.title,
      description: body.description,
      category: body.category,
      department: body.department,
      date: new Date().toLocaleDateString('en-IN'),
      urgent: body.urgent || false,
      image: body.image || '',
      link: body.link || '',
      createdAt: Date.now(),
    }

    announcements.unshift(newAnnouncement)

    await saveAnnouncements(announcements)

    return NextResponse.json(newAnnouncement)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Failed to post announcement' },
      { status: 500 }
    )
  }
}