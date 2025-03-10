import { CollectionConfig } from 'payload'

export const Journals: CollectionConfig = {
  slug: 'journals',
  admin: {
    useAsTitle: 'timeCreated',
  },
  access: {
    read: () => true, // Allow anyone to read this collection
  },
  fields: [
    {
      name: 'timeCreated',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      required: true,
    },
  ],
}
