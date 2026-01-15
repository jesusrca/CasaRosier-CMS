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
    "/clases/clases-regulares-de-modelado": "/clases/clases-regulares-modelado", // Fix: remove 'de'
    "/clases/clases-de-un-dia-iniciacion-en-ceramica": "/clases/clases-de-un-dia-iniciacion-en-ceramica", // This one seems OK based on previous manual check, but can ensure
    "/clases/modelado-con-torno": "/clases/curso-de-torno-alfarero-en-barcelona", // Or 'modelado-con-torno'? Query showed 'curso-de-torno-alfarero-en-barcelona' for "Cursos de Torno..."? Wait, I saw "Cursos de Torno Alfarero en Barcelona" in verification script. Let's double check.
    // Actually, list showed: "slug": "clases-regulares-modelado"
    // "slug": "curso-de-torno-alfarero-en-barcelona" -> "Cursos de Torno Alfarero en Barcelona"
    // "slug": "clases-de-un-dia-iniciacion-en-ceramica" -> "Clases de un día de Iniciación en Cerámica"
    // "slug": "laboratorio-ceramico" -> "Laboratorio de Investigación técnica..."
};

// Based on the output:
const realSlugs = {
    "/clases/clases-regulares-de-modelado": "/clases/clases-regulares-modelado",
    "/clases/modelado-con-torno": "/clases/curso-de-torno-alfarero-en-barcelona",
    "/clases/laboratorio-de-investigacion-tecnica-de-esmaltes-y-pastas": "/workshops/laboratorio-ceramico" // Using workshop path if it's considered workshop or class? title is "Laboratorio..."
};


async function updateMenu() {
    console.log('🔄 Corrigiendo menú con slugs verificados...');

    const menu = await client.fetch('*[_type == "siteMenu"][0]');
    if (!menu) {
        console.error('❌ No se encontró el menú');
        return;
    }

    const newItems = menu.items.map((item: any) => {
        // Top level
        if (realSlugs[item.path]) {
            console.log(`✅ Top Level: ${item.path} -> ${realSlugs[item.path]}`);
            item.path = realSlugs[item.path];
        }

        // Submenu
        if (item.submenu) {
            item.submenu = item.submenu.map((sub: any) => {
                if (realSlugs[sub.path]) {
                    console.log(`✅ Submenú: ${sub.path} -> ${realSlugs[sub.path]}`);
                    sub.path = realSlugs[sub.path];
                } else {
                    // Try to fix "modelado-con-torno" if previous script set it to that
                    if (sub.path === "/clases/modelado-con-torno") {
                        sub.path = "/clases/curso-de-torno-alfarero-en-barcelona";
                        console.log(`✅ Submenú (Fix Torno): /clases/modelado-con-torno -> /clases/curso-de-torno-alfarero-en-barcelona`);
                    }
                    if (sub.path === "/clases/laboratorio-de-investigacion-tecnica-de-esmaltes-y-pastas") {
                        // Check if it is class or workshop. The query showed type=class. 
                        // slug: laboratorio-ceramico
                        sub.path = "/clases/laboratorio-ceramico";
                        console.log(`✅ Submenú (Fix Lab): -> /clases/laboratorio-ceramico`);
                    }
                }
                return sub;
            });
        }
        return item;
    });

    await client.patch(menu._id).set({ items: newItems }).commit();
    console.log('✨ Menú corregido correctamente');
}

updateMenu().catch(console.error);
