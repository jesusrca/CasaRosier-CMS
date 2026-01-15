import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  redirects?: any[];
  // Fallback compatibility
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
      console.log('🔄 Iniciando carga de contenido desde Sanity...');

      // Timeout de seguridad
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout loading content')), 15000);
      });

      // Cargar todo en paralelo usando solo Sanity
      const loadPromise = Promise.all([
        sanityFetchers.getSettings().catch(() => null),
        sanityFetchers.getMenu().catch(() => null),
        sanityFetchers.getPosts(true).catch(() => []),
        sanityFetchers.getAllLandingPages().catch(() => []),
        sanityFetchers.getCourses().catch(() => []),
        sanityFetchers.getGiftCards().catch(() => []),
      ]);

      const [
        sanitySettings,
        sanityMenu,
        sanityPosts,
        sanityLps,
        sanityCourses,
        sanityGiftCards
      ] = await Promise.race([loadPromise, timeoutPromise]) as any;

      // Procesar Cursos y Workshops
      const allItems: ContentItem[] = [];

      if (sanityCourses && sanityCourses.length > 0) {
        allItems.push(...sanityCourses);
      }

      if (sanityGiftCards && sanityGiftCards.length > 0) {
        // Asegurar tipo gift-card
        const formattedGiftCards = sanityGiftCards.map((gc: any) => ({ ...gc, type: 'gift-card' }));
        allItems.push(...formattedGiftCards);
      }

      // Filtrar por visibilidad y tipo
      const visibleClasses = allItems.filter(item => item.type === 'class' && item.visible);
      const visibleWorkshops = allItems.filter(item => item.type === 'workshop' && item.visible);
      const visiblePrivates = allItems.filter(item => item.type === 'private' && item.visible);
      const visibleGiftCards = allItems.filter(item => item.type === 'gift-card' && item.visible);

      setClasses(visibleClasses);
      setWorkshops(visibleWorkshops);
      setPrivates(visiblePrivates);
      setGiftCards(visibleGiftCards);

      // Blog y Menú
      setBlogPosts(sanityPosts || []);
      setMenuItems(sanityMenu?.items || []);

      // Páginas
      setPages(sanityLps || []);

      // Settings
      setSettings(sanitySettings || {});

      console.log('✅ Contenido Sanity cargado:', {
        clases: visibleClasses.length,
        workshops: visibleWorkshops.length,
        privados: visiblePrivates.length,
        giftCards: visibleGiftCards.length,
        posts: (sanityPosts || []).length,
        páginas: (sanityLps || []).length,
        menuItems: (sanityMenu?.items || []).length
      });

    } catch (err) {
      console.error('❌ Error cargando contenido Sanity:', err);

      // Datos mínimos en caso de error crítico
      setSettings({
        siteName: 'Casa Rosier',
        contactEmail: 'info@casarosierceramica.com',
      });
      // No seteamos menuItems por defecto para no ocultar el error visualmente, 
      // o podríamos dejar un menú básico si se prefiere.
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