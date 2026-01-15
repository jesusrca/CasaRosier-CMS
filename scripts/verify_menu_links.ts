import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: '2024-01-15',
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN,
});

async function verifyMenu() {
    console.log('🔍 Verificando enlaces del menú...');

    // 1. Get Menu
    const menu = await client.fetch('*[_type == "siteMenu"][0]');
    if (!menu) {
        console.error('❌ No se encontró el menú');
        return;
    }

    // 2. Get All Content Slugs
    const courses = await client.fetch('*[_type == "course"]{ "slug": slug.current, type, title }');
    const giftCards = await client.fetch('*[_type == "giftCard"]{ "slug": slug.current, title }');
    const landingPages = await client.fetch('*[_type == "landingPage"]{ "slug": slug.current, title }');

    // Helper to check if a path exists
    const checkPath = (path: string): { valid: boolean; reason?: string; match?: string } => {
        if (!path) return { valid: false, reason: 'Empty path' };
        if (path === '/') return { valid: true, match: 'Home' };

        // Normalize path
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const parts = cleanPath.split('/');

        if (parts.length === 1) {
            // Check static pages / landing pages
            // Static routes in React Router: /blog, /clases, /workshops, /tiendita, /el-estudio, /admin/*
            const staticRoutes = ['blog', 'clases', 'workshops', 'tiendita', 'el-estudio', 'admin', 'espacios-privados']; // espacios-privados is in menu but might be redirect?
            if (staticRoutes.includes(parts[0])) return { valid: true, match: 'Static Route' };

            // Check Landing Pages (e.g. /tarjeta-regalo)
            const lp = landingPages.find((p: any) => p.slug === parts[0]);
            if (lp) return { valid: true, match: `Landing Page: ${lp.title}` };

            return { valid: false, reason: 'Unknown root path' };
        }

        // Check Dynamic Routes: /clases/:slug, /workshops/:slug, /privada/:slug, /tarjeta-regalo/:slug
        const section = parts[0];
        const slug = parts[1];

        if (section === 'clases') {
            const item = courses.find((c: any) => c.slug === slug && c.type === 'class');
            if (item) return { valid: true, match: `Class: ${item.title}` };
            // Fallback check: maybe it's a workshop but url says classes? or vice versa
            const anyItem = courses.find((c: any) => c.slug === slug);
            if (anyItem) return { valid: true, match: `Found as ${anyItem.type}: ${anyItem.title} (URL mismatch?)` };
        }

        if (section === 'workshops') {
            const item = courses.find((c: any) => c.slug === slug && c.type === 'workshop');
            if (item) return { valid: true, match: `Workshop: ${item.title}` };
            const anyItem = courses.find((c: any) => c.slug === slug);
            if (anyItem) return { valid: true, match: `Found as ${anyItem.type}: ${anyItem.title} (URL mismatch?)` };
        }

        if (section === 'privada') {
            const item = courses.find((c: any) => c.slug === slug && c.type === 'private');
            if (item) return { valid: true, match: `Private: ${item.title}` };
        }

        if (section === 'tarjeta-regalo') {
            // Could be Landing Page OR Dynamic Gift Card content
            // But usually /tarjeta-regalo root is a landing page.
            // If path is /tarjeta-regalo (handled above). 
            // If path is /tarjeta-regalo/:slug (unlikely menu item, but possible)
            return { valid: false, reason: 'Dynamic Gift Card path not common in menu' };
        }

        if (section === 'blog') {
            // Assume blog posts exist or valid static route
            return { valid: true, match: 'Blog Post' };
        }

        return { valid: false, reason: 'Content not found in Sanity' };
    };

    console.log('\n📋 Reporte de Enlaces del Menú:\n');

    const processItems = (items: any[], level = 0) => {
        items.forEach(item => {
            const indent = '  '.repeat(level);
            if (item.path) {
                const status = checkPath(item.path);
                const icon = status.valid ? '✅' : '❌';
                console.log(`${indent}${icon} [${item.name}](${item.path}) - ${status.valid ? status.match : status.reason}`);
            } else {
                console.log(`${indent}📂 [${item.name}] (Folder)`);
            }

            if (item.submenu) {
                processItems(item.submenu, level + 1);
            }
        });
    };

    processItems(menu.items);
    console.log('\n🏁 Verificación completada.');
}

verifyMenu().catch(console.error);
