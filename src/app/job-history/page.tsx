'use client'

import { useState } from 'react'

interface JobEntry {
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

export default function JobHistoryPage() {
  const [jobs, setJobs] = useState<JobEntry[]>([
    {
      title: 'Software Engineer',
      company: 'Google',
      startDate: 'Jan 2022',
      endDate: 'Present',
      description: 'Developed scalable web services and improved system performance.'
    },
    {
      title: 'Frontend Developer',
      company: 'Facebook',
      startDate: 'Jun 2020',
      endDate: 'Dec 2021',
      description: 'Built user interfaces with React and enhanced accessibility.'
    }
  ])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Job History</h1>

      <div className="space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">
              {job.startDate} – {job.endDate}
            </p>
            <p className="mt-2 text-gray-700">{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
