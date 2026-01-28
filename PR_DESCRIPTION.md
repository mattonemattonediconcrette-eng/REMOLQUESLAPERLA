# Pull Request: Feature Catálogo — Product Pages Static + SEO

## Resumen de los Cambios

Este PR implementa páginas de producto estáticas generadas automáticamente con optimización SEO completa para el sitio de Remolques La Perla.

### Cambios Principales:

1. **Estructura de Datos de Productos** (`data/products.json`)
   - Base de datos JSON con 6 productos completos
   - Incluye: Food Truck Premium, Remolques Cama Baja (3t y 6t), Remolque Multiusos, Remolque Ganadero, y Oficina Móvil
   - Cada producto con descripción completa, características, precios, imágenes y keywords SEO

2. **Script de Generación** (`scripts/generate-product-pages.js`)
   - Genera páginas HTML estáticas automáticamente desde products.json
   - Crea sitemap.xml para SEO
   - Ejecutar con: `node scripts/generate-product-pages.js`

3. **Páginas de Producto Generadas** (en `product/`)
   - 6 páginas HTML individuales, una por producto
   - **Metadatos Open Graph** completos para compartir en redes sociales
   - **JSON-LD Schema** para rich snippets en Google
   - **CTA WhatsApp** integrado con mensaje pre-llenado por producto
   - Diseño responsive y consistente con el sitio
   - Service Worker para funcionamiento offline

4. **Sitemap.xml**
   - Sitemap XML generado automáticamente
   - Incluye homepage y todas las páginas de productos
   - Listo para enviar a Google Search Console

5. **Service Worker Actualizado** (`sw.js`)
   - Cache actualizado (v5) con:
     - Todas las páginas de producto
     - Sitemap.xml
     - data/products.json
     - Imágenes hero (placeholders)
     - Imágenes de productos existentes
   - PWA funcional con soporte offline

## Cómo Probar Localmente

1. **Clonar y preparar:**
   ```bash
   git clone https://github.com/mattonemattonediconcrette-eng/REMOLQUESLAPERLA.git
   cd REMOLQUESLAPERLA
   git checkout feature/catalogo
   ```

2. **Generar páginas** (opcional, ya están generadas):
   ```bash
   node scripts/generate-product-pages.js
   ```

3. **Servir el sitio localmente:**
   ```bash
   # Opción 1: Python
   python3 -m http.server 8000
   
   # Opción 2: Node.js (npx)
   npx http-server -p 8000
   
   # Opción 3: PHP
   php -S localhost:8000
   ```

4. **Abrir en navegador:**
   - Homepage: http://localhost:8000/
   - Ejemplo producto: http://localhost:8000/product/food-truck-premium.html

5. **Verificar:**
   - ✅ Metadatos Open Graph (Facebook Sharing Debugger)
   - ✅ JSON-LD Schema (Google Rich Results Test)
   - ✅ CTA WhatsApp funcional (click en botones)
   - ✅ Service Worker registrado (DevTools > Application > Service Workers)
   - ✅ Responsive design (DevTools > Device Toolbar)

## Metadatos SEO Implementados

### Open Graph (Facebook/Social)
- `og:type`: product
- `og:url`: URL canónica del producto
- `og:title`: Nombre del producto + Remolques La Perla
- `og:description`: Descripción del producto
- `og:image`: Imagen principal del producto

### Twitter Cards
- `twitter:card`: summary_large_image
- Metadatos completos para vista previa en Twitter

### JSON-LD Schema.org
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "...",
  "image": "...",
  "description": "...",
  "brand": { "@type": "Brand", "name": "Remolques La Perla" },
  "offers": {
    "@type": "Offer",
    "price": "...",
    "priceCurrency": "MXN",
    "availability": "InStock"
  }
}
```

## CTA WhatsApp

Cada página de producto incluye:
- **Botón principal CTA** con mensaje personalizado por producto
- **Botón flotante** (sticky) en esquina inferior derecha
- Mensaje pre-llenado: "Hola, me interesa el [Nombre del Producto]"
- Número WhatsApp: 334 754 0496

## Imágenes Pendientes de Subir

### Hero Images (carpeta: `/assets/images/`)
Estas imágenes están referenciadas en el service worker pero aún no existen en el repositorio:

- [ ] `hero-todos.jpg` - Imagen principal del héroe
- [ ] `hero-todos-1200.jpg` - Versión optimizada 1200px
- [ ] `hero-todos.webp` - Versión WebP para mejor rendimiento

**IMPORTANTE:** La imagen hero debe ser la proporcionada por el usuario:

![Imagen Hero](https://github.com/user-attachments/assets/...)

### Product Images (carpeta: `/assets/`)
Las siguientes imágenes de productos ya existen y están siendo utilizadas:
- ✅ `food-truck-1.jpg`, `food-truck-2.jpg`, `food-truck-3.jpg`, `food-truck-4.jpg`
- ✅ `remolque-multiusos-1.jpg`, `remolque-multiusos-2.jpg`, `remolque-multiusos-3.jpg`, `remolque-multiusos-4.jpg`
- ✅ `cama-baja-3t.jpg`, `cama-baja-6t.jpg`
- ✅ `ganadero-1.jpg`, `ganadero-2.jpg`, `ganadero-4.jpg`
- ✅ `oficina-movil-1.jpg`, `oficina-movil-5.jpg`, `oficina-movil-rellena.jpg`

## Estructura de Archivos Creados

```
/
├── data/
│   └── products.json              # Base de datos de productos
├── product/
│   ├── food-truck-premium.html
│   ├── remolque-cama-baja-3-toneladas.html
│   ├── remolque-cama-baja-6-toneladas.html
│   ├── remolque-multiusos.html
│   ├── remolque-ganadero.html
│   └── oficina-movil.html
├── scripts/
│   └── generate-product-pages.js  # Script generador
├── assets/
│   └── images/
│       └── README.md              # Documentación de imágenes pendientes
├── sitemap.xml                    # Sitemap para SEO
└── sw.js                          # Service Worker actualizado (v5)
```

## Commits Atómicos

1. ✅ **"Generate static product pages and sitemap"**
   - Incluye: product/, sitemap.xml, scripts/generate-product-pages.js, data/products.json

2. ✅ **"Update service worker cache for product pages"**
   - Actualización de sw.js con cache v5

3. ✅ **"Add README for pending hero images"**
   - Documentación de imágenes hero pendientes

## Próximos Pasos

1. **Subir imágenes hero** a `/assets/images/`
2. **Enviar sitemap.xml** a Google Search Console
3. **Probar metadatos** con:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
4. **Validar** CTA WhatsApp en dispositivos móviles

## Notas Técnicas

- ✅ No se modificó la rama `main`
- ✅ Todo el trabajo se realizó en `feature/catalogo`
- ✅ Service Worker PWA funcional
- ✅ Diseño responsive
- ✅ SEO optimizado
- ✅ Accesibilidad (ARIA labels, semantic HTML)
- ⏳ Imágenes hero pendientes de subir

---

**Listo para merge** después de subir las imágenes hero o puede mergearse ahora y las imágenes agregarse después.
