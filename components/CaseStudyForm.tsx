'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormData = {
  title: string
  client_name: string
  industry: string
  cover_image: string
  content: string
  results: string
  images: string[]
  published: boolean
}

type Props = {
  initialData?: Partial<FormData> & { id?: number }
  mode: 'create' | 'edit'
}

const INDUSTRIES = [
  'Technology', 'E-Commerce', 'Healthcare', 'Education', 'Finance',
  'Real Estate', 'Food & Beverage', 'Fashion', 'Marketing', 'Other',
]

export default function CaseStudyForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')

  const [form, setForm] = useState<FormData>({
    title: initialData?.title ?? '',
    client_name: initialData?.client_name ?? '',
    industry: initialData?.industry ?? '',
    cover_image: initialData?.cover_image ?? '',
    content: initialData?.content ?? '',
    results: initialData?.results ?? '',
    images: initialData?.images ?? [],
    published: initialData?.published ?? false,
  })

  function update(field: keyof FormData, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addImage() {
    if (!newImageUrl.trim()) return
    update('images', [...form.images, newImageUrl.trim()])
    setNewImageUrl('')
  }

  function removeImage(index: number) {
    update('images', form.images.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = mode === 'create' ? '/api/case-studies' : `/api/case-studies/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Case Study Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. How we grew XYZ's sales by 300%"
            required
          />
        </div>

        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.client_name}
            onChange={(e) => update('client_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Noon, Daraz, XYZ Brand"
            required
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            value={form.industry}
            onChange={(e) => update('industry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            required
          >
            <option value="">Select industry...</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
        <input
          type="url"
          value={form.cover_image}
          onChange={(e) => update('cover_image', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
        {form.cover_image && (
          <img
            src={form.cover_image}
            alt="Cover preview"
            className="mt-2 h-40 w-full object-cover rounded-lg border border-gray-200"
          />
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Description / Content
        </label>
        <textarea
          value={form.content}
          onChange={(e) => update('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Describe the project, challenge, approach and solution..."
        />
      </div>

      {/* Results */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Results / Achievements
        </label>
        <textarea
          value={form.results}
          onChange={(e) => update('results', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="e.g. 300% increase in sales, 50K new users, ROI 5x..."
        />
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste image URL and click Add"
          />
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
          >
            Add
          </button>
        </div>

        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {form.images.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`Image ${i + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publish Toggle & Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => update('published', !form.published)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              form.published ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.published ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {form.published ? 'Published (visible on site)' : 'Draft (hidden)'}
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Case Study' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
