import { NextResponse } from 'next/server'
import { initDB } from '@/lib/db'

export async function GET() {
  try {
    await initDB()
    return NextResponse.json({ message: 'Database tables created successfully!' })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
