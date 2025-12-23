import { defineType, defineField } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export default defineType({
  name: 'photography',
  title: 'Photography',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'year',
      type: 'number',
      title: 'Year',
      description: 'Photo year',
      validation: (Rule) => Rule.min(1900).max(2100),
    }),
    defineField({
      name: 'city',
      type: 'string',
      title: 'City',
      description: 'City where the photo was taken',
    }),
    defineField({
      name: 'country',
      type: 'string',
      title: 'Country',
      description: 'Country where the photo was taken',
    }),
    defineField({
      name: 'camera',
      type: 'string',
      title: 'Camera',
      description: 'Camera used for this photo',
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
      ],
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Thumbnail',
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
      name: 'projectMedia',
      type: 'array',
      title: 'Project Media',
      description: 'Media slides for the photography carousel. Each slide can contain an image or video.',
      of: [
        {
          type: 'object',
          name: 'mediaSlide',
          title: 'Media Slide',
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
              description: 'Upload MP4 video file. Media will fill the slide (object-fit: cover).',
              options: {
                accept: 'video/mp4',
              },
            }),
          ],
          preview: {
            select: {
              image: 'image',
              video: 'video',
            },
            prepare({ image, video }) {
              return {
                title: video ? 'Video Slide' : 'Image Slide',
                media: image || video,
              };
            },
          },
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value) return true;
              const hasImage = !!value.image;
              const hasVideo = !!value.video;
              if (!hasImage && !hasVideo) {
                return 'Either image or video is required';
              }
              if (hasImage && hasVideo) {
                return 'Only one media type per slide (image OR video)';
              }
              return true;
            }),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      city: 'city',
      country: 'country',
      camera: 'camera',
      media: 'thumbnail',
    },
    prepare({ title, year, city, country, camera, media }) {
      const location = [city, country].filter(Boolean).join(', ');
      return {
        title: title || 'Untitled Photo',
        subtitle: [year, location, camera].filter(Boolean).join(' • ') || 'No details',
        media: media,
      };
    },
  },
});

