import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useContent } from '../contexts/ContentContext';
import { SEOHead } from '../components/SEOHead';
import { generateBlogPostStructuredData } from '../components/SEO';
import { Navigation } from '../components/Navigation';
import { LoadingScreen } from '../components/LoadingScreen';
import { Calendar, User, ArrowLeft, ChevronUp, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sanityFetchers } from '../utils/sanity/fetchers';
import { SanityContent } from '../components/SanityContent';

// Función para calcular tiempo estimado de lectura
function calculateReadingTime(content: any): number {
  if (!content) return 1;
  const wordsPerMinute = 200;

  if (typeof content === 'string') {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // Para Portable Text simple (estimación aproximada basada en caracteres)
  const text = JSON.stringify(content).replace(/[^\w\s]/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}


export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogPostBySlug, loading: contextLoading } = useContent();
  const [showNotFound, setShowNotFound] = useState(false);
  const [sanityPost, setSanityPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const post = await sanityFetchers.getPostBySlug(slug!);
        if (post) {
          setSanityPost(post);
        }
      } catch (err) {
        console.error('Error fetching post from Sanity:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  const contextPost = getBlogPostBySlug(slug || '');
  const post = sanityPost || contextPost;

  // Control del delay antes de mostrar 404
  useEffect(() => {
    if (!post && !loading && !contextLoading) {
      const timer = setTimeout(() => {
        setShowNotFound(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowNotFound(false);
    }
  }, [post, loading, contextLoading, slug]);

  if (loading || contextLoading || (!post && !showNotFound)) {
    return <LoadingScreen />;
  }

  if (!post && showNotFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl mb-4">Artículo no encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = generateBlogPostStructuredData({
    title: post.title,
    description: post.excerpt,
    author: post.author,
    publishedDate: post.publishedAt || post.publishedDate || post.createdAt,
    modifiedDate: post.updatedAt,
    image: post.featuredImage,
    url: window.location.href,
  });

  const readingTime = calculateReadingTime(post.body || post.content);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={post.seo?.metaTitle || `${post.title} | Casa Rosier Blog`}
        description={post.seo?.metaDescription || post.excerpt}
        keywords={post.seo?.keywords || 'blog, cerámica, Casa Rosier'}
        image={post.featuredImage}
        type="article"
        publishedTime={post.publishedAt || post.publishedDate || post.createdAt}
        modifiedTime={post.updatedAt}
        author={post.author}
        structuredData={structuredData}
      />

      <div className="relative min-h-[60vh] bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              {post.category && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <span className="text-sm uppercase tracking-wider text-foreground/60">{post.category}</span>
                </motion.div>
              )}
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-foreground text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                {post.title}
              </motion.h1>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex items-center justify-center gap-6 text-sm text-foreground/60">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{readingTime} min de lectura</span></div>
                <span>•</span>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{new Date(post.publishedAt || post.publishedDate || post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              </motion.div>
              {post.featuredImage && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-12 w-full">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-auto rounded-lg shadow-lg object-cover" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <article className="pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-12">
            <div className="prose prose-lg max-w-none">
              <SanityContent content={post.body || post.content} />
            </div>
            <div className="pt-12 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"><ArrowLeft className="w-4 h-4" />Ver más artículos</Link>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white/60 hover:bg-white/80 border border-border rounded-lg transition-colors shadow-sm">Volver arriba<ChevronUp className="w-4 h-4" /></button>
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  );
}