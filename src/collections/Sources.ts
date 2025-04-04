import { CollectionConfig } from 'payload'
import { allowIfApiKeyOrAuthenticated } from '../utilities/accessControl'
import { deleteVectors } from '../app/(payload)/components/sources/vectors/actions'

export const Sources: CollectionConfig = {
  slug: 'sources',
  access: {
    read: () => true,
    create: allowIfApiKeyOrAuthenticated,
    update: allowIfApiKeyOrAuthenticated,
    delete: allowIfApiKeyOrAuthenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterDelete: [
      // @ts-ignore
      async ({ id, doc }: { id: string; doc: any }) => {
        // If we have a pineconeId stored on the source, delete it from the vector DB
        if (doc && doc.pineconeId) {
          console.log(`Source ${id} deleted, attempting to delete vector ${doc.pineconeId}`)
          await deleteVectors(doc.pineconeId)
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'sourceCategory',
      type: 'relationship',
      relationTo: 'source-categories',
    },

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
      name: 'publication',
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
      name: 'oneSentenceSummary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'mainPoints',
      type: 'array',
      admin: {
        description: 'Main points from the source',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description: 'A main point',
          },
        },
      ],
    },
    {
      name: 'bulletSummary',
      type: 'array',
      admin: {
        description: 'List of bullet points summarizing the source',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description: 'A bullet point',
          },
        },
      ],
    },
    {
      name: 'peopleplacesthingsevents',
      type: 'array',
      admin: {
        description: 'List of people, places, things, and events mentioned',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description: 'A person, place, thing, or event',
          },
        },
      ],
    },
    {
      name: 'quotations',
      type: 'array',
      admin: {
        description: 'Important quotations from the source',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description: 'A quotation',
          },
        },
      ],
    },
    {
      name: 'details',
      type: 'array',
      admin: {
        description: 'Additional details about the source',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description: 'A detail',
          },
        },
      ],
    },
    {
      name: 'pineconeId',
      type: 'text',
      admin: {
        description: 'The ID of the source embedding in Pinecone',
        readOnly: true,
      },
    },
    {
      name: 'relatedSynthesizedAtoms',
      type: 'relationship',
      relationTo: 'synthesizedAtoms',
      hasMany: true,
      admin: {
        description: 'Synthesized atoms related to this source',
      },
    },
    {
      name: 'fullText',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
    },
    {
      name: 'relatedAtoms',
      type: 'join',
      collection: 'atoms',
      on: 'source',
      admin: {
        description: 'Atoms derived from this source',
        defaultColumns: ['title', 'mainContent', 'createdAt'],
      },
    },
  ],
}

export default Sources
