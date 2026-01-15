import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: '2024-01-15',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
});

// Based on recent validation:
const updates = {
    "/clases/curso-de-torno-alfarero-en-barcelona": "/clases/cursos-ceramica-barcelona-torno", // Correct slug found
    "/privada/taller-de-ceramica-y-vino-art-wine-en-barcelona": "/privada/ceramica-y-vino", // Correct slug found
    "/tarjeta-regalo": "/privada/gift-card-tarjeta-regalo" // Pointing to the migrated item (type=private)
};

async function updateMenu() {
    console.log('🔄 Corrigiendo enlaces restantes del menú...');

    const menu = await client.fetch('*[_type == "siteMenu"][0]');
    if (!menu) {
        console.error('❌ No se encontró el menú');
        return;
    }

    const newItems = menu.items.map((item: any) => {
        // Top level
        if (updates[item.path]) {
            console.log(`✅ Corrigiendo ${item.name}: ${item.path} -> ${updates[item.path]}`);
            item.path = updates[item.path];
        }

        // Submenu
        if (item.submenu) {
            item.submenu = item.submenu.map((sub: any) => {
                if (updates[sub.path]) {
                    console.log(`✅ Corrigiendo Submenú ${sub.name}: ${sub.path} -> ${updates[sub.path]}`);
                    sub.path = updates[sub.path];
                }
                return sub;
            });
        }
        return item;
    });

    await client.patch(menu._id).set({ items: newItems }).commit();
    console.log('✨ Menú corregido finalizado');
}

updateMenu().catch(console.error);
