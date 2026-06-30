# SEO Audit

## Toegevoegd
- `index.html` heeft nu een productiegerichte title: `ChemTrainer USG | Scheikunde leren voor VWO`.
- Toegevoegde metadata: description, `robots`, canonical, Open Graph, Twitter card, `theme-color`, `application-name`, `lang="nl"`.
- Structured data toegevoegd via JSON-LD als `EducationalApplication`.
- Publieke crawlbare pagina's toegevoegd:
  - `public/over-chemtrainer.html`
  - `public/scheikunde-vwo.html`
  - `public/voor-docenten.html`
- Crawl- en discoverybestanden toegevoegd:
  - `public/llms.txt`
  - `public/robots.txt`
  - `public/sitemap.xml`
- Rustige footerlinks toegevoegd in de app, zodat de publieke SEO-pagina's niet orphan blijven.

## Production URL
- Huidige centrale productie-URL in metadata en sitemap: `https://chemtrainer-usg.vercel.app/`
- Deze URL moet worden aangepast zodra een custom domain de definitieve productie-URL wordt.

## Eerlijke SEO-keuzes
- Geen keyword stuffing.
- Geen verborgen tekst.
- Geen cloaking.
- Publieke pagina's bevatten gewone, leesbare uitleg voor leerlingen, docenten en AI-crawlers.

## Later verbeteren
- Custom domain koppelen en daarna canonical/sitemap/OG URL's bijwerken.
- Google Search Console koppelen.
- Meer echte URL-routes per module toevoegen in plaats van alleen de SPA-root.
- SSR of prerendering overwegen als toekomstige indexatie-optimalisatie.
