# Vérification du contenu publié — site NAS MODE vs dépliant officiel

**Référence (source de vérité)** : `docs/depliant-transcription.md` (transcription littérale du dépliant papier, établie en aveugle).
**Publié (objet de la vérification)** :
- `public/nasmode.html` — objet `formationData` (modales `stylisme`, `coiffure`, `esthetique`, `maquillage`) + texte de la page d'accueil
- `public/ecole/index.html` — page École (grille des formations, tableau des tarifs, commodités, modalités)
- `public/contact/index.html` — coordonnées

**Méthode** : `formationData` extrait par script (ligne 1046 de `nasmode.html`, objet sur une seule ligne) ; texte des pages extrait par dépouillement HTML ; contre-vérifications par `grep` sur l'ensemble de `public/`.

**Verdicts employés** : IDENTIQUE · DIVERGENT · ABSENT_DU_SITE · ABSENT_DU_DEPLIANT · NON_VERIFIABLE.

---

## 1. Identité, coordonnées, éléments de couverture

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| Nom de l'établissement | « NAS MODE » | « NAS MODE » | **IDENTIQUE** |
| Nature de l'établissement | « Centre de formation professionnelle » / « Centre de formation PROFESIONNELLE » | « NAS MODE — Centre de Formation Professionnelle » (ecole, hero) | **IDENTIQUE** |
| Année de création | « DEPUIS 2001 » | « En 2001, […] fonde NAS MODE » (nasmode.html, ecole) | **IDENTIQUE** |
| Ville | « OUAGADOUGOU » | « Ouagadougou » | **IDENTIQUE** |
| Téléphone n°1 | « 25 47 05 85 » (pied de page) | « +226 25 47 05 85 » (contact) | **IDENTIQUE** |
| Téléphone n°2 | « 78 01 41 98 » — cité **deux fois** (rubrique « Inscriptions et informations » + pied de page) | Introuvable dans tout `public/` (`grep` sur `78 01 41 98`, `78014198` : 0 occurrence) | **ABSENT_DU_SITE** |
| Téléphone n°3 | « 65 81 18 18 » | « +226 65 81 18 18 » (contact) | **IDENTIQUE** |
| Email | « info@nasmodeformation.com » | « info@nasmodeformation.com » | **IDENTIQUE** |
| Site web | « www.nasmodeformation.com » | Le site est publié sur `nas-mode.vercel.app` (`<link rel="canonical" href="https://nas-mode.vercel.app/">`, `og:url`, JSON-LD `url`). L'adresse `www.nasmodeformation.com` n'apparaît nulle part comme adresse web (le domaine n'apparaît que dans l'adresse e-mail) | **DIVERGENT** |
| Adresse postale | « 09 BP : 1334 Ouaga 09 Burkina Faso » | « 09 BP 1334 Ouaga 09 » / « Burkina Faso » (contact) | **IDENTIQUE** |
| Adresse physique | Le dépliant ne donne **aucune** adresse physique (ni secteur, ni quartier) | « Secteur 47, Rayongo » (contact, 3 emplacements dont le JSON-LD `PostalAddress`) | **ABSENT_DU_DEPLIANT** |
| Slogan | « NAS MODE, un style, une marque, une école ! » | Introuvable (`grep` : 0 occurrence) | **ABSENT_DU_SITE** |
| Baseline métiers de couverture | « STYLISME - COIFFURE - MODÉLISME - ESTHETIQUE » | Cette énumération n'existe pas ; le pied de page liste « Stylisme & Couture / Coiffure / Esthétique / Maquillage Cinéma » (MODÉLISME remplacé par Maquillage Cinéma) | **ABSENT_DU_SITE** |
| Bandeau de couverture : liste des 10 métiers | 10 métiers énumérés | Les 10 métiers sont tous nommés dans la grille de `ecole/index.html` | **IDENTIQUE** |
| Texte « BIENVENUE À NAS MODE » (2 paragraphes) | « Nous sommes heureux de vous accueillir… », « une équipe pluridisciplinaire de formateurs qualifiés et expérimentés… » | Introuvable (`grep` sur `heureux`, `pluridisciplinaire`, `employabilité` : 0 occurrence) | **ABSENT_DU_SITE** |
| Crédit photo en filigrane | `[INCERTAIN: …de Mode © Boudou OUEDRAOGO]` (×2) | Aucun crédit photo sur le site | **NON_VERIFIABLE** |

---

## 2. Grille d'admission — vérification métier par métier

### 2.1 Résultat du test de décalage

L'hypothèse d'un décalage d'une ligne a été **testée sur les 10 métiers**, et non supposée. Elle est **partiellement confirmée** :

- **Lignes 1 et 2** (Mécanicien de confection, Couturier dame) : **conditions correctes**, aucun décalage.
- **Lignes 3, 4, 5 et 6** (Modéliste, Technicien de confection, Styliste, Tailleur homme et dame) : **décalage confirmé et systématique**. Chacun de ces quatre métiers affiche la condition d'admission du **métier suivant** dans l'ordre du dépliant.
- **Ligne 7** (Esthéticien) : **la chaîne se rompt**. L'Esthéticien n'hérite **pas** de la condition de la ligne 8 (Maquillage). Il affiche une condition (« Cycle 1 : niveau inférieur à la classe de CM2 / Cycle 2 : CM2 ou plus ») qui n'est celle **d'aucun** métier voisin : c'est la condition des métiers de couture (lignes 1-2) et de coiffure (ligne 9). Il s'agit donc d'une **erreur distincte**, pas de la même glissade.
- **Lignes 8, 9, 10** (Maquillage, Coiffeur dame, Coiffeur dame Spécialisation) : **conditions correctes**, aucun décalage.

Autrement dit : le décalage existe, il est réel, mais il ne touche **que quatre métiers sur dix** (Modéliste, Technicien de confection, Styliste, Tailleur homme et dame) ; l'Esthéticien est faux pour une autre raison. Dire « chaque métier a hérité des conditions du suivant » serait inexact.

Le même décalage est reproduit **à l'identique** aux deux endroits du site : `ecole/index.html` (cartes de la grille) et `formationData.stylisme.admissionDetails` / `formationData.esthetique.admissionDetails` (`nasmode.html`). Il n'y a donc pas une source correcte et une source fausse : les deux sont fausses de la même façon.

