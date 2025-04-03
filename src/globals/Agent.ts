import { GlobalConfig } from 'payload'

export const Agent: GlobalConfig = {
  slug: 'agent',
  access: {
    read: () => true, // Allow anyone to read this global
    update: () => true, // Allow updates for saving cookies
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
              type: 'textarea',
              label: 'Bio',
            },
            {
              name: 'styles',
              type: 'textarea',
              label: 'Styles',
            },
          ],
        },
        {
          label: 'Scheduling',
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
        {
          label: 'Twitter Auth',
          fields: [
            {
              name: 'twitterCookieData',
              type: 'textarea', // Use textarea for potentially long JSON string
              label: 'Twitter Session Cookies (JSON)',
              admin: {
                description:
                  'Session cookies for Twitter, automatically managed. Do not edit manually unless necessary.',
                readOnly: false, // Make readOnly in production?
              },
            },
          ],
        },
      ],
    },
  ],
}
