import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Blog Post',
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
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'author',
            title: 'Autor',
            type: 'string',
            initialValue: 'Casa Rosier',
        }),
        defineField({
            name: 'excerpt',
            title: 'Extracto',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'mainImage',
            title: 'Imagen Destacada',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'category',
            title: 'Categoría',
            type: 'string',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Fecha de publicación',
            type: 'datetime',
            initialValue: (new Date()).toISOString(),
        }),
        defineField({
            name: 'isPublished',
            title: 'Publicado',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'featured',
            title: 'Destacado',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'body',
            title: 'Cuerpo',
            type: 'array',
            of: [
                {
                    type: 'block',
                },
                {
                    type: 'image',
                    options: { hotspot: true },
                },
            ],
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
                { name: 'metaTitle', title: 'Meta Título', type: 'string' },
                { name: 'metaDescription', title: 'Meta Descripción', type: 'text', rows: 3 },
                { name: 'keywords', title: 'Palabras Clave', type: 'string' },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author',
            media: 'mainImage',
        },
        prepare(selection) {
            const { author } = selection
            return { ...selection, subtitle: author && `por ${author}` }
        },
    },
})