### 2.2 Tableau — NIVEAUX D'ADMISSION

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| Admission — Mécanicien de confection | « Cycle 1 / Niveau inférieur à la classe de CM2 pour la formation pratique / Cycle 2 / Niveau CM2 ou plus pour la formation théorique et pratique » | « Cycle 1 (niveau inférieur à la classe de CM2, formation pratique) ou Cycle 2 (niveau CM2 ou plus, formation théorique et pratique) » | **IDENTIQUE** |
| Admission — Couturier dame | idem ci-dessus | idem (carte PACKAGE 1 groupant les deux métiers) | **IDENTIQUE** |
| Admission — Modéliste | « **Classe de 3ème** » | « **diplôme en modélisme ou équivalent** » — c'est la condition du **Technicien de confection** (ligne 4 du dépliant) | **DIVERGENT** |
| Admission — Technicien de confection | « **Diplôme en modelisme ou équivalent** » | « **diplôme en modélisme et technique de confection ou équivalent** » — c'est la condition du **Styliste** (ligne 5) | **DIVERGENT** |
| Admission — Styliste | « **Diplôme en modelisme et technique de confection ou équivalent** » | « **niveau de classe de 3ème au moins et titulaire d'un CAP ou CQP du même domaine** » — c'est la condition du **Tailleur homme et dame** (ligne 6) | **DIVERGENT** |
| Admission — Tailleur homme et dame | « **Niveau de classe de 3ème au moins et être titulaire d'un CAP ou CQP du même** » (phrase tronquée à l'impression) | « **Cycle 1 (niveau inférieur ou égal à la classe de 4ème)** » — c'est la condition de l'**Esthéticien** (ligne 7) | **DIVERGENT** |
| Admission — Esthéticien | « Cycle 1 / **Niveau inférieur ou égale à la classe de 4ème** / Cycle 2 / *(aucune condition imprimée — cellule vide)* » | « Cycle 1 (niveau inférieur à la classe de **CM2**, formation pratique) ou Cycle 2 (niveau **CM2 ou plus**, formation théorique et pratique) » — condition inexistante pour ce métier au dépliant | **DIVERGENT** |
| Admission — Esthéticien, contenu du Cycle 2 | Cellule **vide** au dépliant : « Cycle 2 » est imprimé sans condition | Le site remplit ce vide avec « niveau CM2 ou plus, formation théorique et pratique » | **ABSENT_DU_DEPLIANT** |
| Admission — Maquillage cinéma et télévision | « Attestation de fin de formation en coiffure ou en esthétique » | « attestation de fin de formation en coiffure ou en esthétique » | **IDENTIQUE** |
| Admission — Coiffeur dame | « Cycle 1 / Niveau inférieur à la classe CM2 pour une formation pratique / Cycle 2 / Niveau CM2 ou plus pour une formation théorique et pratique » | « Cycle 1 (niveau inférieur à la classe de CM2, formation pratique) ou Cycle 2 (niveau CM2 ou plus, formation théorique et pratique) » | **IDENTIQUE** |
| Admission — Coiffeur dame Spécialisation | « CQP Coiffeur dame, / BQP esthétique ou avoir une attestation de formation en coiffure ou en esthétique » | « être titulaire du CQP Coiffeur dame, du BQP esthétique, ou d'une attestation de formation en coiffure ou en esthétique » | **IDENTIQUE** |
| Complétion de la phrase tronquée du Tailleur | Le dépliant s'arrête sur « **du même** » (mot suivant absent de l'impression) | Le site écrit « du même **domaine** » (`formationData.stylisme.admissionDetails`, ligne Styliste ; `ecole/index.html`, carte Styliste) | **ABSENT_DU_DEPLIANT** |
| Encart « Admission » de la modale Stylisme (`infos`) | Le dépliant donne 6 conditions distinctes pour les 6 métiers de couture | « Cycle 1 : niveau inférieur au CM2 (pratique) · Cycle 2 : CM2 ou plus (théorie + pratique) » présenté comme **la** condition d'admission de toute la filière, Modéliste / Styliste / Tailleur compris | **DIVERGENT** |
| Encart « Admission » de la modale Coiffure (`infos`) | Coiffeur dame : Cycle 1 / Cycle 2 CM2 | « Cycle 1 : niveau inférieur à la classe CM2 (pratique) · Cycle 2 : CM2 ou plus » | **IDENTIQUE** |
| Encart « Admission » de la modale Esthétique (`infos`) | Esthéticien : « Niveau inférieur ou égale à la classe de 4ème » | « Cycle 1 : niveau inférieur à la classe CM2 (pratique) · Cycle 2 : CM2 ou plus » | **DIVERGENT** |
| Encart « Admission » de la modale Maquillage (`infos`) | « Attestation de fin de formation en coiffure ou en esthétique » | « Attestation de fin de formation en coiffure ou en esthétique » | **IDENTIQUE** |
| Formalités d'admission supplémentaires | Le dépliant ne mentionne aucune procédure de candidature ni sélection | « Déposer un dossier de candidature et **réussir les formalités d'admission de NAS MODE** » (`formationData.maquillage.admissionDetails`) | **ABSENT_DU_DEPLIANT** |

---

## 3. Documents de fin de formation (diplômes)

Observation préalable : la liste **agrégée** des diplômes de la filière couture affichée dans la modale Stylisme (« Attestation / CQP / BQP / BPT / BPTS ») correspond exactement à l'ensemble des diplômes des lignes 1 à 6 du dépliant. Le stock de diplômes est donc juste ; c'est **l'attribution métier par métier** qui a été brouillée.

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| Diplôme — Mécanicien de confection | « Attestation de fin de formation » | « Attestation de fin de formation » | **IDENTIQUE** |
| Diplôme — Couturier dame | « Attestation de fin de formation / **Certificat de Qualification Professionnelle (CQP)** » | « Attestation de fin de formation » (carte PACKAGE 1 groupée ; modale idem). Le **CQP n'est attribué au Couturier dame nulle part** sur le site | **DIVERGENT** |
| Diplôme — Modéliste | « Attestation de fin de formation / **Brevet de Qualification Professionnelle (BQP)** » | « **Certificat de Qualification Professionnelle (CQP)** » | **DIVERGENT** |
| Diplôme — Technicien de confection | « Attestation de fin de formation » *(seul document listé)* | « **Brevet de Qualification Professionnelle (BQP)** » | **DIVERGENT** |
| Diplôme — Styliste | « Attestation de fin de formation / Brevet Professionnel de Technicien (BPT) » | « Brevet Professionnel de Technicien (BPT) » — la mention « Attestation de fin de formation » est omise | **DIVERGENT** |
| Diplôme — Tailleur homme et dame | « Attestation de fin de formation / Brevet Professionnel de Technicien Supérieur (BPTS) » | « Brevet Professionnel de Technicien Supérieur (BPTS) » — attestation omise | **DIVERGENT** |
| Diplôme — Esthéticien | « Attestation de fin de formation / Brevet de Qualification Professionnelle (BQP) » | « Attestation / Brevet de Qualification Professionnelle (BQP) » (ecole) ; « Attestation de fin de formation ou Brevet de Qualification Professionnelle (BQP) **en esthétique** » (modale — le qualificatif « en esthétique » n'est pas au dépliant) | **IDENTIQUE** |
| Diplôme — Maquillage cinéma et télévision | « Attestation de fin de formation » | « Attestation de fin de formation » | **IDENTIQUE** |
| Diplôme — Coiffeur dame | « Attestation de fin de formation / Certificat de Qualification Professionnelle (CQP) » | « Certificat de Qualification Professionnelle (CQP) » — attestation omise | **DIVERGENT** |
| Diplôme — Coiffeur dame Spécialisation | « Attestation de fin de formation / Brevet de Qualification Professionnelle (BQP) » | « Brevet de Qualification Professionnelle (BQP) » — attestation omise | **DIVERGENT** |
| Liste agrégée des diplômes (modale Stylisme) | Lignes 1-6 : Attestation, CQP, BQP, BPT, BPTS | « Attestation / CQP / BQP / BPT / BPTS » | **IDENTIQUE** |
| Reconnaissance officielle des diplômes | Le dépliant ne qualifie **jamais** les diplômes de reconnus, agréés ou sanctionnés par l'État | « Nos certifications sont **agréées par l'État burkinabè** » (ecole) ; « sanctionnées par des **diplômes reconnus** » (ecole) ; « préparation aux **diplômes sanctionnés par l'État** » (modale Stylisme) | **ABSENT_DU_DEPLIANT** |

---

## 4. Tarifs

### 4.1 Page École (`ecole/index.html`) — tableau par métier

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| Inscription / réinscription — Externat (tous métiers) | 10 000 F CFA (identique sur les 10 lignes) | « Externat : 10 000 F CFA » | **IDENTIQUE** |
| Inscription / réinscription — Internat (tous métiers) | 15 000 F CFA (identique sur les 10 lignes) | « Internat : 15 000 F CFA » | **IDENTIQUE** |
| Externat — Mécanicien de confection | 380 000 F CFA | 380 000 F CFA | **IDENTIQUE** |
| Internat — Mécanicien de confection | 1 217 500 F CFA | 1 217 500 F CFA | **IDENTIQUE** |
| Externat — Couturier dame | 405 000 F CFA | 405 000 F CFA | **IDENTIQUE** |
| Internat — Couturier dame | 1 242 000 F CFA | 1 242 000 F CFA | **IDENTIQUE** |
| Externat — Modéliste | 392 000 F CFA | 392 000 F CFA | **IDENTIQUE** |
| Internat — Modéliste | 1 229 000 F CFA | 1 229 000 F CFA | **IDENTIQUE** |
| Externat — Technicien de confection | 438 000 F CFA | 438 000 F CFA | **IDENTIQUE** |
| Internat — Technicien de confection | 1 275 000 F CFA | 1 275 000 F CFA | **IDENTIQUE** |
| Externat — Styliste | 415 000 F CFA | 415 000 F CFA | **IDENTIQUE** |
| Internat — Styliste | 1 252 000 F CFA | 1 252 000 F CFA | **IDENTIQUE** |
| Externat — Tailleur homme et dame | 465 000 F CFA | 465 000 F CFA | **IDENTIQUE** |
| Internat — Tailleur homme et dame | 1 302 000 F CFA | 1 302 000 F CFA | **IDENTIQUE** |
| Externat — Esthéticien | 415 000 F CFA | 415 000 F CFA | **IDENTIQUE** |
| Internat — Esthéticien | 1 252 000 F CFA | 1 252 000 F CFA | **IDENTIQUE** |
| Externat — Maquilleur Cinéma et Télévision | 440 000 F CFA | 440 000 F CFA (libellé « Maquilleur cinéma et TV ») | **IDENTIQUE** |
| Internat — Maquilleur Cinéma et Télévision | 1 277 000 F CFA | 1 277 000 F CFA | **IDENTIQUE** |
| Externat — Coiffeur Dame | 380 000 F CFA | 380 000 F CFA | **IDENTIQUE** |
| Internat — Coiffeur Dame | 1 217 500 F CFA | 1 217 500 F CFA | **IDENTIQUE** |
| Externat — Coiffeur Dame Spécialisation | 405 000 F CFA | 405 000 F CFA | **IDENTIQUE** |
| Internat — Coiffeur Dame Spécialisation | 1 242 000 F CFA | 1 242 000 F CFA | **IDENTIQUE** |
| Module supplémentaire au choix | « 30 000 FCFA par module sans la matière d'œuvre » | « 30 000 F CFA par module (sans la matière d'œuvre) » | **IDENTIQUE** |
| Réduction de tarif à la réinscription | Le dépliant met inscription et réinscription **dans la même cellule, au même montant** ; aucune réduction n'est mentionnée | « **Réinscription à un tarif réduit** » (ecole, encart Inscription & réinscription) | **ABSENT_DU_DEPLIANT** |
| Contenu de l'internat | « Internat pour jeunes filles » (rubrique commodités) | « Internat (formation avec **pension complète**, réservé aux jeunes filles) » — « pension complète » n'est pas au dépliant ; « réservé aux jeunes filles » l'est | **ABSENT_DU_DEPLIANT** |
| Statut de la crèche et du bus dans le tarif | Le dépliant les liste comme commodités tarifées et les intègre à l'échéancier de paiement, sans autre commentaire | « des commodités **ajoutées au tarif selon les besoins** » (ecole) | **ABSENT_DU_DEPLIANT** |
| Note de bas de tableau associée à l'astérisque « Frais de formation\* » | **Absente du dépliant** (astérisque orphelin, confirmé par la transcription) | Aucun astérisque sur le site | **NON_VERIFIABLE** |

