# Feature: Catálogo — Product Pages Static + SEO

## Resumen de Cambios

Este Pull Request implementa la generación automática de páginas estáticas para productos, sitemap para SEO y actualiza el service worker para soportar PWA.

### Archivos Creados

1. **data/products.json** - Base de datos de productos con 6 productos:
   - Remolque Food Truck
   - Remolque Ganadero
   - Remolque Cama Baja 3 Toneladas
   - Remolque Cama Baja 6 Toneladas
   - Remolque Oficina Móvil
   - Remolque Multiusos

2. **scripts/generate-product-pages.js** - Script de generación automática:
   - Lee `data/products.json`
   - Genera páginas HTML estáticas en `/product/`
   - Crea `sitemap.xml` con todas las URLs
   - Soporta parámetro `--baseUrl` para configurar el dominio

3. **product/*.html** - 6 páginas de producto generadas:
   - `/product/food-truck.html`
   - `/product/ganadero.html`
   - `/product/cama-baja-3t.html`
   - `/product/cama-baja-6t.html`
   - `/product/oficina-movil.html`
   - `/product/multiusos.html`

4. **sitemap.xml** - Sitemap XML con 8 URLs:
   - Página principal
   - Página offline
   - 6 páginas de productos

5. **assets/images/.gitkeep** - Directorio placeholder para imágenes hero

### Archivos Actualizados

1. **sw.js** - Service Worker actualizado:
   - Versión incrementada de v4 a v5
   - Incluye todas las páginas de producto en caché
   - Incluye `data/products.json` y `sitemap.xml`
   - Incluye referencias a imágenes hero (pendientes de subir)
   - Incluye todas las imágenes de productos existentes

## Cómo Probar Localmente

### 1. Obtener la Rama

```bash
git fetch origin
git checkout copilot/add-static-pages-and-sitemap
# O si prefieres usar feature/catalogo:
# git checkout feature/catalogo
```

### 2. Regenerar Páginas (Opcional)

Si deseas cambiar la URL base o regenerar las páginas:

```bash
node scripts/generate-product-pages.js --baseUrl=https://tu-dominio.com
```

Por defecto usa: `https://remolqueslaperla.example`

### 3. Servir Localmente

Opción 1 - Python:
```bash
python3 -m http.server 8000
# Abrir http://localhost:8000
```

Opción 2 - npx serve:
```bash
npx serve .
```

Opción 3 - Node.js http-server:
```bash
npx http-server
```

### 4. Probar las Páginas

- Página principal: http://localhost:8000/
- Productos: http://localhost:8000/product/food-truck.html
- Sitemap: http://localhost:8000/sitemap.xml

## Imágenes Pendientes por Subir

Las siguientes imágenes están referenciadas en el código pero **no están presentes en el repositorio**. Deben ser subidas a las rutas indicadas:

### Imágenes Hero (Generales)
- `/assets/images/hero-todos.jpg` - Imagen hero principal
- `/assets/images/hero-todos-1200.jpg` - Variante responsive 1200px
- `/assets/images/hero-todos.webp` - Formato WebP para mejor rendimiento

**Nota**: La imagen proporcionada por el usuario puede usarse como hero:

![Hero Placeholder](https://via.placeholder.com/1200x600/0b1c2d/f5b301?text=Remolques+La+Perla)

### Imágenes de Productos

Las siguientes imágenes de productos **YA EXISTEN** en `/assets/` y están correctamente referenciadas:

✅ `/assets/food-truck-1.jpg`
✅ `/assets/food-truck-2.jpg`
✅ `/assets/food-truck-3.jpg`
✅ `/assets/food-truck-4.jpg`
✅ `/assets/ganadero-1.jpg`
✅ `/assets/ganadero-2.jpg`
✅ `/assets/ganadero-4.jpg`
✅ `/assets/cama-baja-3t.jpg`
✅ `/assets/cama-baja-6t.jpg`
✅ `/assets/oficina-movil-1.jpg`
✅ `/assets/oficina-movil-5.jpg`
✅ `/assets/oficina-movil-rellena.jpg`
✅ `/assets/remolque-multiusos-1.jpg`
✅ `/assets/remolque-multiusos-2.jpg`
✅ `/assets/remolque-multiusos-3.jpg`
✅ `/assets/remolque-multiusos-4.jpg`

## Características Implementadas

### SEO Optimizado
- Títulos y meta descripciones únicas por producto
- Open Graph tags para redes sociales (Facebook)
- Twitter Cards para mejor presentación en Twitter
- URLs canónicas
- Sitemap.xml para indexación de motores de búsqueda

### PWA (Progressive Web App)
- Service Worker actualizado con todas las páginas
- Caché offline de productos y recursos
- Soporte para manifest.json

### Diseño Responsive
- Páginas adaptables a móviles y tablets
- Galería de imágenes por producto
- Botón flotante de WhatsApp en todas las páginas
- Breadcrumbs de navegación

### Funcionalidades
- Botón de cotización por WhatsApp con texto pre-rellenado
- Información detallada de cada producto (características, precio, disponibilidad)
- Enlaces de vuelta a la página principal
- Categorización de productos

## Estructura de Commits

Según la especificación, se crearon 2 commits atómicos:

1. **"Generate static product pages and sitemap"**
   - Incluye: `scripts/generate-product-pages.js`, `product/`, `sitemap.xml`, `data/products.json`
   
2. **"Update service worker cache for product pages"**
   - Incluye: actualización de `sw.js` y creación de `assets/images/.gitkeep`

## Próximos Pasos

1. ✅ Revisar y aprobar este PR
2. 📤 Subir las imágenes hero pendientes a `/assets/images/`
3. 🔄 Actualizar la URL base ejecutando: `node scripts/generate-product-pages.js --baseUrl=https://dominio-real.com`
4. 🚀 Hacer merge a `main`
5. 📊 Enviar sitemap.xml a Google Search Console

## Notas Técnicas

- **BASE_URL**: Actualmente configurado como `https://remolqueslaperla.example` (placeholder)
- **Service Worker**: La versión de caché se incrementó a `v5`
- **Compatibilidad**: Las páginas son estáticas y funcionan sin JavaScript (mejora progresiva)
- **Formato**: Todas las páginas en español con encoding UTF-8
