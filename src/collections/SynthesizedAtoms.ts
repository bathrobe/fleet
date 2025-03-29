import { CollectionConfig } from 'payload'

export const SynthesizedAtoms: CollectionConfig = {
  slug: 'synthesizedAtoms',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parentAtoms', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
      name: 'theoryFiction',
      type: 'textarea',
      admin: {
        description:
          'A short paragraph, styled as a fictional quote, that imagines a future where the concept is realized.',
      },
    },
    {
      name: 'parentAtoms',
      type: 'relationship',
      relationTo: 'atoms',
      hasMany: true,
      required: true,
    },
    // {
    //   name: 'synthesisMethod',
    //   type: 'select',
    //   options: [
    //     { label: 'Random', value: 'random' },
    //     { label: 'Vector', value: 'vector' },
    //     { label: 'Random Fallback', value: 'random-fallback' },
    //   ],
    // },
    {
      name: 'pineconeId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'posting',
      type: 'group',
      fields: [
        {
          name: 'isPosted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Has this atom been posted to social media?',
          },
        },
        {
          name: 'twitterUrl',
          type: 'text',
          admin: {
            description: 'URL to the Twitter post',
          },
        },
        {
          name: 'bskyUrl',
          type: 'text',
          admin: {
            description: 'URL to the Bluesky post',
          },
        },
      ],
    },
  ],
}
