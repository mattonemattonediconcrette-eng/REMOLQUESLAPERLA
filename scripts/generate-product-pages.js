#!/usr/bin/env node

/**
 * Generate static product pages and sitemap for Remolques La Perla
 * Usage: node scripts/generate-product-pages.js [--baseUrl=https://example.com]
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let BASE_URL = 'https://remolqueslaperla.example';

args.forEach(arg => {
  if (arg.startsWith('--baseUrl=')) {
    BASE_URL = arg.split('=')[1];
  }
});

// Remove trailing slash from BASE_URL if present
BASE_URL = BASE_URL.replace(/\/$/, '');

console.log(`🚀 Generating product pages with BASE_URL: ${BASE_URL}\n`);

// Read products data
const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Create product directory if it doesn't exist
const productDir = path.join(__dirname, '../product');
if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}

/**
 * Generate HTML template for a product page
 */
function generateProductHTML(product) {
  const featuresHTML = product.features
    .map(feature => `        <li>${feature}</li>`)
    .join('\n');

  const specsHTML = Object.entries(product.specs)
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return `        <li><strong>${label}:</strong> ${value}</li>`;
    })
    .join('\n');

  const imagesHTML = product.images
    .map((img, idx) => {
      const alt = `${product.name} - Imagen ${idx + 1}`;
      return `      <img src="${img}" alt="${alt}" loading="${idx === 0 ? 'eager' : 'lazy'}" />`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${product.name} | Remolques La Perla</title>
  <meta name="description" content="${product.shortDescription}" />
  <meta name="keywords" content="remolque, ${product.category.toLowerCase()}, ${product.name.toLowerCase()}, jalisco, venta de remolques" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${product.name} | Remolques La Perla" />
  <meta property="og:description" content="${product.shortDescription}" />
  <meta property="og:image" content="${BASE_URL}${product.images[0]}" />
  <meta property="og:url" content="${BASE_URL}/product/${product.slug}.html" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${product.name} | Remolques La Perla" />
  <meta name="twitter:description" content="${product.shortDescription}" />
  <meta name="twitter:image" content="${BASE_URL}${product.images[0]}" />
  
  <link rel="canonical" href="${BASE_URL}/product/${product.slug}.html" />
  <link rel="manifest" href="/manifest.json" />
  
  <style>
    :root {
      --azul: #0b1c2d;
      --azul-oscuro: #08121c;
      --amarillo: #f5b301;
      --gris: #f4f6f8;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: 'Segoe UI', Arial, sans-serif;
      background: var(--gris);
      color: #222;
      line-height: 1.6;
    }

    header {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--azul);
      color: #fff;
      padding: 18px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 6px 20px rgba(0,0,0,.25);
    }

    header h1 {
      margin: 0;
      font-size: 1.4rem;
      letter-spacing: .5px;
    }

    nav a {
      color: #fff;
      margin-left: 22px;
      text-decoration: none;
      font-weight: 600;
      transition: color .2s;
    }

    nav a:hover { color: var(--amarillo); }

    .product-hero {
      background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${product.images[0]}') center/cover no-repeat;
      min-height: 50vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #fff;
      padding: 60px 30px;
    }

    .product-hero h2 {
      font-size: 2.8rem;
      margin: 0 0 15px 0;
      text-shadow: 0 2px 10px rgba(0,0,0,.5);
    }

    .product-hero .category {
      font-size: 1.1rem;
      opacity: .9;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
    }

    .product-content {
      max-width: 1200px;
      margin: -50px auto 0;
      padding: 0 30px 80px;
    }

    .product-card {
      background: #fff;
      border-radius: 20px;
      padding: 50px;
      box-shadow: 0 20px 50px rgba(0,0,0,.1);
      margin-bottom: 40px;
    }

    .product-card h3 {
      font-size: 2rem;
      margin-top: 0;
      color: var(--azul);
    }

    .product-card p {
      font-size: 1.1rem;
      line-height: 1.8;
      opacity: .9;
    }

    .price {
      font-size: 2rem;
      font-weight: 800;
      color: var(--amarillo);
      margin: 30px 0;
    }

    .features-specs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
      margin-top: 40px;
    }

    .features-specs ul {
      list-style: none;
      padding: 0;
    }

    .features-specs li {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-top: 40px;
    }

    .gallery img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,.1);
      transition: transform .3s;
    }

    .gallery img:hover {
      transform: scale(1.05);
    }

    .btn {
      display: inline-block;
      margin-top: 28px;
      padding: 16px 32px;
      background: var(--amarillo);
      color: #000;
      text-decoration: none;
      font-weight: 800;
      border-radius: 10px;
      transition: transform .2s, box-shadow .2s;
      font-size: 1.1rem;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,.25);
    }

    .cta-section {
      background: var(--azul);
      color: #fff;
      text-align: center;
      padding: 60px 30px;
      border-radius: 20px;
      margin-top: 40px;
    }

    footer {
      background: var(--azul-oscuro);
      color: #aaa;
      text-align: center;
      padding: 18px;
      font-size: .9rem;
      margin-top: 60px;
    }

    .whatsapp-float {
      position: fixed;
      width: 60px;
      height: 60px;
      bottom: 25px;
      right: 25px;
      background-color: #25D366;
      color: #FFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(0,0,0,.35);
      z-index: 999;
      transition: transform .2s, box-shadow .2s;
    }

    .whatsapp-float:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 30px rgba(0,0,0,.45);
    }

    @media(max-width: 768px) {
      .product-hero h2 { font-size: 2rem; }
      .product-card { padding: 30px 20px; }
      header { flex-direction: column; gap: 10px; padding: 15px; }
      .whatsapp-float {
        width: 56px;
        height: 56px;
        bottom: 20px;
        right: 20px;
      }
    }
  </style>
