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

// In-memory store for local development
let localAnnouncements: Announcement[] = []

export async function getAnnouncements(): Promise<Announcement[]> {
  if (process.env.KV_REST_API_URL) {
    const { kv } = await import('@vercel/kv')
    const data = await kv.get<Announcement[]>('announcements')
    return data || []
  }
  return localAnnouncements
}

export async function saveAnnouncements(announcements: Announcement[]): Promise<void> {
  if (process.env.KV_REST_API_URL) {
    const { kv } = await import('@vercel/kv')
    await kv.set('announcements', announcements)
    return
  }
  localAnnouncements = announcements
}