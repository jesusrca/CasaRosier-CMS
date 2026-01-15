import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { contentAPI, blogAPI, menuAPI, settingsAPI, pagesAPI } from '../utils/api';
import { LoadingScreen } from '../components/LoadingScreen';
import { sanityFetchers } from '../utils/sanity/fetchers';

interface ContentItem {
  id: string;
  type: 'class' | 'workshop' | 'private' | 'gift-card';
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  duration?: string;
  includes?: string[];
  images?: any[];
  schedule?: any;
  content?: any;
  visible: boolean;
  seo?: any;
  heroImage?: string;
  titleImage?: string;
  showInHome?: boolean;
  showInHomeWorkshops?: boolean;
  excerpt?: string;
}

interface BlogPost {
  slug: string;
  title: string;
  content: any;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  published: boolean;
  featured?: boolean;
  seo?: any;
}

interface MenuItem {
  name: string;
  path?: string;
  submenu?: {
    name: string;
    path: string;
    order?: number;
  }[];
  order?: number;
}

interface Page {
  id?: string;
  slug: string;
  title: string;
  content: any;
  visible: boolean;
  seo?: any;
  heroImage?: string;
  sections?: any[];
}

interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactEmail2?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  heroImageDesktop?: any;
  heroImageMobile?: any;
  heroTextImage1?: any;
  heroTextImage2?: any;
  blogHeroImage?: string;
  blogTitleImage?: string;
  homeCoursesDescription?: string;
  homeWorkshopsDescription?: string;
  instagramTitle?: string;
  instagramHandle?: string;
  instagramLink?: string;
  instagramImages?: Array<{
    url: string;
    title?: string;
    description?: string;
    date?: string;
  }>;
  instagram?: {
    title?: string;
    handle?: string;
    link?: string;
    images?: Array<{
      url: string;
      title?: string;
      description?: string;
      date?: string;
    }>;
  };
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogImage?: string;
    ogUrl?: string;
    ogType?: string;
    googleAnalyticsId?: string;
  };
  // Fallback compatibility with Supabase structure
  siteLogo?: any;
  siteLogoDark?: any;
  siteLogoLight?: any;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  googleAnalyticsId?: string;
}

interface ContentContextType {
  // Data
  classes: ContentItem[];
  workshops: ContentItem[];
  privates: ContentItem[];
  giftCards: ContentItem[];
  blogPosts: BlogPost[];
  menuItems: MenuItem[];
  pages: Page[];
  settings: SiteSettings;

  // State
  loading: boolean;
  error: string | null;

  // Methods
  getClassBySlug: (slug: string) => ContentItem | undefined;
  getWorkshopBySlug: (slug: string) => ContentItem | undefined;
  getPrivateBySlug: (slug: string) => ContentItem | undefined;
  getGiftCardBySlug: (slug: string) => ContentItem | undefined;
  getBlogPostBySlug: (slug: string) => BlogPost | undefined;
  getPageBySlug: (slug: string) => Page | undefined;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ContentItem[]>([]);
  const [workshops, setWorkshops] = useState<ContentItem[]>([]);
  const [privates, setPrivates] = useState<ContentItem[]>([]);
  const [giftCards, setGiftCards] = useState<ContentItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllContent = async () => {
    try {
      setError(null);

      console.log('🔄 Iniciando carga de contenido...');

      // Timeout de seguridad de 15 segundos (aumentado desde 10)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout loading content')), 15000);
      });

      // Cargar todo en paralelo para máxima velocidad
      const loadPromise = Promise.all([
        contentAPI.getAllItems().catch((err) => {
          console.warn('⚠️ Error loading content items:', err);
          return { items: [] };
        }),
        blogAPI.getPosts(true).catch((err) => {
          console.warn('⚠️ Error loading blog posts:', err);
          return { posts: [] };
        }),
        menuAPI.getMenu().catch((err) => {
          console.warn('⚠️ Error loading menu:', err);
          return { menu: { items: [] } };
        }),
        settingsAPI.getSettings().catch((err) => {
          console.warn('⚠️ Error loading settings:', err);
          return {
            settings: {
              siteName: 'Casa Rosier',
              siteDescription: 'Taller de cerámica en Barcelona',
              seoTitle: 'Casa Rosier - Taller de Cerámica en Barcelona',
              seoDescription: 'Descubre la cerámica en Casa Rosier. Clases, workshops y espacios para eventos en Barcelona.',
              seoKeywords: 'cerámica, Barcelona, taller, clases, workshops, torno',
              ogImage: '',
              contactEmail: 'info@casarosierceramica.com',
              contactPhone: '+34 633788860',
            }
          };
        }),
        pagesAPI.getAllPages().catch((err) => {
          console.warn('⚠️ Error loading pages:', err);
          return { pages: [] };
        }),
        // Sanity Data
        sanityFetchers.getSettings().catch(() => null),
        sanityFetchers.getMenu().catch(() => null),
        sanityFetchers.getPosts(true).catch(() => []),
        sanityFetchers.getAllLandingPages().catch(() => []),
        sanityFetchers.getCourses().catch(() => []),
        sanityFetchers.getGiftCards().catch(() => []),
      ]);

