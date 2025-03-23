import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)

    // Get payload instance
    const payload = await getPayload({ config })

    // Find atoms
    const result = await payload.find({
      collection: 'atoms',
      limit,
      page,
      sort: '-updatedAt',
      depth: 1,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching atoms:', error)
    return NextResponse.json({ error: 'Failed to fetch atoms' }, { status: 500 })
  }
}
