import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'giftCard',
    title: 'Tarjetas de Regalo',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Precio (Desde)',
            type: 'number',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'images',
            title: 'Imágenes',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'visible',
            title: 'Visible',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
                { name: 'metaTitle', title: 'Meta Título', type: 'string' },
                { name: 'metaDescription', title: 'Meta Descripción', type: 'text', rows: 3 },
            ],
        }),
    ],
})
