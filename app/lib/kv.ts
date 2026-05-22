type Announcement = {
  id: string
  title: string
  description: string
  category: string
  department: string
  date: string
  urgent: boolean
  image?: string
  link?: string
}

let announcements: Announcement[] = []

export async function getAnnouncements() {
  return announcements
}

export async function saveAnnouncement(data: Omit<Announcement, 'id'>) {
  const newAnnouncement = {
    id: Date.now().toString(),
    ...data,
  }

  announcements.unshift(newAnnouncement)

  return newAnnouncement
}

export async function deleteAnnouncement(id: string) {
  announcements = announcements.filter(a => a.id !== id)
}