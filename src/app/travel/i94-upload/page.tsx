'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function I94UploadPage() {
  const [i94File, setI94File] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!i94File) {
      setMessage('Please select an I-94 file to upload.')
      return
    }

    setMessage('Uploading.')

    const i94Path = `i94/${Date.now()}-${i94File.name}`
    const { error } = await supabase.storage
      .from('user-uploads')
      .upload(i94Path, i94File)

    if (error) {
      setMessage('Upload failed: ' + error.message)
      return
    }

    setMessage('I-94 uploaded successfully!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <form onSubmit={handleUpload} className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload I-94 Travel Record</h2>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full border p-2 mb-3"
          onChange={(e) => setI94File(e.target.files?.[0] || null)}
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Upload
        </button>

        {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
      </form>
    </div>
  )
}