### 4.2 Modales `formationData` (`nasmode.html`) — tarifs affichés en fourchettes

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| Frais de formation EXTERNAT — filière Stylisme | Six montants **distincts et nominatifs** : Mécanicien 380 000 · Couturier dame 405 000 · Modéliste 392 000 · Technicien 438 000 · Styliste 415 000 · Tailleur 465 000 | « **380 000 à 465 000 F CFA / an** » | **DIVERGENT** |
| Frais de formation INTERNAT — filière Stylisme | 1 217 500 · 1 242 000 · 1 229 000 · 1 275 000 · 1 252 000 · 1 302 000 | « **1 217 500 à 1 302 000 F CFA / an** » | **DIVERGENT** |
| Frais de formation EXTERNAT — filière Coiffure | Coiffeur dame 380 000 · Spécialisation 405 000 | « **380 000 à 405 000 F CFA / an** » | **DIVERGENT** |
| Frais de formation INTERNAT — filière Coiffure | Coiffeur dame 1 217 500 · Spécialisation 1 242 000 | « **1 217 500 à 1 242 000 F CFA / an** » | **DIVERGENT** |
| Frais de formation EXTERNAT — Esthétique | 415 000 F CFA | 415 000 F CFA / an | **IDENTIQUE** |
| Frais de formation INTERNAT — Esthétique | 1 252 000 F CFA | 1 252 000 F CFA / an | **IDENTIQUE** |
| Frais de formation EXTERNAT — Maquillage | 440 000 F CFA | 440 000 F CFA / an | **IDENTIQUE** |
| Frais de formation INTERNAT — Maquillage | 1 277 000 F CFA | 1 277 000 F CFA / an | **IDENTIQUE** |
| Frais d'inscription — 4 modales | 10 000 F CFA externat / 15 000 F CFA internat | « Externat : 10 000 F CFA / Internat : 15 000 F CFA » | **IDENTIQUE** |
| Module supplémentaire — 4 modales | « 30 000 FCFA par module **sans la matière d'œuvre** » | « Module supplémentaire au choix : 30 000 F CFA par module. » — la restriction « sans la matière d'œuvre » est omise dans les 4 champs `why` | **DIVERGENT** |

**Pourquoi les fourchettes sont DIVERGENT et non IDENTIQUE.** Les bornes des fourchettes correspondent bien au minimum et au maximum du dépliant, mais le dépliant n'affiche **aucune fourchette** : il facture un montant nominatif par métier. Un visiteur qui lit « 380 000 à 465 000 F CFA / an » dans la modale Stylisme ne peut pas savoir ce que coûte le Modéliste (392 000) ni le Technicien de confection (438 000) ; il peut légitimement croire qu'un tarif de 380 000 est accessible pour n'importe lequel des six métiers, ce qui est faux pour cinq d'entre eux. La fourchette n'est pas une reformulation du dépliant, c'est une **information différente** : elle remplace six prix opposables par un intervalle qui n'engage sur aucun. Le fait que la modale Stylisme affiche une fourchette alors que la page École, dans le même site, affiche les six montants exacts, crée en outre une contradiction interne au site.

---

## 5. Matières et suppléments au choix

### 5.1 Constat général

Aucune matière affichée sur le site n'est **inventée** : toutes se retrouvent dans le dépliant. Le problème est ailleurs — la **grille du dépliant attribue chaque matière à un métier précis** ; le site a fondu les 10 métiers en 4 filières et redistribué les matières entre ces filières. Résultat : des matières sont attribuées à des métiers auxquels le dépliant ne les rattache pas, et des matières obligatoires sont présentées comme des options.

