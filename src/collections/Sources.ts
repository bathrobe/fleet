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
    useAsTitle: 'title',
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
      name: 'fullText',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
    },
  ],
}

export default Sources
