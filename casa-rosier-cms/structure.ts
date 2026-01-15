import { StructureBuilder } from 'sanity/structure'

export const myStructure = (S: StructureBuilder) =>
    S.list()
        .title('Administración Casa Rosier')
        .items([
            // sección de páginas y blog
            S.listItem()
                .title('Contenido Web')
                .child(
                    S.list()
                        .title('Contenido Web')
                        .items([
                            S.documentTypeListItem('landingPage').title('Páginas (Landing)'),
                            S.documentTypeListItem('post').title('Blog (Entradas)'),
                        ])
                ),

            S.divider(),

            // sección de catálogo de productos/servicios
            S.listItem()
                .title('Catálogo y Servicios')
                .child(
                    S.list()
                        .title('Catálogo')
                        .items([
                            S.listItem()
                                .title('Cursos y Workshops')
                                .child(
                                    S.documentTypeList('course')
                                        .title('Todos los Cursos')
                                ),
                            S.documentTypeListItem('giftCard').title('Tarjetas de Regalo'),
                        ])
                ),

            S.divider(),

            // configuración global
            S.listItem()
                .title('Configuración Global')
                .child(
                    S.list()
                        .title('Ajustes del Sitio')
                        .items([
                            S.listItem()
                                .title('Configuración General')
                                .child(
                                    S.document()
                                        .schemaType('settings')
                                        .documentId('settings')
                                ),
                            S.listItem()
                                .title('Menú de Navegación')
                                .child(
                                    S.document()
                                        .schemaType('siteMenu')
                                        .documentId('siteMenu')
                                ),
                        ])
                ),
        ])
