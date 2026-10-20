#!/usr/bin/env python3
"""Concatène site/src/* → site/index.html (ordre fixe, pas le tri lexicographique)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"

HEAD = [
    "00-head.html",
    "10-styles.css",
    "15-body-open.html",
    "20-sprite.html",
    "21-hero.html",
]
TAIL = [
    "29-app-open.html",
    "30-app.js",
    "99-close.html",
]


PAGES = [
    "p-band.html",
    "p-prestations.html",
    "p-chantiers.html",
    "p-avis.html",
    "p-methode.html",
    "p-pourquoi.html",
    "p-gerant.html",
    "p-zone.html",
    "p-faq.html",
    "p-devis.html",
    "p-contact.html",
    "p-footer.html",
]


def fragment_order() -> list[Path]:
    named = {p.name: p for p in SRC.iterdir() if p.is_file() and not p.name.startswith(".")}
    pages = [n for n in PAGES if n in named]
    vendor = "25-vendor.html"
    order = HEAD + pages
    if vendor in named:
        order.append(vendor)
    order.extend(TAIL)
    missing = [n for n in order if n not in named]
    if missing:
        raise SystemExit(f"Fragments manquants dans src/ : {', '.join(missing)}")
    extra = set(named) - set(order)
    if extra:
        raise SystemExit(f"Fichiers src/ non référencés : {', '.join(sorted(extra))}")
    return [named[n] for n in order]


def main() -> None:
    parts: list[str] = []
    for path in fragment_order():
        text = path.read_text(encoding="utf-8")
        parts.append(text)
        if not text.endswith("\n"):
            parts.append("\n")

    built = "".join(parts)
    prev = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    OUT.write_text(built, encoding="utf-8")
    if built != prev:
        print(f"Écrit {OUT} ({len(built):,} octets, {len(parts)} fragments)")
    else:
        print(f"À jour — {OUT} ({len(built):,} octets)")


if __name__ == "__main__":
    main()
