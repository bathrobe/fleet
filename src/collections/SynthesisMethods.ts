import { CollectionConfig } from 'payload'

export const SynthesisMethods: CollectionConfig = {
  slug: 'synthesisMethods',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'description', 'methodKey'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'methodKey',
      type: 'text',
      required: true,
      defaultValue: 'dual-dissimilar',
      admin: {
        description:
          'Unique key to map this method to the front-end implementation (e.g., dual-dissimilar)',
      },
    },
  ],
}
