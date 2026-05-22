import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (
    body.username === username &&
    body.password === password
  ) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false },
    { status: 401 }
  )
}