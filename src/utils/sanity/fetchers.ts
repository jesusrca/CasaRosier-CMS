import { sanityClient } from './client';

export const sanityFetchers = {
  // Configuración global
  getSettings: async () => {
    return sanityClient.fetch(`*[_type == "settings"][0]{
      siteName,
      siteDescription,
      "siteLogo": siteLogo.asset->url,
      "siteLogoDark": siteLogoDark.asset->url,
      "siteLogoLight": siteLogoLight.asset->url,
      "contactEmail": contact.email,
      "contactPhone": contact.phone,
      "contactEmail2": contact.email2,
      "whatsappNumber": contact.whatsapp,
      "heroImageDesktop": heroImages.desktop.asset->url,
      "heroImageMobile": heroImages.mobile.asset->url,
      "heroTextImage1": heroImages.text1.asset->url,
      "heroTextImage2": heroImages.text2.asset->url,
      "blogHeroImage": blogHero.image.asset->url,
      "blogTitleImage": blogHero.titleImage.asset->url,
      homeCoursesDescription,
      homeWorkshopsDescription,
      instagram{
        title,
        handle,
        link,
        images[]{
          title,
          description,
          date,
          "url": image.asset->url
        }
      },
      "seoTitle": seo.seoTitle,
      "seoDescription": seo.seoDescription,
      "seoKeywords": seo.seoKeywords,
      "ogImage": seo.ogImage.asset->url,
      "ogUrl": seo.ogUrl,
      "ogType": seo.ogType,
      "googleAnalyticsId": seo.googleAnalyticsId,
      "instagramTitle": instagram.title,
      "instagramHandle": instagram.handle,
      "instagramLink": instagram.link,
      "instagramImages": instagram.images[]{
        title,
        description,
        date,
        "url": image.asset->url
      },
      seo {
        seoTitle,
        seoDescription,
        seoKeywords,
        "ogImage": ogImage.asset->url,
        ogUrl,
        ogType,
        googleAnalyticsId
      }
    }`);
  },

  // Menú de navegación
  getMenu: async () => {
    return sanityClient.fetch(`*[_type == "siteMenu"][0]{
      items[]{
        name,
        path,
        submenu[]{
          name,
          path
        }
      }
    }`);
  },

  // Blog posts
  getPosts: async (publishedOnly = true) => {
    const filter = publishedOnly ? '&& isPublished == true' : '';
    return sanityClient.fetch(`*[_type == "post" ${filter}] | order(publishedAt desc){
      title,
      "slug": slug.current,
      excerpt,
      author,
      category,
      publishedAt,
      "published": isPublished,
      featured,
      "featuredImage": mainImage.asset->url,
      seo
    }`);
  },

  getPostBySlug: async (slug: string) => {
    return sanityClient.fetch(`*[_type == "post" && slug.current == $slug][0]{
      ...,
      "slug": slug.current,
      "featuredImage": mainImage.asset->url
    }`, { slug });
  },

  // Landing pages
  getLandingPage: async (slug: string) => {
    return sanityClient.fetch(`*[_type == "landingPage" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      visible,
      seo,
      hero{
        title,
        subtitle,
        "image": image.asset->url
      },
      sections[]{
        _key,
        type,
        title,
        subtitle,
        titleLine1,
        titleLine2,
        description,
        link,
        layout,
        content,
        "image": image.asset->url,
        "mainImage": mainImage.asset->url,
        "images": images[].asset->url,
        features[]{
          title,
          description,
          icon
        }
      },
      cta
    }`, { slug });
  },

  // Todas las landing pages (para el context)
  getAllLandingPages: async () => {
    return sanityClient.fetch(`*[_type == "landingPage" && visible == true]{
      title,
      "slug": slug.current,
      visible,
      "heroImage": hero.image.asset->url
    }`);
  },

  // Cursos, Workshops y Privados
  getCourses: async (publishedOnly = true) => {
    const filter = publishedOnly ? '&& visible == true' : '';
    return sanityClient.fetch(`*[_type == "course" ${filter}]{
      "id": _id,
      "slug": slug.current,
      title,
      type,
      visible,
      price,
      duration,
      shortDescription,
      description,
      includes,
      showInHome,
      showInHomeWorkshops,
      "heroImage": heroImage.asset->url,
      "titleImage": titleImage.asset->url,
      "images": images[].asset->url,
      seo
    }`);
  },

  // Tarjetas de Regalo
  getGiftCards: async (publishedOnly = true) => {
    const filter = publishedOnly ? '&& visible == true' : '';
    return sanityClient.fetch(`*[_type == "giftCard" ${filter}]{
      "id": _id,
      "slug": slug.current,
      title,
      price,
      visible,
      "images": images[].asset->url,
      description,
      seo
    }`);
  }
};
