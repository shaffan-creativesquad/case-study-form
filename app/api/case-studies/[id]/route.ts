import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Support both numeric id and slug
    const isNum = /^\d+$/.test(params.id)
    const result = isNum
      ? await sql`SELECT * FROM case_studies WHERE id = ${parseInt(params.id)}`
      : await sql`SELECT * FROM case_studies WHERE slug = ${params.id} AND published = true`

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
    }
    return NextResponse.json(result[0], { headers: corsHeaders })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: corsHeaders })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { title, client_name, industry, cover_image, content, results, images, published } = body

    const result = await sql`
      UPDATE case_studies SET
        title       = ${title},
        client_name = ${client_name},
        industry    = ${industry},
        cover_image = ${cover_image ?? null},
        content     = ${content ?? null},
        results     = ${results ?? null},
        images      = ${images ?? []},
        published   = ${published ?? false},
        updated_at  = NOW()
      WHERE id = ${parseInt(params.id)}
      RETURNING *
    `
    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM case_studies WHERE id = ${parseInt(params.id)}`
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
