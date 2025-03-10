import { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'content',
  },
  access: {
    read: () => true, // Allow anyone to read this collection
    create: () => true, // Allow anyone to create posts
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
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
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      required: true,
    },
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      required: false,
      filterOptions: ({ data }: { data: any }) => {
        if (!data?.agent) return {}
        return {
          agent: {
            equals: data.agent,
          },
        }
      },
    },
    {
      name: 'blueskyPost',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'posted',
          type: 'checkbox',
          label: 'Posted to Bluesky',
          defaultValue: false,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Bluesky Post URL',
          admin: {
            condition: (data: any, siblingData: any) => siblingData?.posted,
          },
        },
      ],
    },
    {
      name: 'twitterPost',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'posted',
          type: 'checkbox',
          label: 'Posted to Twitter',
          defaultValue: false,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Twitter Post URL',
          admin: {
            condition: (data: any, siblingData: any) => siblingData?.posted,
          },
        },
      ],
    },
  ],
}
