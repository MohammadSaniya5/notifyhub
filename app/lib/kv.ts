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

let localAnnouncements: Announcement[] = []

export async function getAnnouncements(): Promise<Announcement[]> {
  if (process.env.POSTGRES_URL) {
    const { sql } = await import('@vercel/postgres')
    const { rows } = await sql`SELECT * FROM announcements ORDER BY created_at DESC`
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      department: r.department,
      date: r.date,
      urgent: r.urgent,
      image: r.image,
      link: r.link,
      createdAt: r.created_at,
    }))
  }
  return localAnnouncements
}

export async function saveAnnouncement(a: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
  const id = Math.random().toString(36).substring(2, 9)
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const createdAt = Date.now()

  if (process.env.POSTGRES_URL) {
    const { sql } = await import('@vercel/postgres')
    await sql`
      INSERT INTO announcements (id, title, description, category, department, date, urgent, image, link, created_at)
      VALUES (${id}, ${a.title}, ${a.description}, ${a.category}, ${a.department}, ${date}, ${a.urgent}, ${a.image || ''}, ${a.link || ''}, ${createdAt})
    `
  } else {
    localAnnouncements.unshift({ id, ...a, date, createdAt })
  }

  return { id, ...a, date, createdAt }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  if (process.env.POSTGRES_URL) {
    const { sql } = await import('@vercel/postgres')
    await sql`DELETE FROM announcements WHERE id = ${id}`
  } else {
    localAnnouncements = localAnnouncements.filter(a => a.id !== id)
  }
}