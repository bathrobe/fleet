import { CollectionConfig } from 'payload'
import { deleteVectors } from '../app/(payload)/components/sources/vectors/actions'

export const Atoms: CollectionConfig = {
  slug: 'atoms',
  admin: {
    useAsTitle: 'mainContent',
    defaultColumns: ['mainContent', 'source', 'tags'],
  },
  hooks: {
    afterDelete: [
      // @ts-ignore
      async ({ id, doc }: { id: string; doc: any }) => {
        // If we have a vectorId stored on the atom, delete it from the vector DB
        if (doc && doc.pineconeId) {
          console.log(`Atom ${id} deleted, attempting to delete vector ${doc.pineconeId}`)
          await deleteVectors(doc.pineconeId)
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'The title of the atom',
      },
    },
    {
      name: 'pineconeId',
      type: 'text',
      admin: {
        description: 'The ID of the atom in Pinecone',
        readOnly: true,
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
      type: 'array',
      admin: {
        description: 'Additional information that supports this atom',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description: 'Supporting information item',
          },
        },
      ],
    },
    {
      name: 'source',
      type: 'relationship',
      relationTo: 'sources',
      required: true,
      admin: {
        description: 'The source this atom is derived from',
      },
    },
    {
      name: 'synthesizedAtoms',
      type: 'join',
      collection: 'synthesizedAtoms',
      on: 'parentAtoms',
      admin: {
        description: 'Synthesized atoms derived from this atom',
        defaultColumns: ['title', 'mainContent', 'createdAt'],
      },
    },
  ],
}
