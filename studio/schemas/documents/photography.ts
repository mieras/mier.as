import { defineType, defineField } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export default defineType({
  name: 'photography',
  title: 'Photography',
  type: 'document',
  icon: ImageIcon,
  groups: [
    {
      name: 'general',
      title: 'General',
      default: true,
    },
    {
      name: 'preview',
      title: 'Preview',
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'info',
      title: 'Info',
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
      title: 'Title',
      description: 'Internal title for Sanity Studio (not used in front-end)',
      validation: (Rule) => Rule.required().min(3).max(100),
      group: 'general',
    }),
    defineField({
      name: 'projectTitle',
      type: 'string',
      title: 'Project Title',
      description: 'Project title used in work list tile (shown with Country and Year)',
      validation: (Rule) => Rule.required().min(3).max(100),
      group: 'general',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'projectTitle' },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return 'Slug is required';
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return 'Slug can only contain lowercase letters, numbers, and hyphens';
          }
          return true;
        }),
      group: 'general',
    }),
    defineField({
      name: 'country',
      type: 'string',
      title: 'Country',
      description: 'Country name (shown in work list tile)',
      group: 'general',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
      description: 'Project subtitle used in info panel',
      group: 'general',
    }),
    defineField({
      name: 'location',
      type: 'array',
      title: 'Location',
      description: 'Location tags (shown in info panel only)',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      group: 'general',
    }),
    defineField({
      name: 'camera',
      type: 'array',
      title: 'Camera',
      description: 'Camera tags',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      group: 'general',
    }),
    defineField({
      name: 'film',
      type: 'array',
      title: 'Film',
      description: 'Film tags',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      group: 'general',
    }),
    defineField({
      name: 'year',
      type: 'number',
      title: 'Year',
      description: 'Photo year',
      validation: (Rule) => Rule.min(1900).max(2100),
      group: 'general',
    }),
    defineField({
      name: 'preview',
      type: 'image',
      title: 'Preview Media',
      description: 'Image used for preview panel when hovering a WorkListItem',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
      group: 'preview',
    }),
    defineField({
      name: 'projectMedia',
      type: 'array',
      title: 'Project Media',
      description: 'Media slides for the photography carousel. Each slide can contain an image or video with fill/fit option.',
      of: [
        {
          type: 'object',
          name: 'imageSlide',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                }),
              ],
            }),
            defineField({
              name: 'fitMode',
              type: 'string',
              title: 'Fit Mode',
              description: 'How the image should fit in the carousel container',
              options: {
                list: [
                  { title: 'Fill', value: 'fill' },
                  { title: 'Fit', value: 'fit' },
                ],
              },
              initialValue: 'fill',
            }),
          ],
          preview: {
            select: {
              image: 'image',
              fitMode: 'fitMode',
            },
            prepare({ image, fitMode }) {
              return {
                title: 'Image Slide',
                subtitle: fitMode ? `Fit: ${fitMode}` : 'Fill',
                media: image,
              };
            },
          },
        },
        {
          type: 'object',
          name: 'videoSlide',
          title: 'Video (MP4)',
          fields: [
            defineField({
              name: 'video',
              type: 'file',
              title: 'Video (MP4/MOV)',
              description: 'Upload MP4 or MOV video file. Media will fill the slide (object-fit: cover).',
              options: {
                accept: 'video/mp4,video/quicktime',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'fitMode',
              type: 'string',
              title: 'Fit Mode',
              description: 'How the video should fit in the carousel container',
              options: {
                list: [
                  { title: 'Fill', value: 'fill' },
                  { title: 'Fit', value: 'fit' },
                ],
              },
              initialValue: 'fill',
            }),
          ],
          preview: {
            select: {
              video: 'video',
              fitMode: 'fitMode',
            },
            prepare({ video, fitMode }) {
              return {
                title: 'Video Slide',
                subtitle: fitMode ? `Fit: ${fitMode}` : 'Fill',
                media: video,
              };
            },
          },
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'description',
      type: 'array',
      title: 'Description',
      description: 'Simple rich text description with bold and italic',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
      group: 'info',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social Media',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'projectTitle',
      subtitle: 'subtitle',
      country: 'country',
      location: 'location',
      year: 'year',
      media: 'preview',
    },
    prepare({ title, subtitle, country, location, year, media }) {
      const locationStr = location && location.length > 0 ? location.join(', ') : null;
      const parts = [subtitle, country, locationStr, year].filter(Boolean);
      return {
        title: title || 'Untitled Photo',
        subtitle: parts.length > 0 ? parts.join(' • ') : 'No details',
        media: media,
      };
    },
  },
});
