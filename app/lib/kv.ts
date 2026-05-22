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

let announcements: Announcement[] = []

export async function getAnnouncements(): Promise<Announcement[]> {
  return announcements
}

export async function saveAnnouncements(
  data: Announcement[]
): Promise<void> {
  announcements = data
}