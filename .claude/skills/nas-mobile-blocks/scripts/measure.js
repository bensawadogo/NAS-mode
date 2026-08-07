/*
 * Sondes de mesure NAS MODE — à coller dans mcp__Claude_Browser__javascript_tool.
 *
 * Ce fichier ne s'exécute pas en Node. Chaque bloc ci-dessous est une IIFE
 * autonome : copie celle dont tu as besoin dans le paramètre `text`.
 *
 * Profil de référence : resize_window 360x560, puis navigate force:true
 * (les media queries et la détection mobile se réévaluent au chargement).
 */

// ---------------------------------------------------------------------------
// 1. POIDS ET REQUÊTES — la mesure de base, à faire sur chaque bloc.
//    Baseline nasmode.html : 662 Ko / 9 requêtes. defiles-gallery : 8049 Ko / 32.
// ---------------------------------------------------------------------------
;(() => {
  const res = performance.getEntriesByType('resource')
  const nav = performance.getEntriesByType('navigation')[0]
  const total = res.reduce((a, b) => a + (b.transferSize || 0), 0)
  const imgs = res.filter((r) => /\.(jpg|jpeg|png|webp|svg)/.test(r.name))
  return {
    totalTransferKB: Math.round(total / 1024),
    resourceCount: res.length,
    imageCount: imgs.length,
    imageKB: Math.round(imgs.reduce((a, b) => a + (b.transferSize || 0), 0) / 1024),
    biggest: res
      .map((r) => ({ n: r.name.split('/').pop().slice(0, 45), kb: Math.round((r.transferSize || 0) / 1024) }))
      .sort((a, b) => b.kb - a.kb)
      .slice(0, 10),
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
    loadEvent: Math.round(nav.loadEventEnd),
    // Estimation Slow 3G : 400 kbps utiles => ~50 Ko/s. À présenter comme calcul, pas comme mesure.
    estimated3GSeconds: Math.round(total / 1024 / 50),
  }
})()

// ---------------------------------------------------------------------------
// 2. ASSETS TÉLÉCHARGÉS MAIS JAMAIS AFFICHÉS (bloc 2)
//    Détecte le gaspillage type preload hero-02.webp (304 Ko).
//    Croiser avec read_console_messages : Chrome émet lui-même l'avertissement
//    "was preloaded using link preload but not used".
// ---------------------------------------------------------------------------
;(() => {
  const shown = new Set()
  document.querySelectorAll('img').forEach((i) => i.currentSrc && shown.add(i.currentSrc))
  document.querySelectorAll('*').forEach((el) => {
    const bg = getComputedStyle(el).backgroundImage
    if (bg && bg !== 'none' && getComputedStyle(el).display !== 'none') {
      const m = bg.match(/url\("?([^")]+)"?\)/)
      if (m) shown.add(new URL(m[1], location.href).href)
    }
  })
  const fetched = performance
    .getEntriesByType('resource')
    .filter((r) => /\.(jpg|jpeg|png|webp)/.test(r.name))
  return {
    wasted: fetched
      .filter((r) => !shown.has(r.name))
      .map((r) => ({ n: r.name.split('/').pop(), kb: Math.round((r.transferSize || 0) / 1024) })),
    wastedTotalKB: Math.round(
      fetched.filter((r) => !shown.has(r.name)).reduce((a, b) => a + (b.transferSize || 0), 0) / 1024
    ),
  }
})()

// ---------------------------------------------------------------------------
// 3. CIBLES TACTILES < 44x44 (bloc 5) — WCAG 2.5.5. Baseline : 23 éléments.
// ---------------------------------------------------------------------------
;(() => {
  const small = []
  document.querySelectorAll('a, button, input, select, textarea, [onclick], [role=button]').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) return
    if (r.height < 44 || r.width < 44) {
      small.push({
        tag: el.tagName,
        txt: (el.textContent || el.placeholder || '').trim().slice(0, 30),
        w: Math.round(r.width),
        h: Math.round(r.height),
      })
    }
  })
  return { count: small.length, targets: small }
})()

// ---------------------------------------------------------------------------
// 4. CLS / DIMENSIONS D'IMAGES (bloc 6) — baseline : 16/16 sans width+height.
// ---------------------------------------------------------------------------
;(() => {
  const missing = [...document.images]
    .filter((i) => !(i.getAttribute('width') && i.getAttribute('height')))
    .map((i) => (i.currentSrc || i.src).split('/').pop().slice(0, 45))
  return { totalImgs: document.images.length, missingDims: missing.length, files: missing }
})()