### 5.2 Attribution des matières, métier par métier

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| Matières — Mécanicien de confection | 3 matières : Techniques d'assemblage / Lecture des patrons / Maintenance des équipements **de la** couture | Aucune matière n'est rattachée à ce métier. Les 3 figurent dans un bloc « Matières communes » de 7 items, présenté comme commun aux 6 métiers de la filière | **DIVERGENT** |
| Matières — Couturier dame | 5 matières : Techniques d'assemblage / Techniques de coupe / Technologie d'atelier / Technologie du textile / Organisation du travail | Idem : fondues dans le bloc « Matières communes » sans attribution | **DIVERGENT** |
| Matières — Modéliste | 3 matières : Développement du patron / Réalisation de prototype / Techniques de coupe | Fondues dans le bloc « Création de mode » (7 items) de la modale Stylisme, sans attribution | **DIVERGENT** |
| Matières — Technicien de confection | 5 matières : Techniques d'assemblage (cours théorique et pratique) / Dessin technique / Organisation du travail / Technologie du textile / Technologie d'atelier | Fondues, sans attribution ; la précision « (cours théorique et pratique) » n'est pas reprise | **DIVERGENT** |
| Matières — Styliste | 5 matières : Réalisation d'un dessin de mode / Création et réalisation personnelle / Marketing de la mode / Initiation à l'informatique / **Dessin de mode via les logiciels Adobe Illustrator et Adobe Photoshop** | Les 4 premières sont dans le bloc « Création de mode », sans attribution ; la 5e est absente | **DIVERGENT** |
| Matière « Dessin de mode via les logiciels Adobe Illustrator et Adobe Photoshop » | Matière du Styliste | Introuvable dans tout `public/` (`grep` sur `Illustrator`, `Photoshop` : 0 occurrence) | **ABSENT_DU_SITE** |
| Matières — Tailleur homme et dame | 5 matières : **Design** / Dessin technique / Techniques de coupe / Techniques d'assemblage (cours théorique et pratique) / Organisation du travail | 4 sur 5 présentes dans les blocs communs, sans attribution ; « Design » est absent | **DIVERGENT** |
| Matière « Design » | Matière du Tailleur homme et dame | Introuvable comme matière (`grep` sur `Design` : 0 occurrence hors le mot anglais du pied de page « laboratoires de design modernes ») | **ABSENT_DU_SITE** |
| Matières — Esthéticien | 5 matières : **Organisation du travail** / Réalisation des soins de la peau et des ongles / Embellissement du corps (maquillage, épilation...) / Onglerie / Gestion | Le bloc « Esthétique » de la modale contient 4 des 5 (Organisation du travail est absente pour ce métier) et **ajoute « Anatomie et colorimétrie »**, que le dépliant attribue au Maquillage cinéma et télévision | **DIVERGENT** |
| Matières — Maquillage cinéma et télévision | 7 matières : Anatomie et colorimétrie / Maquillage cinéma / Maquillage télévision / Effets spéciaux (SFX) / Maquillage artistique / Photographie et portfolio / Body Painting | Les 7 sont présentes dans la modale Maquillage | **IDENTIQUE** |
| Matières — Coiffeur dame | 10 matières (Technologie et entretien du matériel du salon … Organisation du travail) | Les 10 sont présentes dans la modale Coiffure, réparties entre les blocs « Base coiffure » et « Spécialisation ». Une reformulation : « Entretien du cuir chevelu et cheveux » devient « Entretien du cuir chevelu et **des** cheveux » | **IDENTIQUE** |
| Matières — Coiffeur dame Spécialisation | 12 matières **obligatoires** | 5 d'entre elles sont reclassées en « **Suppléments au choix** » : Tresses africaines modernes / Braids (Knotless, Box Braids, Fulani, Vanilles, etc.) / Coiffures événementielles / Chignons professionnels / Coloration et balayage sur modèles | **DIVERGENT** |
| Matière « Lace Front et Lace Closure » | Matière obligatoire du Coiffeur dame Spécialisation | N'apparaît pas dans le programme ; seulement à l'intérieur d'un objectif rédigé (« Confectionner des perruques à la machine (Lace Front et Lace Closure) ») | **DIVERGENT** |
| Matière « Soins capillaires complets » | Matière obligatoire du Coiffeur dame Spécialisation | N'apparaît pas dans le programme ; seulement comme objectif (« Réaliser des soins capillaires complets ») et comme compétence (« Soins capillaires ») | **DIVERGENT** |
| Matière « Marketing digital et développement de la clientèle » | Matière obligatoire du Coiffeur dame Spécialisation | N'apparaît pas dans le programme ; seulement comme compétence (« Marketing digital ») et dans le texte de présentation | **DIVERGENT** |

### 5.3 Suppléments au choix, métier par métier

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| Suppléments — Mécanicien de confection | **Aucun** (cellule vide au dépliant) | Le site ne rattache aucun supplément à ce métier en particulier, mais la modale Stylisme affiche 6 suppléments présentés comme accessibles à toute la filière | **DIVERGENT** |
| Suppléments — Couturier dame | Coupe à main levée / Dessin de vêtement à plat / Photographie et création de contenus pour les réseaux sociaux | Les 3 figurent dans le bloc « Suppléments au choix » de la modale Stylisme, sans attribution au métier | **DIVERGENT** |
| Suppléments — Modéliste | Techniques **du** moulage / Conception de patrons sur ordinateur (Logiciel **styleCAD** 2D) | « Techniques **de** moulage » / « Conception de patrons sur ordinateur (Logiciel **StyleCAD** 2D) » — sans attribution au métier | **DIVERGENT** |
| Suppléments — Technicien de confection | Coupe à main levée / Confection **des** accessoires (chapeau, chaussure, sac **à main**...) | « Confection **d'**accessoires (chapeau, chaussure, **sac**) » — « à main » et les points de suspension, qui indiquent une liste non close, sont supprimés ; sans attribution au métier | **DIVERGENT** |
| Suppléments — Styliste | **Confection des bijoux** / **Maquillage beauté** | Ces deux suppléments ne figurent **pas** dans la modale Stylisme : ils ont été déplacés dans la modale **Esthétique** | **DIVERGENT** |
| Suppléments — Tailleur homme et dame | **Conception et gestion de costumes de cinéma** | Ce supplément ne figure pas dans la modale Stylisme : il a été déplacé dans la modale **Maquillage**, bloc « Photo & portfolio » | **DIVERGENT** |
| Suppléments — Esthéticien | Réflexologie / Microblading / Dermo-cosmétique | Les 3 figurent dans la modale Esthétique — **et sont dupliquées** dans la modale Maquillage comme suppléments du maquilleur | **DIVERGENT** |
| Suppléments — Maquillage cinéma et télévision | **Perruques et postiches** / Création de contenus pour les réseaux sociaux / **Coiffure de mariée** | « Création de contenus pour les réseaux sociaux » est bien dans la modale Maquillage ; « Perruques et postiches » et « Coiffure de mariée » ont été déplacés dans la modale **Coiffure** | **DIVERGENT** |
| Suppléments — Coiffeur dame | **Maquillage beauté** / **Onglerie** | Aucun des deux n'est dans la modale Coiffure : tous deux sont dans la modale **Esthétique** | **DIVERGENT** |
| Suppléments — Coiffeur dame Spécialisation | **Onglerie professionnelle (Gel, Résine, Acrygel, Capsules américaines)** / Photographie et création de contenus pour les réseaux sociaux | Ces deux items sont dans la modale **Esthétique**, dans un bloc de programme intitulé « Onglerie professionnelle » — donc présentés comme un enseignement d'esthétique et non comme un supplément de coiffure | **DIVERGENT** |

---

## 6. Modules généraux et transversaux

| Fait | Dépliant | Site (`ecole/index.html`) | Verdict |
|---|---|---|---|
| Module général « Métier et formation » | présent | « Métier et formation » | **IDENTIQUE** |
| Module général « Hygiène, Santé, Sécurité et protection de l'Environnement » | imprimé sur **deux puces** : « Hygiène, Santé, » puis « Sécurité et protection de l'Environnement » | fusionné en **une seule** puce, même contenu | **IDENTIQUE** |
| Module général « Marketing » | présent | présent | **IDENTIQUE** |
| Module général « Gestion simplifiée » | présent | présent | **IDENTIQUE** |
| Module transversal « Droit du travail » | présent | présent | **IDENTIQUE** |
| Module transversal « Santé sexuelle et reproductive des jeunes » | présent | présent | **IDENTIQUE** |
| Module transversal « Civisme et patriotisme » | présent | présent | **IDENTIQUE** |
| Module transversal entrepreneuriat | « Formation en **entreprenariat** après validation **de** modules de formation. » | « Formation en **entrepreneuriat** après validation **des** modules de formation » (orthographe corrigée, article changé) | **IDENTIQUE** |
| Modules généraux / transversaux dans les modales | 4 + 4 modules | Les modales `formationData` ne mentionnent **aucun** module général ni transversal : ils n'existent que sur la page École | **ABSENT_DU_SITE** |

---

