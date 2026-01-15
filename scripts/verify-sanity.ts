import 'dotenv/config';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: '2024-01-15',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
});

async function verify() {
    console.log('🧐 Verificando datos en Sanity...');

    try {
        const counts = await sanityClient.fetch(`{
      "posts": count(*[_type == "post"]),
      "landingPages": count(*[_type == "landingPage"]),
      "settings": count(*[_type == "settings"]),
      "siteMenu": count(*[_type == "siteMenu"]),
      "assets": count(*[_type == "sanity.imageAsset"])
    }`);

        console.log('📊 Resumen de migración:');
        console.log(`- Blog Posts: ${counts.posts}`);
        console.log(`- Landing Pages: ${counts.landingPages}`);
        console.log(`- Settings Doc: ${counts.settings}`);
        console.log(`- Menu Doc: ${counts.siteMenu}`);
        console.log(`- Image Assets: ${counts.assets}`);

        if (counts.landingPages > 0) {
            const lps = await sanityClient.fetch(`*[_type == "landingPage"]{title, "slug": slug.current}`);
            console.log('\n📄 Landing Pages migradas:');
            lps.forEach((lp: any) => console.log(`  - ${lp.title} (${lp.slug})`));
        }

    } catch (err) {
        console.error('❌ Error en verificación:', err);
    }
}

verify();
