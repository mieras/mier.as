import { defineType, defineField } from 'sanity';
import { ProjectsIcon } from '@sanity/icons';

export default defineType({
  name: 'work',
  title: 'Projects',
  type: 'document',
  icon: ProjectsIcon,
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
      name: 'projectTitle',
      type: 'string',
      title: 'Project Title',
      description: 'Project title used in work list tile and info panel',
      validation: (Rule) => Rule.required().min(3).max(100),
      group: 'general',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
      description: 'Project subtitle used in work list tile and info panel',
      group: 'general',
    }),
    defineField({
      name: 'client',
      type: 'reference',
      title: 'Client',
      to: [{ type: 'client' }],
      group: 'general',
    }),
    defineField({
      name: 'year',
      type: 'number',
      title: 'Year',
      description: 'Project year',
      validation: (Rule) => Rule.min(1900).max(2100),
      group: 'general',
    }),
    defineField({
      name: 'preview',
      type: 'object',
      title: 'Preview Media',
      description:
        'Media used for preview panel when hovering a WorkListItem. Image or Video.',
      fields: [
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
          ],
        }),
        defineField({
          name: 'video',
          type: 'file',
          title: 'Video (MP4)',
          description: 'Upload MP4 video file for preview',
          options: {
            accept: 'video/mp4',
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((preview) => {
          if (!preview) return true;
          const hasImage = !!preview.image;
          const hasVideo = !!preview.video;
          if (!hasImage && !hasVideo) {
            return 'Either image or video is required';
          }
          return true;
        }),
      group: 'preview',
    }),
    defineField({
      name: 'projectMedia',
      type: 'array',
      title: 'Project Media',
      description:
        'Media slides for the project carousel. Each slide can contain an image or video.',
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
          ],
          preview: {
            select: {
              image: 'image',
            },
            prepare({ image }) {
              return {
                title: 'Image Slide',
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
              title: 'Video (MP4)',
              description:
                'Upload MP4 video file. Media will fill the slide (object-fit: cover).',
              options: {
                accept: 'video/mp4',
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              video: 'video',
            },
            prepare({ video }) {
              return {
                title: 'Video Slide',
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
      client: 'client.title',
      year: 'year',
      media: 'preview.image',
    },
    prepare({ title, subtitle, client, year, media }) {
      const parts = [subtitle, client, year].filter(Boolean);
      return {
        title: title || 'Untitled Project',
        subtitle: parts.length > 0 ? parts.join(' • ') : 'No details',
        media: media,
      };
    },
  },
});
