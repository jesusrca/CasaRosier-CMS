import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadAPI } from '../utils/api';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Escribe aquí...', height = '300px' }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar el valor local con el prop solo si cambió externamente
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Manejador de cambios con debounce
  const handleChange = useCallback((content: string) => {
    setLocalValue(content);
    
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Establecer nuevo timeout para propagar el cambio
    timeoutRef.current = setTimeout(() => {
      onChange(content);
    }, 300); // 300ms de debounce
  }, [onChange]);

  // Manejador de imágenes personalizado
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const response = await uploadAPI.uploadImage(file);
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', response.url);
          quill.setSelection(range.index + 1, 0);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error al subir la imagen. Por favor intenta de nuevo.');
      }
    };
  }, []);

  // Manejador para insertar HTML personalizado
  const insertHtmlHandler = useCallback(() => {
    const htmlCode = prompt('Pega el código HTML o iframe aquí:\n\nEjemplo para Google Maps:\n1. Ve a Google Maps\n2. Busca la ubicación\n3. Clic en "Compartir" → "Insertar un mapa"\n4. Copia TODO el código <iframe>...</iframe>');
    
    if (!htmlCode) return;
    
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true) || { index: quill.getLength() };
      
      // Insertar el HTML directamente
      const delta = quill.clipboard.convert({ html: htmlCode });
      quill.updateContents(delta, 'user');
      quill.setSelection(range.index + 1, 0);
    }
  }, []);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Agregar botón personalizado de HTML a la toolbar
  useEffect(() => {
    const toolbar = document.querySelector('.rich-text-editor-wrapper .ql-toolbar');
    if (!toolbar) return;

    // Verificar si el botón ya existe
    if (toolbar.querySelector('.ql-html-button')) return;

    // Crear el botón personalizado
    const htmlButton = document.createElement('button');
    htmlButton.className = 'ql-html-button';
    htmlButton.type = 'button';
    htmlButton.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>';
    htmlButton.title = 'Insertar HTML/iframe';
    htmlButton.onclick = insertHtmlHandler;

    // Insertar el botón al final de la toolbar
    toolbar.appendChild(htmlButton);

    return () => {
      htmlButton.remove();
    };
  }, [insertHtmlHandler]);

  // Configuración de módulos de Quill
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        'html': insertHtmlHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), [imageHandler, insertHtmlHandler]);

  // Formatos permitidos
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={localValue || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
      
      <style>{`
        .rich-text-editor-wrapper .quill {
          background: white;
          border-radius: 0.5rem;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        
        .rich-text-editor-wrapper .ql-toolbar {
          background: #F3F2EF;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
        
        .rich-text-editor-wrapper .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-size: 16px;
          font-family: inherit;
          min-height: ${height};
          max-height: 500px;
          border: 0;
        }
        
        .rich-text-editor-wrapper .ql-editor {
          min-height: ${height};
          max-height: 500px;
          overflow-y: auto;
          line-height: 1.7;
          color: #333;
        }
        
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: rgba(0, 0, 0, 0.4);
          font-style: normal;
        }
        
        /* Estilos para headings */
        .rich-text-editor-wrapper .ql-editor h2 {
          font-size: 1.75em;
          font-weight: 700;
          margin: 1em 0 0.5em 0;
          line-height: 1.3;
          color: #1a1a1a;
        }
        
        .rich-text-editor-wrapper .ql-editor h3 {
          font-size: 1.4em;
          font-weight: 600;
          margin: 0.8em 0 0.4em 0;
          line-height: 1.4;
          color: #1a1a1a;
        }
        
        /* Estilos para párrafos */
        .rich-text-editor-wrapper .ql-editor p {
          margin-bottom: 1em;
          line-height: 1.7;
        }
        
        /* Estilos para listas */
        .rich-text-editor-wrapper .ql-editor ul,
        .rich-text-editor-wrapper .ql-editor ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        
        .rich-text-editor-wrapper .ql-editor li {
          margin-bottom: 0.3em;
          line-height: 1.7;
        }
        
        /* Estilos para enlaces */
        .rich-text-editor-wrapper .ql-editor a {
          color: #FF5100;
          text-decoration: underline;
        }
        
        .rich-text-editor-wrapper .ql-editor a:hover {
          text-decoration: none;
        }
        
        /* Estilos para imágenes */
        .rich-text-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
        
        /* Estilos para videos/iframes */
        .rich-text-editor-wrapper .ql-editor iframe,
        .rich-text-editor-wrapper .ql-editor .ql-video {
          max-width: 100%;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 0.5rem;
          margin: 1.5em 0;
          border: none;
        }
        
        /* Botones de la toolbar */
        .rich-text-editor-wrapper .ql-toolbar button:hover,
        .rich-text-editor-wrapper .ql-toolbar button:focus,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active {
          color: #FF5100;
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: #666;
        }
        
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #FF5100;
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: #666;
        }
        
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button:focus .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #FF5100;
        }
        
        /* Picker (dropdowns) */
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label:hover,
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label.ql-active {
          color: #FF5100;
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label.ql-active .ql-stroke {
          stroke: #FF5100;
        }
        
        /* Botón personalizado de HTML */
        .rich-text-editor-wrapper .ql-html-button {
          width: 28px;
          height: 28px;
          padding: 5px;
          display: inline-block;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #666;
          vertical-align: middle;
        }
        
        .rich-text-editor-wrapper .ql-html-button:hover {
          color: #FF5100;
        }
        
        .rich-text-editor-wrapper .ql-html-button svg {
          display: block;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}