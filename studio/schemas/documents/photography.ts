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

