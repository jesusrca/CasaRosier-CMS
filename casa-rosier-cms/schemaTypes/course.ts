import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'course',
    title: 'Cursos y Workshops',
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
            name: 'type',
            title: 'Tipo',
            type: 'string',
            options: {
                list: [
                    { title: 'Clase Mensual', value: 'class' },
                    { title: 'Workshop', value: 'workshop' },
                    { title: 'Reserva Privada', value: 'private' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'visible',
            title: 'Visible',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'price',
            title: 'Precio',
            type: 'number',
        }),
        defineField({
            name: 'duration',
            title: 'Duración',
            type: 'string',
        }),
        defineField({
            name: 'shortDescription',
            title: 'Descripción Corta',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'description',
            title: 'Descripción Detallada',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'includes',
            title: '¿Qué incluye?',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'images',
            title: 'Imágenes',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'heroImage',
            title: 'Imagen de Hero (Cabecera)',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'titleImage',
            title: 'Imagen de Título (Gráfica)',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'showInHome',
            title: 'Mostrar en Home (Clases)',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'showInHomeWorkshops',
            title: 'Mostrar en Home (Workshops)',
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
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            type: 'type',
            media: 'heroImage',
        },
        prepare({ title, type, media }) {
            const typeLabels: any = {
                class: 'Clase',
                workshop: 'Workshop',
                private: 'Privado',
            }
            return {
                title,
                subtitle: typeLabels[type] || type,
                media,
            }
        },
    },
})