</head>
<body>

<header>
  <h1>Remolques La Perla</h1>
  <nav>
    <a href="/">Inicio</a>
    <a href="/#productos">Catálogo</a>
    <a href="/#contacto">Contacto</a>
  </nav>
</header>

<section class="product-hero">
  <div>
    <p class="category">${product.category}</p>
    <h2>${product.name}</h2>
  </div>
</section>

<div class="product-content">
  <div class="product-card">
    <h3>Descripción</h3>
    <p>${product.description}</p>
    
    <div class="price">${product.price}</div>
    
    <div class="features-specs">
      <div>
        <h3>Características</h3>
        <ul>
${featuresHTML}
        </ul>
      </div>
      <div>
        <h3>Especificaciones</h3>
        <ul>
${specsHTML}
        </ul>
      </div>
    </div>
  </div>

  ${product.images.length > 1 ? `
  <div class="product-card">
    <h3>Galería de Imágenes</h3>
    <div class="gallery">
${imagesHTML}
    </div>
  </div>
  ` : ''}

  <div class="cta-section">
    <h2>¿Interesado en este remolque?</h2>
    <p>Cotiza ahora por WhatsApp y recibe atención inmediata</p>
    <a class="btn" href="https://wa.me/523347540496?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(product.name)}" target="_blank">
      Cotizar por WhatsApp
    </a>
  </div>
</div>

<footer>
  © 2026 Remolques La Perla · Hecho para durar
</footer>

<!-- Botón flotante WhatsApp -->
<a href="https://wa.me/523347540496?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(product.name)}" target="_blank" class="whatsapp-float" aria-label="WhatsApp">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="white">
    <path d="M19.11 17.205c-.302-.151-1.787-.881-2.064-.981-.277-.101-.479-.151-.681.151-.202.302-.782.981-.958 1.184-.176.202-.353.227-.655.076-.302-.151-1.275-.47-2.43-1.5-.898-.8-1.504-1.787-1.681-2.089-.176-.302-.019-.466.132-.617.136-.135.302-.353.453-.529.151-.176.202-.302.302-.504.101-.202.05-.378-.025-.529-.076-.151-.681-1.64-.933-2.246-.245-.589-.494-.509-.681-.519l-.579-.01c-.202 0-.529.076-.806.378-.277.302-1.059 1.034-1.059 2.521s1.084 2.924 1.235 3.126c.151.202 2.136 3.264 5.178 4.576.724.312 1.288.499 1.728.639.726.231 1.387.198 1.909.12.583-.087 1.787-.73 2.039-1.435.252-.705.252-1.309.176-1.435-.076-.126-.277-.202-.579-.353z"/>
    <path d="M16.003 3C9.373 3 4 8.373 4 15.003c0 2.646.864 5.094 2.329 7.082L4 29l7.123-2.287a11.94 11.94 0 004.88 1.04h.001C22.627 27.753 28 22.38 28 15.75 28 9.12 22.627 3.747 16.003 3zm0 21.753h-.001a9.93 9.93 0 01-4.74-1.201l-.34-.18-4.228 1.357 1.378-4.122-.22-.353a9.93 9.93 0 01-1.531-5.251C6.32 9.82 10.82 5.32 16.003 5.32c5.182 0 9.683 4.5 9.683 9.683 0 5.183-4.5 9.75-9.683 9.75z"/>
  </svg>
</a>

</body>
</html>`;
}

/**
 * Generate sitemap.xml
 */
function generateSitemap(products) {
  const now = new Date().toISOString().split('T')[0];
  
  // Collect all unique images from products
  const productImages = new Set();
  products.forEach(product => {
    product.images.forEach(img => productImages.add(img));
  });

  // Hero images (placeholders)
  const heroImages = [
    '/assets/images/hero-todos.jpg',
    '/assets/images/hero-todos-1200.jpg',
    '/assets/images/hero-todos.webp'
  ];

  const urls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${BASE_URL}/index.html`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${BASE_URL}/offline.html`, priority: '0.3', changefreq: 'monthly' }
  ];

  // Add product pages
  products.forEach(product => {
    urls.push({
      loc: `${BASE_URL}/product/${product.slug}.html`,
      priority: product.featured ? '0.9' : '0.8',
      changefreq: 'monthly'
    });
  });

  // Add hero images
  heroImages.forEach(img => {
    urls.push({
      loc: `${BASE_URL}${img}`,
      priority: '0.5',
      changefreq: 'yearly'
    });
  });

  // Add product images
  Array.from(productImages).forEach(img => {
    urls.push({
      loc: `${BASE_URL}${img}`,
      priority: '0.6',
      changefreq: 'yearly'
    });
  });

  const urlsXML = urls
    .map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
}

// Generate product pages
console.log('📄 Generating product pages...\n');
let generatedCount = 0;

products.forEach(product => {
  const html = generateProductHTML(product);
  const filename = `${product.slug}.html`;
  const filepath = path.join(productDir, filename);
  
  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`   ✓ Created: product/${filename}`);
  generatedCount++;
});

console.log(`\n✅ Generated ${generatedCount} product pages\n`);

// Generate sitemap
console.log('🗺️  Generating sitemap...\n');
const sitemap = generateSitemap(products);
const sitemapPath = path.join(__dirname, '../sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('   ✓ Created: sitemap.xml\n');

console.log('🎉 Done! All static pages and sitemap generated successfully.\n');
console.log('📋 Summary:');
console.log(`   - Product pages: ${generatedCount}`);
console.log(`   - Sitemap entries: ${products.length + 3 + 3 + products.reduce((acc, p) => acc + p.images.length, 0)}`);
console.log(`   - Base URL: ${BASE_URL}\n`);
