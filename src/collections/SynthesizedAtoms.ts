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
    {
      name: 'synthesisMethod',
      type: 'relationship',
      relationTo: 'synthesisMethods',
      hasMany: false,
    },
    {
      name: 'pineconeId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'posts',
      type: 'join',
      collection: 'posts',
      on: 'synthesizedAtom',
      admin: {
        description: 'Posts created from this atom',
      },
    },
  ],
}
