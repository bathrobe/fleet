import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    // Get sourceId from request
    const sourceId = req.nextUrl.searchParams.get('sourceId')

    if (!sourceId) {
      return NextResponse.json({ error: 'Missing sourceId parameter' }, { status: 400 })
    }

    // Initialize response data
    const responseData = {
      sourceId,
      hasSource: false,
      hasAtoms: false,
      complete: false,
      message: '',
    }

    // Initialize Payload CMS
    const payload = await getPayload({ config, importMap: {} })

    // First check if the source exists
    try {
      const source = await payload.findByID({
        collection: 'sources',
        id: sourceId,
      })

      if (source) {
        responseData.hasSource = true

        // Now check if atoms exist for this source
        const atoms = await payload.find({
          collection: 'atoms',
          where: {
            source: {
              equals: sourceId,
            },
          },
        })

        if (atoms && atoms.docs.length > 0) {
          responseData.hasAtoms = true
          responseData.message = `Found ${atoms.docs.length} atoms for source`
        } else {
          responseData.message = 'Source exists, atoms are being processed'
        }
      } else {
        responseData.message = 'Source is being processed'
      }
    } catch (error) {
      console.error('Error fetching source status:', error)
      responseData.message = 'Source is still being processed'
    }

    // If both source and atoms exist, the process is complete
    responseData.complete = responseData.hasSource && responseData.hasAtoms

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error in source status API:', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}
