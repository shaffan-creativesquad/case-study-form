import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

// Public: returns only published case studies
export async function GET() {
  try {
    const studies = await sql`
      SELECT * FROM case_studies
      WHERE published = true
      ORDER BY created_at DESC
    `
    return NextResponse.json(studies, { headers: corsHeaders })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: corsHeaders })
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, client_name, industry, cover_image, content, results, images, published } = body

    if (!title || !client_name || !industry) {
      return NextResponse.json({ error: 'title, client_name, industry are required' }, { status: 400 })
    }

    const baseSlug = slugify(title)
    // Make slug unique by appending timestamp if needed
    const existing = await sql`SELECT id FROM case_studies WHERE slug = ${baseSlug}`
    const slug = existing.length > 0 ? `${baseSlug}-${Date.now()}` : baseSlug

    const result = await sql`
      INSERT INTO case_studies (title, slug, client_name, industry, cover_image, content, results, images, published)
      VALUES (
        ${title}, ${slug}, ${client_name}, ${industry},
        ${cover_image ?? null}, ${content ?? null}, ${results ?? null},
        ${images ?? []}, ${published ?? false}
      )
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
