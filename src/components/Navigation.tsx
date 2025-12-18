import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Plus } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { Logo } from './Logo';

interface NavigationProps {
  isDark?: boolean;
}

interface SubMenuItem {
  name: string;
  path: string;
  order?: number;
}

interface MenuItem {
  name: string;
  path?: string;
  submenu?: SubMenuItem[];
  order?: number;
}

export function Navigation({ isDark = false }: NavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<string | null>(null);
  const { menuItems } = useContent();

  const toggleMobileSubmenu = (itemName: string) => {
    setMobileOpenSubmenu(mobileOpenSubmenu === itemName ? null : itemName);
  };

  // Dynamic color classes based on background
  const textColor = isDark ? 'text-white/90 hover:text-white' : 'text-foreground/90 hover:text-foreground';
  const separatorColor = isDark ? 'text-white/40' : 'text-foreground/40';
  const mobileTextColor = isDark ? 'text-white hover:text-white/80' : 'text-foreground hover:text-foreground/80';
  const mobileSubmenuTextColor = isDark ? 'text-white/90 hover:text-white' : 'text-foreground/90 hover:text-foreground';
  const mobileBgColor = isDark ? 'bg-black/40' : 'bg-white/40';
  const mobileBorderColor = isDark ? 'border-white/10' : 'border-foreground/10';
  const mobileSubmenuBgColor = isDark ? 'bg-white/10' : 'bg-foreground/10';

  return (
    <>
      {/* Header with Logo and Menu */}
      <div className="relative z-20 pt-4 sm:pt-6 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo y Menú en una sola línea */}
          <div className="flex justify-between items-center">
            {/* Logo a la izquierda */}
            <Link to="/" className="flex-shrink-0">
              <Logo 
                className="h-10 sm:h-12 lg:h-14 w-auto"
                isDark={isDark}
              />
            </Link>

            {/* Desktop Navigation Menu a la derecha */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center relative"
                  onMouseEnter={() => item.submenu && setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`${textColor} px-3 lg:px-4 transition-colors duration-200 text-sm whitespace-nowrap`}
                    >
                      {item.name}
                      {item.submenu && <span className="ml-1">+</span>}
                    </Link>
                  ) : (
                    <button
                      className={`${textColor} px-3 lg:px-4 transition-colors duration-200 text-sm whitespace-nowrap`}
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
                          className="absolute top-full left-0 mt-2 bg-white rounded-lg overflow-hidden min-w-[220px] z-50"
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.path}
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

                  {index < menuItems.length - 1 && (
                    <span className={`${separatorColor} text-sm hidden lg:inline ml-1`}>|</span>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 ${mobileTextColor} transition-colors`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden relative z-20 overflow-hidden ${mobileBgColor} backdrop-blur-md border-t ${mobileBorderColor}`}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      onClick={() => !item.submenu && setIsMenuOpen(false)}
                      className={`flex items-center justify-between ${mobileTextColor} py-2 transition-colors`}
                    >
                      <span>{item.name}</span>
                      {item.submenu && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleMobileSubmenu(item.name);
                          }}
                          className="p-2"
                        >
                          <Plus
                            className={`w-5 h-5 transition-transform duration-200 ${
                              mobileOpenSubmenu === item.name ? 'rotate-45' : ''
                            }`}
                          />
                        </button>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => item.submenu && toggleMobileSubmenu(item.name)}
                      className={`flex items-center justify-between w-full ${mobileTextColor} py-2 transition-colors`}
                    >
                      <span>{item.name}</span>
                      {item.submenu && (
                        <Plus
                          className={`w-5 h-5 transition-transform duration-200 ${
                            mobileOpenSubmenu === item.name ? 'rotate-45' : ''
                          }`}
                        />
                      )}
                    </button>
                  )}

                  {/* Mobile Submenu */}
                  <AnimatePresence>
                    {item.submenu && mobileOpenSubmenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`ml-4 mt-2 space-y-2 pl-4 border-l-2 ${mobileBorderColor} overflow-hidden`}
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block ${mobileSubmenuTextColor} py-2 transition-colors`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}