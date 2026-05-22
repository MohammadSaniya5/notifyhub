import React from 'react'
import Link from 'next/link'
import { db, Announcement } from '../../lib/db'
import NoticeCard from '../../components/NoticeCard'
import {
  FileText,
  Calendar,
  Sparkles,
  Share2,
  Download,
  ArrowLeft,
  Shield,
  Layers,
} from 'lucide-react'
import ShareButtonClient from './ShareButtonClient' // client interactive button

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { slug } = await params
  const notice = await db.getAnnouncement(slug)

  if (!notice) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notice Not Found</h1>
        <p className="text-slate-400 text-sm">The announcement you are searching for does not exist or has been removed.</p>
        <Link href="/announcements" className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition">
          Return to Board
        </Link>
      </main>
    )
  }

  // Load related notices
  const allNotices = await db.getAnnouncements()
  const related = allNotices
    .filter((a) => a.category === notice.category && a.id !== notice.id)
    .slice(0, 2)

  // Fetch department details
  const depts = await db.getDepartments()
  const deptMatch = depts.find((d) => d.id === notice.department_id)
  const deptName = deptMatch ? deptMatch.name : 'General Academic Admin'

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr)
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <Link
        href="/announcements"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-500 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Board
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Main Notice Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
            
            {/* Header tags */}
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wider">
                  {notice.category}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wider">
                  {notice.priority} Priority
                </span>
              </div>
              
              {/* Share client Button */}
              <ShareButtonClient />
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-950 dark:text-white leading-tight">
              {notice.title}
            </h1>

            {/* Logistics info */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 border-y border-slate-100 dark:border-slate-800/80 py-3.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                Released {formatDate(notice.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-500" />
                Issued by: {deptName}
              </span>
            </div>

            {/* Full text content */}
            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
              {notice.content}
            </div>

            {/* PDF Attachment Preview Pane */}
            {notice.pdf_url && (
              <div className="mt-4 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900">
                <div className="px-4 py-3 bg-slate-800 border-b border-slate-700/50 flex justify-between items-center text-xs text-white">
                  <span className="font-semibold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-500" /> Attachment.pdf
                  </span>
                  <a
                    href={notice.pdf_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
                {/* Embed PDF inside frame */}
                <div className="h-96 w-full">
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(notice.pdf_url)}&embedded=true`}
                    className="w-full h-full border-none"
                    title="PDF Document Viewer"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: AI Summary & Related */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* AI summaries card */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden border-l-2 border-l-indigo-500">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-16 h-16 text-indigo-500" />
            </div>
            
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5 mb-4">
              <Sparkles className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
              <span>AI-Generated Key Summary</span>
            </h3>

            {notice.summary ? (
              <div className="flex flex-col gap-3">
                {notice.summary.split('\n').map((point, idx) => (
                  <div key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <span className="text-indigo-500 font-bold shrink-0">•</span>
                    <span>{point.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No summary pre-generated for this general academic alert.</p>
            )}
          </div>

          {/* Related notices */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" /> Related Notices
            </h3>

            {related.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No related notices found in {notice.category}.</p>
            ) : (
              related.map((r) => <NoticeCard key={r.id} notice={r} />)
            )}
          </div>

        </div>

      </div>

    </main>
  )
}
