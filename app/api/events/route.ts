import { NextRequest, NextResponse } from 'next/server'
import { getEvents, saveEvent } from '@/app/lib/kv'

export async function GET() {
  try {
    const events = await getEvents()
    return NextResponse.json(events)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const event = await saveEvent({
      title: body.title,
      description: body.description,
      category: body.category,
      department: body.department,
      date: body.date,
      time: body.time,
      venue: body.venue,
      registrationLink: body.registrationLink || '',
    })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}