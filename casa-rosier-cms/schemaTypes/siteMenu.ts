import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'siteMenu',
    title: 'Menú de Navegación',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre del Menú',
            type: 'string',
            initialValue: 'Menú Principal',
        }),
        defineField({
            name: 'items',
            title: 'Items del Menú',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'menuItem',
                    title: 'Item del Menú',
                    fields: [
                        defineField({ name: 'name', title: 'Nombre', type: 'string' }),
                        defineField({ name: 'path', title: 'Ruta (URL)', type: 'string' }),
                        defineField({
                            name: 'submenu',
                            title: 'Submenú',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    name: 'submenuItem',
                                    fields: [
                                        { name: 'name', title: 'Nombre', type: 'string' },
                                        { name: 'path', title: 'Ruta (URL)', type: 'string' },
                                    ],
                                },
                            ],
                        }),
                    ],
                },
            ],
        }),
    ],
})
