'use client'

export default function TravelTimeline() {
  // Simulated travel data
  const travelData = [
    { date: '2023-01-10', location: 'New York, USA' },
    { date: '2023-06-25', location: 'Toronto, Canada' },
    { date: '2024-02-15', location: 'London, UK' },
    { date: '2025-05-01', location: 'San Francisco, USA' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Travel History Timeline</h1>
      <div className="w-full max-w-xl">
        {travelData.map((entry, index) => (
          <div key={index} className="mb-4 flex items-start gap-4">
            <div className="w-4 h-4 bg-blue-600 rounded-full mt-1" />
            <div>
              <p className="font-semibold">{entry.date}</p>
              <p className="text-gray-700">{entry.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
