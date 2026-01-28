#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read products data
const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Create product directory if it doesn't exist
const productDir = path.join(__dirname, '../product');
if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}

// Generate HTML for each product
products.forEach(product => {
  const html = generateProductHTML(product);
  const filename = `${product.slug}.html`;
  const filepath = path.join(productDir, filename);
  
  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✓ Generated: product/${filename}`);
});

// Generate sitemap.xml
generateSitemap(products);

console.log(`\n✓ Generated ${products.length} product pages`);
console.log('✓ Generated sitemap.xml');

function generateProductHTML(product) {
  const featuresHTML = product.features.map(f => `          <li>${f}</li>`).join('\n');
  const imagesHTML = product.images.map((img, idx) => {
    const altText = idx === 0 ? product.name : `${product.name} - Imagen ${idx + 1}`;
    return `          <img src="${img}" alt="${altText}" loading="lazy" />`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${product.name} | Remolques La Perla</title>
  <meta name="description" content="${product.description}" />
  <meta name="keywords" content="${product.keywords}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="product" />
  <meta property="og:url" content="https://remolqueslaperla.com/product/${product.slug}.html" />
  <meta property="og:title" content="${product.name} | Remolques La Perla" />
  <meta property="og:description" content="${product.description}" />
  <meta property="og:image" content="https://remolqueslaperla.com${product.image}" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://remolqueslaperla.com/product/${product.slug}.html" />
  <meta property="twitter:title" content="${product.name} | Remolques La Perla" />
  <meta property="twitter:description" content="${product.description}" />
  <meta property="twitter:image" content="https://remolqueslaperla.com${product.image}" />
  
  <!-- JSON-LD Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "${product.name}",
    "image": "https://remolqueslaperla.com${product.image}",
    "description": "${product.description}",
    "brand": {
      "@type": "Brand",
      "name": "Remolques La Perla"
    },
    "offers": {
      "@type": "Offer",
      "price": "${product.price}",
      "priceCurrency": "MXN",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Remolques La Perla"
      }
    }
  }
  </script>

  <link rel="canonical" href="https://remolqueslaperla.com/product/${product.slug}.html" />
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
      background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${product.image}') center/cover no-repeat;
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #fff;
      padding: 30px;
    }

    .product-hero h2 {
      font-size: 2.8rem;
      margin-bottom: 15px;
    }

    .category-badge {
      display: inline-block;
      background: var(--amarillo);
      color: #000;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    .price {
      font-size: 2rem;
      font-weight: 800;
      color: var(--amarillo);
      margin-top: 20px;
    }

    section {
      padding: 60px 40px;
      max-width: 1200px;
      margin: auto;
    }

    .product-content {
      background: #fff;
      border-radius: 20px;
      padding: 50px;
      box-shadow: 0 15px 40px rgba(0,0,0,.08);
      margin-bottom: 40px;
    }

    .product-content h3 {
      font-size: 2rem;
      margin-bottom: 25px;
      color: var(--azul);
    }

    .product-content p {
      font-size: 1.1rem;
      line-height: 1.8;
      margin-bottom: 30px;
    }

    .features {
      background: var(--gris);
      border-radius: 15px;
      padding: 30px;
      margin-top: 30px;
    }

    .features h4 {
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: var(--azul);
    }

    .features ul {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .features li {
      font-weight: 600;
      padding: 10px 0;
      border-left: 4px solid var(--amarillo);
      padding-left: 15px;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-top: 40px;
    }

    .gallery img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,.1);
      transition: transform .3s;
    }

    .gallery img:hover {
      transform: scale(1.05);
    }

    .cta-section {
      background: var(--azul);
      color: #fff;
      text-align: center;
      padding: 60px 30px;
      border-radius: 20px;
      margin-top: 40px;
    }

    .btn {
      display: inline-block;
      margin-top: 20px;
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

    footer {
      background: var(--azul-oscuro);
      color: #aaa;
      text-align: center;
      padding: 18px;
      font-size: .9rem;
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
      .product-content { padding: 30px 25px; }
      header { flex-direction: column; gap: 10px; }
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
    <a href="/#productos">Remolques</a>
    <a href="/#contacto">Contacto</a>
  </nav>
</header>

<section class="product-hero">
  <div>
    <span class="category-badge">${product.category}</span>
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <p class="price">${product.price}</p>
  </div>
</section>

<section>
  <div class="product-content">
    <h3>Descripción Completa</h3>
    <p>${product.longDescription}</p>

    <div class="features">
      <h4>Características Principales</h4>
      <ul>
${featuresHTML}
      </ul>
    </div>
  </div>

  <div class="product-content">
    <h3>Galería de Imágenes</h3>
    <div class="gallery">
${imagesHTML}
    </div>
  </div>

  <div class="cta-section">
    <h3>¿Interesado en este remolque?</h3>
    <p>Cotiza ahora y recibe atención inmediata por WhatsApp</p>
    <p><strong>📲 WhatsApp: 334 754 0496</strong></p>
    <a class="btn" href="https://wa.me/523347540496?text=Hola, me interesa el ${encodeURIComponent(product.name)}" target="_blank">Cotizar por WhatsApp</a>
  </div>
</section>

<footer>
  © 2026 Remolques La Perla · Hecho para durar
</footer>

<!-- Botón flotante WhatsApp -->
<a href="https://wa.me/523347540496?text=Hola, me interesa el ${encodeURIComponent(product.name)}" target="_blank" class="whatsapp-float" aria-label="WhatsApp">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="white">
    <path d="M19.11 17.205c-.302-.151-1.787-.881-2.064-.981-.277-.101-.479-.151-.681.151-.202.302-.782.981-.958 1.184-.176.202-.353.227-.655.076-.302-.151-1.275-.47-2.43-1.5-.898-.8-1.504-1.787-1.681-2.089-.176-.302-.019-.466.132-.617.136-.135.302-.353.453-.529.151-.176.202-.302.302-.504.101-.202.05-.378-.025-.529-.076-.151-.681-1.64-.933-2.246-.245-.589-.494-.509-.681-.519l-.579-.01c-.202 0-.529.076-.806.378-.277.302-1.059 1.034-1.059 2.521s1.084 2.924 1.235 3.126c.151.202 2.136 3.264 5.178 4.576.724.312 1.288.499 1.728.639.726.231 1.387.198 1.909.12.583-.087 1.787-.73 2.039-1.435.252-.705.252-1.309.176-1.435-.076-.126-.277-.202-.579-.353z"/>
    <path d="M16.003 3C9.373 3 4 8.373 4 15.003c0 2.646.864 5.094 2.329 7.082L4 29l7.123-2.287a11.94 11.94 0 004.88 1.04h.001C22.627 27.753 28 22.38 28 15.75 28 9.12 22.627 3.747 16.003 3zm0 21.753h-.001a9.93 9.93 0 01-4.74-1.201l-.34-.18-4.228 1.357 1.378-4.122-.22-.353a9.93 9.93 0 01-1.531-5.251C6.32 9.82 10.82 5.32 16.003 5.32c5.182 0 9.683 4.5 9.683 9.683 0 5.183-4.5 9.75-9.683 9.75z"/>
  </svg>
</a>

<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  }
</script>

</body>
</html>`;
}

function generateSitemap(products) {
  const baseURL = 'https://remolqueslaperla.com';
  const date = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseURL}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  products.forEach(product => {
    xml += `  <url>
    <loc>${baseURL}/product/${product.slug}.html</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  xml += '</urlset>';

  const sitemapPath = path.join(__dirname, '../sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
}
