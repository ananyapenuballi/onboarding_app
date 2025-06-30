'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilesList() {
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('*')
      if (error) {
        console.error('Error fetching profiles:', error.message)
        return
      }
      setProfiles(data)
    }

    fetchProfiles()
  }, [])

  const getPublicURL = (path: string) => {
    const { data } = supabase.storage.from('user-uploads').getPublicUrl(path)
    return data?.publicUrl || ''
  }
return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
  <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Uploaded Profiles</h1>
  <div className="max-w-3xl mx-auto space-y-6">
    {profiles.map((profile) => (
      <div
        key={profile.id}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
      >
        <div className="space-y-2">
          <p><span className="font-semibold text-gray-800">Name:</span> <span className="text-gray-900">{profile.name}</span></p>
<p><span className="font-semibold text-gray-800">Email:</span> <span className="text-gray-900">{profile.email}</span></p>

          <p><span className="font-semibold text-gray-700">Photo:</span> <a className="text-blue-600 underline" href={getPublicURL(profile.photo_path)} target="_blank">View</a></p>
          <p><span className="font-semibold text-gray-700">Passport:</span> <a className="text-blue-600 underline" href={getPublicURL(profile.passport_path)} target="_blank">View</a></p>
          <p><span className="font-semibold text-gray-700">Resume:</span> <a className="text-blue-600 underline" href={getPublicURL(profile.resume_path)} target="_blank">View</a></p>
          {profile.i94_path && (
            <p><span className="font-semibold text-gray-700">I-94:</span> <a className="text-blue-600 underline" href={getPublicURL(profile.i94_path)} target="_blank">View</a></p>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
)
}