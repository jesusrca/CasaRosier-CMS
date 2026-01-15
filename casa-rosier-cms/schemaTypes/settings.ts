import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'settings',
    title: 'Configuración del Sitio',
    type: 'document',
    fields: [
        defineField({
            name: 'siteName',
            title: 'Nombre del Sitio',
            type: 'string',
            initialValue: 'Casa Rosier',
        }),
        defineField({
            name: 'siteDescription',
            title: 'Descripción del Sitio',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'siteLogo',
            title: 'Logo Principal',
            type: 'image',
        }),
        defineField({
            name: 'siteLogoDark',
            title: 'Logo Oscuro (para fondos claros)',
            type: 'image',
        }),
        defineField({
            name: 'siteLogoLight',
            title: 'Logo Claro (para fondos oscuros)',
            type: 'image',
        }),
        defineField({
            name: 'seo',
            title: 'SEO Global',
            type: 'object',
            fields: [
                { name: 'seoTitle', title: 'Meta Título por Defecto', type: 'string' },
                { name: 'seoDescription', title: 'Meta Descripción por Defecto', type: 'text', rows: 3 },
                { name: 'seoKeywords', title: 'Palabras Clave por Defecto', type: 'string' },
                { name: 'ogImage', title: 'Imagen Open Graph (Social)', type: 'image' },
                { name: 'ogUrl', title: 'URL de Open Graph (ej: https://casarosier.com)', type: 'string' },
                { name: 'ogType', title: 'Tipo de Open Graph (ej: website)', type: 'string', initialValue: 'website' },
                { name: 'googleAnalyticsId', title: 'Google Analytics ID', type: 'string' },
            ],
        }),
        defineField({
            name: 'homeCoursesDescription',
            title: 'Descripción de Cursos (Home)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'homeWorkshopsDescription',
            title: 'Descripción de Workshops (Home)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'contact',
            title: 'Información de Contacto',
            type: 'object',
            fields: [
                { name: 'email', title: 'Email Principal', type: 'string' },
                { name: 'email2', title: 'Email Secundario', type: 'string' },
                { name: 'phone', title: 'Teléfono', type: 'string' },
                { name: 'whatsapp', title: 'WhatsApp (número sin +)', type: 'string' },
            ],
        }),
        defineField({
            name: 'heroImages',
            title: 'Imágenes Hero (Home)',
            type: 'object',
            fields: [
                { name: 'desktop', title: 'Hero Desktop', type: 'image', options: { hotspot: true } },
                { name: 'mobile', title: 'Hero Mobile', type: 'image', options: { hotspot: true } },
                { name: 'text1', title: 'Imagen de Texto 1', type: 'image' },
                { name: 'text2', title: 'Imagen de Texto 2', type: 'image' },
            ],
        }),
        defineField({
            name: 'blogHero',
            title: 'Hero del Blog',
            type: 'object',
            fields: [
                { name: 'image', title: 'Imagen Hero Blog', type: 'image', options: { hotspot: true } },
                { name: 'titleImage', title: 'Imagen de Título (PNG)', type: 'image' },
            ],
        }),
        defineField({
            name: 'instagram',
            title: 'Instagram',
            type: 'object',
            fields: [
                { name: 'title', title: 'Título del Carrusel', type: 'text', rows: 2 },
                { name: 'handle', title: 'Instagram Handle (@...)', type: 'string' },
                { name: 'link', title: 'Enlace al Perfil', type: 'string' },
                {
                    name: 'images',
                    title: 'Imágenes del Carrusel',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                { name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } },
                                { name: 'title', title: 'Título', type: 'string' },
                                { name: 'description', title: 'Descripción', type: 'text' },
                                { name: 'date', title: 'Fecha (ej: 15 ENERO 2024)', type: 'string' },
                            ],
                        },
                    ],
                },
            ],
        }),
    ],
})
