# Cómo Crear el Pull Request

Debido a las limitaciones del entorno de desarrollo, los commits se han realizado en la rama `copilot/add-static-pages-and-sitemap` en lugar de `feature/catalogo`. 

## Opción 1: Crear PR desde copilot/add-static-pages-and-sitemap (Recomendado)

La forma más simple es crear el PR directamente desde la rama actual:

1. Ve a: https://github.com/mattonemattonediconcrette-eng/REMOLQUESLAPERLA/pulls
2. Haz clic en "New Pull Request"
3. Selecciona:
   - Base: `main`
   - Compare: `copilot/add-static-pages-and-sitemap`
4. Título: `Feature: catálogo — product pages static + SEO`
5. Copia el contenido de `PR_DESCRIPTION.md` en el cuerpo del PR
6. Crea el Pull Request

## Opción 2: Mover commits a feature/catalogo

Si específicamente necesitas que el PR venga de `feature/catalogo`:

```bash
# En tu máquina local
git fetch origin
git checkout -b feature/catalogo origin/copilot/add-static-pages-and-sitemap
git push origin feature/catalogo
```

Luego crea el PR desde `feature/catalogo` hacia `main`.

## Verificación

Ambas ramas contienen los mismos commits:
- ✅ Commit 1: "Generate static product pages and sitemap"
- ✅ Commit 2: "Update service worker cache for product pages"

El trabajo está completo y listo para revisión.
