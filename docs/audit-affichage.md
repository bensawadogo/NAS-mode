# Audit d'affichage NAS MODE

Mesuré le 2026-08-08 · serveur local `http://localhost:4321` servant `public/`
Formats : **360×560** (Android bas de gamme, référence) · **768×1024** · **1440×900**
Rechargement `navigate force:true` après chaque `resize_window`.

Toutes les valeurs de ce rapport sont mesurées dans le navigateur, jamais estimées.
Aucune correction n'est proposée : seul l'écart est décrit.

---

## 1. Verdict par page

| Page | 360×560 | 768×1024 | 1440×900 | Verdict |
|---|---|---|---|---|
| `/nasmode.html` | FAIL | FAIL | FAIL | **FAIL** — texte du hero sous le seuil de contraste aux 3 formats |
| `/ecole/` | FAIL | FAIL | FAIL | **FAIL** — 18 combinaisons de contraste sous le seuil + 2 contradictions de contenu |
| `/contact/` | FAIL | PASS | PASS | **FAIL** — texte du schéma SVG à 4,7–7,8 px sur mobile ; 6 ancres cassées ; 2 liens morts |
| `/soutenir/` | FAIL | non mesuré (voir §7) | FAIL | **FAIL** — 2 requêtes YouTube au chargement ; 3 contrastes sous le seuil ; faute « NAS MODe » |
| `/defiles-gallery/` | FAIL | non mesuré (voir §7) | FAIL | **FAIL** — affichage correct, mais 3 702 Ko / 28 images sans `srcset`, 28/28 surdimensionnées |
| `/defiles.html` | non mesuré (voir §7) | non mesuré | FAIL | **FAIL** — `<h1>` et `<h2>` masqués par `display:none`, Tailwind CDN + Google Fonts externes |

Les 4 modales de formation sont **PASS** (§3).

---

## 2. Tableau de mesures

