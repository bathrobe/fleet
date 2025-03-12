import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'
import { allowIfApiKeyOrAuthenticated } from '../utilities/accessControl'

export const Sources: CollectionConfig = {
  slug: 'sources',
  access: {
    read: () => true,
    create: allowIfApiKeyOrAuthenticated,
    update: allowIfApiKeyOrAuthenticated,
    delete: allowIfApiKeyOrAuthenticated,
  },
  admin: {
    useAsTitle: 'url',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'publishedDate',
      type: 'date',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'notes',
      type: 'richText',
      editor: lexicalEditor({}),
    },
  ],
}

export default Sources
