import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'landingPage',
    title: 'Landing Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título Interno',
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
            name: 'visible',
            title: 'Visible (Publicada)',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
                { name: 'metaTitle', title: 'Meta Título', type: 'string' },
                { name: 'metaDescription', title: 'Meta Descripción', type: 'text', rows: 3 },
                { name: 'metaKeywords', title: 'Palabras Clave', type: 'string' },
            ],
        }),
        defineField({
            name: 'hero',
            title: 'Sección Hero',
            type: 'object',
            fields: [
                { name: 'title', title: 'Título', type: 'string' },
                { name: 'subtitle', title: 'Subtítulo', type: 'text', rows: 2 },
                { name: 'image', title: 'Imagen de Fondo', type: 'image', options: { hotspot: true } },
            ],
        }),
        defineField({
            name: 'sections',
            title: 'Secciones de Contenido',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'section',
                    title: 'Sección',
                    fields: [
                        defineField({
                            name: 'type',
                            title: 'Tipo de Sección',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Sobre Nosotros', value: 'about' },
                                    { title: 'Cursos (Sección 1)', value: 'courses' },
                                    { title: 'Cursos (Sección 2)', value: 'courses2' },
                                    { title: 'Banner', value: 'banner' },
                                    { title: 'Texto', value: 'text' },
                                    { title: 'Imagen + Texto', value: 'image-text' },
                                    { title: 'Características', value: 'features' },
                                    { title: 'Galería', value: 'gallery' },
                                    { title: 'CTA', value: 'cta' },
                                ],
                            },
                        }),
                        defineField({ name: 'title', title: 'Título', type: 'string' }),
                        defineField({ name: 'titleLine1', title: 'Título Línea 1 (Home)', type: 'string', hidden: ({ parent }) => !['courses', 'courses2'].includes(parent?.type) }),
                        defineField({ name: 'titleLine2', title: 'Título Línea 2 (Home)', type: 'string', hidden: ({ parent }) => !['courses', 'courses2'].includes(parent?.type) }),
                        defineField({ name: 'subtitle', title: 'Subtítulo', type: 'string' }),
                        defineField({ name: 'description', title: 'Descripción (Home)', type: 'text', rows: 2, hidden: ({ parent }) => parent?.type !== 'banner' }),
                        defineField({ name: 'link', title: 'Enlace (Home / CTA)', type: 'string', hidden: ({ parent }) => !['banner', 'cta'].includes(parent?.type) }),
                        defineField({
                            name: 'content',
                            title: 'Contenido',
                            type: 'array',
                            of: [{ type: 'block' }],
                        }),
                        defineField({
                            name: 'image',
                            title: 'Imagen',
                            type: 'image',
                            hidden: ({ parent }) => !['image-text', 'banner'].includes(parent?.type),
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'mainImage',
                            title: 'Imagen Principal (Sobre Nosotros)',
                            type: 'image',
                            hidden: ({ parent }) => parent?.type !== 'about',
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'layout',
                            title: 'Disposición',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Imagen a la izquierda', value: 'left' },
                                    { title: 'Imagen a la derecha', value: 'right' },
                                ],
                            },
                            hidden: ({ parent }) => parent?.type !== 'image-text',
                        }),
                        defineField({
                            name: 'features',
                            title: 'Características',
                            type: 'array',
                            hidden: ({ parent }) => parent?.type !== 'features',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        { name: 'title', title: 'Título', type: 'string' },
                                        { name: 'description', title: 'Descripción', type: 'text' },
                                        { name: 'icon', title: 'Icono (nombre Lucide)', type: 'string' },
                                    ],
                                },
                            ],
                        }),
                        defineField({
                            name: 'images',
                            title: 'Imágenes',
                            type: 'array',
                            hidden: ({ parent }) => parent?.type !== 'gallery',
                            of: [{ type: 'image', options: { hotspot: true } }],
                        }),
                    ],
                },
            ],
        }),
        defineField({
            name: 'cta',
            title: 'Call to Action Final',
            type: 'object',
            fields: [
                { name: 'text', title: 'Texto del Botón', type: 'string' },
                { name: 'link', title: 'Enlace', type: 'string' },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            slug: 'slug.current',
        },
        prepare({ title, slug }) {
            return {
                title,
                subtitle: slug ? `/${slug}` : 'Sin URL',
            }
        },
    },
})
