/**
 * Mapeo de tipos de Supabase a Schemas de Sanity
 */

export const mapPost = (post: any) => ({
    _type: 'post',
    _id: `post-${post.id || post.slug}`,
    title: post.title,
    slug: {
        _type: 'slug',
        current: post.slug,
    },
    author: post.author || 'Casa Rosier',
    excerpt: post.excerpt,
    isPublished: post.published,
    featured: post.featured,
    publishedAt: post.createdAt || (new Date()).toISOString(),
    category: post.category,
    // Nota: Las imágenes requieren un tratamiento especial como assets en Sanity
    // mainImage: { _type: 'image', asset: { _ref: '...' } }
    seo: {
        metaTitle: post.seo?.metaTitle || '',
        metaDescription: post.seo?.metaDescription || '',
        keywords: post.seo?.keywords || '',
    },
    mainImage: undefined as any,
});

export const mapLandingPage = (lp: any) => ({
    _type: 'landingPage',
    _id: `lp-${lp.id || lp.slug}`,
    title: lp.title,
    slug: {
        _type: 'slug',
        current: lp.slug,
    },
    visible: lp.visible,
    seo: {
        metaTitle: lp.metaTitle,
        metaDescription: lp.metaDescription,
        metaKeywords: lp.metaKeywords,
    },
    hero: {
        title: lp.heroTitle,
        subtitle: lp.heroSubtitle,
        image: undefined as any,
    },
    sections: (lp.sections || []).map((s: any, index: number) => ({
        _key: s.id || `section-${index}`,
        type: s.type,
        title: s.title,
        layout: s.layout,
        // content: mapHTMLToPortableText(s.content),
        features: s.features?.map((f: any, i: number) => ({
            _key: `feature-${i}`,
            title: f.title,
            description: f.description,
            icon: f.icon,
        })),
        image: undefined as any,
        images: [] as any[],
    })),
    cta: {
        text: lp.ctaText,
        link: lp.ctaLink,
    },
});

export const mapSettings = (s: any) => ({
    _type: 'settings',
    _id: 'settings', // Singleton
    siteName: s.siteName,
    siteDescription: s.siteDescription,
    seo: {
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription,
        seoKeywords: s.seoKeywords,
        googleAnalyticsId: s.googleAnalyticsId,
    },
    contact: {
        email: s.contactEmail,
        email2: s.contactEmail2,
        phone: s.contactPhone,
        whatsapp: s.whatsappNumber,
    },
    heroImages: {
        desktop: undefined as any,
        mobile: undefined as any,
        text1: undefined as any,
        text2: undefined as any,
    },
    instagram: {
        title: s.instagramTitle,
        handle: s.instagramHandle,
        link: s.instagramLink,
        images: (s.instagramImages || []).map((img: any, i: number) => ({
            _key: `insta-${i}`,
            title: img.title,
            description: img.description,
            date: img.date,
            image: undefined as any,
        })),
    },
});

export const mapMenu = (menu: any) => ({
    _type: 'siteMenu',
    _id: 'siteMenu',
    name: 'Menú Principal',
    items: (menu.items || []).map((item: any, i: number) => ({
        _key: `menu-${i}`,
        name: item.name,
        path: item.path,
        submenu: item.submenu?.map((sub: any, si: number) => ({
            _key: `sub-${si}`,
            name: sub.name,
            path: sub.path,
        })),
    })),
});

export const mapCourse = (course: any) => ({
    _type: 'course',
    _id: `course-${(course.id || course.slug).toString().replace(/:/g, '-')}`,
    title: course.title,
    slug: {
        _type: 'slug',
        current: course.slug,
    },
    type: course.type, // 'class', 'workshop', 'private'
    visible: course.visible,
    price: course.price,
    duration: course.duration,
    shortDescription: course.shortDescription,
    // content: mapHTMLToPortableText(course.description),
    includes: course.includes || [],
    showInHome: course.showInHome,
    showInHomeWorkshops: course.showInHomeWorkshops,
    seo: {
        metaTitle: course.seo?.metaTitle || '',
        metaDescription: course.seo?.metaDescription || '',
    },
    heroImage: undefined as any,
    titleImage: undefined as any,
    images: [] as any[],
});

export const mapGiftCard = (gc: any) => ({
    _type: 'giftCard',
    _id: `giftcard-${(gc.id || gc.slug).toString().replace(/:/g, '-')}`,
    title: gc.title,
    slug: {
        _type: 'slug',
        current: gc.slug,
    },
    price: gc.price,
    visible: gc.visible,
    seo: {
        metaTitle: gc.seo?.metaTitle || '',
        metaDescription: gc.seo?.metaDescription || '',
    },
    images: [] as any[],
});
