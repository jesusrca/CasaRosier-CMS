import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Instagram, Mail, Phone, Facebook } from 'lucide-react';
import { settingsAPI, messagesAPI } from '../utils/api';
import { landingPagesAPI } from '../utils/landingPagesApi';
import { InstagramCarousel } from './InstagramCarousel';
import { Logo } from './Logo';

export function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successTimeoutId, setSuccessTimeoutId] = useState<number | null>(null);
  const [settings, setSettings] = useState<any>({});
  const [landingPages, setLandingPages] = useState<any[]>([]);

  useEffect(() => {
    loadSettings();
    loadLandingPages();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      setSettings(response.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadLandingPages = async () => {
    try {
      const response = await landingPagesAPI.getPublishedLandingPages();
      console.log('📍 Footer - Landing pages received:', response);
      console.log('📍 Footer - Landing pages array:', response.landingPages);
      setLandingPages(response.landingPages || []);
    } catch (error) {
      // Silently fail if error occurs
      console.error('Error loading landing pages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Limpiar estados y timeout anterior
    setError('');
    setSuccess(false);
    if (successTimeoutId) {
      clearTimeout(successTimeoutId);
      setSuccessTimeoutId(null);
    }
    
    setSending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const messageData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      };

      await messagesAPI.sendMessage(messageData);
      
      setSuccess(true);
      setError('');
      e.currentTarget.reset();
      
      // Ocultar mensaje de éxito después de 5 segundos
      const timeoutId = window.setTimeout(() => {
        setSuccess(false);
        setSuccessTimeoutId(null);
      }, 5000);
      setSuccessTimeoutId(timeoutId);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error sending message:', err);
      }
      setSuccess(false);
      setError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  // Don't render footer in admin routes
  if (isAdminRoute) {
    return null;
  }

  return (
    <footer className="bg-white">
      {/* Instagram Carousel */}
      <InstagramCarousel
        title={settings.instagramTitle}
        instagramHandle={settings.instagramHandle}
        instagramLink={settings.instagramLink}
        images={settings.instagramImages}
      />

      {/* Contact Section */}
      <div className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div>
            <h3 className="text-xl mb-6">Llámanos o escríbenos al</h3>
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
              >
                ¡Mensaje enviado correctamente! Te responderemos pronto.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="+34 633788860"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Nombre de asunto"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <textarea
                name="message"
                placeholder="Comentario"
                required
                rows={4}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              />
              <motion.button
                type="submit"
                disabled={sending}
                className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: sending ? 1 : 1.02 }}
                whileTap={{ scale: sending ? 1 : 0.98 }}
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </motion.button>
            </form>
          </div>

          {/* Info and Social */}
          <div className="space-y-8">
            <div className="flex justify-center lg:justify-start">
              <Logo className="h-20 w-auto" asLink={true} />
            </div>
            
            <div>
              <h4 className="mb-4">Visítanos:</h4>
              <a 
                href="https://maps.app.goo.gl/XMba2UZrDb7RjTVh6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer inline-block"
              >
                C/ Villarroel 206 - El Eixample - Barcelona 08036, España
              </a>
            </div>

            <div>
              <h4 className="mb-4">Síguenos en nuestras redes:</h4>
              <div className="flex space-x-4">
                <motion.a
                  href="https://www.instagram.com/casarosier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a
                  href="https://www.facebook.com/casarosier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </motion.a>
              </div>
            </div>

            <div className="pt-6 border-t border-foreground/10">
              {/* Landing Pages y Administración en la misma línea */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/admin/login"
                  className="text-xs text-foreground/40 hover:text-primary transition-colors"
                >
                  Administración
                </Link>
                
                {landingPages.length > 0 && landingPages.map((page, index) => (
                  <>
                    <span key={`sep-${page.id}`} className="text-xs text-foreground/20">·</span>
                    <Link
                      key={page.id}
                      to={`/${page.slug}`}
                      className="text-xs text-foreground/40 hover:text-primary transition-colors"
                    >
                      {page.title}
                    </Link>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}