'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { jobDescriptionMap } from '@/data/job_description_map'

export default function ProfilePage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [i94File, setI94File] = useState<File | null>(null) // ✅ NEW
  const [message, setMessage] = useState('')
  const [jobs, setJobs] = useState([
    { title: '', company: '', start_date: '', end_date: '' }
  ])

  const handleJobChange = (index: number, field: string, value: string) => {
    const newJobs = [...jobs]
    newJobs[index][field as keyof typeof newJobs[0]] = value
    setJobs(newJobs)
  }

  const addJob = () => {
    setJobs([...jobs, { title: '', company: '', start_date: '', end_date: '' }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!photoFile || !passportFile || !resumeFile || !i94File) {
      setMessage('Please upload all required files.')
      return
    }

    setMessage('Uploading...')

    const photoPath = `photos/${Date.now()}-${photoFile.name}`
    const { error: photoError } = await supabase.storage
      .from('user-uploads')
      .upload(photoPath, photoFile)
    if (photoError) {
      setMessage('Profile photo upload failed: ' + photoError.message)
      return
    }

    const passportPath = `passport/${Date.now()}-${passportFile.name}`
    const { error: passportError } = await supabase.storage
      .from('user-uploads')
      .upload(passportPath, passportFile)
    if (passportError) {
      setMessage('Passport upload failed: ' + passportError.message)
      return
    }

    const resumePath = `resumes/${Date.now()}-${resumeFile.name}`
    const { error: resumeError } = await supabase.storage
      .from('user-uploads')
      .upload(resumePath, resumeFile)
    if (resumeError) {
      setMessage('Resume upload failed: ' + resumeError.message)
      return
    }

    const i94Path = `i94/${Date.now()}-${i94File.name}` // ✅ NEW
    const { error: i94Error } = await supabase.storage
      .from('user-uploads')
      .upload(i94Path, i94File)
    if (i94Error) {
      setMessage('I-94 upload failed: ' + i94Error.message)
      return
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('No user found', userError)
      return
    }

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    if (existingProfile) {
      console.log('Profile already exists')
      return
    }

    const { data: insertedProfile, error: dbError } = await supabase.from('profiles')
      .insert({
        id: user.id,
        name,
        email,
        photo_path: photoPath,
        passport_path: passportPath,
        resume_path: resumePath,
        i94_path: i94Path // ✅ NEW
      })
      .select()
      .single()

    if (dbError) {
      console.error('Insert error:', JSON.stringify(dbError, null, 2))

      return
    }

    const profileId = insertedProfile.id

    for (const job of jobs) {
      const { error: jobError } = await supabase.from('job_history').insert({
        profile_id: profileId,
        ...job
      })
      if (jobError) {
        console.error('Job insert error:', jobError)
        setMessage('Some jobs failed to save: ' + jobError.message)
        return
      }
    }

    setMessage('Profile and job history saved successfully!')
    router.push('/dashboard')
  }

  return (
  <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">Create Your Profile</h2>

      {/* Profile Info */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Documents</h3>

        <label className="block text-sm text-gray-600 font-medium">Profile Photo</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />

        <label className="block text-sm text-gray-600 font-medium">Passport Scan</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setPassportFile(e.target.files?.[0] || null)}
          className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />

        <label className="block text-sm text-gray-600 font-medium">Resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />

        <label className="block text-sm text-gray-600 font-medium">I-94 Document</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setI94File(e.target.files?.[0] || null)}
          className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
      </div>

      {/* Job History Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Job History</h3>
        {jobs.map((job, index) => (
          <div key={index} className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Job Title"
              className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={job.title}
              onChange={(e) => handleJobChange(index, 'title', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Company"
              className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={job.company}
              onChange={(e) => handleJobChange(index, 'company', e.target.value)}
              required
            />
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={job.start_date}
              onChange={(e) => handleJobChange(index, 'start_date', e.target.value)}
              required
            />
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={job.end_date}
              onChange={(e) => handleJobChange(index, 'end_date', e.target.value)}
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addJob}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Another Job
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold"
      >
        Save Profile
      </button>

      {message && <p className="text-center text-green-600 text-sm">{message}</p>}
    </form>
  </div>
)
}