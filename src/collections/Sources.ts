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
      type: 'textarea',
      required: true,
    },
    {
      name: 'bulletSummary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'peopleplacesthingsevents',
      type: 'textarea',
      required: true,
    },
    {
      name: 'quotations',
      type: 'textarea',
      required: true,
    },
    {
      name: 'details',
      type: 'textarea',
      required: true,
    },
  ],
}

export default Sources
