import { defineType, defineField } from 'sanity';
import { ProjectsIcon } from '@sanity/icons';

export default defineType({
  name: 'work',
  title: 'Projects',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    {
      name: 'hero',
      title: 'Hero',
      default: true,
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'meta',
      title: 'Project Details',
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
      title: 'Project Title',
      validation: (Rule) => Rule.required().min(3).max(100),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return 'Slug is required';
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return 'Slug can only contain lowercase letters, numbers, and hyphens';
          }
          return true;
        }),
      group: 'content',
    }),
    defineField({
      name: 'hero',
      type: 'object',
      title: 'Hero',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
        }),
        defineField({
          name: 'subtitle',
          type: 'string',
          title: 'Subtitle',
        }),
        defineField({
          name: 'intro',
          type: 'text',
          title: 'Intro',
        }),
        defineField({
          name: 'coverMedia',
          type: 'image',
          title: 'Cover Media',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
          ],
        }),
      ],
      group: 'hero',
    }),
    defineField({
      name: 'projectMedia',
      type: 'array',
      title: 'Project Media',
      description: 'Media slides for the project carousel. Each slide can contain an image or video.',
      of: [
        {
          type: 'object',
          name: 'mediaSlide',
          title: 'Media Slide',
          fields: [
            defineField({
              name: 'mediaType',
              type: 'string',
              title: 'Media Type',
              description: 'Choose whether this slide contains an image or video',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video (MP4)', value: 'video' },
                ],
              },
              initialValue: 'image',
              validation: (Rule) => Rule.required(),
            }),
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
              hidden: ({ parent }) => parent?.mediaType !== 'image',
            }),
            defineField({
              name: 'video',
              type: 'file',
              title: 'Video (MP4)',
              description: 'Upload MP4 video file. Media will fill the slide (object-fit: cover).',
              options: {
                accept: 'video/mp4',
              },
              hidden: ({ parent }) => parent?.mediaType !== 'video',
            }),
          ],
          preview: {
            select: {
              mediaType: 'mediaType',
              image: 'image',
              video: 'video',
            },
            prepare({ mediaType, image, video }) {
              return {
                title: mediaType === 'video' ? 'Video Slide' : 'Image Slide',
                media: image || video,
              };
            },
          },
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value) return true;
              if (!value.mediaType) {
                return 'Media type is required';
              }
              if (value.mediaType === 'image' && !value.image) {
                return 'Image is required when media type is image';
              }
              if (value.mediaType === 'video' && !value.video) {
                return 'Video is required when media type is video';
              }
              return true;
            }),
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'credits',
      type: 'array',
      title: 'Credits',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Title', value: 'h3' },
            { title: 'Subtitle', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'services',
      type: 'array',
      title: 'Services',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      group: 'meta',
    }),
    defineField({
      name: 'thumbnail',
      type: 'object',
      title: 'Thumbnail',
      fields: [
        defineField({
          name: 'image',
          type: 'image',
          title: 'Thumbnail Image',
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
          name: 'size',
          type: 'string',
          title: 'Size',
          options: {
            list: [
              { title: 'Small', value: 'small' },
              { title: 'Default', value: 'default' },
              { title: 'Large', value: 'large' },
              { title: 'Full', value: 'full' },
            ],
          },
          initialValue: 'default',
        }),
        defineField({
          name: 'video',
          type: 'file',
          title: 'Video (MP4)',
          description: 'Upload MP4 video file for thumbnail. Alternatively, use videoUrl for external video.',
          options: {
            accept: 'video/mp4',
          },
        }),
        defineField({
          name: 'videoUrl',
          type: 'url',
          title: 'Video URL (Fallback)',
          description: 'Optional video URL as fallback if no MP4 file is uploaded',
        }),
        defineField({
          name: 'aspectRatio',
          type: 'string',
          title: 'Aspect Ratio',
          description: 'Choose the aspect ratio for the thumbnail',
          options: {
            list: [
              { title: '16:9 (Widescreen)', value: '16:9' },
              { title: '5:4 (Portrait)', value: '5:4' },
              { title: '4:3 (Standard)', value: '4:3' },
              { title: '3:2 (Photo)', value: '3:2' },
              { title: '1:1 (Square)', value: '1:1' },
              { title: '2:3 (Portrait Photo)', value: '2:3' },
              { title: '3:4 (Portrait)', value: '3:4' },
              { title: '4:5 (Portrait)', value: '4:5' },
              { title: '9:16 (Vertical)', value: '9:16' },
            ],
          },
          initialValue: '16:9',
        }),
      ],
      group: 'meta',
    }),
    defineField({
      name: 'client',
      type: 'reference',
      title: 'Client',
      to: [{ type: 'client' }],
      group: 'meta',
    }),
    defineField({
      name: 'year',
      type: 'number',
      title: 'Year',
      description: 'Project year',
      validation: (Rule) => Rule.min(1900).max(2100),
      group: 'meta',
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role',
      description: 'Your role in this project',
      group: 'meta',
    }),
    defineField({
      name: 'relatedProjects',
      type: 'array',
      title: 'Related Projects',
      of: [{ type: 'reference', to: [{ type: 'work' }] }],
      validation: (Rule) => Rule.max(3),
      group: 'meta',
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
      title: 'title',
      size: 'thumbnail.size',
      media: 'thumbnail.image',
    },
    prepare({ title, size, media }) {
      return {
        title: title || 'Untitled Project',
        subtitle: size ? `Size: ${size}` : 'No size set',
        media: media,
      };
    },
  },
});
