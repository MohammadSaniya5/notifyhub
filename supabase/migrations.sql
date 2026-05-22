-- NotifyHub Supabase Database Migrations
-- Run this in your Supabase SQL Editor to initialize all tables, types, and security roles.

-- 1. Create Custom Types
CREATE TYPE user_role AS ENUM ('admin', 'student');
CREATE TYPE notice_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- 2. Create Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Seed Departments
INSERT INTO departments (id, name) VALUES
('GEN', 'General / Academic Admin'),
('CSE', 'Computer Science & Engineering'),
('ECE', 'Electronics & Communication Engineering'),
('ME', 'Mechanical Engineering'),
('BBA', 'Bachelor of Business Administration'),
('MBA', 'Master of Business Administration')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Create Profiles / Users Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role user_role DEFAULT 'student'::user_role,
    bookmarks UUID[] DEFAULT '{}'::UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only profiles access" 
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Allow individual update on own profile" 
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Create Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    summary TEXT, -- AI summary points (newline separated)
    category VARCHAR(50) NOT NULL, -- e.g., Exams, Placements, Events, Holidays, Workshops, General
    priority notice_priority DEFAULT 'LOW'::notice_priority,
    department_id VARCHAR(10) REFERENCES departments(id) ON DELETE SET NULL,
    pinned BOOLEAN DEFAULT FALSE,
    pdf_url TEXT, -- URL to uploaded attachment
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only announcements" 
    ON announcements FOR SELECT USING (true);

CREATE POLICY "Allow full announcements access for admins" 
    ON announcements ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
        )
    );

-- Index for Slug & Date searches
CREATE INDEX IF NOT EXISTS idx_announcements_slug ON announcements(slug);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(published_at DESC);

-- 5. Create Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    banner_url TEXT,
    date_time TIMESTAMPTZ NOT NULL,
    venue VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    department_id VARCHAR(10) REFERENCES departments(id) ON DELETE SET NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only events" 
    ON events FOR SELECT USING (true);

CREATE POLICY "Allow full events access for admins" 
    ON events ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
        )
    );

-- Index for Events Date
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_time);

-- 6. Create Student Queries Table
CREATE TABLE IF NOT EXISTS student_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    department_id VARCHAR(10) REFERENCES departments(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Queries
ALTER TABLE student_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous query creation" 
    ON student_queries FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access to queries" 
    ON student_queries ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
        )
    );

-- 7. Seed Sample Announcements
INSERT INTO announcements (title, slug, content, summary, category, priority, department_id, pinned, pdf_url, published_at) VALUES
(
  'End Semester Examination Schedule Released - June 2026', 
  'end-semester-exam-schedule-june-2026', 
  'This is to notify all undergraduate and postgraduate students that the End Semester Examinations for June 2026 will commence on June 8, 2026. The detailed timetables for all departments are attached in the official document. Make sure to download and check your dates. Admits will be issued from the administrative wing starting June 1st. Attendance must be above 75% to sit for the exams.',
  '1. Exams start on June 8th for all programs.\n2. Admit cards will be distributed from June 1st.\n3. Strictly 75%+ attendance is mandatory.',
  'Exams', 
  'HIGH', 
  'GEN',
  TRUE,
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  NOW() - INTERVAL '1 hours'
),
(
  'Mega Campus Recruitment Drive by Tata Consultancy Services', 
  'mega-campus-recruitment-drive-tcs-2026', 
  'Tata Consultancy Services (TCS) is hosting a mega recruitment drive for final-year students (CSE, ECE, ME) on May 28th and 29th. The positions offered are System Engineer and Digital Engineer with attractive packages. Registered candidates should carry three copies of their resumes and wear professional formal attire. Eligible GPA is 7.0 and above with no active backlogs.',
  '1. TCS Recruitment drive on May 28-29 starting at 9:00 AM.\n2. Eligibility criteria: GPA of 7.0+ with zero active backlogs.\n3. Bring resumes and maintain formal dress code.',
  'Placements', 
  'HIGH', 
  'CSE',
  TRUE,
  NULL,
  NOW() - INTERVAL '5 hours'
),
(
  'Annual Technical Fest: TechVantage 2026 Registration Open', 
  'annual-tech-fest-techvantage-2026', 
  'Get ready for the biggest technical spectacle of the year, TechVantage 2026! Register for over 25+ events including Hackathons, Robo-Wars, Paper Presentations, Web Design Wars, and Coding Relay. Exciting cash prizes worth $5,000 are up for grabs. Registration closes on May 26th. Guest lectures from industry leaders will be held on day two.',
  '1. Annual Technical Festival featuring 25+ dynamic events.\n2. Over $5,000 in total cash prizes to be won.\n3. Last date to register is May 26th.',
  'Events', 
  'MEDIUM', 
  'CSE',
  FALSE,
  NULL,
  NOW() - INTERVAL '1 days'
),
(
  'Hostel Fee Payment & Room Allocation Deadline Extension', 
  'hostel-fee-payment-deadline-extension', 
  'Attention all hostel residents: The deadline for submitting the annual hostel fee and completing the room allocation form has been extended to May 25, 2026. Late fees of $50 will apply to any submissions received after this date. Payments can be made online via the parent portal or physically at the account office.',
  '1. Hostel fee payment deadline extended to May 25th.\n2. Late payment will attract a $50 fine.\n3. Pay online or in the administrative office.',
  'Holidays', 
  'HIGH', 
  'GEN',
  FALSE,
  NULL,
  NOW() - INTERVAL '2 days'
);

-- Seed Sample Events
INSERT INTO events (title, description, banner_url, date_time, venue, category, department_id, registration_deadline, featured) VALUES
(
  'National Robotics Championship',
  'Witness high-octane engineering with battles, autonomous maze solvers, and custom drone races at our central arena.',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  NOW() + INTERVAL '10 days',
  'Main Gym & Indoor Stadium',
  'Workshops',
  'ECE',
  NOW() + INTERVAL '5 days',
  TRUE
),
(
  'AI & Deep Learning Intensive Workshop',
  'Hands-on workshop on PyTorch, large language models, and practical computer vision systems hosted by industry experts.',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
  NOW() + INTERVAL '5 days',
  'Block B Seminar Hall',
  'Workshops',
  'CSE',
  NOW() + INTERVAL '3 days',
  TRUE
),
(
  'Inter-College Sports Gala',
  'Annual sporting celebration containing football, basketball, track & field events, and outdoor tennis games.',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  NOW() + INTERVAL '12 days',
  'Main Sports Grounds',
  'Events',
  'GEN',
  NOW() + INTERVAL '8 days',
  FALSE
);
