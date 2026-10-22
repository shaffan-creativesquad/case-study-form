'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this case study?')) return
    setLoading(true)
    await fetch(`/api/case-studies/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-gray-400 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-40"
    >
      {loading ? '...' : 'Delete'}
    </button>
  )
}
