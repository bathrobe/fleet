'use server'

import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Save content to a temporary file and upload it to the Media collection
 */
export async function processSourceMedia(sourceTitle: string, content: string) {
  try {
    // 1. Write content to temporary file with .txt extension
    const contentStr = content.toString()
    const tmpDir = os.tmpdir()
    const fileName = `source-${Date.now()}.txt`
    const filePath = path.join(tmpDir, fileName)

    await fs.writeFile(filePath, contentStr)
    console.log(`Content written to temporary file: ${filePath}`)

    // 2. Upload the file to Media collection
    let mediaDoc
    try {
      const payload = await getPayload({ config })

      // Create a buffer from the content string
      const buffer = Buffer.from(contentStr)

      // Create a Payload-compatible file object
      const payloadFile = {
        data: buffer,
        mimetype: 'text/plain',
        name: fileName,
        size: buffer.length,
      }

      mediaDoc = await payload.create({
        collection: 'media',
        data: {
          alt: sourceTitle || 'Source content',
        },
        file: payloadFile,
      })

      console.log(`File uploaded to Media collection with ID: ${mediaDoc.id}`)
      return { success: true, mediaDoc }
    } catch (uploadError) {
      console.error('Failed to upload file to Media collection:', uploadError)
      throw uploadError
    } finally {
      // Clean up: remove the temporary file
      try {
        await fs.unlink(filePath)
        console.log(`Temporary file removed: ${filePath}`)
      } catch (unlinkError) {
        console.error('Failed to remove temporary file:', unlinkError)
      }
    }
  } catch (error) {
    console.error('Error processing source media:', error)
    return { success: false, error }
  }
}
