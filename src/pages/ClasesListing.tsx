import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useContent } from '../contexts/ContentContext';
import { Hero } from '../components/Hero';
import { SEO } from '../components/SEO';
import { Calendar, Clock, ArrowRight, SortAsc, SortDesc, Users } from 'lucide-react';

type SortOrder = 'newest' | 'oldest';

export function ClasesListing() {
  const { classes, workshops, privates, loading, settings } = useContent();
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Combinar solo clases y workshops (excluir privates)
  const allItems = [...classes, ...workshops];

  // Debug: Ver qué datos están llegando
  console.log('📊 ClasesListing - Datos cargados:', {
    classes: classes.length,
    workshops: workshops.length,
    privates: privates.length,
    allItems: allItems.length,
    sampleItem: allItems[0]
  });

  // Ordenar según el criterio seleccionado
  const sortedItems = [...allItems].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Extraer la imagen del título desde settings
  const titleImageUrl = typeof settings.clasesHeroTitleImage === 'string' 
    ? settings.clasesHeroTitleImage 
    : settings.clasesHeroTitleImage?.url || '';

  // Extraer la imagen de fondo del hero
  const heroBackgroundUrl = typeof settings.clasesHeroBackground === 'string'
    ? settings.clasesHeroBackground
    : settings.clasesHeroBackground?.url || 'https://images.unsplash.com/photo-1660958639203-cbc9bb56955b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwdmFzZSUyMG1pbmltYWx8ZW58MXx8fHwxNzY1MTQ4MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080';

  // Extraer textos del hero
  const heroTitle = settings.clasesHeroTitle || 'Clases';
  const heroSubtitle = settings.clasesHeroSubtitle || 'Aprende cerámica con nosotros';

  // Extraer SEO settings
  const seoTitle = settings.clasesSeoTitle || 'Clases de Cerámica - Casa Rosier';
  const seoDescription = settings.clasesSeoDescription || 'Descubre nuestras clases de cerámica en Barcelona. Aprende técnicas de modelado, torno y más.';
  const seoKeywords = settings.clasesSeoKeywords || 'clases cerámica, taller cerámica Barcelona, curso cerámica, modelado, torno';

  // Función para obtener el label del tipo
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'class':
        return 'Clase';
      case 'workshop':
        return 'Workshop';
      case 'private':
        return 'Clase Privada';
      default:
        return 'Clase';
    }
  };

  // Función para obtener el color del tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-primary text-white';
      case 'workshop':
        return 'bg-secondary text-white';
      case 'private':
        return 'bg-foreground text-background';
      default:
        return 'bg-primary text-white';
    }
  };

  // Función para extraer texto de campos que pueden ser objetos o strings
  const getDisplayText = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
      // Si tiene description, usarla
      if (field.description) return field.description;
      // Si es un objeto con slots, mostrar el número de slots
      if (field.slots && Array.isArray(field.slots)) {
        return `${field.slots.length} sesiones`;
      }
      // Si tiene enabled, mostrar estado
      if (typeof field.enabled === 'boolean') {
        return field.enabled ? 'Disponible' : 'No disponible';
      }
    }
    return '';
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
      />

      <Hero
        backgroundImage={heroBackgroundUrl}
        title={heroTitle}
        subtitle={heroSubtitle}
        useTextTitle={!titleImageUrl}
        titleImage={titleImageUrl}
      />

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controles de ordenamiento */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-left">Nuestras Clases</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/60">Ordenar:</span>
              <button
                onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors text-sm"
              >
                {sortOrder === 'newest' ? (
                  <>
                    <SortDesc className="w-4 h-4" />
                    Más recientes
                  </>
                ) : (
                  <>
                    <SortAsc className="w-4 h-4" />
                    Más antiguos
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grid de clases */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-foreground/60">Cargando clases...</p>
              </div>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground/60 text-lg">
                No hay clases disponibles en este momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedItems.map((item, index) => {
                // Extraer la primera imagen del carrusel (puede ser string o objeto)
                const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
                const imageUrl = typeof firstImage === 'string' 
                  ? firstImage 
                  : firstImage?.url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwY2xhc3N8ZW58MXx8fHwxNzY1MTQ4MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080';
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/${item.type === 'class' ? 'clases' : item.type === 'workshop' ? 'workshops' : 'privada'}/${item.slug}`}
                      className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
                    >
                      {/* Imagen */}
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Badge de tipo */}
                        <div className="absolute top-4 right-4">
                          <span className={`${getTypeColor(item.type)} px-3 py-1 rounded-full text-xs shadow-lg`}>
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-foreground/70 text-sm line-clamp-2">
                          {item.excerpt}
                        </p>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                          {item.duration && getDisplayText(item.duration) && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{getDisplayText(item.duration)}</span>
                            </div>
                          )}
                          {item.schedule && getDisplayText(item.schedule) && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{getDisplayText(item.schedule)}</span>
                            </div>
                          )}
                          {item.capacity && getDisplayText(item.capacity) && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{getDisplayText(item.capacity)}</span>
                            </div>
                          )}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-primary pt-2">
                          <span className="text-sm">Más información</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}