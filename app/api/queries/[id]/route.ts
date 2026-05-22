import { NextResponse } from 'next/server'
import { answerQuery } from '@/app/lib/kv'

type Context = {
  params: Promise<{ id: string }>
}

export async function PATCH(
  req: Request,
  context: Context
) {
  try {
    const params = await context.params
    const body = await req.json()
    await answerQuery(params.id, body.answer)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}