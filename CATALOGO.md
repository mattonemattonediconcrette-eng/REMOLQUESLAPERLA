# Catálogo de Productos - Remolques La Perla

Este documento explica el sistema de catálogo de productos implementado para el sitio web de Remolques La Perla.

## Estructura del Sistema

### 📁 Archivos y Directorios

```
REMOLQUESLAPERLA/
├── data/
│   └── products.json          # Datos estructurados de productos
├── product/
│   └── *.html                 # 15 páginas estáticas de productos
├── generate-pages.js          # Script de generación de páginas
├── sitemap.xml               # Mapa del sitio para SEO
├── robots.txt                # Configuración para motores de búsqueda
└── sw.js                     # Service Worker actualizado
```

### 📊 Productos Incluidos

El catálogo incluye **15 productos** organizados en **5 categorías**:

1. **Remolques de Carga** (2 productos)
   - Remolque de Carga Cama Baja 3 Toneladas
   - Remolque de Carga Cama Baja 6 Toneladas

2. **Remolques Food Truck** (4 productos)
   - Food Truck Premium
   - Food Truck Compacto
   - Food Truck Profesional
   - Food Truck Deluxe

3. **Remolques Ganaderos** (3 productos)
   - Remolque Ganadero Estándar
   - Remolque Ganadero Reforzado
   - Remolque Ganadero Premium

4. **Remolques Multiusos** (4 productos)
   - Remolque Multiusos Básico
   - Remolque Multiusos Mediano
   - Remolque Multiusos Grande
   - Remolque Multiusos Premium

5. **Oficinas Móviles** (2 productos)
   - Oficina Móvil Básica
   - Oficina Móvil Equipada

## 🛠️ Cómo Funciona

### 1. Datos de Productos (data/products.json)

Cada producto tiene la siguiente estructura:

```json
{
  "id": "food-truck-premium",
  "slug": "food-truck-premium",
  "name": "Food Truck Premium",
  "category": "food-truck",
  "categoryName": "Remolques Food Truck",
  "image": "assets/food-truck-1.jpg",
  "description": "Descripción del producto...",
  "features": ["Característica 1", "Característica 2", ...],
  "price": "Cotizar",
  "whatsappMessage": "Mensaje personalizado para WhatsApp"
}
```

### 2. Generación de Páginas

El script `generate-pages.js`:
- Lee `data/products.json`
- Genera una página HTML por cada producto en `product/{slug}.html`
- Crea el archivo `sitemap.xml` con todas las URLs
- Usa plantillas consistentes con el diseño del sitio principal

Para regenerar las páginas después de modificar los datos:

```bash
node generate-pages.js
```

### 3. Características de las Páginas de Producto

Cada página incluye:
- ✅ SEO optimizado (title, meta description, keywords)
- ✅ Breadcrumb navigation (navegación de migas de pan)
- ✅ Imagen del producto
- ✅ Descripción y características detalladas
- ✅ Integración con WhatsApp para cotizaciones
- ✅ Diseño responsive (móvil y desktop)
- ✅ Service Worker para funcionamiento offline
- ✅ Estilos consistentes con el sitio principal

### 4. SEO y Descubribilidad

- **sitemap.xml**: 16 URLs indexadas (homepage + 15 productos)
- **robots.txt**: Permite rastreo de todo el sitio y referencia al sitemap
- **Meta tags**: Cada producto tiene title y description únicos
- **URLs amigables**: Formato `product/{slug}.html`

### 5. Service Worker

El archivo `sw.js` ha sido actualizado para:
- Cachear todas las páginas de productos
- Cachear todas las imágenes de productos
- Cachear el archivo `products.json`
- Proporcionar funcionamiento offline

## 📝 Agregar Nuevos Productos

Para agregar un nuevo producto:

1. **Agregar la imagen** del producto en `assets/`
2. **Editar** `data/products.json` y agregar el nuevo producto
3. **Ejecutar** el script de generación:
   ```bash
   node generate-pages.js
   ```
4. **Actualizar** `sw.js` para incluir la nueva página en el cache (aumentar versión del cache)
5. **Commit** los cambios

## 🔗 URLs de Productos

Todas las páginas de productos siguen el patrón:

```
https://mattonemattonediconcrette-eng.github.io/REMOLQUESLAPERLA/product/{slug}.html
```

Ejemplos:
- `/product/food-truck-premium.html`
- `/product/remolque-carga-cama-baja-3-toneladas.html`
- `/product/oficina-movil-basica.html`

## 📱 Integración con WhatsApp

Cada producto tiene un botón "Cotizar por WhatsApp" que:
- Abre WhatsApp con un mensaje pre-escrito específico para ese producto
- Incluye el nombre del producto en el mensaje
- Usa el número: 334 754 0496

## 🎨 Diseño

Las páginas de producto utilizan:
- **Colores**: Azul (#0b1c2d), Amarillo (#f5b301), Gris (#f4f6f8)
- **Tipografía**: Segoe UI, Arial, sans-serif
- **Layout**: Grid de 2 columnas (imagen + info) en desktop, 1 columna en móvil
- **Componentes**: Cards, botones, breadcrumbs consistentes con el sitio principal

## ✅ Validación

El sistema ha sido validado:
- ✅ JSON válido en `products.json`
- ✅ Sitemap XML válido con 16 URLs
- ✅ HTML válido en todas las páginas
- ✅ Links de WhatsApp correctamente codificados
- ✅ Sin vulnerabilidades de seguridad (CodeQL)
- ✅ Sin issues en revisión de código

## 🚀 Próximos Pasos Sugeridos

1. **Integrar el catálogo en la página principal**: Agregar enlaces desde `index.html` a las páginas de productos
2. **Crear página de categorías**: Páginas que listen productos por categoría
3. **Agregar más productos**: Expandir el catálogo según inventario
4. **Implementar búsqueda**: Agregar funcionalidad de búsqueda de productos
5. **Analytics**: Integrar Google Analytics para rastrear visitas a productos
