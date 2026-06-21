# AI Handoff — NAS MODE images

Objectif: fournir un état des lieux clair et reproductible pour qu'une autre IA (ou un ingénieur) puisse poursuivre le traitement des images et rester dans le contexte.

Résumé des actions récentes
- Script ajouté: `scripts/enhance-images.js` (options: `--dry-run`, `--filter`, `--limit`).
- Commande npm ajoutée: `images:enhance` -> `node ./scripts/enhance-images.js`.
- Exécution: dry-run puis exécution réelle réalisée. Enhancements appliqués via `sharp` (rotate, normalize, sharpen, modulate).

Backups
- Backups créés lors de l'exécution réelle: `public/images/originals/backups/2026-06-22T12-43-33-733Z-enhance/`
- Structure: catégories `ateliers/`, `defiles/`, `ecole/`, `hero/`, `portraits/`.

Journal & audit
- Fichier de suivi: `public/images/inventaire.md` — contient les entrées `dry-enhance:` et `enhanced:` avec horodatages et chemins vers les backups.

Fichiers importants
- `scripts/enhance-images.js` — pipeline d'amélioration (Node + sharp).
- `package.json` — script `images:enhance` ajouté.
- `public/images/originals/backups/...` — backups (NE PAS SUPPRIMER sans vérification).

Commandes utiles
- Dry-run sur 5 fichiers: `npm run images:enhance -- --dry-run --limit=5`
- Exécuter pour une catégorie: `npm run images:enhance -- --filter=ateliers`
- Exécution complète (déjà faite): `npm run images:enhance`

Comment revenir en arrière
1. Restaurer un fichier depuis le backup: copier depuis `public/images/originals/backups/<ts>-enhance/<category>/<file>` vers `public/images/<category>/<file>`.
2. Mettre à jour `public/images/inventaire.md` si restauration manuelle.

Recommandations pour la prochaine IA / étape suivante
- Vérifier visuellement un échantillon (fichier `public/compare-enhance.html` généré) et ajuster les paramètres `sharpen` / `modulate` si nécessaire.
- Ajouter un `--revert` flag au script pour restaurer automatiquement depuis le dernier backup (optionnel).
- Implémenter une étape de déduplication (perceptual hashing) si on veut supprimer/archiver similaires.
- Ajouter tests CI: vérifier que `public/images/inventaire.md` est mis à jour pour chaque opération ; vérifier que les backups existent.

