import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: '2024-01-15',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
});

const updates = {
    "/clases/iniciacion": "/clases/clases-de-un-dia-iniciacion-en-ceramica",
    "/clases/regular": "/clases/clases-regulares-de-modelado",
    "/clases/torno": "/clases/modelado-con-torno",
    "/workshops/esmaltes-online": "/workshops/esmaltes-online-zoom",
    "/workshops/esmaltes-barcelona": "/workshops/formulacion-esmaltes-barcelona",
    "/workshops/laboratorio": "/clases/laboratorio-de-investigacion-tecnica-de-esmaltes-y-pastas",
    "/workshops/metodo-seger": "/workshops/workshop-quimica-ceramica-fundamentos-de-la-formula-seger",
    "/espacios-privados": "/privada/taller-de-ceramica-y-vino-art-wine-en-barcelona" // Assuming this is the main private one or generic
};

async function updateMenu() {
    console.log('🔄 Actualizando menú...');

    const menu = await client.fetch('*[_type == "siteMenu"][0]');
    if (!menu) {
        console.error('❌ No se encontró el menú');
        return;
    }

    const newItems = menu.items.map((item: any) => {
        // Update top level path
        if (item.path && updates[item.path]) {
            console.log(`✅ Actualizando ${item.name}: ${item.path} -> ${updates[item.path]}`);
            item.path = updates[item.path];
        }

        // Update submenu items
        if (item.submenu) {
            item.submenu = item.submenu.map((sub: any) => {
                if (sub.path && updates[sub.path]) {
                    console.log(`✅ Actualizando Submenú ${sub.name}: ${sub.path} -> ${updates[sub.path]}`);
                    sub.path = updates[sub.path];
                }
                return sub;
            });
        }
        return item;
    });

    await client.patch(menu._id).set({ items: newItems }).commit();
    console.log('✨ Menú actualizado correctamente');
}

updateMenu().catch(console.error);