## 7. Commodités, dossier, paiement, informations importantes, avantages

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| Bus scolaire | « 160 000 F CFA / an » | « Bus scolaire : 160 000 F / an » (unité abrégée en « F ») | **IDENTIQUE** |
| Crèche pour nourrisson | « 135 000 F CFA / an » | « Crèche pour nourrisson : 135 000 F / an » | **IDENTIQUE** |
| Internat pour jeunes filles | « Internat pour jeunes filles » | « Internat pour jeunes filles » | **IDENTIQUE** |
| Cantine | « Cantine » | « Cantine & infirmerie » (deux commodités fusionnées en une ligne) | **IDENTIQUE** |
| Infirmerie | « Infirmerie » | « Cantine & infirmerie » | **IDENTIQUE** |
| Dossier — photos d'identité | « Deux (02) photos d'identité ; » | « Deux (02) photos d'identité » | **IDENTIQUE** |
| Dossier — acte de naissance | « Une (01) copie de l'acte de naissance » | « Une (01) copie de l'acte de naissance » | **IDENTIQUE** |
| Dossier — diplôme / bulletin | « Diplôme ou dernier bulletin scolaire **s'il y a lieu** » | « Diplôme ou dernier bulletin scolaire **(si lieu)** » | **IDENTIQUE** |
| Paiement — 1er versement, échéance | « AVANT LE DEBUT DE LA FORMATION » | « 50 % avant le début de la formation » | **IDENTIQUE** |
| Paiement — 1er versement, frais d'inscription | « Frais d'inscription ou de réinscription » fait partie du 1er versement | Le site ne mentionne pas les frais d'inscription dans l'échéancier | **ABSENT_DU_SITE** |
| Paiement — 1er versement, quotité | 50 % des frais de formation + 50 % internat + 50 % crèche + 50 % bus (quatre postes détaillés) | « 50 % avant le début de la formation » (poste unique, non détaillé) | **DIVERGENT** |
| Paiement — 2e versement, échéance | « **1ère semaine du mois de** décembre » | « 25 % **en** décembre » | **DIVERGENT** |
| Paiement — 2e versement, quotité | 25 % formation + 25 % internat + 25 % crèche + 25 % bus | « 25 % » (poste unique) | **DIVERGENT** |
| Paiement — 3e versement, échéance | « **1ère semaine du mois de** février » | « 25 % **en** février » | **DIVERGENT** |
| Paiement — 3e versement, quotité | 25 % formation + 25 % internat + 25 % crèche + 25 % bus | « 25 % » (poste unique) | **DIVERGENT** |
| Frais de formation et matière d'œuvre | « Les frais de formation comprennent la matière d'œuvre utilisée pendant les cours pratiques. » | Même phrase (ecole) ; « Les frais de formation comprennent la matière d'oeuvre utilisée pendant les cours pratiques. » (modale Stylisme) | **IDENTIQUE** |
| À la charge de l'apprenant — trousseau | « Le trousseau (blouse et petits matériels) ; » | « Le trousseau (blouse et petits matériels) est à la charge de l'apprenant. » — présent **uniquement** dans les modales Coiffure et Esthétique ; absent de la page École et des modales Stylisme et Maquillage | **DIVERGENT** |
| À la charge de l'apprenant — matière d'œuvre de l'ouvrage de fin de formation | « La matière d'œuvre destinée à la réalisation de l'ouvrage de fin de formation ; » | Introuvable sur le site | **ABSENT_DU_SITE** |
| À la charge de l'apprenant — frais de la formation en entrepreneuriat | « Les frais de la formation en entrepreneuriat organisée en fin de formation. » | Introuvable sur le site ; la page École présente au contraire l'entrepreneuriat comme un module transversal et un avantage, sans mention de frais | **ABSENT_DU_SITE** |
| Avantage — microcrédit | « Accès à un microcrédit pour les meilleurs apprenants de la promotion. » | Même phrase (ecole) et reprise dans les 4 champs `why` | **IDENTIQUE** |
| Avantage — stages | « Facilitation des stages professionnels au Burkina Faso et dans la sous-région. » | Même phrase (ecole, modales Stylisme et Maquillage) | **IDENTIQUE** |
| Avantage — défilé de fin de formation | « Participation au défilé de fin de formation organisé par NAS MODE. » | « Participation aux défilés de fin de formation et au défilé biennal organisé par NAS MODE. » (singulier → pluriel, les deux défilés fusionnés en une phrase) | **IDENTIQUE** |
| Avantage — masterclass | « Participation aux masterclass sur l'entrepreneuriat et le marketing digital. » | Même phrase (ecole, modale Maquillage) | **IDENTIQUE** |
| Avantage — défilé biennal | « Participation au défilé biennal organisé **au profit des formés** » | « au défilé biennal organisé par NAS MODE » — la mention « au profit des formés » est remplacée par « organisé par NAS MODE » | **IDENTIQUE** |

---

## 8. Intitulés des métiers et des packages

| Fait | Dépliant | Site | Verdict |
|---|---|---|---|
| PACKAGE 1 | « PACKAGE 1 : COUTURE » | « PACKAGE 1 — Couture » | **IDENTIQUE** |
| PACKAGE 2 | « PACKAGE 2 : CREATION DE MODE » | « PACKAGE 2 — Création de mode » | **IDENTIQUE** |
| PACKAGE 3 | « PACKAGE 3 : HAUTE COUTURE » | « PACKAGE 3 — Haute couture » | **IDENTIQUE** |
| PACKAGE 4 | « PACKAGE 4 : ESTHÉTIQUE ET MAQUILLAGE CINÉMA ET TÉLÉVISION » | « PACKAGE 4 — **Esthétique & maquillage** » (intitulé tronqué) | **DIVERGENT** |
| PACKAGE 5 | « PACKAGE 5 : COIFFURE ET SPÉCIALISATION » | « PACKAGE 5 — **Coiffure** » (« et spécialisation » supprimé) | **DIVERGENT** |
| Métier 1 | « Mécanicien de confection » | « Mécanicien de confection » | **IDENTIQUE** |
| Métier 2 | « Couturier Dame » | « Couturier dame » (casse) | **IDENTIQUE** |
| Métier 3 | « Modéliste » | « Modéliste » | **IDENTIQUE** |
| Métier 4 | « Technicien de confection » | « Technicien de confection » | **IDENTIQUE** |
| Métier 5 | « Styliste » | « Styliste » | **IDENTIQUE** |
| Métier 6 | « Tailleur homme et dame » (tableaux) / « HAUTE COUTURE HOMME ET DAME » (couverture) | « Tailleur homme et dame » | **IDENTIQUE** |
| Métier 7 | « Esthéticien » | « Esthéticien » | **IDENTIQUE** |
| Métier 8 | « Maquilleur Cinéma et Télévision » (tarifs) / « Maquillage cinéma et télévision » (grille) | « Maquillage cinéma et télévision » (grille) et « Maquilleur cinéma et **TV** » (carte tarif — abréviation absente du dépliant) | **IDENTIQUE** |
| Métier 9 | « Coiffeur Dame » | « Coiffeur dame » | **IDENTIQUE** |
| Métier 10 | « Coiffeur Dame Spécialisation » | « Coiffeur dame — Spécialisation » | **IDENTIQUE** |
| Structure de l'offre | **5 packages / 10 métiers** | La page École respecte les 5 packages ; la page d'accueil et les modales réorganisent l'offre en **4 filières** aux intitulés inédits : « Stylisme, Modélisme & Haute Couture », « Coiffure & Spécialisation », « **Esthétique & Onglerie** », « Maquillage Cinéma & Télévision » | **DIVERGENT** |

---

## 9. Affirmations du site absentes du dépliant (ABSENT_DU_DEPLIANT)

Ce sont les énoncés que le site publie et que **rien dans le dépliant ne permet de sourcer**. Aucun n'est vérifiable à partir de la référence.

### 9.1 Chiffres et performances

