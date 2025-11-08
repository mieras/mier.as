import { defineType, defineField } from 'sanity';
import { CommentIcon } from '@sanity/icons';

export default defineType({
  name: 'testimonialBlock',
  title: 'Testimonial Block',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      type: 'text',
      title: 'Testimonial Quote',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Person Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role/Company',
    }),
    defineField({
      name: 'photo',
      type: 'image',
      title: 'Person Photo',
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
          { title: 'Content (Default)', value: 'content' },
          { title: 'Popout', value: 'popout' },
          { title: 'Feature', value: 'feature' },
          { title: 'Page', value: 'page' },
        ],
      },
      initialValue: 'content',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      role: 'role',
      quote: 'quote',
      media: 'photo',
    },
    prepare({ name, role, quote: _quote, media }) {
      return {
        title: name || 'Testimonial',
        subtitle: `Testimonial Block • ${role || 'No role'}`,
        media: media,
      };
    },
  },
});
