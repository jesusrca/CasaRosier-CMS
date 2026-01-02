import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, AlertCircle, CheckCircle, Plus, Trash2, Copy, Eye, EyeOff, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { ImageUploader } from '../../components/ImageUploader';
import { NavigationBlocker } from '../../components/NavigationBlocker';
import { landingPagesAPI } from '../../utils/landingPagesApi';

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  sections: Section[];
  ctaText: string;
  ctaLink: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  type: 'text' | 'image-text' | 'gallery' | 'cta' | 'features';
  title: string;
  content: string;
  image?: string;
  images?: string[];
  features?: { title: string; description: string; icon?: string }[];
  layout?: 'left' | 'right';
}

export function LandingPageManager() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Detectar cambios no guardados
  useEffect(() => {
    if (selectedPage) {
      const currentSnapshot = JSON.stringify(selectedPage);
      if (initialSnapshot && currentSnapshot !== initialSnapshot) {
        setHasUnsavedChanges(true);
      } else if (initialSnapshot) {
        setHasUnsavedChanges(false);
      }
    }
  }, [selectedPage, initialSnapshot]);

  // Prevenir cierre de ventana con cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    loadLandingPages();
  }, []);

  const loadLandingPages = async () => {
    try {
      const data = await landingPagesAPI.getAllLandingPages();
      setLandingPages(data.landingPages || []);
    } catch (error) {
      console.error('Error loading landing pages:', error);
      setMessage({ type: 'error', text: 'Error al cargar las landing pages' });
    } finally {
      setLoading(false);
    }
  };

  const createNewLandingPage = () => {
    const newPage: LandingPage = {
      id: `lp_${Date.now()}`,
      title: 'Nueva Landing Page',
      slug: `nueva-landing-${Date.now()}`,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      heroImage: '',
      heroTitle: 'Título del Hero',
      heroSubtitle: 'Subtítulo del Hero',
      sections: [],
      ctaText: 'Reserva ahora',
      ctaLink: '/contacto',
      visible: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSelectedPage(newPage);
    setInitialSnapshot(JSON.stringify(newPage));
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  const duplicateLandingPage = (page: LandingPage) => {
    const duplicated: LandingPage = {
      ...page,
      id: `lp_${Date.now()}`,
      title: `${page.title} (Copia)`,
      slug: `${page.slug}-copia-${Date.now()}`,
      visible: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSelectedPage(duplicated);
    setInitialSnapshot(JSON.stringify(duplicated));
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  const editLandingPage = (page: LandingPage) => {
    setSelectedPage({ ...page });
    setInitialSnapshot(JSON.stringify(page));
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  const saveLandingPage = async () => {
    if (!selectedPage) return;

    setSaving(true);
    setMessage(null);

    try {
      await landingPagesAPI.saveLandingPage(selectedPage);

      setMessage({ type: 'success', text: '✅ Landing page guardada correctamente' });
      setHasUnsavedChanges(false);
      setInitialSnapshot(JSON.stringify(selectedPage));
      await loadLandingPages();
      
      // Auto-hide success message
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving landing page:', error);
      setMessage({ type: 'error', text: 'Error al guardar la landing page' });
    } finally {
      setSaving(false);
    }
  };

  const deleteLandingPage = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta landing page?')) return;

    try {
      await landingPagesAPI.deleteLandingPage(id);

      setMessage({ type: 'success', text: '✅ Landing page eliminada' });
      await loadLandingPages();
      
      if (selectedPage?.id === id) {
        setSelectedPage(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error deleting landing page:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la landing page' });
    }
  };

  const addSection = (type: Section['type']) => {
    if (!selectedPage) return;

    const newSection: Section = {
      id: `section_${Date.now()}`,
      type,
      title: '',
      content: '',
      layout: type === 'image-text' ? 'left' : undefined,
      features: type === 'features' ? [] : undefined,
      images: type === 'gallery' ? [] : undefined
    };

    setSelectedPage({
      ...selectedPage,
      sections: [...selectedPage.sections, newSection]
    });
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    if (!selectedPage) return;

    setSelectedPage({
      ...selectedPage,
      sections: selectedPage.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      )
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!selectedPage) return;

    setSelectedPage({
      ...selectedPage,
      sections: selectedPage.sections.filter(s => s.id !== sectionId)
    });
  };

  const moveSectionUp = (index: number) => {
    if (!selectedPage || index === 0) return;

    const newSections = [...selectedPage.sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];

    setSelectedPage({
      ...selectedPage,
      sections: newSections
    });
  };

  const moveSectionDown = (index: number) => {
    if (!selectedPage || index === selectedPage.sections.length - 1) return;

    const newSections = [...selectedPage.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];

    setSelectedPage({
      ...selectedPage,
      sections: newSections
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/60">Cargando landing pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NavigationBlocker when={hasUnsavedChanges} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Landing Pages</h2>
          <p className="text-sm text-foreground/60 mt-1">
            Crea y gestiona landing pages optimizadas para SEO
          </p>
        </div>
        <button
          onClick={createNewLandingPage}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Landing Page
        </button>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Landing Pages */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg mb-4">Todas las Landing Pages ({landingPages.length})</h3>
            
            {landingPages.length === 0 ? (
              <p className="text-sm text-foreground/60 text-center py-8">
                No hay landing pages creadas. Haz clic en "Nueva Landing Page" para comenzar.
              </p>
            ) : (
              <div className="space-y-2">
                {landingPages.map((page) => (
                  <div
                    key={page.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedPage?.id === page.id
                        ? 'border-primary bg-primary/5'
                        : 'border-foreground/10 hover:border-foreground/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0" onClick={() => editLandingPage(page)}>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm truncate">{page.title}</h4>
                          {page.visible ? (
                            <Eye className="w-3 h-3 text-green-600 flex-shrink-0" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-foreground/40 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-foreground/60 truncate">/{page.slug}</p>
                      </div>
                      
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateLandingPage(page);
                          }}
                          className="p-1 hover:bg-foreground/5 rounded"
                          title="Duplicar"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLandingPage(page.id);
                          }}
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {!isEditing || !selectedPage ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-foreground/60">
                Selecciona una landing page para editar o crea una nueva
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Save Button */}
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  {hasUnsavedChanges && (
                    <span className="text-sm text-orange-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Cambios sin guardar
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {selectedPage.visible && (
                    <a
                      href={`/${selectedPage.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver página
                    </a>
                  )}
                  <button
                    onClick={saveLandingPage}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>

              {/* Basic Settings */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg">Configuración General</h3>
                
                <div>
                  <label className="block text-sm mb-2">Título de la Landing Page</label>
                  <input
                    type="text"
                    value={selectedPage.title}
                    onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">URL (slug)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground/60">/</span>
                    <input
                      type="text"
                      value={selectedPage.slug}
                      onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="flex-1 px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="ejemplo-landing-page"
                    />
                  </div>
                  <p className="text-xs text-foreground/60 mt-1">
                    Solo letras minúsculas, números y guiones
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={selectedPage.visible}
                    onChange={(e) => setSelectedPage({ ...selectedPage, visible: e.target.checked })}
                    className="w-4 h-4 text-primary"
                  />
                  <label htmlFor="visible" className="text-sm">
                    Página visible (publicada)
                  </label>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg">SEO</h3>
                
                <div>
                  <label className="block text-sm mb-2">Meta Título</label>
                  <input
                    type="text"
                    value={selectedPage.metaTitle}
                    onChange={(e) => setSelectedPage({ ...selectedPage, metaTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Máximo 60 caracteres"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    {selectedPage.metaTitle.length}/60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-2">Meta Descripción</label>
                  <textarea
                    value={selectedPage.metaDescription}
                    onChange={(e) => setSelectedPage({ ...selectedPage, metaDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                    placeholder="Máximo 160 caracteres"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    {selectedPage.metaDescription.length}/160 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-2">Palabras Clave</label>
                  <input
                    type="text"
                    value={selectedPage.metaKeywords}
                    onChange={(e) => setSelectedPage({ ...selectedPage, metaKeywords: e.target.value })}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="palabra1, palabra2, palabra3"
                  />
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg">Sección Hero</h3>
                
                <ImageUploader
                  currentImage={selectedPage.heroImage}
                  onImageSelect={(url) => setSelectedPage({ ...selectedPage, heroImage: url })}
                  label="Imagen de Fondo del Hero"
                />

                <div>
                  <label className="block text-sm mb-2">Título del Hero</label>
                  <input
                    type="text"
                    value={selectedPage.heroTitle}
                    onChange={(e) => setSelectedPage({ ...selectedPage, heroTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Subtítulo del Hero</label>
                  <textarea
                    value={selectedPage.heroSubtitle}
                    onChange={(e) => setSelectedPage({ ...selectedPage, heroSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                </div>
              </div>

              {/* Sections */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg">Secciones de Contenido</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addSection('text')}
                      className="px-3 py-1 text-sm border border-foreground/20 rounded hover:bg-foreground/5"
                    >
                      + Texto
                    </button>
                    <button
                      onClick={() => addSection('image-text')}
                      className="px-3 py-1 text-sm border border-foreground/20 rounded hover:bg-foreground/5"
                    >
                      + Imagen+Texto
                    </button>
                    <button
                      onClick={() => addSection('features')}
                      className="px-3 py-1 text-sm border border-foreground/20 rounded hover:bg-foreground/5"
                    >
                      + Características
                    </button>
                  </div>
                </div>

                {selectedPage.sections.length === 0 ? (
                  <p className="text-sm text-foreground/60 text-center py-8">
                    No hay secciones. Agrega una sección usando los botones de arriba.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedPage.sections.map((section, index) => (
                      <div key={section.id} className="border border-foreground/20 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm px-2 py-1 bg-foreground/5 rounded">
                            {section.type === 'text' && 'Texto'}
                            {section.type === 'image-text' && 'Imagen + Texto'}
                            {section.type === 'features' && 'Características'}
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveSectionUp(index)}
                              disabled={index === 0}
                              className="p-1 hover:bg-foreground/5 rounded disabled:opacity-30"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveSectionDown(index)}
                              disabled={index === selectedPage.sections.length - 1}
                              className="p-1 hover:bg-foreground/5 rounded disabled:opacity-30"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSection(section.id)}
                              className="p-1 hover:bg-red-50 rounded text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm mb-2">Título de la Sección</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {section.type === 'image-text' && (
                          <>
                            <ImageUploader
                              currentImage={section.image || ''}
                              onImageSelect={(url) => updateSection(section.id, { image: url })}
                              label="Imagen"
                            />
                            
                            <div>
                              <label className="block text-sm mb-2">Disposición</label>
                              <select
                                value={section.layout || 'left'}
                                onChange={(e) => updateSection(section.id, { layout: e.target.value as 'left' | 'right' })}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="left">Imagen a la izquierda</option>
                                <option value="right">Imagen a la derecha</option>
                              </select>
                            </div>
                          </>
                        )}

                        <div>
                          <label className="block text-sm mb-2">Contenido</label>
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg">Call to Action</h3>
                
                <div>
                  <label className="block text-sm mb-2">Texto del Botón CTA</label>
                  <input
                    type="text"
                    value={selectedPage.ctaText}
                    onChange={(e) => setSelectedPage({ ...selectedPage, ctaText: e.target.value })}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Enlace del CTA</label>
                  <input
                    type="text"
                    value={selectedPage.ctaLink}
                    onChange={(e) => setSelectedPage({ ...selectedPage, ctaLink: e.target.value })}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="/contacto"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}