import { defineType, defineField } from 'sanity';
import { CogIcon } from '@sanity/icons';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  // Singleton - only one instance allowed
  groups: [
    {
      name: 'general',
      title: 'General',
      default: true,
    },
    {
      name: 'navigation',
      title: 'Navigation',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Site Title',
      validation: (Rule) => Rule.required().min(3).max(60),
      group: 'general',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Site Description',
      validation: (Rule) => Rule.required().min(10).max(160),
      group: 'general',
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'Site URL',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
        }),
      group: 'general',
    }),
    defineField({
      name: 'logo',
      type: 'image',
      title: 'Site Logo',
      options: { hotspot: true },
      group: 'general',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      name: 'navigation',
      type: 'object',
      title: 'Main Navigation',
      group: 'navigation',
      fields: [
        defineField({
          name: 'menuItems',
          type: 'array',
          title: 'Menu Items',
          of: [
            {
              type: 'object',
              name: 'menuItem',
              title: 'Menu Item',
              fields: [
                defineField({
                  name: 'label',
                  type: 'string',
                  title: 'Menu Label',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'link',
                  type: 'link',
                  title: 'Menu Link',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'order',
                  type: 'number',
                  title: 'Menu Order',
                  initialValue: 0,
                }),
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'link.url',
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'footer',
      type: 'object',
      title: 'Footer Settings',
      group: 'footer',
      fields: [
        defineField({
          name: 'address',
          type: 'object',
          title: 'Address',
          fields: [
            defineField({
              name: 'company',
              type: 'string',
              title: 'Company Name',
            }),
            defineField({
              name: 'street',
              type: 'string',
              title: 'Street Address',
            }),
            defineField({
              name: 'city',
              type: 'string',
              title: 'City',
            }),
            defineField({
              name: 'country',
              type: 'string',
              title: 'Country',
            }),
          ],
        }),
        defineField({
          name: 'contact',
          type: 'object',
          title: 'Contact Information',
          fields: [
            defineField({
              name: 'phone',
              type: 'string',
              title: 'Phone Number',
            }),
            defineField({
              name: 'email',
              type: 'string',
              title: 'Email Address',
              validation: (Rule) => Rule.email(),
            }),
          ],
        }),
        defineField({
          name: 'social',
          type: 'object',
          title: 'Social Media',
          fields: [
            defineField({
              name: 'instagram',
              type: 'url',
              title: 'Instagram URL',
            }),
            defineField({
              name: 'behance',
              type: 'url',
              title: 'Behance URL',
            }),
            defineField({
              name: 'linkedin',
              type: 'url',
              title: 'LinkedIn URL',
            }),
          ],
        }),
      ],
    }),
    // Site-wide SEO settings (siteName, twitterSite)
    // These are handled by the plugin's fieldVisibility config for siteSettings
    defineField({
      name: 'openGraphSiteName',
      type: 'string',
      title: 'Open Graph Site Name',
      description: 'The name of your site (for social media sharing)',
      group: 'seo',
    }),
    defineField({
      name: 'twitterSite',
      type: 'string',
      title: 'X (Twitter) Site Handle',
      description: 'Your X/Twitter handle (e.g., @yourhandle)',
      group: 'seo',
    }),
    defineField({
      name: 'defaultSeo',
      type: 'seoFields',
      title: 'Default SEO Settings',
      description: 'Default SEO settings used as fallback for pages without their own SEO',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Configure your site settings',
        media: 'Settings',
      };
    },
  },
});