Contexte Next.js
- Page diagnostic: `app/test-images/page.tsx` — contient correctifs LCP (loading eager pour l'image détectée).
- Note: éviter les commits/pushs automatiques. Ce repo contient modifications locales réalisées.

Contact / reproduction
- Pour reproduire localement: `npm install` puis `npm run images:enhance -- --dry-run --limit=5`.

---
Fait par l'agent: résumé auto-généré. Vérifier les backups avant toute suppression.

Design & directives de production
 - But : donner à une IA/humain tout le rationnel de design, les assets, et les règles de mise en œuvre pour poursuivre le développement du site sans clarification.

Identité visuelle
 - Nom de la marque : NAS MODE (site vitrine haute couture).
 - Ton : épuré, luxueux, minimaliste, mise en valeur des images (photographie produit/atelier/défilé).

Palette de couleurs (recommandée)
 - Primaire (noir profond) : #0B0B0B
 - Secondaire (ivoire / papier) : #F7F5F2
 - Accent doré : #C59C6D
 - Neutres : gris clair #EDEBE8, gris moyen #9B9895

Typographie
 - Titres : Playfair Display (Google Fonts) ou alternative serif haut de gamme. Fallbacks : serif, Georgia.
 - Texte courant : Inter ou Montserrat (sans-serif). Fallbacks : system-ui, -apple-system, 'Segoe UI', Roboto.
 - Déclaration Tailwind : ajouter dans `tailwind.config.js` sous `theme.extend.fontFamily` : `heading: ['Playfair Display', 'serif']`, `body: ['Inter', 'sans-serif']`.

Mise en page & grille
 - Largeur maximale du contenu : 1200px centralisé.
 - Marges verticales généreuses (taille base 1rem → spacing scale dans Tailwind : `py-12`/`py-16`).
 - Utiliser une grille 12 colonnes pour la galerie et fiche produit ; zoner le hero en 2 colonnes (image large / texte minimal).

Images & médias
 - Priorité aux images haute résolution des dossiers `public/images/*`.
 - Hero : aspect 3:2 ou 16:9, servir la version optimisée (webp/avif) pour LCP.
 - Portraits : carré 1:1 crop centré, ou crop focalisé si sujet non centré.
 - Gallery : mosaïque responsive, lazy-loading sauf pour LCP hero (eager si spécifié).
 - Conservation des originaux : `public/images/originals/backups/<ts>-enhance` (NE PAS SUPPRIMER).

Composants principaux à implémenter
 - `Header` : logo, navigation primaire, CTA 'Contact'.
 - `Hero` : image large + court texte superposé (typographie serif), CTA primaire.
 - `Gallery` : filtrable par catégorie (ateliers, defiles, portraits, ecole, hero).
 - `About` / `École` : texte de présentation + photo d'ambiance.
 - `Contact` : formulaire minimal + coordonnées; form handler optionnel (netlify/functions ou API route Next.js).
 - `Footer` : mentions légales, réseaux sociaux, copyright.

Accessibilité & SEO
 - Images : `alt` descriptifs obligatoires. Remplir `alt` depuis métadonnées si disponibles.
 - Contraste : vérifier sur chaque composant (WCAG AA minimum pour textes principaux).
 - Meta : pages principales avec meta title/description et Open Graph (og:image optimisé).

Next.js / Tailwind / Framer Motion — notes d'implémentation
 - Router : App Router (`app/`), conserver `app/test-images/page.tsx` pour diagnostics.
 - Tailwind : couleurs/typographie à ajouter dans `tailwind.config.js` (`theme.extend`).
 - Framer Motion : animations subtiles pour entrées de galerie, hover sur vignettes, transition hero → page.

Scripts & flux de travail liés aux images
 - Pipeline d'amélioration : `scripts/enhance-images.js` (flags détaillés plus haut). Toujours dry-run d'abord.
 - Audit : `scripts/audit-enhance.js` écrit `public/images/enhance-audit.json`.
 - Comparaison visuelle : ouvrir `public/compare-enhance.html` localement pour revue rapide.

Commandes locales essentielles
```
npm install
npm run dev
npm run images:report
npm run images:enhance -- --dry-run --limit=5
npm run images:enhance -- --filter=ateliers --gamma=1.08 --sharpen=0.5
npm run images:enhance -- --filter=hero --width=2000 --gamma=1.05
npm run images:enhance -- --filter=defiles --median=1 --gamma=1.1 --sharpen=0.6 --saturation=1.04
npm run images:enhance -- --filter=ateliers --format=webp --gamma=1.08
npm run images:restore -- --backup=2026-06-22T15-16-24-300Z-enhance
npm run images:enhance -- --revert --backup=2026-06-22T15-28-36-024Z-enhance
node scripts/audit-enhance.js
node scripts/compare-with-originals.js
```

Qualité & dimensions (état au 2026-06-22 v2)
- Problème identifié : les images avaient subi 3 passes d'enhancement (effet cumulé : hautes lumières brûlées, fichiers lourds).
- Actions correctives :
  1. Restauration depuis `2026-06-22T12-43-33-733Z-enhance` (état pré-enhancement initial).
  2. Passage doux : `sharpen=0.4`, `brightness=1.01`, `saturation=1.02`, `normalize=false`.
  3. **Passage pro** (2026-06-22T15:28) par catégorie avec gamma + median :
     - hero : `--width=2000 --gamma=1.05 --sharpen=0.3` (upscale 1338→2000px)
     - ateliers : `--gamma=1.08 --sharpen=0.5`
     - defiles : `--median=1 --gamma=1.1 --sharpen=0.6 --saturation=1.04`
     - portraits : `--gamma=1.05 --sharpen=0.4 --saturation=1.02`
     - ecole : `--gamma=1.05 --sharpen=0.4`
- Rapport dimensions : `public/images/dimensions-report.json`
- Résumé dimensions : ideal=8, ok=4, small=19 (hero passé de small→ideal)
- Scripts ajoutés :
  - `scripts/restore-images.js` — restaure depuis un backup `--backup=...`
  - `scripts/report-dimensions.js` — rapport JSON + console
  - `scripts/enhance-images.js` — flags : `--revert`, `--no-normalize`, `--sharpen`, `--brightness`, `--saturation`, `--gamma`, `--median`, `--width=N`, `--format=webp|jpeg|png`, `--dry-run`, `--filter`, `--limit`
- Images needing better sources : 19 images still "small" — liste dans dimensions-report.json.
- Page test : `/test-images` montre dimensions et poids.
- Comparaison visuelle : `public/compare-enhance.html`.

Conventions & bonnes pratiques
 - Ne pas modifier ou supprimer les backups automatiques.
 - Toute restauration ou re-run doit être documentée dans `public/images/inventaire.md` (ligne courte : timestamp + action + raison + chemin backup).
 - Garder les commits d'images hors d'une revue automatisée trop large (gros binaires). Préparer PRs séparées si besoin.

Où commencer pour une IA qui reprend
 1. Lire `AI_HANDOFF.md` (ce fichier) puis : `cat public/images/inventaire.md` pour l'historique.
 2. Lancer `npm install` puis `npm run dev` pour voir `app/test-images` et la page de diagnostic.
  3. Ouvrir `public/compare-enhance.html` pour parcourir visuellement les paires backup→actuel (valider OK/À revoir).
  4. Le dernier backup complet est `2026-06-22T15-28-36-024Z-enhance` (hero+ateliers), mais le passage defiles/portraits/ecole est dans les backups ~37-39Z.
  5. Commande revert tout : `npm run images:restore -- --backup=2026-06-22T15-16-24-300Z-enhance` (état avant passage pro).
  6. Pour images `À revoir` : soit `cp` depuis le backup, soit ré-exécuter avec paramètres ajustés.

Commande de restauration exemple
```
cp public/images/originals/backups/2026-06-22T13-44-21-308Z-enhance/defiles/defiles-screenshot-2026-06-21-200722.png public/images/defiles/defiles-screenshot-2026-06-21-200722.png
```

CI / déploiement (recommandations)
 - Pipeline CI : tests lint + build Next.js + check que `public/images/inventaire.md` n'est pas modifié accidentellement.
 - Déploiement : Vercel ou Netlify recommandés pour Next.js App Router. Déployer manuellement après validation visuelle.

Contacts / contexte
 - Tous les assets et scripts mentionnés se trouvent dans ce repo. Si l'IA a besoin d'autres paramètres, référer à `package.json` et aux scripts dans `scripts/`.

---
Fin de l'enrichissement — prêt pour relais ou exécution par la prochaine IA/ingénieur.
