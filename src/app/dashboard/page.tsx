'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'

type Job = {
  id: number
  title: string
  company: string
  start_date: string
  end_date: string
  description: string
}

type Travel = {
  id: number
  country: string
  entry_date: string
  exit_date: string
}

type Profile = {
  id: string
  name: string
  email: string
  photo_path: string
  passport_path: string
  resume_path: string
  i94_path?: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [travel, setTravel] = useState<Travel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (profileError || !profileData) {
        setProfile(null)
        setLoading(false)
        return
      }

      setProfile(profileData)

      const { data: jobData } = await supabase
        .from('job_history')
        .select('*')
        .eq('profile_id', profileData.id)

      if (jobData) setJobs(jobData)

      const { data: travelData } = await supabase
        .from('travel_history')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('entry_date', { ascending: true })

      if (travelData) setTravel(travelData)

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>
  if (!profile) return <div className="p-6 text-gray-600">No profile found.</div>

  const supabaseUrl =
    'https://rkstelwhsrpjajuvdgcr.supabase.co/storage/v1/object/public/user-uploads/'

  const renderLink = (label: string, path?: string) => (
    <p>
      <strong>{label}:</strong>{' '}
      {path ? (
        <a
          href={`${supabaseUrl}${path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View
        </a>
      ) : (
        <span className="text-gray-500 italic">Not uploaded</span>
      )}
    </p>
  )

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        {renderLink('Photo', profile.photo_path)}
        {renderLink('Passport', profile.passport_path)}
        {renderLink('Resume', profile.resume_path)}
        {renderLink('I-94', profile.i94_path)}
      </div>

      {/* Job History Timeline */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Job History</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No job history found.</p>
        ) : (
          <VerticalTimeline>
            {jobs.map((job) => (
              <VerticalTimelineElement
                key={job.id}
                date={`${job.start_date} – ${job.end_date}`}
                iconStyle={{ background: '#2563eb', color: '#fff' }}
              >
                <h3 className="vertical-timeline-element-title font-bold">
                  {job.title}
                </h3>
                <h4 className="vertical-timeline-element-subtitle">
                  {job.company}
                </h4>
                <p>{job.description || '—'}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        )}
      </div>

      {/* Travel History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Travel History</h2>
        {travel.length === 0 ? (
          <p className="text-gray-600">No travel history found.</p>
        ) : (
          <div className="space-y-4">
            {travel.map((trip) => (
              <div key={trip.id} className="bg-white p-5 rounded-xl shadow">
                <p><strong>Country:</strong> {trip.country}</p>
                <p>
                  <strong>From:</strong> {trip.entry_date}{' '}
                  <strong>To:</strong> {trip.exit_date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