// ---------------------------------------------------------------------------
// 5. GÉOMÉTRIE DU HERO (blocs 2 et 5)
//    Vérifie que les CTA tiennent dans le viewport et que la flèche ↓ ne les
//    recouvre pas. Baseline 360x560 : CTA bottom 529, flèche top 520 => collision.
// ---------------------------------------------------------------------------
;(() => {
  const g = (e) =>
    e
      ? (({ top, bottom, height }) => ({ top: Math.round(top), bottom: Math.round(bottom), h: Math.round(height) }))(
          e.getBoundingClientRect()
        )
      : null
  const hero = document.getElementById('hero')
  const cta = document.querySelector('.hero-line-3')
  const arrow = document.getElementById('hero-scroll')
  const heroR = hero && hero.getBoundingClientRect()
  const ctaR = cta && cta.getBoundingClientRect()
  const arrowR = arrow && arrow.getBoundingClientRect()
  return {
    vh: innerHeight,
    hero: g(hero),
    h1: g(document.querySelector('.hero-line-1')),
    cta: g(cta),
    arrow: g(arrow),
    ctaClipped: ctaR && heroR ? ctaR.bottom > heroR.bottom : null,
    arrowOverlapsCta: ctaR && arrowR ? arrowR.top < ctaR.bottom : null,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
  }
})()

// ---------------------------------------------------------------------------
// 6. ACCESSIBILITÉ DU MENU MOBILE (bloc 5)
//    Baseline : hiddenLinksStillFocusable = true (bug), pas d'aria-expanded.
// ---------------------------------------------------------------------------
;(() => {
  const m = document.getElementById('mobile-menu')
  const toggle = document.getElementById('menu-toggle')
  const cs = getComputedStyle(m)
  const first = m.querySelector('a')
  first.focus()
  const focusable = document.activeElement === first
  first.blur()
  return {
    display: cs.display,
    visibility: cs.visibility,
    opacity: cs.opacity,
    hasInert: m.hasAttribute('inert'),
    ariaHidden: m.getAttribute('aria-hidden'),
    hiddenLinksStillFocusable: focusable, // doit devenir false
    toggleAriaExpanded: toggle.getAttribute('aria-expanded'),
    toggleAriaControls: toggle.getAttribute('aria-controls'),
  }
})()

// ---------------------------------------------------------------------------
// 7. POLICES (bloc 4) — baseline : 93 @font-face, 2 domaines externes.
// ---------------------------------------------------------------------------
;(() => {
  const ext = performance.getEntriesByType('resource').filter((r) => /gstatic|googleapis/.test(r.name))
  return {
    fontFaceCount: document.fonts.size, // doit chuter fortement
    families: [...new Set([...document.fonts].map((f) => f.family))],
    externalFontRequests: ext.map((r) => r.name.slice(-70)),
    externalOrigins: [...new Set(ext.map((r) => new URL(r.name).origin))],
  }
})()

// ---------------------------------------------------------------------------
// 8. GALERIE WEBGL (bloc 1)
//    Baseline : 27 textures, 7533 Ko, ~106 Mo GPU, aucun rendu avant chargement complet.
// ---------------------------------------------------------------------------
;(() => {
  const res = performance.getEntriesByType('resource')
  const imgs = res.filter((r) => /\.(jpg|jpeg|png|webp)/.test(r.name))
  const canvas = document.querySelector('canvas.webgl')
  let gpuMB = null
  if (canvas) {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    gpuMB = gl ? 'contexte WebGL actif' : 'PAS DE CONTEXTE WEBGL'
  }
  return {
    totalKB: Math.round(res.reduce((a, b) => a + (b.transferSize || 0), 0) / 1024),
    textureCount: imgs.length,
    textureKB: Math.round(imgs.reduce((a, b) => a + (b.transferSize || 0), 0) / 1024),
    canvasPresent: !!canvas,
    webgl: gpuMB,
    // Un fallback HTML doit exister quand WebGL est indisponible ou sur mobile :
    htmlFallbackPresent: !!document.querySelector('[data-gallery-fallback], .gallery-fallback'),
    visibleImgTags: document.images.length,
  }
})()
