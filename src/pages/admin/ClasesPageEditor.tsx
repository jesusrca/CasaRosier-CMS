import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { settingsAPI } from '../../utils/api';
import { Save, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { ImageUploader } from '../../components/ImageUploader';
import { NavigationBlocker } from '../../components/NavigationBlocker';
import { Link } from 'react-router-dom';

export function ClasesPageEditor() {
  const [settings, setSettings] = useState<any>({});
  const [initialSettingsSnapshot, setInitialSettingsSnapshot] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Detectar cambios no guardados
  useEffect(() => {
    const currentSnapshot = JSON.stringify(settings);
    if (initialSettingsSnapshot && currentSnapshot !== initialSettingsSnapshot) {
      setHasUnsavedChanges(true);
    } else if (initialSettingsSnapshot) {
      setHasUnsavedChanges(false);
    }
  }, [settings, initialSettingsSnapshot]);

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
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      setSettings(response.settings);
      setInitialSettingsSnapshot(JSON.stringify(response.settings));
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Error al cargar la configuración' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      await settingsAPI.saveSettings(settings);
      setMessage({ type: 'success', text: '✅ Configuración guardada correctamente' });
      setInitialSettingsSnapshot(JSON.stringify(settings));
      setHasUnsavedChanges(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: '❌ Error al guardar la configuración' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <NavigationBlocker when={hasUnsavedChanges} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">Editor de Página: Clases</h1>
          <p className="text-foreground/60">
            Personaliza el contenido y diseño de la página /clases
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/clases"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 border border-primary rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            Vista previa
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Indicador de cambios sin guardar */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Tienes cambios sin guardar. No olvides hacer clic en "Guardar Cambios" antes de salir.
          </p>
        </motion.div>
      )}

      {/* Mensaje de estado */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 rounded-lg p-4 flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {message.text}
          </p>
        </motion.div>
      )}

      {/* Secciones editables */}
      <div className="space-y-6">
        {/* Hero - Imagen de fondo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl mb-4">Imagen Hero de Fondo</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Imagen de fondo que se mostrará en la cabecera de la página de Clases
          </p>
          
          <div className="space-y-4">
            <ImageUploader
              currentImage={typeof settings.clasesHeroBackground === 'string' ? settings.clasesHeroBackground : settings.clasesHeroBackground?.url || ''}
              onImageSelect={(data) => {
                if (typeof data === 'string') {
                  updateField('clasesHeroBackground', { url: data, alt: '', description: '' });
                } else {
                  updateField('clasesHeroBackground', data);
                }
              }}
              label="Imagen de Fondo del Hero"
              withMetadata={true}
              initialAlt={typeof settings.clasesHeroBackground === 'object' ? settings.clasesHeroBackground?.alt || '' : ''}
              initialDescription={typeof settings.clasesHeroBackground === 'object' ? settings.clasesHeroBackground?.description || '' : ''}
            />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>💡 Recomendación:</strong> Usa una imagen horizontal de alta calidad (mínimo 1920x1080px) que represente el ambiente de tus clases de cerámica.
            </div>
          </div>
        </div>

        {/* Hero - Imagen de título */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl mb-4">Imagen de Título del Hero</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Imagen de título que se mostrará en la cabecera de la página de Clases (reemplaza el texto)
          </p>
          
          <div className="space-y-4">
            <ImageUploader
              currentImage={typeof settings.clasesHeroTitleImage === 'string' ? settings.clasesHeroTitleImage : settings.clasesHeroTitleImage?.url || ''}
              onImageSelect={(data) => {
                if (typeof data === 'string') {
                  updateField('clasesHeroTitleImage', { url: data, alt: '', description: '' });
                } else {
                  updateField('clasesHeroTitleImage', data);
                }
              }}
              label="Imagen de Título del Hero (opcional - PNG transparente)"
              withMetadata={true}
              initialAlt={typeof settings.clasesHeroTitleImage === 'object' ? settings.clasesHeroTitleImage?.alt || '' : ''}
              initialDescription={typeof settings.clasesHeroTitleImage === 'object' ? settings.clasesHeroTitleImage?.description || '' : ''}
            />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>💡 Imagen de Título:</strong> Si subes una imagen (PNG transparente recomendado), esta reemplazará el texto "Clases" en el hero. Si no se sube, se mostrará el texto normal.
            </div>
          </div>
        </div>

        {/* Texto del Hero */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl mb-4">Textos del Hero</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Texto principal y subtítulo que aparecen en la cabecera (solo se usan si no hay imagen de título)
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Título Principal</label>
              <input
                type="text"
                value={settings.clasesHeroTitle || 'Clases'}
                onChange={(e) => updateField('clasesHeroTitle', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Clases de Cerámica"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Subtítulo</label>
              <input
                type="text"
                value={settings.clasesHeroSubtitle || ''}
                onChange={(e) => updateField('clasesHeroSubtitle', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Aprende cerámica con nosotros"
              />
            </div>
          </div>
        </div>

        {/* SEO de la página */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl mb-4">SEO - Página Clases</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Optimización para motores de búsqueda específica de la página de Clases
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Meta Título</label>
              <input
                type="text"
                value={settings.clasesSeoTitle || ''}
                onChange={(e) => updateField('clasesSeoTitle', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Clases de Cerámica en Barcelona - Casa Rosier"
                maxLength={60}
              />
              <p className="text-xs text-foreground/50 mt-1">
                {(settings.clasesSeoTitle || '').length}/60 caracteres (óptimo: 50-60)
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">Meta Descripción</label>
              <textarea
                value={settings.clasesSeoDescription || ''}
                onChange={(e) => updateField('clasesSeoDescription', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Ej: Descubre nuestras clases de cerámica en Barcelona. Aprende técnicas de modelado, torno y más en un ambiente creativo y acogedor."
                maxLength={160}
              />
              <p className="text-xs text-foreground/50 mt-1">
                {(settings.clasesSeoDescription || '').length}/160 caracteres (óptimo: 120-160)
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">Palabras Clave (separadas por comas)</label>
              <input
                type="text"
                value={settings.clasesSeoKeywords || ''}
                onChange={(e) => updateField('clasesSeoKeywords', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: clases cerámica, taller cerámica Barcelona, curso cerámica, modelado, torno"
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
              <strong>✅ Buenas prácticas SEO:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Título: Incluye palabras clave y el nombre de tu marca</li>
                <li>Descripción: Resume el contenido de forma atractiva y natural</li>
                <li>Keywords: Usa términos que tus clientes buscarían</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de guardar fijo en mobile */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      )}
    </div>
  );
}