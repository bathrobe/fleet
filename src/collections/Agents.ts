// src/collections/Agents.ts
import { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Allow anyone to read this collection
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'array',
      label: 'Bio',
      fields: [
        {
          name: 'content',
          type: 'textarea',
          label: 'Content',
        },
      ],
    },
    {
      name: 'styles',
      type: 'textarea',
      label: 'Styles',
    },
  ],
}
