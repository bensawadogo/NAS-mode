---
name: nas-mobile-blocks
description: Pilote l'optimisation mobile/3G du site NAS MODE bloc par bloc — implémenter, valider, commiter, passer au suivant. Utiliser quand on travaille sur les performances, le poids, l'accessibilité tactile ou la compatibilité bas de gamme du site NAS MODE.
---

# Optimisation NAS MODE — bloc par bloc

Workflow strict : **un bloc à la fois**. On n'ouvre pas le bloc N+1 tant que le bloc N n'est pas validé PASS et commité.

## Le contexte qui décide de tout

Les visiteurs sont à Ouagadougou et Abidjan, sur des Android bas de gamme (1–2 Go RAM, 360×560 à 360×640) en 3G (~400 kbps utiles, 300 ms RTT). Un correctif élégant qui coûte 100 Ko est un mauvais correctif. Le site réel est du **HTML statique dans `public/`** — `app/` (Next.js) est du code mort.

## Boucle par bloc

1. **Annoncer le bloc** à l'utilisateur : ce qu'il corrige, les fichiers touchés, le gain visé chiffré.
2. **Implémenter** — déléguer à `nas-perf-fixer` (et `nas-asset-optimizer` si le bloc produit des assets). Lancer en `run_in_background: false` : le résultat est nécessaire avant de valider.
3. **Valider** — déléguer à `nas-mobile-validator`. Il rend PASS/FAIL chiffré à 360×560.
4. **Sur FAIL** : renvoyer l'écart à `nas-perf-fixer` via `SendMessage` (son contexte est intact, c'est moins cher qu'un nouvel agent). Revalider. Ne jamais requalifier un FAIL en PASS sans nouvelle mesure.
5. **Sur PASS** : rapporter les chiffres à l'utilisateur, proposer le commit, puis passer au bloc suivant.

**Ne jamais annoncer un gain non mesuré.** Le rapport du validateur est la seule source de vérité sur les chiffres.

## Les blocs, par ordre de priorité

L'ordre est celui du rapport gain/risque. Blocs 1 et 2 = l'essentiel du gain.

### Bloc 1 — Galerie Défilés (8 Mo → ~400 Ko)
Le plus gros problème du site. `defiles-gallery/src/Experience/Engine.js:80` fait un `Promise.all` sur les 27 textures et `init()` attend ce `await` avant tout rendu → écran vide pendant ~2 min 40 s en 3G. 106 Mo de textures GPU → contexte WebGL perdu ou onglet tué sur 1–2 Go de RAM. Aucun test de disponibilité WebGL → écran blanc définitif si absent.

Cible : servir une galerie **HTML/CSS + WebP lazy-loadée** sur mobile/connexion lente (`navigator.connection.effectiveType`, `navigator.deviceMemory`, `matchMedia`), garder le WebGL sur desktop, et sur desktop charger les 3 premières textures puis le reste progressivement. Prévoir un fallback si `WebGLRenderingContext` est indisponible.

### Bloc 2 — Hero de l'accueil (−430 Ko)
`public/nasmode.html:40` précharge `hero-02.webp` (304 Ko, 2120×1390) qui est en `display:none` sur mobile — Chrome le signale lui-même en console. Le vrai visuel mobile n'est pas préchargé. Les 3 slides sont en `opacity:0` (pas `display:none`) donc les 3 se téléchargent d'un coup (319 Ko) alors que les slides 2 et 3 n'apparaissent qu'à 8 s et 16 s.

Cible : preload conditionnel du bon visuel, chargement différé des slides 2–3.

### Bloc 3 — Images responsives (−60 %)
Aucun `srcset` nulle part. Un écran de 360 px reçoit des images de 1665 px. Générer 480/768/1280 via `nas-asset-optimizer`, câbler `srcset`+`sizes` via `nas-perf-fixer`.

### Bloc 4 — Polices (−3 allers-retours réseau)
`public/nasmode.html:39` charge 3 familles Google Fonts, toutes variantes → **93 `@font-face`**, et DNS+TLS vers `fonts.googleapis.com` **puis** vers `fonts.gstatic.com` avant le premier texte. Cormorant Garamond est demandé en 14 variantes pour 1 ou 2 réellement utilisées.

Cible : auto-héberger en woff2, sous-ensemble latin, uniquement les graisses utilisées. `fonts/Zina-Regular.woff2` est déclaré mais jamais utilisé — code mort.

### Bloc 5 — Tactile et accessibilité
23 cibles tactiles sous 44×44 px (WCAG 2.5.5), dont les liens principaux vers les formations à **24 px de haut** et le bouton « S'abonner » à **12 px**. La flèche ↓ du hero recouvre le bouton POSTULER à 560 px de haut. Le menu mobile fermé (`transform:translateX(100%)`, `opacity:0`, mais `display:flex` et `visibility:visible`) garde ses 5 liens **focusables au clavier et exposés aux lecteurs d'écran** — vérifié. `#menu-toggle` n'a ni `aria-expanded` ni `aria-controls`.

### Bloc 6 — CLS
16 images sur 16 sans `width`/`height` → décalages de mise en page pendant tout le chargement, très visibles en 3G.

### Bloc 7 — Correctifs fonctionnels
Newsletter factice (`onclick="alert(...)"`, input hors `<form>`, sans `name` ni label). « Mentions légales » → `href="#"`. « Presse » → `#formations`. Lien Facebook sans `rel="noopener"`. **BOM UTF-8 dans les 7 fichiers HTML** (`ef bb bf` avant `<!DOCTYPE>`) — le commit `69fa8b6` visait à le retirer, il est toujours là. `index.html` fait une double redirection (`<meta refresh>` **et** `location.href`) → un aller-retour complet en trop, à remplacer par une 301 Vercel. `vercel.json` met `no-cache` sur tout le HTML alors que les `?v=` gèrent déjà le cache-busting → 71 Ko re-téléchargés à chaque visite.

### Bloc 8 — Nettoyage
160 Mo de PNG/JPEG jamais servis dans `public/images`. `screenshot-gh.png` (1,4 Mo) et `nasmode-hero-screenshot.png` (3,2 Mo) référencés nulle part. 4 HTML orphelins (`*.bak-20260625`, `modal-prototype.html`, `compare-enhance.html`). `app/` + React + framer-motion + Next maintenus pour un simple `redirect()`.

**Bloc destructif** : faire confirmer la liste par l'utilisateur avant toute suppression.

## Ce qui marche déjà — ne pas casser

`prefers-reduced-motion` correctement géré partout · écouteurs scroll en `{passive:true}` + `requestAnimationFrame` · parallaxe et curseur personnalisé désactivés sous 768 px et sur pointeur tactile · `loading="lazy"` sur les images de contenu · piège à focus et gestion d'Échap dans le modal formations · JSON-LD propre.

## Harnais de mesure

- `scripts/serve.js` — serveur statique sur `public/`, port 4321
- `scripts/measure.js` — sondes à coller dans `javascript_tool` (poids, cibles tactiles, CLS, géométrie hero, a11y du menu)

Profil de référence : **360×560**. Le pane navigateur n'étant pas affiché, `computer{action:"screenshot"}` échoue en timeout — mesurer par `javascript_tool`.

Baselines mesurées le 2026-08-07 avant correctifs : voir le tableau dans `.claude/agents/nas-mobile-validator.md`.
