import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import heroBackgroundImage from "figma:asset/cf3b622b1e53dff197470df428faee1c6f268025.png";
import logoImage from "figma:asset/2dacc970a5a37325400c034e8aab058b32fcf649.png";
import heroTextImage from "figma:asset/00083d30bea445cb191f41f57aa132965c193e0d.png";

interface HeroHomeProps {
  image?: string;
  title?: string;
  subtitle?: string;
  textImage?: string;
}

export function HeroHome({ image, title, subtitle, textImage }: HeroHomeProps) {
  const { settings, menuItems: mainMenuItems } = useContent();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [heroImages, setHeroImages] = useState({
    desktop: '',
    mobile: ''
  });
  const [heroTextImages, setHeroTextImages] = useState<string[]>([]);
  const [currentTextImageIndex, setCurrentTextImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Detect screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update local state when settings from context change or props provided
  useEffect(() => {
    // If prop provided, use it
    if (image) {
      setHeroImages({
        desktop: image,
        mobile: image
      });
    } else if (settings) {
      // Fallback to settings for background
      const desktopImage = typeof settings.heroImageDesktop === 'string'
        ? settings.heroImageDesktop
        : settings.heroImageDesktop?.url || heroBackgroundImage;

      const mobileImage = typeof settings.heroImageMobile === 'string'
        ? settings.heroImageMobile
        : settings.heroImageMobile?.url || heroBackgroundImage;

      setHeroImages({
        desktop: desktopImage || heroBackgroundImage,
        mobile: mobileImage || heroBackgroundImage
      });
    }

    // Handle Text/Overlay Image
    if (textImage) {
      setHeroTextImages([textImage]);
    } else if (settings) {
      // Load hero text images from settings fallback
      const textImages: string[] = [];
      const img1 = typeof settings.heroTextImage1 === 'string'
        ? settings.heroTextImage1
        : settings.heroTextImage1?.url;
      const img2 = typeof settings.heroTextImage2 === 'string'
        ? settings.heroTextImage2
        : settings.heroTextImage2?.url;

      if (img1) textImages.push(img1);
      if (img2) textImages.push(img2);

      if (textImages.length > 0) {
        setHeroTextImages(textImages);
      } else {
        setHeroTextImages([heroTextImage]);
      }
    }

    setImagesLoaded(true);
  }, [settings, image, textImage]);

  // Auto-rotate text images if there are multiple
  useEffect(() => {
    if (heroTextImages.length <= 1) return;

    // Show second image after 2 seconds, then stop
    const timeout = setTimeout(() => {
      setCurrentTextImageIndex(1);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [heroTextImages.length]);

  const scrollToContent = () => {
    const nextSection = document.querySelector('#about-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageLoad = () => {
    console.log('📸 Image loaded:', isMobile ? 'MOBILE' : 'DESKTOP', isMobile ? heroImages.mobile : heroImages.desktop);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image - Renderiza solo la imagen correspondiente con eager loading */}
      {(heroImages.desktop || heroImages.mobile) && (
        <img
          src={isMobile ? heroImages.mobile : heroImages.desktop}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: imagesLoaded ? 1 : 0 }}
          key={isMobile ? 'mobile' : 'desktop'} // Force re-render when switching
          onLoad={handleImageLoad}
        />
      )}
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Header with Logo and Menu */}
      <div className="relative z-20 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-12 sm:mb-6 mt-8 sm:mt-0"
          >
            <Link to="/">
              <img
                src={settings?.siteLogoLight || settings?.siteLogo || logoImage}
                alt="Casa Rosier"
                loading="eager"
                className="h-16 sm:h-20 w-auto"
              />
            </Link>
          </motion.div>

          {/* Navigation Menu */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:flex items-center justify-center gap-1"
          >
            {mainMenuItems.map((item, index) => (
              <motion.div
                key={`home-${item.name}-${index}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
                className="flex items-center relative"
                onMouseEnter={() => item.submenu && setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    className="text-white/90 hover:text-white px-3 lg:px-4 py-2 transition-colors duration-200 text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    className="text-white/90 hover:text-white px-3 lg:px-4 py-2 transition-colors duration-200 text-sm whitespace-nowrap"
                  >
                    {item.name}
                    {item.submenu && <span className="ml-1">+</span>}
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.submenu && (
                  <AnimatePresence>
                    {hoveredItem === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden min-w-[220px] z-50"
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={`${subItem.path}-${subIndex}`}
                            to={subItem.path}
                            className="block px-5 py-3 text-secondary hover:bg-muted transition-colors duration-150 text-sm border-b border-border last:border-b-0"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {index < mainMenuItems.length - 1 && (
                  <span className="text-white/40 text-sm hidden lg:inline ml-1">|</span>
                )}
              </motion.div>
            ))}
          </motion.nav>
        </div>
      </div>

      {/* Center Content - Hero Text */}
      <div className="relative z-10 md:flex-1 md:flex md:items-center md:justify-center md:mt-[10vh] px-4 absolute md:relative top-[calc(40%-60px)] md:top-auto -translate-y-1/2 md:translate-y-0 left-0 right-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full max-w-3xl relative"
        >
          {/* Render all images */}
          {heroTextImages.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt="estudio Cerámica creativa en Barcelona"
              className={`w-full h-auto ${index === 0 ? 'relative' : 'absolute top-0 left-0'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentTextImageIndex >= index ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll Down Button */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full border-2 border-white/70 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ChevronDown className="text-white" size={24} />
        </motion.div>
      </motion.button>

      {/* Degradado blanco para transición al siguiente bloque */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#F3F2EF] z-20 pointer-events-none" />
    </section>
  );
}