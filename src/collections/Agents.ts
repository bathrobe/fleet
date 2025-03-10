// src/collections/Agents.ts
import { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name'],
  },
  access: {
    read: () => true, // Allow anyone to read this collection
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
            {
              name: 'relatedJournals',
              type: 'join',
              label: 'Related Journals',
              collection: 'journals',
              on: 'agent',
            },
            {
              name: 'relatedTasks',
              type: 'join',
              label: 'Related Tasks',
              collection: 'tasks',
              on: 'agent',
            },
          ],
        },
        {
          label: 'Scheduling',
          description: 'Configure agent scheduling behavior',
          fields: [
            {
              name: 'scheduling',
              type: 'group',
              label: 'Scheduling Configuration',
              fields: [
                {
                  name: 'postingInterval',
                  type: 'number',
                  label: 'Posting Interval (ms)',
                  defaultValue: 18000000, // 5 hours
                },
                {
                  name: 'sleepStartHour',
                  type: 'number',
                  label: 'Sleep Start Hour (0-23)',
                  min: 0,
                  max: 23,
                  defaultValue: 1,
                },
                {
                  name: 'sleepEndHour',
                  type: 'number',
                  label: 'Sleep End Hour (0-23)',
                  min: 0,
                  max: 23,
                  defaultValue: 5,
                },

                {
                  name: 'jitter',
                  type: 'number',
                  label: 'Jitter (ms)',
                  defaultValue: 300000, // 5 minutes
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable scheduling',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
