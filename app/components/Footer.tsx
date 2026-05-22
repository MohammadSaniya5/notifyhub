'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Shield } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full mt-auto border-t border-slate-200/50 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-950/60 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
              <span className="text-xl">🔔</span>
              <span>Notify<span className="text-slate-800 dark:text-white">Hub</span></span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Providing smart, centralized, real-time notices and campus event registrations for students, faculties, and administrators.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-2 text-slate-400 dark:text-slate-500">
              <a href="#" className="hover:text-blue-500 transition"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-blue-500 transition"><Twitter className="w-4.5 h-4.5" /></a>
              <a href="#" className="hover:text-blue-500 transition"><Linkedin className="w-4.5 h-4.5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Quick Shortcuts</h4>
            <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-blue-500 hover:underline">Home Landing</Link>
              <Link href="/announcements" className="hover:text-blue-500 hover:underline">Announcements Board</Link>
              <Link href="/events" className="hover:text-blue-500 hover:underline">Events Calendar</Link>
              <Link href="/urgent" className="hover:text-rose-500 hover:underline text-rose-500/80">🚨 Urgent Dashboard</Link>
            </div>
          </div>

          {/* Help & Support */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Help & Policies</h4>
            <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Link href="/contact" className="hover:text-blue-500 hover:underline">Student Query Form</Link>
              <Link href="/admin" className="hover:text-blue-500 hover:underline flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Admin Console
              </Link>
              <a href="#" className="hover:text-blue-500 hover:underline">User Agreement</a>
              <a href="#" className="hover:text-blue-500 hover:underline">Security Guidelines</a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Campus Desk</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>NotifyHub University, Administrative Block A, Campus Road, CA 90001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>support@notifyhub.edu</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200/50 dark:border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-4">
          <p>© {currentYear} NotifyHub Platform. Developed for Mohammad Saniya.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy Statement</a>
            <span>•</span>
            <a href="#" className="hover:underline">Accessibility Access</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
