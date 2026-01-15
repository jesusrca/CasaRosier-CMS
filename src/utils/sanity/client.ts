import { createClient } from '@sanity/client';

export const sanityClient = createClient({
    projectId: 'oozhfnqb',
    dataset: 'production',
    useCdn: true, // `false` si quieres garantizar datos frescos, `true` para mejor rendimiento
    apiVersion: '2024-01-15',
});

// Helper para generar URLs de imágenes de Sanity
import imageUrlBuilder from '@sanity/image-url';
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
    return builder.image(source);
}