| # | Affirmation publiée | Emplacement |
|---|---|---|
| 1 | « Plus de **3 000** jeunes femmes et hommes y ont appris un métier » | `nasmode.html` (Notre vision) |
| 2 | Compteur « **3000+** Jeunes formés » | `nasmode.html` (`data-target="3000"`) |
| 3 | Compteur « **2500+** Apprenants formés » — contredit le chiffre de 3 000 de la page d'accueil | `ecole/index.html` (`data-count="2500"`) |
| 4 | « **80 %** des diplômé(e)s exercent aujourd'hui dans leur domaine » | `nasmode.html` |
| 5 | « **80%** de nos diplômés exercent dans leur domaine » + compteur « 80 % d'insertion » | `ecole/index.html` |
| 6 | Compteur « **100 %** Taux de réussite CQP » | `nasmode.html` (`data-target="100"`) |
| 7 | Compteur « **23** Promotions » | `nasmode.html` (`data-target="23"`) |
| 8 | Compteur « **25** Années d'expérience » | `ecole/index.html` |
| 9 | Compteur « **4** Filières » (le dépliant annonce 5 packages / 10 métiers) | `ecole/index.html` |
| 10 | Compteur « **2** Campus » | `ecole/index.html` |
| 11 | « l'école forme près de **200 jeunes chaque année** » | `ecole/index.html` |
| 12 | « Un investissement de plus de **3,5 milliards de francs CFA** » | `nasmode.html` (×2) |
| 13 | « **plus de 3,5 milliards** de francs CFA ont été investis dans la formation » | `nasmode.html` (Soutenir) |
| 14 | « **Depuis plus de 20 ans** » (ecole) / « **25 ans** de savoir-faire » (accueil) / « **plus de 25 ans** après sa création » (ecole) — trois formulations différentes, aucune au dépliant, qui dit seulement « DEPUIS 2001 » | `ecole/index.html`, `nasmode.html` |

### 9.2 Histoire, gouvernance, partenariats, distinctions

| # | Affirmation publiée | Emplacement |
|---|---|---|
| 15 | « **Safi Ouattara Diallo** fonde NAS MODE » / « Fondatrice de NAS MODE » — le nom de la fondatrice n'apparaît nulle part au dépliant | `nasmode.html`, `ecole/index.html` |
| 16 | Citation attribuée à la fondatrice (« L'éducation est l'arme la plus puissante pour changer le monde… ») | `ecole/index.html` |
| 17 | « En **2008**, la rencontre avec **Bea Petri**, venue de **Suisse** via **Swisscontact**, marque un tournant décisif » | `ecole/index.html`, `nasmode.html` |
| 18 | « Grâce à son engagement et aux **donateurs internationaux**, NAS MODE s'est dotée d'**infrastructures modernes** » | `ecole/index.html` |
| 19 | « bourses, microcrédits pour les **femmes entrepreneures**, infrastructures, équipements et un **jardin biologique** » | `nasmode.html` |
| 20 | « **L'État du Burkina Faso a distingué NAS MODE** pour l'excellence de sa formation et la qualité de ses infrastructures » | `nasmode.html` |
| 21 | « l'école est reconnue comme un **monument identitaire du Burkina Faso** » | `nasmode.html` |
| 22 | « Nos certifications sont **agréées par l'État burkinabè** » | `ecole/index.html` |
| 23 | « sanctionnées par des **diplômes reconnus** » | `ecole/index.html` |
| 24 | « préparation aux **diplômes sanctionnés par l'État** » | `formationData.stylisme.presentation` |
| 25 | « Des collaborations avec **Swisscontact, FESPACO** et des partenaires internationaux » | `ecole/index.html` |
| 26 | Section « PARTENAIRES — Ils nous font confiance » | `ecole/index.html` |

### 9.3 Second campus d'Abidjan

| # | Affirmation publiée | Emplacement |
|---|---|---|
| 27 | « NAS MODE franchit une nouvelle étape en ouvrant un **second campus à Abidjan, en Côte d'Ivoire** » | `ecole/index.html` |
| 28 | « NAS MODE s'implante désormais à **Abidjan**, en Côte d'Ivoire » | `nasmode.html` |
| 29 | Fiche « Campus Abidjan — Prochainement », formations annoncées : « Stylisme & Couture, Coiffure, Esthétique, Maquillage Cinéma » | `ecole/index.html` |
| 30 | « Abidjan, Côte d'Ivoire — **Enseignements en stylisme & modélisme** » | `contact/index.html` |
| 31 | « **Inscriptions ouvertes** — Contactez-nous pour les dates de session » (Abidjan) | `contact/index.html` |
| 32 | « Deux campus, deux pays, une même excellence » / « Nos Pays d'Implantation : Burkina Faso, Côte d'Ivoire » | `contact/index.html`, `ecole/index.html` |
| 33 | Mention de pied de page « © 2026 NAS MODE **Ouagadougou · Abidjan** » (sur les 3 pages) | toutes pages |

### 9.4 Adresse et coordonnées

| # | Affirmation publiée | Emplacement |
|---|---|---|
| 34 | « **Secteur 47, Rayongo** » comme adresse physique (y compris dans le JSON-LD `addressRegion`) | `contact/index.html` |
| 35 | Liens « Voir sur Google Maps » pour les deux campus | `contact/index.html` |

### 9.5 Arguments commerciaux et engagements de service

| # | Affirmation publiée | Emplacement |
|---|---|---|
| 36 | « **Réinscription à un tarif réduit** » | `ecole/index.html` |
| 37 | Internat « formation avec **pension complète** » | `ecole/index.html` |
| 38 | Crèche et bus « commodités **ajoutées au tarif selon les besoins** » | `ecole/index.html` |
| 39 | « **bourses pour les talents méritants** » (le dépliant ne mentionne que le microcrédit) | `ecole/index.html` |
| 40 | « **Suivi personnalisé** » / « un **suivi actif** » / « un **réseau de partenaires** » | `ecole/index.html` |
| 41 | « Une équipe pédagogique **passionnée**, alliant expertise technique et expérience du terrain » | `ecole/index.html` |
| 42 | « Nos programmes sont conçus pour privilégier la pratique : ateliers, projets concrets et **stages en entreprise** » | `ecole/index.html` |
| 43 | Blocs **Mission / Vision / Valeurs** (« Devenir une référence régionale… », « Excellence, transmission, solidarité et respect de la dignité humaine… ») | `ecole/index.html` |
| 44 | « **Filière unique au Burkina Faso**, reconnue pour son excellence et ses **équipements de pointe** » | `formationData.maquillage.why` |
| 45 | « Une **filière unique au Burkina Faso**, formant les maquilleurs des productions cinématographiques et théâtrales » | `nasmode.html` (carte 04) |
| 46 | « Filière unique au Burkina Faso » (sous-titre de la modale) et « **Unique au Burkina Faso** » (présentation) | `formationData.maquillage` |
| 47 | « Filière unique au Burkina Faso » (carte Maquillage de la grille École) | `ecole/index.html` |
| 48 | « **Déposer un dossier de candidature et réussir les formalités d'admission de NAS MODE** » | `formationData.maquillage.admissionDetails` |
| 49 | Baseline « Élever l'artisanat ouest-africain grâce à une formation professionnelle d'**élite** et des **laboratoires de design modernes** » (pied de page des 3 pages) | toutes pages |
| 50 | « **Excellence Artisanale Ouest-Africaine** » (pied de page) | toutes pages |
| 51 | « offrir une formation professionnelle **d'élite** au plus grand nombre » | `ecole/index.html` |
| 52 | Rubrique de navigation « **Fondation NAS MODE** » — aucune fondation n'est mentionnée au dépliant | toutes pages |

### 9.6 Descriptions de filières (page d'accueil)

| # | Affirmation publiée | Emplacement |
|---|---|---|
| 53 | « De la coupe au **patronage assisté par ordinateur**, nos élèves maîtrisent chaque étape de la création de mode » | `nasmode.html` (carte 01) |
| 54 | « Des techniques classiques aux **créations sculpturales**, la coiffure comme **art à part entière** » | `nasmode.html` (carte 02) |
| 55 | « Soins, beauté et expertise **au service des femmes burkinabè** » | `nasmode.html` (carte 03) |
| 56 | Intitulé de filière « **Esthétique & Onglerie** » (le dépliant ne crée aucune filière de ce nom) | `formationData.esthetique.title` |

### 9.7 Champs entiers des modales sans aucune contrepartie au dépliant

Le dépliant ne comporte **ni objectifs pédagogiques, ni compétences développées, ni qualités requises, ni débouchés, ni argumentaire commercial**. Les sections suivantes de `formationData` sont donc intégralement non sourcées.

