# Cache headers para Netlify/Vercel
# Esto mejorará significativamente el rendimiento al cachear recursos estáticos

# Assets estáticos (imágenes, fuentes, etc)
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# JavaScript y CSS con hash
/*.js
  Cache-Control: public, max-age=31536000, immutable
  
/*.css
  Cache-Control: public, max-age=31536000, immutable

# Imágenes
/*.jpg
  Cache-Control: public, max-age=31536000, immutable
  
/*.jpeg
  Cache-Control: public, max-age=31536000, immutable
  
/*.png
  Cache-Control: public, max-age=31536000, immutable
  
/*.webp
  Cache-Control: public, max-age=31536000, immutable
  
/*.svg
  Cache-Control: public, max-age=31536000, immutable

# Fuentes
/*.woff
  Cache-Control: public, max-age=31536000, immutable
  
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
  
/*.ttf
  Cache-Control: public, max-age=31536000, immutable

# HTML - no cachear para que siempre obtengan la última versión
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Index - no cachear
/
  Cache-Control: public, max-age=0, must-revalidate

# API routes - no cachear
/api/*
  Cache-Control: no-cache, no-store, must-revalidate

# Preconnect a dominios externos para mejorar rendimiento
/*
  Link: <https://fonts.googleapis.com>; rel=preconnect
  Link: <https://images.unsplash.com>; rel=preconnect; crossorigin
  Link: <https://ka-f.fontawesome.com>; rel=preconnect; crossorigin
