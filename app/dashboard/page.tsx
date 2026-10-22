import { sql } from '@/lib/db'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import DeleteButton from '@/components/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let studies: any[] = []
  let dbError = false

  try {
    studies = await sql`SELECT * FROM case_studies ORDER BY created_at DESC`
  } catch {
    dbError = true
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900 text-lg">Codezotic</span>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-600 text-sm">Case Studies</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/new"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              + New Case Study
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {dbError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="font-medium text-yellow-800">Database not set up yet</p>
            <p className="text-sm text-yellow-700 mt-1">
              Visit{' '}
              <a href="/api/setup" target="_blank" className="underline font-medium">
                /api/setup
              </a>{' '}
              once to create tables, then refresh.
            </p>
          </div>
        )}

        {!dbError && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total', val: studies.length, cls: 'bg-blue-50 text-blue-700 border-blue-100' },
              { label: 'Published', val: studies.filter((s) => s.published).length, cls: 'bg-green-50 text-green-700 border-green-100' },
              { label: 'Drafts', val: studies.filter((s) => !s.published).length, cls: 'bg-gray-100 text-gray-600 border-gray-200' },
            ].map(({ label, val, cls }) => (
              <div key={label} className={`rounded-xl border p-4 ${cls}`}>
                <p className="text-3xl font-bold">{val}</p>
                <p className="text-sm font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {!dbError && studies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📁</p>
            <p className="text-gray-500 text-lg">No case studies yet</p>
            <Link href="/dashboard/new" className="mt-3 inline-block text-blue-600 hover:underline text-sm">
              Add your first one →
            </Link>
          </div>
        )}

        {!dbError && studies.length > 0 && (
          <div className="grid gap-3">
            {studies.map((study) => (
              <div
                key={study.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-sm transition"
              >
                {study.cover_image ? (
                  <img
                    src={study.cover_image}
                    alt={study.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">
                    📄
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-gray-900 truncate">{study.title}</h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        study.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {study.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {study.client_name} &middot; {study.industry}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(study.created_at).toLocaleDateString('en-PK', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/dashboard/${study.id}/edit`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={study.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
