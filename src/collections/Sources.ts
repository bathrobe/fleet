import { CollectionConfig } from 'payload'

const Sources: CollectionConfig = {
  slug: 'sources',
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
    // {
    //   name: 'notes',
    //   type: 'richText',
    //   editor: {
    //     lexical: {
    //       features: true,
    //     },
    //   },
    // },
  ],
}

export default Sources
