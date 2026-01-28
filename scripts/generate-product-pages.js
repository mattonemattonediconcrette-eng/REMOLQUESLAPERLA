#!/usr/bin/env node

/**
 * Generate static product pages and sitemap for Remolques La Perla
 * 
 * Usage:
 *   node scripts/generate-product-pages.js [options]
 * 
 * Options:
 *   --baseUrl <url>    Base URL for sitemap (default: https://remolqueslaperla.example)
 *   --out <dir>        Output directory (default: current directory)
 *   --update-sw        Update service worker with generated pages
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let baseUrl = 'https://remolqueslaperla.example';
let outputDir = process.cwd();
let updateSW = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--baseUrl' && i + 1 < args.length) {
    baseUrl = args[i + 1];
    i++;
  } else if (args[i] === '--out' && i + 1 < args.length) {
    outputDir = args[i + 1];
    i++;
  } else if (args[i] === '--update-sw') {
    updateSW = true;
  }
}

// Ensure baseUrl doesn't end with slash
baseUrl = baseUrl.replace(/\/$/, '');

console.log('⚙️  Configuration:');
console.log(`   Base URL: ${baseUrl}`);
console.log(`   Output directory: ${outputDir}`);
console.log(`   Update service worker: ${updateSW}`);
console.log('');

// Read products data
const productsPath = path.join(outputDir, 'data', 'products.json');
if (!fs.existsSync(productsPath)) {
  console.error(`❌ Error: products.json not found at ${productsPath}`);
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
console.log(`📦 Loaded ${products.length} products from data/products.json`);

// Create product directory if it doesn't exist
const productDir = path.join(outputDir, 'product');
if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
  console.log(`📁 Created directory: product/`);
}

// Helper function to generate HTML for a product
function generateProductHTML(product) {
  const images = product.images || [];
  const firstImage = images[0] || '/assets/logo.png';
  
  const imagesHTML = images.map(img => 
    `          <img src="${img}" alt="${product.name}" loading="lazy">`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${product.short_description}">
  <meta name="theme-color" content="#1f1712">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${baseUrl}/product/${product.id}.html">
  <meta property="og:title" content="${product.name} - Remolques La Perla">
  <meta property="og:description" content="${product.short_description}">
  <meta property="og:image" content="${baseUrl}${firstImage}">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${baseUrl}/product/${product.id}.html">
  <meta property="twitter:title" content="${product.name} - Remolques La Perla">
  <meta property="twitter:description" content="${product.short_description}">
  <meta property="twitter:image" content="${baseUrl}${firstImage}">
  
  <title>${product.name} - Remolques La Perla</title>
  <link rel="stylesheet" href="../styles.css">
  <link rel="manifest" href="../manifest.json">
  <link rel="icon" type="image/png" href="../assets/logo.png">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="../index.html" class="logo">
        <img src="../assets/logo.png" alt="Remolques La Perla" width="60" height="60">
        <span>Remolques La Perla</span>
      </a>
      <nav>
        <a href="../index.html">Catálogo</a>
        <a href="tel:+523331234567">Contacto</a>
      </nav>
    </div>
  </header>

  <main class="product-page">
    <div class="container">
      <nav class="breadcrumb">
        <a href="../index.html">Inicio</a> / 
        <span>${product.category}</span> / 
        <strong>${product.name}</strong>
      </nav>

      <article class="product-detail">
        <div class="product-images">
${imagesHTML || '          <img src="../assets/logo.png" alt="' + product.name + '">'}
        </div>

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h1>${product.name}</h1>
          <p class="product-description">${product.short_description}</p>
          
          <div class="product-price">
            <strong>${product.price}</strong>
          </div>

          <div class="product-actions">
            <a href="tel:+523331234567" class="btn btn-primary">
              📞 Llamar para cotizar
            </a>
            <a href="https://wa.me/523331234567?text=Hola%2C%20me%20interesa%20el%20producto%3A%20${encodeURIComponent(product.name)}" 
               class="btn btn-secondary" 
               target="_blank" 
               rel="noopener">
              💬 WhatsApp
            </a>
          </div>

          <div class="product-meta">
            <p><strong>ID del producto:</strong> ${product.id}</p>
          </div>
        </div>
      </article>

      <section class="back-to-catalog">
        <a href="../index.html" class="btn">← Volver al catálogo</a>
      </section>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2025 Remolques La Perla. Todos los derechos reservados.</p>
      <p>Jalisco, México</p>
    </div>
  </footer>

  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../sw.js');
    }
  </script>
</body>
</html>`;
}

// Generate product pages
console.log('');
console.log('📝 Generating product pages...');
let generatedPages = [];

products.forEach(product => {
  const filename = `${product.id}.html`;
  const filepath = path.join(productDir, filename);
  const html = generateProductHTML(product);
  
  fs.writeFileSync(filepath, html, 'utf-8');
  generatedPages.push(`/product/${filename}`);
  console.log(`   ✓ Generated: product/${filename}`);
});

console.log(`✅ Generated ${generatedPages.length} product pages`);

// Generate sitemap.xml
console.log('');
console.log('🗺️  Generating sitemap.xml...');

// Collect all unique images from products
const allProductImages = new Set();
products.forEach(product => {
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => allProductImages.add(img));
  }
});

// Add hero images
const heroImages = [
  '/assets/images/hero-todos.jpg',
  '/assets/images/hero-todos-1200.jpg',
  '/assets/images/hero-todos.webp'
];

const sitemapUrls = [
  // Homepage
  {
    loc: baseUrl + '/',
    images: heroImages,
    priority: '1.0',
    changefreq: 'weekly'
  },
  // Product pages
  ...products.map(product => ({
    loc: baseUrl + `/product/${product.id}.html`,
    images: product.images || [],
    priority: '0.8',
    changefreq: 'monthly'
  }))
];

let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

sitemapUrls.forEach(urlData => {
  sitemapXML += `  <url>
    <loc>${urlData.loc}</loc>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
`;
  
  // Add images for this URL
  if (urlData.images && urlData.images.length > 0) {
    urlData.images.forEach(img => {
      const imageUrl = img.startsWith('http') ? img : baseUrl + img;
      sitemapXML += `    <image:image>
      <image:loc>${imageUrl}</image:loc>
    </image:image>
`;
    });
  }
  
  sitemapXML += `  </url>
`;
});

sitemapXML += `</urlset>`;

const sitemapPath = path.join(outputDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXML, 'utf-8');
console.log(`✅ Generated sitemap.xml with ${sitemapUrls.length} URLs`);

// Update service worker if requested
if (updateSW) {
  console.log('');
  console.log('🔧 Updating service worker...');
  
  const swPath = path.join(outputDir, 'sw.js');
  
  if (!fs.existsSync(swPath)) {
    console.log('⚠️  Service worker not found, creating new one...');
    
    // Create basic service worker
    const swContent = `const CACHE_NAME = 'rlp-cache-v5';
const OFFLINE_URL = 'offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/styles.css',
  '/data/products.json',
  '/assets/logo.png',
  '/assets/images/hero-todos.jpg',
  '/assets/images/hero-todos-1200.jpg',
  '/assets/images/hero-todos.webp',
${generatedPages.map(page => `  '${page}'`).join(',\n')}
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('/assets/logo.png');
          }
          return null;
        });
    })
  );
});
`;
    
    fs.writeFileSync(swPath, swContent, 'utf-8');
    console.log('✅ Created new service worker with product pages');
  } else {
    // Update existing service worker
    let swContent = fs.readFileSync(swPath, 'utf-8');
    
    // Increment cache version
    swContent = swContent.replace(/CACHE_NAME = '[^']+'/g, "CACHE_NAME = 'rlp-cache-v5'");
    
    // Find ASSETS_TO_CACHE array and update it
    const assetsToCache = [
      '/',
      '/index.html',
      '/offline.html',
      '/manifest.json',
      '/styles.css',
      '/data/products.json',
      '/assets/logo.png',
      '/assets/images/hero-todos.jpg',
      '/assets/images/hero-todos-1200.jpg',
      '/assets/images/hero-todos.webp',
      ...generatedPages
    ];
    
    // Collect product images from products.json
    const productImages = Array.from(allProductImages);
    
    const assetsArrayContent = assetsToCache.map(asset => `  '${asset}'`).join(',\n');
    
    // Replace ASSETS_TO_CACHE array
    const assetsRegex = /const ASSETS_TO_CACHE = \[[^\]]*\];/s;
    if (assetsRegex.test(swContent)) {
      swContent = swContent.replace(
        assetsRegex,
        `const ASSETS_TO_CACHE = [\n${assetsArrayContent}\n];`
      );
      console.log('✅ Updated ASSETS_TO_CACHE in service worker');
    } else {
      console.log('⚠️  Could not find ASSETS_TO_CACHE array in service worker');
    }
    
    fs.writeFileSync(swPath, swContent, 'utf-8');
    console.log('✅ Updated service worker cache list');
  }
}

console.log('');
console.log('✨ All done!');
console.log('');
console.log('📋 Summary:');
console.log(`   • Generated ${generatedPages.length} product pages in product/`);
console.log(`   • Generated sitemap.xml with ${sitemapUrls.length} URLs`);
if (updateSW) {
  console.log(`   • Updated service worker (sw.js)`);
}
console.log('');
console.log('🚀 Next steps:');
console.log('   1. Review generated files');
console.log('   2. Test locally: serve . (or python -m http.server)');
console.log('   3. Commit changes');
console.log('');
