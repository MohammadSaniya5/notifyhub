import { NextRequest, NextResponse } from 'next/server'
import { getQueries, saveQuery } from '@/app/lib/kv'

export async function GET() {
  try {
    const queries = await getQueries()
    return NextResponse.json(queries)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const query = await saveQuery({
      name: body.name,
      email: body.email,
      department: body.department,
      message: body.message,
    })
    return NextResponse.json(query)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}