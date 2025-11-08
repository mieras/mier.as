import { defineType, defineField } from 'sanity';
import { PresentationIcon } from '@sanity/icons';

export default defineType({
  name: 'carouselBlock',
  title: 'Carousel Block',
  type: 'object',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Carousel Title',
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      title: 'Carousel Images',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'size',
      type: 'string',
      title: 'Size',
      options: {
        list: [
          { title: 'Feature', value: 'feature' },
          { title: 'Full Width', value: 'full' },
        ],
      },
      initialValue: 'feature',
    }),
    defineField({
      name: 'showCaptions',
      type: 'boolean',
      title: 'Show Captions',
      initialValue: false,
    }),
    defineField({
      name: 'showTitle',
      type: 'boolean',
      title: 'Show Title',
      description: 'Display the carousel title',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      gallery: 'gallery',
      size: 'size',
    },
    prepare({ title, gallery, size }) {
      return {
        title: title || 'Carousel Block',
        subtitle: `${gallery?.length || 0} images - ${size || 'feature'} size`,
        media: PresentationIcon,
      };
    },
  },
});
