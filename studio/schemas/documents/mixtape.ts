import { defineType, defineField } from 'sanity';
import { PlayIcon } from '@sanity/icons';

export default defineType({
  name: 'mixtape',
  title: 'Mixtape',
  type: 'document',
  icon: PlayIcon,
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
      description: 'Mixtape year',
      validation: (Rule) => Rule.min(1900).max(2100),
    }),
    defineField({
      name: 'mixcloudLink',
      type: 'url',
      title: 'Mixcloud Link',
      description: 'URL to the Mixcloud mix',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
        }),
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
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      media: 'thumbnail',
    },
    prepare({ title, year, media }) {
      return {
        title: title || 'Untitled Mixtape',
        subtitle: year ? `Year: ${year}` : 'No year',
        media: media,
      };
    },
  },
});
