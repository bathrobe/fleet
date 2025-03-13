import { CollectionConfig } from 'payload'

export const Atoms: CollectionConfig = {
  slug: 'atoms',
  admin: {
    useAsTitle: 'mainContent',
    defaultColumns: ['mainContent', 'source', 'tags'],
  },
  fields: [
    {
      name: 'pineconeId',
      type: 'text',
      admin: {
        description: 'The ID of the atom in Pinecone',
      },
    },
    {
      name: 'mainContent',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The full atomic idea (1-2 sentences)',
      },
    },
    {
      name: 'supportingQuote',
      type: 'textarea',
      admin: {
        description: 'A quote from the Source that supports this atom',
      },
    },
    {
      name: 'supportingInfo',
      type: 'textarea',
      admin: {
        description: 'Additional information that supports this atom',
      },
    },
    {
      name: 'source',
      type: 'relationship',
      relationTo: 'sources',
      admin: {
        description: 'The source this atom is derived from',
      },
    },
  ],
}
