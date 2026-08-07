/* ============================================================================
   NAS MODE — INFORMATIONS À CONFIRMER AUPRÈS DU CENTRE
   ============================================================================

   POURQUOI CE FICHIER
   Le dépliant officiel (docs/depliant-transcription.md) n'imprime NI la durée
   des formations, NI le rythme hebdomadaire, NI l'effectif par promotion, NI
   les dates de rentrée, NI le détail de ce que couvre l'internat, NI le montant
   des frais de la formation en entrepreneuriat.
   Ces informations ne sont donc PAS écrites sur le site tant que le centre ne
   les a pas communiquées. À la place, le visiteur voit une mention neutre
   (« à confirmer auprès du centre ») et le numéro de téléphone du centre.

   ----------------------------------------------------------------------------
   POUR BEN — COMMENT REMPLIR
   ----------------------------------------------------------------------------
   1. Une seule chose à faire : remplacer `null` par la valeur réelle, entre
      guillemets simples. Exemple :
          duree: null                 ->   duree: '9 mois'
          effectif: null              ->   effectif: '25 apprenants par promotion'
   2. Ne toucher à rien d'autre. Ce fichier est le SEUL endroit à modifier :
      les deux pages qui affichent ces informations le lisent ici.
   3. Tant qu'une valeur reste `null`, la mention « à confirmer auprès du
      centre » et le téléphone restent affichés : jamais de blanc, jamais de
      texte de remplissage.
   4. La mise en page ne dépend pas de la longueur du texte (grille auto-fit,
      pas de hauteur fixe, pas de white-space:nowrap) : une valeur courte
      (« 9 mois ») comme une valeur longue (« du lundi au vendredi, 8h-16h »)
      s'affichent sans saut ni débordement.

   ----------------------------------------------------------------------------
   OÙ CHAQUE INFORMATION APPARAÎT SUR LE SITE
   ----------------------------------------------------------------------------
   duree, rythme, effectif, rentree, internat, fraisEntrepreneuriat
     - public/nasmode.html      : dans les 4 modales de formation
                                  (section « Organisation de la formation »,
                                  juste après « Les métiers de cette filière »)
     - public/ecole/index.html  : section FORMATIONS & DIPLÔMES,
                                  bloc « Organisation de la formation »
                                  (entre « Les 10 métiers » et « Coût annuel »),
                                  accessible depuis le sommaire de la section.

   Le téléphone affiché à côté des mentions est `telephone` ci-dessous
   (source : dépliant, « Inscriptions et informations »).
   ============================================================================ */

window.infosAConfirmer = {

  /* --- Les 6 informations attendues du centre. `null` = pas encore connue. --- */

  // Durée de chaque formation. Ex. : '9 mois', 'Cycle 1 : 2 ans / Cycle 2 : 3 ans'
  duree: null,

  // Rythme hebdomadaire. Ex. : 'Du lundi au vendredi, 8h - 16h'
  rythme: null,

  // Effectif par promotion. Ex. : '25 apprenants par promotion'
  effectif: null,

  // Dates de rentrée. Ex. : 'Rentrée le 1er octobre'
  rentree: null,

  // Ce que couvre l'internat. Ex. : 'Hébergement, restauration et blanchisserie'
  internat: null,

  // Montant des frais de la formation en entrepreneuriat (à la charge de
  // l'apprenant, cf. dépliant). Recopier le montant communiqué par le centre
  // chiffre par chiffre, au format « … F CFA ». Aucun montant d'exemple n'est
  // écrit ici pour qu'il ne puisse jamais être publié par erreur.
  fraisEntrepreneuriat: null,

  /* --- Réglages d'affichage (ne pas modifier sans raison) --- */

  telephone: '+226 78 01 41 98',
  telephoneLien: '+22678014198',
  mention: 'à confirmer auprès du centre',

  // Ordre et intitulés affichés côté visiteur.
  libelles: [
    ['duree',                'Durée de la formation'],
    ['rythme',               'Rythme hebdomadaire'],
    ['effectif',             'Effectif par promotion'],
    ['rentree',              'Date de rentrée'],
    ['internat',             "Ce que couvre l'internat"],
    ['fraisEntrepreneuriat', "Frais de la formation en entrepreneuriat"]
  ]
};

/* ----------------------------------------------------------------------------
   Rendu. Deux usages, une seule source de vérité (l'objet ci-dessus).

   a) window.infosAConfirmerHTML()  -> chaîne HTML, utilisée par les modales
      de nasmode.html qui construisent leur contenu en JavaScript.

   b) window.infosAConfirmerAppliquer() -> met à jour le bloc déjà présent en
      HTML statique sur ecole/index.html. Le texte « à confirmer » y est écrit
      en dur pour rester lisible sans JavaScript et pour ne provoquer aucun
      décalage de mise en page ; cette fonction ne fait que le remplacer par la
      vraie valeur quand elle existe.
   ---------------------------------------------------------------------------- */

(function () {
  var I = window.infosAConfirmer;

  function echapper(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.infosAConfirmerHTML = function () {
    var lignes = I.libelles.map(function (paire) {
      var valeur = I[paire[0]];
      var connue = valeur !== null && valeur !== undefined && String(valeur).trim() !== '';
      return '<div class="iac-item" data-info-a-confirmer="' + paire[0] + '">'
        + '<span class="iac-cle">' + echapper(paire[1]) + '</span>'
        + '<span class="iac-val' + (connue ? '' : ' iac-attente') + '">'
        + echapper(connue ? valeur : I.mention) + '</span></div>';
    }).join('');
    return '<div class="iac-grid">' + lignes + '</div>'
      + '<p class="iac-tel">Ces précisions sont données par le centre. '
      + 'Inscriptions et informations : '
      + '<a href="tel:' + I.telephoneLien + '">' + echapper(I.telephone) + '</a></p>';
  };

  window.infosAConfirmerAppliquer = function (racine) {
    var champs = (racine || document).querySelectorAll('[data-info-a-confirmer]');
    for (var i = 0; i < champs.length; i++) {
      var cle = champs[i].getAttribute('data-info-a-confirmer');
      var valeur = I[cle];
      if (valeur === null || valeur === undefined || String(valeur).trim() === '') continue;
      var cible = champs[i].querySelector('.iac-val');
      if (!cible) continue;
      cible.textContent = valeur;
      cible.classList.remove('iac-attente');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.infosAConfirmerAppliquer(); });
  } else {
    window.infosAConfirmerAppliquer();
  }
})();