| # | Champ | Contenu publié |
|---|---|---|
| 57 | `stylisme.objectives` (5 items) | Maîtriser les techniques d'assemblage et de coupe · Lire et développer des patrons · Réaliser des prototypes et des vêtements finis · Entretenir les équipements de couture · **Créer une collection personnelle** |
| 58 | `coiffure.objectives` (6 items) | Réaliser des soins capillaires complets · Modifier la texture et la couleur des cheveux · Confectionner des perruques à la machine (Lace Front et Lace Closure) · Maîtriser les tresses africaines modernes et braids · Réaliser des coiffures événementielles et chignons professionnels · Gérer un salon de coiffure |
| 59 | `esthetique.objectives` (5 items) | Réaliser les soins de la peau et des ongles · Maîtriser l'embellissement du corps · Pratiquer l'onglerie professionnelle · Connaître l'anatomie et la colorimétrie · **Gérer un institut de beauté** |
| 60 | `maquillage.objectives` (5 items) | Maîtriser le maquillage cinéma et télévision · Réaliser des effets spéciaux (SFX) · Pratiquer le maquillage artistique et le body painting · **Constituer un portfolio professionnel** · **Travailler sur un plateau de tournage** |
| 61 | `stylisme.skills` (8 badges) | Couture · Modélisme · Stylisme · Coupe · **Patronage** · Technologie textile · Dessin technique · **Entrepreneuriat** |
| 62 | `coiffure.skills` (8 badges) | Coiffure · Soins capillaires · Rajouts et extensions · Perruques · Tresses et braids · Brushing · Gestion de salon · Marketing digital |
| 63 | `esthetique.skills` (7 badges) | Soins de la peau · Soins des ongles · Onglerie · **Épilation** · Maquillage · Anatomie et colorimétrie · **Gestion d'institut** |
| 64 | `maquillage.skills` (7 badges) | Maquillage cinéma · Maquillage télévision · Effets spéciaux (SFX) · Maquillage artistique · Body painting · Photographie et portfolio · Colorimétrie |
| 65 | `stylisme.qualites` | Créativité · Rigueur · Patience · Sens du détail · Esprit d'équipe |
| 66 | `coiffure.qualites` | Créativité · Rigueur · Patience · Sens du détail · Contact client |
| 67 | `esthetique.qualites` | Sens du détail · Rigueur · **Hygiène** · **Douceur** · Contact client |
| 68 | `maquillage.qualites` | Créativité · Rigueur · Patience · Sens du détail · Esprit d'équipe |
| 69 | `stylisme.debouches` | 6 intitulés du dépliant + **« Créateur de marque »** et **« Responsable d'atelier »**, qui n'existent pas au dépliant |
| 70 | `coiffure.debouches` | Coiffeur dame · Coiffeur dame spécialisation + **« Bridage beauté »** *(libellé apparemment fautif)* · **« Gérant de salon »** · **« Coiffeur de mariée »** · **« Freelance »** · **« Formateur »** |
| 71 | `esthetique.debouches` | Esthéticien + **« Praticien onglerie »** · **« Spécialiste microblading »** · **« Gérant d'institut »** · **« Freelance »** · **« Formateur »** |
| 72 | `maquillage.debouches` | **« Maquilleur cinéma »** · **« Maquilleur télévision »** · **« Maquilleur de mode »** · **« Artiste SFX »** · **« Body painter »** · **« Freelance »** · **« Formateur »** — le dépliant ne connaît qu'un seul intitulé : « Maquilleur Cinéma et Télévision » |
| 73 | `stylisme.presentation` | « Chaque parcours allie **pratique intensive en atelier**, théorie, création et préparation aux diplômes sanctionnés par l'État » |
| 74 | `coiffure.presentation` | « Une **formation pratique intensive**, complétée par la gestion d'un salon de coiffure et le marketing digital » |
| 75 | `esthetique.presentation` | « Une **formation complète pour exercer dans un institut, un salon ou en indépendant** » |
| 76 | `maquillage.presentation` | « forme des maquilleurs capables d'intervenir sur les **plateaux de tournage, les théâtres et les défilés de mode** » |
| 77 | Sous-titres des 4 modales | « de l'esquisse au vêtement fini », « de la base à l'expertise », etc. |

---

## 10. Totaux

### 10.1 Lignes de comparaison des tableaux (sections 1 à 8)

| Verdict | Nombre |
|---|---|
| **IDENTIQUE** | 86 |
| **DIVERGENT** | 50 |
| **ABSENT_DU_SITE** | 10 |
| **ABSENT_DU_DEPLIANT** | 8 |
| **NON_VERIFIABLE** | 2 |
| **Total des faits comparés** | **156** |

### 10.2 Affirmations non sourcées recensées séparément (section 9)

