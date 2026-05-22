import { kv } from '@vercel/kv'

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

export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await kv.get<Announcement[]>('announcements')
  return data || []
}

export async function saveAnnouncements(announcements: Announcement[]): Promise<void> {
  await kv.set('announcements', announcements)
}