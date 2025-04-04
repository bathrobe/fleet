import { CollectionConfig } from 'payload'
import { allowIfApiKeyOrAuthenticated } from '../utilities/accessControl'
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'timeCreated',
  },
  access: {
    read: () => true,
    create: allowIfApiKeyOrAuthenticated,
    update: allowIfApiKeyOrAuthenticated,
    delete: allowIfApiKeyOrAuthenticated,
  },
  fields: [
    {
      name: 'synthesizedAtom',
      type: 'relationship',
      relationTo: 'synthesizedAtoms',
      hasMany: false,
    },
    {
      name: 'content',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
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
        {
          name: 'postId',
          type: 'text',
          label: 'Twitter Post ID',
          admin: {
            condition: (data: any, siblingData: any) => siblingData?.posted,
          },
        },
      ],
    },
    {
      name: 'bskyPost',
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
        {
          name: 'postId',
          type: 'text',
          label: 'Bluesky Post ID',
          admin: {
            condition: (data: any, siblingData: any) => siblingData?.posted,
          },
        },
      ],
    },
  ],
}