| Page | Format | Contrôle | Mesuré | Attendu | |
|---|---|---|---|---|---|
| nasmode | 360 | images cassées | 0/16 | 0 | ✅ |
| nasmode | 360 | débordement horizontal | scrollWidth 360 / innerWidth 360 | égal | ✅ |
| nasmode | 360 | texte tronqué | 0 | 0 | ✅ |
| nasmode | 360 | superpositions | 0 | 0 | ✅ |
| nasmode | 360 | cibles < 44 px | 0 | 0 | ✅ |
| nasmode | 360 | contraste H1 hero / hero-mobile-1 | médiane **1,70:1**, 78,5 % de la surface < 3:1 | ≥ 3:1 | ❌ |
| nasmode | 360 | contraste CTA « POSTULER » / hero-mobile-3 | médiane **2,76:1**, 99,9 % de la surface < 4,5:1 | ≥ 4,5:1 | ❌ |
| nasmode | 360 | `document.fonts.size` | 5 | 5 | ✅ |
| nasmode | 360 | origines externes | 0 | 0 | ✅ |
| nasmode | 360 | variantes servies | `-768` (7 fichiers) | variante adaptée | ✅ |
| nasmode | 360 | poids / requêtes | 565 Ko / 15 | — | — |
| nasmode | 360 | menu mobile fermé focusable | false, `aria-hidden=true`, toggle 44×44, `aria-expanded` présent | non focusable | ✅ |
| nasmode | 360 | compteurs | 3000+ / 23 / 100 % | valeurs cibles | ✅ |
| nasmode | 768 | débordement / troncature / superposition | 0 / 0 / 0 | 0 | ✅ |
| nasmode | 768 | cibles < 44 px | 18 | 0 | ❌ (voir §5.4) |
| nasmode | 1440 | images / débordement / troncature | 0 cassée, sw 1425, 0 tronqué | — | ✅ |
| nasmode | 1440 | cibles < 44 px | 23, dont **17 sans classe `tap-target`** | — | ❌ (voir §5.4) |
| nasmode | 1440 | contraste H1 hero / hero-02 | médiane 1,53:1, 82,2 % < 3:1 | ≥ 3:1 | ❌ |
| nasmode | 1440 | contraste CTA / hero-04 | médiane 3,70:1, 68,9 % < 4,5:1 | ≥ 4,5:1 | ❌ |
| nasmode | 1440 | libellé « JEUNES FORMÉS » #B5562C/#1A1A1A 12 px | 3,59:1 | ≥ 4,5:1 | ❌ |
| nasmode | 1440 | poids / requêtes | 1 598 Ko / 26 | — | — |
| nasmode | 1440 | assets téléchargés inutilisés | 0 | 0 | ✅ |
| ecole | 360 | images cassées | 0/13 | 0 | ✅ |
| ecole | 360 | débordement / troncature / superposition | 0 / 0 / 0 | 0 | ✅ |
| ecole | 360 | cibles < 44 px | 0 | 0 | ✅ |
| ecole | 360 | contraste — combinaisons distinctes sous seuil | **18** | 0 | ❌ (voir §5.2) |
| ecole | 360 | contraste H1 hero (scrim 40 %) | médiane 5,96:1, 2,7 % < 3:1 | ≥ 3:1 | ✅ |
| ecole | 360 | contraste sous-titre hero 13 px, blanc 60 % | médiane 3,41:1, **73,6 % < 4,5:1** | ≥ 4,5:1 | ❌ |
| ecole | 360 | `document.fonts.size` / origines externes | 5 / 0 | 5 / 0 | ✅ |
| ecole | 360 | poids / requêtes | 790 Ko / 21 | — | — |
| ecole | 768 | débordement / troncature / superposition | 0 / 0 / 0 | 0 | ✅ |
| ecole | 768 | cibles < 44 px | 40 | 0 | ❌ (voir §5.4) |
| ecole | 1440 | débordement / troncature / superposition | 0 / 0 / 0 | 0 | ✅ |
| ecole | 1440 | poids | 827 Ko | — | — |
| contact | 360 | images / débordement / troncature / superposition | 0 cassée sur 5, 0, 0, 0 | 0 | ✅ |
| contact | 360 | cibles < 44 px | 0 | 0 | ✅ |
| contact | 360 | **requêtes externes avant clic** | **0** | 0 | ✅ |
| contact | 360 | Leaflet chargé avant clic | `window.L` = false | false | ✅ |
| contact | 360 | schéma SVG affiché | 312×187 px, 0 débordement | affiché | ✅ |
| contact | 360 | **taille du texte dans le SVG** | villes **7,8 px**, coordonnées **5,5 px**, légende **4,7 px** (échelle 0,39) | lisible | ❌ |
| contact | 360 | liens de sortie hors carte | 4 liens, 44 px de haut chacun | ≥ 44 | ✅ |
| contact | 360 | bloc utilisable sans JS | SVG + 4 liens en HTML statique ; bouton révélé par JS seulement | utilisable | ✅ |
| contact | 360 | contraste | 1 sous seuil (#B5562C/#1A1A1A 12 px = 3,59:1) | 0 | ❌ |
| contact | 768 | cibles < 44 px | 28 (liens de sortie retombés à 22 px, téléphones à 20 px) | 0 | ❌ (voir §5.4) |
| contact | 1440 | débordement / troncature / superposition | 0 / 0 / 0 | 0 | ✅ |
| contact | 1440 | SVG | 1 152×691, villes 28,8 px | lisible | ✅ |
| soutenir | 360 | images / débordement / troncature | 0 cassée sur 2, 0, 0 | 0 | ✅ |
| soutenir | 360 | cibles < 44 px | 0 | 0 | ✅ |
| soutenir | 360 | **origines externes** | **`https://www.youtube.com`** (2 iframes chargées au load) | 0 | ❌ |
| soutenir | 1440 | contraste | 3 sous seuil (voir §5.2) | 0 | ❌ |
| soutenir | 1440 | débordement / troncature / superposition | 0 / 0 / 0 | 0 | ✅ |
| soutenir | 1440 | poids | 386 Ko / 11 requêtes locales | — | — |
| defiles-gallery | 360 | mode réduit actif | grille légère, canvas 0×0 | grille légère | ✅ |
| defiles-gallery | 360 | images cassées | 0/28 | 0 | ✅ |
| defiles-gallery | 360 | débordement / troncature / superposition / cibles | 0 / 0 / 0 / 0 | 0 | ✅ |
| defiles-gallery | 360 | contraste en-tête sur fond crème | 0 combinaison sous seuil | 0 | ✅ |
| defiles-gallery | 360 | **poids** | **3 702 Ko / 33 requêtes**, dont 3 663 Ko d'images | — | ❌ |
| defiles-gallery | 360 | `srcset` sur les images de la grille | **0 / 28** | présent | ❌ |
| defiles-gallery | 360 | images surdimensionnées (natW > 2,5 × cssW) | **28 / 28** (965–1280 px natifs pour 324 px CSS) | 0 | ❌ |
| defiles-gallery | 360 | `document.fonts.size` | **2** (IBM Plex Mono seul) | 5 | ⚠ voir §6 |
| defiles-gallery | 1440 | canvas / débordement / troncature | 0×0, sw 1425, 0 | — | ✅ |
| defiles-gallery | 1440 | images surdimensionnées | 28 / 28 (cellule 576 px CSS) | 0 | ❌ |
| defiles.html | 1440 | **`<h1>` « Nos Défilés »** | `display: none` | visible | ❌ |
| defiles.html | 1440 | **`<h2>` « Galerie des collections NAS MODE »** | `display: none` | visible | ❌ |
| defiles.html | 1440 | texte visible dans `<body>` | **105 caractères** (les deux barres de navigation seules) | contenu de la page | ❌ |
| defiles.html | 1440 | `document.fonts.size` | **94** | 5 | ❌ |
| defiles.html | 1440 | origines externes | **`cdn.tailwindcss.com`, `fonts.googleapis.com`** | 0 | ❌ |
| defiles.html | 1440 | classes `tap-target` | **0** | — | ❌ |
| defiles.html | 1440 | poids | 2 654 Ko / 26 | — | — |
| toutes | — | URL locales | **210 testées, 0 en échec** | 0 | ✅ |
| toutes | — | 404 console | uniquement `_vercel/speed-insights` et `_vercel/insights` (2 par page) | normal en local | ✅ |

---

## 3. Les 4 modales de formation — PASS

Ouvertes par `openModal('stylisme'|'coiffure'|'esthetique'|'maquillage')` à **360×560** et **1440×900**.

| Modale | Fiches métier | `NIVEAU D'ADMISSION` | `DOCUMENT DE FIN DE FORMATION` | Occurrences « F CFA » |
|---|---|---|---|---|
| stylisme | 6 | 6 | 6 | 26 = 6×4 montants + 2 commodités |
| coiffure | 2 | 2 | 2 | 10 = 2×4 + 2 |
| esthetique | 1 | 1 | 1 | 6 = 1×4 + 2 |
| maquillage | 1 | 1 | 1 | 6 = 1×4 + 2 |
| **total** | **10** | **10** | **10** | **4 montants par fiche, sans exception** |

Les 10 fiches attendues sont présentes : Mécanicien de confection, Couturier dame, Modéliste, Technicien de confection, Styliste, Tailleur homme et dame (stylisme) · Coiffeur dame, Coiffeur dame Spécialisation (coiffure) · Esthéticien (esthétique) · Maquilleur Cinéma et Télévision (maquillage).

Les 40 montants ont été relus un à un contre `docs/depliant-transcription.md` : **40/40 conformes**.

Géométrie et manipulation :

| Contrôle | 360×560 | 1440×900 |
|---|---|---|
| boîte de la modale | 360×515, top 45, bottom 560 | 1200×765, top 68, bottom 833 |
| tient dans le viewport | oui (bottom = innerHeight) | oui |
| pied de modale visible | oui | oui |
| débordement horizontal du corps | non | non |
| débordement horizontal de la page | non | non |
| texte tronqué dans la modale | 0 | 0 |
| bouton de fermeture | 44×44, dans le viewport, reçoit bien le clic (`elementFromPoint`) | 36×36, dans le viewport, reçoit bien le clic |
| fermeture par Échap | oui, `document.body.style.overflow` restauré | oui |

Les 6 emplacements « à confirmer auprès du centre » s'affichent dans les 4 modales, jamais vides, jamais tronqués, suivis du téléphone.

Deux réserves, sans gravité d'affichage :
- le bouton de fermeture mesure **36×36 à 1440** (44×44 seulement sous 768 px) ;
- le lien téléphone du bloc « à confirmer » mesure **93×17** dans la modale à 1440.

---

## 4. Incohérences entre pages — ce que Ben veut voir en premier

### 4.1 Faits contradictoires

| # | Sujet | Page A | Page B | Écart |
|---|---|---|---|---|
| 1 | **Réinscription** | modales de l'accueil : « Inscription / réinscription — 10 000 F CFA » (montant unique) | `/ecole/` : « **Réinscription à un tarif réduit** » | Contradiction directe. Le dépliant imprime inscription et réinscription **au même montant** ; `faits-confirmes-client.md` classe « tarif réduit » comme non sourcé. |
| 2 | **Ce que couvre l'internat** | `/ecole/`, bloc « Organisation de la formation » : « Ce que couvre l'internat — **à confirmer auprès du centre** » | `/ecole/`, note sous le tableau des tarifs, 3 000 px plus haut : « Internat (formation avec **pension complète**, réservé aux jeunes filles) » | La même page affirme puis déclare inconnue la même information. |
| 3 | **Formations prévues à Abidjan** | `/ecole/` : « Formations prévues : Stylisme & Couture, Coiffure, Esthétique, Maquilleur Cinéma et Télévision » (**4 filières**) | `/contact/` : « Enseignements prévus en **stylisme & modélisme** » | Deux réponses différentes à la même question sur le même campus. |
| 4 | **Filière unique au Burkina Faso** | `/ecole/`, fiche Maquilleur : « **Filière unique au Burkina Faso.** » | modale `maquillage` de l'accueil : la mention est absente | Affirmation non sourcée présente sur une page, absente de l'autre. |
| 5 | **Téléphones du bloc « à confirmer »** | modales de l'accueil : **1 numéro** (`+226 78 01 41 98`) | `/ecole/` : **2 numéros** (`+226 78 01 41 98 · +226 65 81 18 18`) | Même bloc, deux contenus. |
| 6 | **Téléphones en pied de page** | `/nasmode.html` : **2 numéros** | `/contact/` et `/ecole/` : **3 numéros** (avec `+226 25 47 05 85`) | Le numéro fixe du dépliant manque sur l'accueil. |

### 4.2 Divergences de forme

| # | Sujet | Écart mesuré |
|---|---|---|
| 7 | **Couleur d'accent** | `/nasmode.html` : `#B5562C` (24 occurrences), `#C17D5A` absent. `/ecole/` : `#C17D5A` (20 occurrences) contre `#B5562C` (11). Deux oranges différents pour le même rôle. C'est `#C17D5A` qui produit la majorité des échecs de contraste de la page École (3,10–3,31:1). |
| 8 | **Scrim du hero** | `/nasmode.html` : `rgba(0,0,0,0.15)`. `/ecole/` : `rgba(0,0,0,0.4)`. Même motif de conception, deux traitements ; seul celui de l'accueil échoue. |
| 9 | **Ombre portée du texte du hero** | H1 de l'accueil : `0 2px 12px rgba(0,0,0,.5)` présente. CTA « POSTULER » du même hero : **aucune ombre**, alors que c'est le texte le plus petit (12 px) et le plus exigeant (4,5:1). |
| 10 | **Nom du métier de maquillage** | Cohérent partout : « Maquilleur Cinéma et Télévision » (accueil section + pied de page + modale, École liste + tableau + campus). **Aucun écart.** |
| 11 | **Nom du 10ᵉ métier** | modale : « Coiffeur dame Spécialisation » · `/ecole/` : « Coiffeur dame — **Spécialisation** » (tiret cadratin ajouté). |
| 12 | **Unité monétaire du module supplémentaire** | modales : « 30 000 **FCFA** » (littéral du dépliant) · `/ecole/` : « 30 000 **F CFA** » (normalisé). |
| 13 | **Couleur du texte courant** | `#474743` sur l'accueil, `#474741` sur École ; `#72716D` sur l'accueil, `#787874` / `#8A857D` sur École. |
| 14 | **Typographie de la galerie** | `/defiles-gallery/` charge **IBM Plex Mono** (`document.fonts.size` = 2), police utilisée nulle part ailleurs sur le site. |
| 15 | **Domaine dans les métadonnées** | `/defiles-gallery/` : `og:image` pointe vers `https://bensawadogo.github.io/NAS-mode/…` ; toutes les autres pages vers `https://nas-mode.vercel.app/…`. |
| 16 | **Jetons de cache sur les favicons** | `/nasmode.html`, `/contact/`, `/defiles.html` : `images/ecole/logo-nas-mode.png?v=641972E6`. `/ecole/`, `/soutenir/` : `/images/ecole/logo-nas-mode.png` sans jeton. |
| 17 | **Jeton de cache du nouveau script** | `js/infos-a-confirmer.js**?v=1**` sur les deux pages qui le chargent, alors que les 100 autres jetons sont des empreintes de contenu (`?v=9268AC77`…). Une modification du fichier ne cassera pas le cache. |
| 18 | **Couverture des cibles tactiles** | nombre de classes `tap-target` : École 49, Contact 24, Soutenir 15, **nasmode.html 8**, defiles-gallery 4, **defiles.html 0**. |

### 4.3 Compteurs — cohérents

| Emplacement | Valeurs |
|---|---|
| `/nasmode.html` | 3000+ jeunes formés · 23 promotions · 100 % taux de réussite CQP |
| `/ecole/` | 25 années d'expérience · 3000+ apprenants formés · 10 métiers de formation · 80 % d'insertion · 1 campus en activité |

« 3000+ » identique sur les deux pages ✅ · « 10 métiers » = les 10 fiches des modales ✅ · « 25 ans » cohérent avec « Depuis 2001 » ✅ · « 80 % » cohérent avec « 80 % des diplômé(e)s exercent » de l'accueil ✅ · « 1 campus en activité » cohérent avec Abidjan au futur ✅.

Tension arithmétique mineure : `/ecole/` annonce « près de 200 jeunes chaque année » sur 25 ans, soit ~5 000, pour un total affiché de 3 000.

### 4.4 Formulations d'Abidjan — toutes au futur ✅

`/nasmode.html` « s'implantera prochainement » · `/ecole/` « ouvrira prochainement », « franchira », « incarnera », « Bientôt deux campus », « Formations prévues », « Abidjan ouvrira prochainement » · `/contact/` « Campus à venir », « Ouverture prochaine », « Enseignements prévus ». Aucun présent résiduel trouvé.

---

## 5. Défauts classés par gravité

### 5.1 Empêche de lire ou de cliquer

**D1 — `defiles.html` : le titre et le sous-titre de la page sont supprimés de l'affichage.**
`defiles.html:212-218` applique `display: none !important` à `.reveal-up` **en même temps** qu'au curseur personnalisé, dans la même règle `@media (prefers-reduced-motion: reduce)`. Le `<h1>` « Nos Défilés » et le `<h2>` « Galerie des collections NAS MODE » portent la classe `.reveal-up`. Mesuré : `display: none`, rectangle `0×0`, `document.body.innerText.length = 105` (les deux barres de navigation seules). Pour tout visiteur ayant activé la réduction des animations — courant sur les Android en mode économie d'énergie — la page est une grille d'images sans un mot de texte.
`nasmode.html:319-327` fait la même chose **correctement**, en deux règles séparées : `display:none` pour le curseur, `opacity:1` pour les `.reveal-*`. L'écart est propre à `defiles.html`.

**D2 — Texte du hero de l'accueil sous le seuil de contraste, aux trois formats.**
Scrim mesuré : `rgba(0,0,0,0.15)`. Contraste calculé pixel par pixel entre la couleur du texte et l'image composée sous le scrim.

| Format | Image | Élément | Seuil | Médiane | % de la surface sous le seuil |
|---|---|---|---|---|---|
| 360×560 | hero-mobile-1 | H1 (ivoire, 28 px) | 3:1 | 1,70:1 | **78,5 %** |
| 360×560 | hero-mobile-2 | H1 | 3:1 | 2,51:1 | 50,3 % |
| 360×560 | hero-mobile-3 | H1 | 3:1 | 1,96:1 | 75,4 % |
| 360×560 | hero-mobile-1 | CTA « POSTULER » (12 px, 600) | 4,5:1 | 3,59:1 | 80,8 % |
| 360×560 | hero-mobile-2 | CTA « POSTULER » | 4,5:1 | 3,00:1 | 82,6 % |
| 360×560 | hero-mobile-3 | CTA « POSTULER » | 4,5:1 | 2,76:1 | **99,9 %** |
| 1440×900 | hero-02 | H1 (56 px) | 3:1 | 1,53:1 | 82,2 % |
| 1440×900 | hero-04 | CTA « POSTULER » | 4,5:1 | 3,70:1 | 68,9 % |
| 1440×900 | hero-02 | flèche ↓ (ivoire 50 %) | 3:1 | 1,80:1 | **100 %** |

Le H1 porte une ombre portée qui atténue la perception sans compter dans le calcul WCAG. **Le CTA « POSTULER » n'en a aucune** — c'est le texte le plus petit et le plus mal contrasté du hero.
La flèche ↓ est calculée avec l'ivoire plein ; sa couleur réelle est `text-ivory-base/50`, donc son contraste réel est **inférieur** aux 1,80:1 indiqués.

**D3 — `/contact/` : le texte du schéma SVG est illisible sur mobile.**
À 360×560 le SVG (`viewBox="0 0 800 480"`) est rendu à 312 px de large, soit une échelle de **0,39**. Tailles effectives : noms de villes **7,8 px**, coordonnées **5,5 px**, titre « NOS DEUX IMPLANTATIONS » **5,1 px**, légende « Schéma de situation » **4,7 px**. Le repère graphique reste lisible, le texte non. À 768 (échelle 0,88) et à 1440 (1,44) le problème disparaît.

**D4 — Six liens de navigation portent le jeton de cache après le fragment.**
Le fragment devient `#formations?v=938A33F0` / `#ecole?v=891C09C3`, qui ne correspond à aucun `id`. Le visiteur atterrit en haut de l'accueil au lieu de la section demandée.

| Fichier | Lignes | Cible |
|---|---|---|
| `contact/index.html` | 264, 278, 530, 531, 532, 533 | `../index.html#formations?v=938A33F0` |
| `soutenir/index.html` | 217, 230 | `../index.html#formations?v=938A33F0` |
| `defiles.html` | 254, 267 | `nasmode.html#formations?v=891C09C3` |
| `defiles.html` | 256, 269 | `nasmode.html#ecole?v=891C09C3` |

**12 occurrences au total.** `ecole/index.html` écrit correctement `../index.html?v=938A33F0#formations` (10 occurrences vérifiées) — la passe de réécriture des 102 jetons n'a donc été appliquée correctement que sur une page sur quatre.

**D5 — Liens de pied de page morts.**
`contact/index.html:538` « Presse » et `:539` « Mentions légales », `ecole/index.html:2127` « Mentions légales » : `href="#"`. Trois liens visibles qui ne mènent nulle part.

### 5.2 Contraste sous le seuil sur fond uni

**`/ecole/` — 18 combinaisons distinctes.** Les plus visibles :

| Texte | Couleurs | Taille | Mesuré | Seuil |
|---|---|---|---|---|
| Bouton **« DÉCOUVRIR NOS FORMATIONS »** | ivoire sur `#C17D5A` | 12 px 600 | **3,10:1** | 4,5:1 |
| Diplôme sur les **10 fiches métier** (« Attestation de fin de formation », « CQP », « BQP », « BPT », « BPTS ») | `#C17D5A` sur blanc | 12 px 600 | **3,31:1** | 4,5:1 |
| Intitulés de packages (« PACKAGE 1 »…) | `#C17D5A` sur ivoire | 10 px 600 | 3,10:1 | 4,5:1 |
| Surtitres de section (« NOTRE HISTOIRE »…) | `#C17D5A` sur ivoire | 12 px 500 | 3,10:1 | 4,5:1 |
| Badge « Depuis 2001 » | ivoire sur `#C17D5A` | 11 px 600 | 3,10:1 | 4,5:1 |
| « Ouagadougou, Burkina Faso » | `#C17D5A` sur blanc | 14 px | 3,31:1 | 4,5:1 |
| Libellés du bloc « à confirmer » (« Durée de la formation »…) | `#8A8985` sur blanc | 11 px 500 | 3,50:1 | 4,5:1 |
| Libellé « Admission » et notes « Condition reproduite telle qu'imprimée… » | `#8A857D` sur blanc | 11–12 px | 3,66:1 | 4,5:1 |
| Libellés « Externat » / « Internat » des cartes de tarifs | `#8A857D` sur ivoire | 10 px 600 | 3,43:1 | 4,5:1 |
| Nom du métier sous les tarifs | `#787874` sur ivoire | 12 px 500 | 4,15:1 | 4,5:1 |
| Sous-titre du hero « NAS MODE — Centre de Formation Professionnelle » | blanc 60 % sur photo + scrim 40 % | 13 px | médiane 3,41:1, **73,6 % de la surface sous le seuil** | 4,5:1 |

La valeur « à confirmer auprès du centre » elle-même (`#5F5E5B`, 15,2 px, italique) mesure **6,1:1** — conforme ✅. Ce sont ses libellés qui échouent.

**`/soutenir/` — 3 combinaisons** (après résolution des couleurs `oklab` en RGB) :

| Texte | Couleurs | Mesuré | Seuil |
|---|---|---|---|
| **« Avec CHF 500, vous financez une année de formation… »** (texte de l'appel au don) | ivoire 90 % sur `#B5562C` | **3,62:1** | 4,5:1 |
| Surtitre « L'HISTOIRE DE BEA » | `#C17D5A` sur ivoire | 3,10:1 | 4,5:1 |
| Pied de page « Excellence Artisanale Ouest-Africaine » | ivoire 50 % sur `#1A1A1A` | 4,17:1 | 4,5:1 |

**`/nasmode.html` et `/contact/` — 1 combinaison chacune** : `#B5562C` sur `#1A1A1A`, 12 px 600 = **3,59:1** (libellés « JEUNES FORMÉS » / « PROMOTIONS » / « TAUX DE RÉUSSITE CQP » sur l'accueil, « EMAIL » / « TÉLÉPHONE » dans le pied de page de Contact).

`/defiles-gallery/` : **0 combinaison sous le seuil** ✅ — l'en-tête est lisible sur le fond crème.

### 5.3 Régressions par rapport aux optimisations

| # | Constat | Mesure |
|---|---|---|
| R1 | `/defiles-gallery/` sert les images **sans `srcset`** | **0/28** portent un `srcset` ; **28/28** ont une largeur native de 965–1 280 px pour une cellule de **324 px CSS** (360×560) ou **576 px CSS** (1440×900). Toutes les autres pages servent des variantes `-480`/`-768`/`-1024`. |
| R2 | Poids de `/defiles-gallery/` sur le profil de référence | **3 702 Ko / 33 requêtes** à 360×560, dont 3 663 Ko d'images. Plus grosse image seule : 276 Ko. À ~50 Ko/s (Slow 3G), cela **calcule** à ~74 s — chiffre déduit du poids, non chronométré. |
| R3 | `/defiles.html` n'a reçu aucune des optimisations | `document.fonts.size` = **94** (contre 5 partout ailleurs) ; charge **`cdn.tailwindcss.com`** (compilateur Tailwind à l'exécution) et **`fonts.googleapis.com`** ; polices « Material Symbols Outlined » et « Zina » absentes du reste du site ; **0 classe `tap-target`** ; 2 654 Ko / 26 requêtes. |
| R4 | `/soutenir/` est la seule page à contacter une origine tierce au chargement | 2 `<iframe>` YouTube (`loading="lazy"` mais requêtées dès le chargement) vers `https://www.youtube.com` — DNS + poignée de main TLS vers Google avant toute interaction. |
| R5 | Jeton de cache non fonctionnel sur le nouveau script | `js/infos-a-confirmer.js?v=1` sur `nasmode.html:1004` et `ecole/index.html:1378`. Jeton littéral, pas une empreinte : une correction du fichier ne sera pas prise en compte par les navigateurs qui l'ont déjà en cache. |
| R6 | Jetons de cache absents sur deux favicons | `ecole/index.html:22-23` et `soutenir/index.html:22-23` : `/images/ecole/logo-nas-mode.png` sans `?v=`. |

Contrôles de non-régression **réussis** : `document.fonts.size` = 5 sur nasmode, ecole, contact et soutenir ✅ · **0 origine externe** sur `nasmode.html` aux trois formats ✅ · **0 asset téléchargé mais jamais affiché** sur nasmode, ecole, contact, soutenir ✅ · variantes `-480`/`-768`/`-1024`/`-1280` correctement sélectionnées selon le format sur toutes les pages sauf la galerie ✅ · **210 URL locales testées sur les 6 pages, 0 en échec** ✅.

### 5.4 Cibles tactiles — mesure et sa limite

Ce navigateur rapporte `pointer: fine` et `hover: hover`. La règle `@media (pointer: coarse), (max-width: 767px)` qui agrandit `.tap-target` par un `::after` transparent **ne se déclenche donc jamais ici au-dessus de 767 px**. Les comptages à 768 et 1440 sont partiellement un artefact de mesure : sur une vraie tablette tactile, `(pointer: coarse)` s'activerait.

Ce qui reste vrai indépendamment du pointeur : **un élément sans la classe `.tap-target` ne sera jamais agrandi**, quel que soit l'appareil.

Sur `/nasmode.html` à 1440 : 23 éléments sous 44×44, dont **17 sans classe `.tap-target`** — les 5 liens de navigation de bureau (75×16, 53×16, 54×16, 158×16, 59×16), les 2 CTA du hero (241×36 et 120×40), les 4 liens « FORMATIONS » du pied de page (292×24), les 2 téléphones (292×24), l'email, « Nous écrire », et le bouton **« S'abonner » à 86×12**.

À 360×560, le format de référence, **toutes les pages mesurent 0 cible sous 44×44** ✅ — sauf `/defiles.html`, non mesurée à ce format.

### 5.5 Esthétique et contenu

| # | Constat |
|---|---|
| E1 | **Faute de frappe** : `/soutenir/`, carte « État du Burkina Faso » — « **NAS MODe** a reçu la distinction du ministère » (e minuscule). |
| E2 | **Ordre de lecture des cartes de tarifs de `/ecole/`** : mesuré aux trois formats, chaque carte affiche `EXTERNAT / 380 000 F CFA` (haut), `INTERNAT / 1 217 500 F CFA` (milieu), puis **le nom du métier en dernier**, en 12 px gris `#787874`. Le visiteur lit deux montants avant de savoir à quel métier ils se rapportent. Les modales de l'accueil font l'inverse : le nom du métier d'abord. |
| E3 | **Corrections éditoriales silencieuses du dépliant** : le site écrit « modélisme » (dépliant : « modelisme ») et « Niveau inférieur ou **égal** » (dépliant : « égale »). Appliquées de façon identique dans les modales et sur `/ecole/`, donc cohérentes entre elles, mais elles s'écartent de la transcription littérale. |
| E4 | **`/defiles-gallery/`** : l'en-tête annonce « DÉFILÉS — GALERIE IMMERSIVE » tandis que la ligne suivante indique « GALERIE ALLÉGÉE ». |
| E5 | **Compteurs et réduction d'animation** : l'animation des compteurs (`animateCounters`, durée 4 000 ms) n'est pas conditionnée à `prefers-reduced-motion`, contrairement aux transitions CSS de la même page. |
| E6 | **`/defiles.html`** : 20 balises `<img decoding="async" loading="lazy">` sans attribut `src` ni `srcset` propre — elles tirent leur source d'un `<source>` parent ; une image reste néanmoins à `naturalWidth = 0`. |

---

## 6. Points signalés dans la commande et confirmés conformes

- **Galerie Défilés** : la grille légère s'affiche correctement sous `prefers-reduced-motion`, le canvas WebGL mesure 0×0 (donc masqué), l'en-tête est lisible sur le fond crème (0 échec de contraste), 28 images sur 28 chargent, aucun débordement, aucune cible tactile insuffisante. **Le comportement de repli est conforme.** C'est le poids, pas l'affichage, qui échoue.
- **Carte de `/contact/`** : **0 requête vers une origine externe avant clic**, `window.L` reste `false`, le schéma SVG s'affiche, et le bloc reste utile sans JavaScript — le SVG et les 4 liens de sortie (44 px de haut chacun) sont du HTML statique, seul le bouton « Charger la carte interactive » est révélé par JS. **Conforme sur les trois points demandés.**
- **Emplacements « à confirmer auprès du centre »** : les 6 s'affichent dans les 4 modales et sur `/ecole/`, en italique `#5F5E5B` (6,1:1, conforme), jamais vides, jamais tronqués, sans casser la grille, avec le téléphone à côté. Seul écart : 1 numéro sur l'accueil contre 2 sur École (§4.1 n°5), et les **libellés** du bloc sont sous le seuil de contraste sur École (§5.2).
- **`document.fonts.size` = 2 sur `/defiles-gallery/`** : ce n'est pas une régression du nombre de fichiers de police (2 fichiers IBM Plex Mono, 31 Ko au total) mais un jeu typographique distinct du reste du site — reporté en §4.2 n°14 comme incohérence, pas comme régression.

---

## 7. Ce qui n'a pas été mesuré, et pourquoi

| Non mesuré | Raison |
|---|---|
| Rendu visuel (aspect, alignement, crénage, qualité photographique) | Le pane navigateur n'étant pas affiché, `computer{action:"screenshot"}` échoue en timeout. Tout passe par `javascript_tool` : je mesure des géométries et des couleurs calculées, je ne vois pas la page. Un défaut purement visuel sans traduction dans le DOM m'échappe. |
| `/soutenir/`, `/defiles-gallery/` et `/defiles.html` à **768×1024** | Non exécuté faute de temps de session. Les trois autres formats ont été couverts pour Soutenir et la galerie ; `defiles.html` n'a été mesurée qu'à 1440. |
| `/defiles.html` à **360×560** | Non exécuté. Le défaut D1 (`display:none` sur `.reveal-up`) est indépendant du format — la règle est dans `@media (prefers-reduced-motion: reduce)`, sans condition de largeur — mais les débordements et cibles tactiles de cette page à 360 restent inconnus. |
| Comportement réel de `.tap-target` sur pointeur grossier | Ce navigateur rapporte `pointer: fine`. `(pointer: coarse)` ne se déclenche jamais. Les comptages à 768 et 1440 sont donc majorés (§5.4). |
| Comportement de `/defiles.html` avec `cdn.tailwindcss.com` accessible | Le CDN renvoie 0 octet dans cet environnement (`transferSize: 0`). Je ne peux pas dire à quoi ressemble la page une fois Tailwind compilé. Le défaut D1 est en revanche indépendant du CDN : il vient d'une règle CSS inline (`defiles.html:212-218`). |
| Contraste du hero de `/soutenir/` | Le texte « Bourses, infrastructures et micro-crédits… » repose sur une image de fond ; la sonde a signalé `overImg` sans pouvoir résoudre le fond composé. Non chiffré. |
| Chargement effectif de la carte Leaflet après clic | Le clic n'a pas été déclenché : il aurait envoyé des requêtes vers `unpkg.com` et `tile.openstreetmap.org`. Seul l'état **avant** clic a été mesuré, qui est ce que la commande demandait. |
| Temps de chargement réels sur 3G | Aucune mesure réseau bridée. Les secondes citées en R2 sont un **calcul** à partir du poids, pas un chronométrage. |
| Lecture des vidéos YouTube de `/soutenir/` | `transferSize` = 0 sur les deux iframes (réponses opaques). La requête part, son poids réel n'est pas mesurable ici. |
| Les 404 individuelles de la console | La console agrège l'historique de la session, y compris des chargements `file://` antérieurs à cet audit (dont une `ReferenceError: L is not defined` qui provient d'une version antérieure de `/contact/`, avant le remplacement de Leaflet). J'ai contrôlé les 404 autrement : les **210 URL locales des 6 pages renvoient toutes 200**. Les seules 404 réelles sont `_vercel/speed-insights` et `_vercel/insights`, normales en local. |
