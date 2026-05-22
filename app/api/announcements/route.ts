import { NextRequest, NextResponse } from 'next/server'

import {
  getAnnouncements,
  saveAnnouncement,
} from '@/app/lib/kv'

export async function GET() {
  const announcements = await getAnnouncements()

  return NextResponse.json(announcements)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const announcement = await saveAnnouncement({
      title: body.title,
      description: body.description,
      category: body.category,
      department: body.department,
      date: new Date().toLocaleDateString('en-IN'),
      urgent: body.urgent || false,
      image: body.image || '',
      link: body.link || '',
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Failed' },
      { status: 500 }
    )
  }
}