import Link from 'next/link'
import CaseStudyForm from '@/components/CaseStudyForm'

export default function NewCaseStudyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Case Studies
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">New Case Study</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Case Study</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <CaseStudyForm mode="create" />
        </div>
      </main>
    </div>
  )
}
