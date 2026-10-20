# Bogey TP — site statique

Le site livré (pixel près) vit dans **`site/`** : une page `index.html` (CSS + JS inline), médias en chemins relatifs. Il fonctionne en `file://` et en hébergement statique.

## Workflow

1. Modifier les fragments dans **`site/src/`** (jamais `index.html` à la main).
2. Reconstruire : `python3 site/build.py`
3. Ouvrir `site/index.html` et comparer avec les captures de référence (`captures/v3/` à 1440, 390 et 360 px) lorsqu’elles sont disponibles.

Import initial depuis le dossier « bogey-tp 2 » (Downloads). Découpe ponctuelle : `python3 site/split_sources.py` (à relancer seulement si vous repartez d’un `index.html` monolithique).

## Avant mise en ligne

- Remplacer `FORM_ENDPOINT` dans `site/src/30-app.js` (Formspree).
- Compléter hébergeur et éléments marqués `.tbc` / « À confirmer » avec le client.

Le dossier **`app/`** à la racine est un projet Next.js par défaut (non utilisé pour la livraison statique).
