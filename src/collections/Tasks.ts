// src/collections/Tasks.ts
import { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Allow anyone to read this collection
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'task',
      type: 'textarea',
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
    },
  ],
}
