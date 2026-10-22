import { sql } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CaseStudyForm from '@/components/CaseStudyForm'

export default async function EditCaseStudyPage({ params }: { params: { id: string } }) {
  const result = await sql`SELECT * FROM case_studies WHERE id = ${parseInt(params.id)}`

  if (!result.length) notFound()

  const study = result[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Case Studies
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 truncate">{study.title}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Case Study</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <CaseStudyForm
            mode="edit"
            initialData={{
              id: study.id,
              title: study.title,
              client_name: study.client_name,
              industry: study.industry,
              cover_image: study.cover_image ?? '',
              content: study.content ?? '',
              results: study.results ?? '',
              images: study.images ?? [],
              published: study.published,
            }}
          />
        </div>
      </main>
    </div>
  )
}