| Catégorie | Nombre |
|---|---|
| Chiffres et performances | 14 |
| Histoire, gouvernance, partenariats, distinctions | 12 |
| Second campus d'Abidjan | 7 |
| Adresse et coordonnées | 2 |
| Arguments commerciaux et engagements de service | 17 |
| Descriptions de filières (page d'accueil) | 4 |
| Champs entiers des modales (objectifs, compétences, qualités, débouchés, présentations, sous-titres) | 21 |
| **Total ABSENT_DU_DEPLIANT (section 9)** | **77** |

**Total général ABSENT_DU_DEPLIANT : 85** — les 8 lignes de tableau des sections 1 à 8 (adresse physique « Secteur 47, Rayongo » ; contenu du Cycle 2 de l'Esthéticien ; complétion « du même domaine » ; formalités d'admission du Maquillage ; reconnaissance des diplômes par l'État ; réinscription à tarif réduit ; internat en pension complète ; crèche et bus « selon les besoins ») plus les 77 entrées de la section 9. Quelques-unes de ces 8 lignes sont reprises en section 9 pour que la liste des affirmations non sourcées soit lisible d'un seul tenant ; les doublons sont signalés dans les tableaux.

### 10.3 Lecture d'ensemble

Sur 156 faits directement comparables, **68 ne tiennent pas** (50 DIVERGENT + 10 ABSENT_DU_SITE + 8 ABSENT_DU_DEPLIANT), soit **44 %**. Les 86 IDENTIQUE se concentrent presque entièrement sur deux blocs : le **tableau des tarifs de la page École** (les 20 montants par métier, les 2 frais d'inscription et le module supplémentaire, soit 23 lignes exactes) et les **rubriques pratiques du dépliant** (commodités, dossier, avantages, modules). Tout ce qui relève de l'**admission, des diplômes et de l'attribution des matières** est majoritairement faux ou déplacé.

---

## 11. Les DIVERGENT par ordre de gravité

### Gravité 1 — Conditions d'admission fausses (un candidat peut être refusé ou dissuadé à tort)

1. **Modéliste** — le site exige « un diplôme en modélisme ou équivalent » ; le dépliant demande la **classe de 3ème**. Le site invente une condition d'entrée circulaire (il faut déjà être modéliste pour devenir modéliste) et écarte de fait tout candidat sortant du collège.
2. **Technicien de confection** — le site exige « un diplôme en modélisme **et technique de confection** » ; le dépliant demande « diplôme en modelisme ou équivalent ».
3. **Styliste** — le site exige « niveau de classe de 3ème au moins **et** un CAP ou CQP du même domaine » ; le dépliant demande un « diplôme en modelisme et technique de confection ou équivalent ».
4. **Tailleur homme et dame** — le site annonce « Cycle 1 (niveau inférieur ou égal à la classe de 4ème) » ; le dépliant exige « niveau de classe de 3ème au moins **et** être titulaire d'un CAP ou CQP ». C'est l'inversion la plus grave : le site présente comme **ouvert à un niveau inférieur à la 4ème** le métier le plus exigeant et le plus cher du catalogue (465 000 F CFA).
5. **Esthéticien** — le site annonce « Cycle 1 : niveau inférieur à la classe de **CM2** » ; le dépliant dit « niveau inférieur ou égale à la classe de **4ème** ». Le site abaisse le niveau annoncé de plusieurs classes.
6. **Esthéticien, Cycle 2** — le dépliant laisse la cellule **vide** ; le site la remplit d'une condition de son cru.
7. **« CAP ou CQP du même domaine »** — le dépliant s'arrête sur « du même » (phrase tronquée à l'impression). Le site complète par « domaine ». C'est une supposition présentée comme une donnée.
8. **Formalités d'admission du Maquillage** — le site ajoute une étape de sélection (« réussir les formalités d'admission de NAS MODE ») dont le dépliant ne dit rien.

### Gravité 2 — Diplômes mal attribués (le document délivré n'est pas celui annoncé)

9. **Modéliste** — le site annonce un **CQP** ; le dépliant sanctionne par « Attestation / **BQP** ».
10. **Technicien de confection** — le site annonce un **BQP** ; le dépliant ne prévoit qu'une **attestation de fin de formation**. Le site promet un brevet là où le dépliant ne délivre qu'une attestation.
11. **Couturier dame** — le dépliant prévoit « Attestation / **CQP** » ; le site n'attribue au Couturier dame que l'attestation, et le CQP disparaît de ce métier.
12. **Styliste, Tailleur, Coiffeur dame, Coiffeur dame Spécialisation** — le site n'affiche que le brevet (BPT / BPTS / CQP / BQP) et supprime la mention « Attestation de fin de formation » que le dépliant associe systématiquement.

### Gravité 3 — Tarifs présentés en fourchettes

13. **Externat filière Stylisme** — « 380 000 à 465 000 F CFA / an » masque six montants nominatifs (380 000 / 405 000 / 392 000 / 438 000 / 415 000 / 465 000).
14. **Internat filière Stylisme** — « 1 217 500 à 1 302 000 F CFA / an » masque six montants.
15. **Externat filière Coiffure** — « 380 000 à 405 000 F CFA / an » masque deux montants.
16. **Internat filière Coiffure** — « 1 217 500 à 1 242 000 F CFA / an » masque deux montants.
17. **Module supplémentaire dans les 4 modales** — « 30 000 F CFA par module » omet « **sans la matière d'œuvre** », qui est la seule restriction tarifaire du dépliant sur ce point.

### Gravité 4 — Contenus pédagogiques déplacés d'un métier à l'autre

18. **Suppléments du Styliste** (Confection des bijoux, Maquillage beauté) déplacés dans la modale **Esthétique**.
19. **Supplément du Tailleur homme et dame** (Conception et gestion de costumes de cinéma) déplacé dans la modale **Maquillage**.
20. **Suppléments du Coiffeur dame** (Maquillage beauté, Onglerie) déplacés dans la modale **Esthétique**.
21. **Suppléments du Coiffeur dame Spécialisation** (Onglerie professionnelle Gel/Résine/Acrygel/Capsules américaines, Photographie et création de contenus) déplacés dans la modale **Esthétique** et présentés comme un bloc de programme d'esthétique.
22. **Suppléments du Maquillage** (Perruques et postiches, Coiffure de mariée) déplacés dans la modale **Coiffure**.
23. **Suppléments de l'Esthéticien** (Réflexologie, Microblading, Dermo-cosmétique) dupliqués comme suppléments du **Maquillage**.
24. **Matière du Maquillage** (Anatomie et colorimétrie) ajoutée au programme de l'**Esthétique**.
25. **Cinq matières obligatoires du Coiffeur dame Spécialisation** (Tresses africaines modernes, Braids, Coiffures événementielles, Chignons professionnels, Coloration et balayage sur modèles) reclassées en « **Suppléments au choix** » : le site transforme des enseignements dus en options.
26. **Matières non attribuées** — les 10 métiers du dépliant ont chacun leur liste de matières ; le site les fond en 4 filières, si bien qu'aucun métier n'a plus de programme identifiable (lignes 1 à 6 de la grille, Esthéticien).
27. **Trois matières du Coiffeur dame Spécialisation** (Lace Front et Lace Closure, Soins capillaires complets, Marketing digital et développement de la clientèle) déclassées : elles n'apparaissent plus dans le programme, seulement dans les objectifs ou les compétences.
28. **Organisation du travail** absente du programme de l'Esthéticien alors que le dépliant l'y inscrit.

### Gravité 5 — Écarts de formulation et de structure

29. **Adresse web** — le dépliant annonce `www.nasmodeformation.com` ; le site est publié sur `nas-mode.vercel.app` et ne mentionne jamais le domaine annoncé.
30. **Modalités de paiement** — le site réduit quatre postes (formation, internat, crèche, bus) à un pourcentage unique par échéance, et remplace « 1ère semaine du mois de décembre / février » par « en décembre / en février ».
31. **Trousseau à la charge de l'apprenant** — mentionné dans les seules modales Coiffure et Esthétique, absent de la page École et des modales Stylisme et Maquillage, alors que le dépliant l'énonce pour tous.
32. **PACKAGE 4** — intitulé tronqué de « ESTHÉTIQUE ET MAQUILLAGE CINÉMA ET TÉLÉVISION » à « Esthétique & maquillage ».
33. **PACKAGE 5** — intitulé tronqué de « COIFFURE ET SPÉCIALISATION » à « Coiffure ».
34. **Structure de l'offre** — 5 packages / 10 métiers au dépliant contre 4 filières aux intitulés inédits sur la page d'accueil et dans les modales.
35. **Encart « Admission » des modales Stylisme et Esthétique** — présentent une condition unique là où le dépliant en donne six (Stylisme) ou une autre (Esthétique).
36. **Suppléments du Modéliste et du Technicien** — « Techniques **de** moulage » pour « Techniques **du** moulage » ; « Confection **d'**accessoires (chapeau, chaussure, **sac**) » pour « Confection **des** accessoires (chapeau, chaussure, sac **à main**...) », les points de suspension du dépliant (liste non close) étant supprimés.
37. **Suppléments du Mécanicien de confection** — le dépliant ne lui en attribue **aucun** ; la modale Stylisme en présente six comme accessibles à toute la filière.

---

## 12. Ce qui n'a pas pu être vérifié, et pourquoi

1. **Les deux filigranes de crédit photo** (`[INCERTAIN: …de Mode © Boudou OUEDRAOGO]` et `[INCERTAIN: …ans de Nas de Mode © Boudou OUEDRAOGO]`) — la transcription les porte comme incertains parce qu'ils sont physiquement coupés par le bord des photos. Le site n'affiche aucun crédit photo, donc aucune comparaison n'est possible. **NON_VERIFIABLE.**
2. **La note de bas de tableau associée à l'astérisque des colonnes « Frais de formation\* »** — la transcription établit qu'elle est **absente du dépliant** et non illisible. Le site ne porte aucun astérisque. On ne peut donc ni confirmer ni infirmer une éventuelle condition attachée aux frais de formation. **NON_VERIFIABLE.**
3. **Les 77 affirmations de la section 9** ne sont pas « fausses » : elles sont **hors du périmètre du dépliant**. La transcription ne permet ni de les confirmer ni de les démentir. Ce sont des faits à sourcer auprès du centre, pas des erreurs constatées. Deux réserves méritent cependant d'être signalées à part, parce que le site s'y contredit lui-même : le nombre de personnes formées (**3 000+** sur la page d'accueil contre **2 500+** sur la page École) et l'ancienneté (**« plus de 20 ans »**, **« 25 ans »** et **« plus de 25 ans »** dans trois formulations concurrentes).
4. **Les pages non couvertes par cette vérification** : `public/defiles.html`, `public/soutenir/index.html`, `public/index.html`, `public/compare-enhance.html` et `public/modal-prototype.html` n'ont pas été dépouillées ligne à ligne (hors périmètre demandé). Des `grep` de contrôle montrent que `soutenir/index.html` reprend au moins les affirmations « monument identitaire », « 3,5 milliards », « Swisscontact » et « FESPACO » relevées en section 9 ; les autres contenus de ces fichiers restent à vérifier.
5. **La correspondance entre les photos du site et celles du dépliant** n'a pas été examinée : la transcription ne décrit les images que par leur sujet, ce qui ne permet aucune comparaison fiable.

---

*Rapport établi sans aucune connaissance extérieure au dépliant et au site. Aucune correction n'est proposée : les décisions de réécriture reviennent à l'agent principal.*
