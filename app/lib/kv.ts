export interface Announcement {
  id: string
  title: string
  description: string
  category: string
  department: string
  date: string
  urgent: boolean
  image?: string
  link?: string
  createdAt: number
}

export interface Event {
  id: string
  title: string
  description: string
  category: string
  department: string
  date: string
  time: string
  venue: string
  registrationLink?: string
  createdAt: number
}

let localAnnouncements: Announcement[] = []
let localEvents: Event[] = []

// ─── Announcements ───────────────────────────────

export async function getAnnouncements(): Promise<Announcement[]> {
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    const rows = await sql`SELECT * FROM announcements ORDER BY created_at DESC`
    return rows.map((r: any) => ({
      id: r.id, title: r.title, description: r.description,
      category: r.category, department: r.department, date: r.date,
      urgent: r.urgent, image: r.image, link: r.link, createdAt: r.created_at,
    }))
  }
  return localAnnouncements
}

export async function saveAnnouncement(a: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
  const id = Math.random().toString(36).substring(2, 9)
  const createdAt = Date.now()
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    await sql`
      INSERT INTO announcements (id, title, description, category, department, date, urgent, image, link, created_at)
      VALUES (${id}, ${a.title}, ${a.description}, ${a.category}, ${a.department}, ${a.date}, ${a.urgent}, ${a.image || ''}, ${a.link || ''}, ${createdAt})
    `
  } else {
    localAnnouncements.unshift({ id, ...a, createdAt })
  }
  return { id, ...a, createdAt }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    await sql`DELETE FROM announcements WHERE id = ${id}`
  } else {
    localAnnouncements = localAnnouncements.filter(a => a.id !== id)
  }
}

// ─── Events ───────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    const rows = await sql`SELECT * FROM events ORDER BY created_at DESC`
    return rows.map((r: any) => ({
      id: r.id, title: r.title, description: r.description,
      category: r.category, department: r.department, date: r.date,
      time: r.time, venue: r.venue, registrationLink: r.registration_link,
      createdAt: r.created_at,
    }))
  }
  return localEvents
}

export async function saveEvent(e: Omit<Event, 'id' | 'createdAt'>): Promise<Event> {
  const id = Math.random().toString(36).substring(2, 9)
  const createdAt = Date.now()
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    await sql`
      INSERT INTO events (id, title, description, category, department, date, time, venue, registration_link, created_at)
      VALUES (${id}, ${e.title}, ${e.description}, ${e.category}, ${e.department}, ${e.date}, ${e.time}, ${e.venue}, ${e.registrationLink || ''}, ${createdAt})
    `
  } else {
    localEvents.unshift({ id, ...e, createdAt })
  }
  return { id, ...e, createdAt }
}

export async function deleteEvent(id: string): Promise<void> {
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    await sql`DELETE FROM events WHERE id = ${id}`
  } else {
    localEvents = localEvents.filter(e => e.id !== id)
  }
}

// ─── Queries ───────────────────────────────────────

export interface Query {
  id: string
  name: string
  email: string
  department: string
  message: string
  answer?: string
  answered: boolean
  createdAt: number
}

export async function getQueries(): Promise<Query[]> {
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    const rows = await sql`SELECT * FROM queries ORDER BY created_at DESC`
    return rows.map((r: any) => ({
      id: r.id, name: r.name, email: r.email,
      department: r.department, message: r.message,
      answer: r.answer, answered: r.answered, createdAt: r.created_at,
    }))
  }
  return []
}

export async function saveQuery(q: Omit<Query, 'id' | 'createdAt' | 'answered' | 'answer'>): Promise<Query> {
  const id = Math.random().toString(36).substring(2, 9)
  const createdAt = Date.now()
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    await sql`
      INSERT INTO queries (id, name, email, department, message, answered, created_at)
      VALUES (${id}, ${q.name}, ${q.email}, ${q.department}, ${q.message}, false, ${createdAt})
    `
  }
  return { id, ...q, answered: false, createdAt }
}

export async function answerQuery(id: string, answer: string): Promise<void> {
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)
    await sql`UPDATE queries SET answer = ${answer}, answered = true WHERE id = ${id}`
  }
}