import 'dotenv/config';
import { createClient as createSanityClient } from '@sanity/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import {
  mapPost,
  mapLandingPage,
  mapSettings,
  mapMenu,
  mapCourse,
  mapGiftCard,
} from '../src/utils/sanity/mapping';

const sanityClient = createSanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-15',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const supabase = createSupabaseClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const KV_TABLE = 'kv_store_0ba58e95';

async function uploadImage(url: string) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return undefined;
  try {
    console.log(`📸 Subiendo imagen: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al descargar imagen: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: url.split('/').pop(),
    });
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
  } catch (error) {
    console.error(`❌ Error al subir imagen ${url}:`, error);
    return undefined;
  }
}

async function migrate() {
  console.log('🚀 Iniciando migración desde KV Store...');

  try {
    // 1. Configuración
    console.log('⚙️ Migrando configuración (site:settings)...');
    const { data: sData, error: sError } = await supabase.from(KV_TABLE).select('value').eq('key', 'site:settings').single();
    if (sError) console.error('❌ Error fetching settings:', sError.message);
    else if (sData?.value) {
      const val = sData.value;
      const mapped = mapSettings(val);
      if (val.heroImageDesktop) mapped.heroImages.desktop = await uploadImage(val.heroImageDesktop);
      if (val.heroImageMobile) mapped.heroImages.mobile = await uploadImage(val.heroImageMobile);
      if (val.heroTextImage1) mapped.heroImages.text1 = await uploadImage(val.heroTextImage1);
      if (val.heroTextImage2) mapped.heroImages.text2 = await uploadImage(val.heroTextImage2);
      if (val.instagramImages) {
        for (let i = 0; i < mapped.instagram.images.length; i++) {
          const url = val.instagramImages[i]?.url;
          if (url) mapped.instagram.images[i].image = await uploadImage(url);
        }
      }
      await sanityClient.createOrReplace(mapped);
      console.log('✅ Configuración migrada');
    }

    // 2. Menú
    console.log('▤ Migrando menú (site:menu)...');
    const { data: mData, error: mError } = await supabase.from(KV_TABLE).select('value').eq('key', 'site:menu').single();
    if (mError) console.error('❌ Error fetching menu:', mError.message);
    else if (mData?.value) {
      const mapped = mapMenu(mData.value);
      await sanityClient.createOrReplace(mapped);
      console.log('✅ Menú migrado');
    }

    // 3. Blog Posts
    console.log('📝 Migrando posts (blog:post:*)...');
    const { data: pItems, error: pError } = await supabase.from(KV_TABLE).select('value').like('key', 'blog:post:%');
    if (pError) console.error('❌ Error fetching posts:', pError.message);
    else if (pItems) {
      console.log(`Encontrados ${pItems.length} posts potenciales`);
      for (const item of pItems) {
        const post = item.value;
        if (!post || post.deleted) continue;
        const mapped = mapPost(post);
        if (post.featuredImage) mapped.mainImage = await uploadImage(post.featuredImage);
        await sanityClient.createOrReplace(mapped);
        console.log(`✅ Post migrado: ${post.title}`);
      }
    }

    // 4. Landing Pages
    console.log('📄 Migrando landing pages (page:*)...');
    const { data: lpItems, error: lpError } = await supabase.from(KV_TABLE).select('value').like('key', 'page:%');
    if (lpError) console.error('❌ Error fetching landing pages:', lpError.message);
    else if (lpItems) {
      console.log(`Encontradas ${lpItems.length} landing pages potenciales`);
      for (const item of lpItems) {
        const lp = item.value;
        if (!lp || lp.deleted || lp.slug === 'blog') continue; // Ignorar el blog page si es solo un contenedor
        const mapped = mapLandingPage(lp);
        if (lp.heroImage) mapped.hero.image = await uploadImage(lp.heroImage);

        for (let i = 0; i < mapped.sections.length; i++) {
          const section = lp.sections[i];
          if (section?.image) mapped.sections[i].image = await uploadImage(section.image);
          if (section?.images) {
            mapped.sections[i].images = (await Promise.all(
              section.images.map((img: any) => typeof img === 'string' ? uploadImage(img) : uploadImage(img.url))
            )).filter(Boolean);
          }
        }
        await sanityClient.createOrReplace(mapped);
        console.log(`✅ Landing page migrada: ${lp.title}`);
      }
    }

    // 5. Courses & Workshops (Recovery Mode from History)
    console.log('🏺 Iniciando recuperación de cursos y workshops desde el historial...');

    // Fetch all history keys
    let historyKeys: string[] = [];
    let from = 0;
    const pageSize = 1000;

    while (true) {
      const { data, error } = await supabase
        .from(KV_TABLE)
        .select('key')
        .like('key', 'history:%')
        .range(from, from + pageSize - 1);

      if (error || !data || data.length === 0) break;
      historyKeys.push(...data.map(d => d.key));
      from += pageSize;
      if (data.length < pageSize) break;
    }

    console.log(`📜 Encontradas ${historyKeys.length} entradas de historial.`);

    // Group by ID and find latest version
    const latestVersions = new Map<string, { key: string, timestamp: number }>();

    historyKeys.forEach(key => {
      // Key format: history:<ID>:version:<TIMESTAMP>:<RANDOM>
      const match = key.match(/^history:(.+):version:(\d+):/);
      if (match) {
        const id = match[1];
        const timestamp = parseInt(match[2]);

        // Skip generic pages or unwanted types if obvious from ID
        if (id.startsWith('page:') || id.startsWith('blog:') || id.startsWith('site:')) return;

        const current = latestVersions.get(id);
        if (!current || timestamp > current.timestamp) {
          latestVersions.set(id, { key, timestamp });
        }
      }
    });

    console.log(`✨ Identificados ${latestVersions.size} ítems únicos potenciales.`);

    const uniqueKeys = Array.from(latestVersions.values()).map(v => v.key);
    const itemsToMigrate = [];

    // Fetch values for unique keys in chunks
    for (let i = 0; i < uniqueKeys.length; i += 20) {
      const chunk = uniqueKeys.slice(i, i + 20);
      const { data } = await supabase.from(KV_TABLE).select('value').in('key', chunk);

      if (data) {
        for (const row of data) {
          const item = row.value;
          // Filter by valid types
          if (['class', 'workshop', 'private', 'gift-card'].includes(item.type) || (item.id && item.id.includes('gift-card'))) {
            if (!item.type && item.id.includes('gift-card')) item.type = 'gift-card';
            itemsToMigrate.push(item);
          }
        }
      }
    }

    console.log(`🚀 Migrando ${itemsToMigrate.length} ítems válidos confirmados...`);

    for (const item of itemsToMigrate) {
      if (!item.title) continue; // Skip incomplete items

      try {
        if (item.type === 'gift-card') {
          console.log(`🎁 Procesando Gift Card: ${item.title}`);
          const mapped = mapGiftCard(item);

          if (item.images && item.images.length > 0) {
            const uploadedImages = [];
            for (const img of item.images) {
              const url = typeof img === 'string' ? img : img.url;
              if (url) {
                const imageObj = await uploadImage(url);
                if (imageObj) {
                  uploadedImages.push({
                    ...imageObj,
                    _key: Math.random().toString(36).substring(7),
                  });
                }
              }
            }
            if (uploadedImages.length > 0) mapped.images = uploadedImages;
          }
          await sanityClient.createOrReplace(mapped);
        } else {
          console.log(`🏺 Procesando Curso/Workshop: ${item.title} (${item.type})`);
          const mapped = mapCourse(item);

          if (item.heroImage) {
            const url = typeof item.heroImage === 'string' ? item.heroImage : item.heroImage.url;
            if (url) {
              const imageObj = await uploadImage(url);
              if (imageObj) mapped.heroImage = imageObj;
            }
          }

          if (item.titleImage) {
            const url = typeof item.titleImage === 'string' ? item.titleImage : item.titleImage.url;
            if (url) {
              const imageObj = await uploadImage(url);
              if (imageObj) mapped.titleImage = imageObj;
            }
          }

          if (item.images && item.images.length > 0) {
            const uploadedImages = [];
            for (const img of item.images) {
              const url = typeof img === 'string' ? img : img.url;
              if (url) {
                const imageObj = await uploadImage(url);
                if (imageObj) {
                  uploadedImages.push({
                    ...imageObj,
                    _key: Math.random().toString(36).substring(7),
                  });
                }
              }
            }
            if (uploadedImages.length > 0) mapped.images = uploadedImages;
          }

          await sanityClient.createOrReplace(mapped);
        }
      } catch (err: any) {
        console.error(`❌ Error migrando ${item.title}:`, err.message || err);
      }
    }

    console.log('✨ Migración desde KV Store FINALIZADA');
  } catch (err) {
    console.error('❌ Error crítico en migración:', err);
  }
}

migrate();
