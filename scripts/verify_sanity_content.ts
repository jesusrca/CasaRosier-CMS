import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: '2024-01-15',
    useCdn: false, // We want fresh data
    token: process.env.SANITY_WRITE_TOKEN,
});

async function verify() {
    console.log('🔍 Verificando contenido en Sanity...');

    const courses = await client.fetch(`*[_type == "course"]{ title, type, "imageUrl": heroImage.asset->url }`);
    const giftCards = await client.fetch(`*[_type == "giftCard"]{ title, price, "imageUrl": images[0].asset->url }`);

    console.log(`📚 Cursos encontrados: ${courses.length}`);
    courses.forEach(c => console.log(`   - ${c.title} (${c.type}) [Image: ${c.imageUrl ? '✅' : '❌'}]`));

    console.log(`\n🎁 Tarjetas de Regalo encontradas: ${giftCards.length}`);
    giftCards.forEach(gc => console.log(`   - ${gc.title} (${gc.price}€) [Image: ${gc.imageUrl ? '✅' : '❌'}]`));
}

verify().catch(console.error);
