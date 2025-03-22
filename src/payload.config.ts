// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Journals } from './collections/Journals'
import { Tasks } from './collections/Tasks'
import { Posts } from './collections/Posts'
import { Sources } from './collections/Sources'
import { Atoms } from './collections/Atoms'
import { Agent } from './globals/Agent'
import { SourceCategory } from './collections/SourceCategory'
import { SourceMedium } from './collections/SourceMedium'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      views: {
        sourceUploader: {
          Component: '/src/app/(payload)/components/sources/SourceUploader',
          path: '/source-uploader',
        },
      },
    },
  },
  collections: [Users, Sources, Media, Journals, Tasks, Posts, Atoms, SourceCategory, SourceMedium],
  globals: [Agent],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