      const [
        contentResponse,
        blogResponse,
        menuResponse,
        settingsResponse,
        pagesResponse,
        sanitySettings,
        sanityMenu,
        sanityPosts,
        sanityLps,
        sanityCourses,
        sanityGiftCards
      ] = await Promise.race([loadPromise, timeoutPromise]) as any;

      // Unificar Items de Contenido (Clases, Workshops, Privados, GiftCards)
      // Priorizar Sanity pero mantener Supabase si no hay datos en Sanity para un tipo específico
      let allItems = [...(contentResponse.items || [])];

      if (sanityCourses && sanityCourses.length > 0) {
        // Reemplazar o añadir items de Sanity
        sanityCourses.forEach((sc: any) => {
          const index = allItems.findIndex(i => i.slug === sc.slug);
          if (index !== -1) {
            allItems[index] = { ...allItems[index], ...sc };
          } else {
            allItems.push(sc);
          }
        });
      }

      if (sanityGiftCards && sanityGiftCards.length > 0) {
        sanityGiftCards.forEach((sgc: any) => {
          const index = allItems.findIndex(i => i.slug === sgc.slug);
          if (index !== -1) {
            allItems[index] = { ...allItems[index], ...sgc, type: 'gift-card' };
          } else {
            allItems.push({ ...sgc, type: 'gift-card' });
          }
        });
      }

      const visibleClasses = allItems.filter((item: ContentItem) => item.type === 'class' && item.visible);
      const visibleWorkshops = allItems.filter((item: ContentItem) => item.type === 'workshop' && item.visible);
      const visiblePrivates = allItems.filter((item: ContentItem) => item.type === 'private' && item.visible);
      const visibleGiftCards = allItems.filter((item: ContentItem) => item.type === 'gift-card' && item.visible);

      setClasses(visibleClasses);
      setWorkshops(visibleWorkshops);
      setPrivates(visiblePrivates);
      setGiftCards(visibleGiftCards);

      // Guardar el resto del contenido - Priorizar Sanity si existe
      setBlogPosts(sanityPosts && sanityPosts.length > 0 ? sanityPosts : (blogResponse.posts || []));
      setMenuItems(sanityMenu?.items || menuResponse.menu?.items || []);

      const allPages = [...(pagesResponse.pages || []).filter((page: Page) => page.visible)];
      // Mezclar landing pages de Sanity (evitando duplicados por slug si es necesario)
      if (sanityLps && sanityLps.length > 0) {
        sanityLps.forEach((slp: any) => {
          if (!allPages.find(p => p.slug === slp.slug)) {
            allPages.push(slp);
          }
        });
      }
      setPages(allPages);

      setSettings(sanitySettings || settingsResponse.settings || {});

      console.log('✅ Contenido cargado en memoria:', {
        clases: visibleClasses.length,
        workshops: visibleWorkshops.length,
        privados: visiblePrivates.length,
        giftCards: visibleGiftCards.length,
        posts: (blogResponse.posts || []).length,
        páginas: (pagesResponse.pages || []).filter((page: Page) => page.visible).length,
        menuItems: (menuResponse.menu?.items || []).length
      });
    } catch (err) {
      console.error('❌ Error cargando contenido:', err);

      // Proporcionar datos por defecto para que la app no falle
      setMenuItems([
        { name: 'Inicio', path: '/', order: 0 },
        { name: 'Clases', path: '/clases', order: 1 },
        { name: 'Workshops', path: '/workshops', order: 2 },
        { name: 'Blog', path: '/blog', order: 3 }
      ]);

      setSettings({
        siteName: 'Casa Rosier',
        siteDescription: 'Taller de cerámica en Barcelona',
        contactEmail: 'info@casarosierceramica.com',
        contactPhone: '+34 633788860',
      });

      // No mostrar error al usuario - el contenido público debería funcionar sin auth
      // setError('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar TODO el contenido una sola vez al montar
    loadAllContent();

    // Log del navegador para debugging de Android
    console.log('🌐 User Agent:', navigator.userAgent);
    console.log('🔌 Connection:', (navigator as any).connection?.effectiveType || 'unknown');
  }, []);

  // Métodos de búsqueda rápida
  const getClassBySlug = (slug: string) => {
    return classes.find(c => c.slug === slug);
  };

  const getWorkshopBySlug = (slug: string) => {
    return workshops.find(w => w.slug === slug);
  };

  const getPrivateBySlug = (slug: string) => {
    return privates.find(p => p.slug === slug);
  };

  const getGiftCardBySlug = (slug: string) => {
    return giftCards.find(p => p.slug === slug);
  };

  const getBlogPostBySlug = (slug: string) => {
    return blogPosts.find(p => p.slug === slug);
  };

  const getPageBySlug = (slug: string) => {
    return pages.find(p => p.slug === slug);
  };

  const refreshContent = async () => {
    setLoading(true);
    await loadAllContent();
  };

  // Mostrar loading mientras se carga el contenido inicial
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ContentContext.Provider
      value={{
        classes,
        workshops,
        privates,
        giftCards,
        blogPosts,
        menuItems,
        pages,
        settings,
        loading,
        error,
        getClassBySlug,
        getWorkshopBySlug,
        getPrivateBySlug,
        getGiftCardBySlug,
        getBlogPostBySlug,
        getPageBySlug,
        refreshContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}