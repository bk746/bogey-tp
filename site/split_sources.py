#!/usr/bin/env python3
"""Découpe index.html en fragments src/ (usage ponctuel après import)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INDEX = ROOT / "index.html"
SRC = ROOT / "src"


def slice_lines(lines: list[str], start: int, end: int) -> str:
    return "".join(lines[start - 1 : end])


def main() -> None:
    lines = INDEX.read_text(encoding="utf-8").splitlines(keepends=True)
    n = len(lines)

    chunks: list[tuple[str, int, int]] = [
        ("00-head.html", 1, 38),
        ("10-styles.css", 39, 550),
        ("15-body-open.html", 551, 553),
        ("20-sprite.html", 554, 577),
        ("21-hero.html", 578, 629),
        ("p-band.html", 630, 641),
        ("p-prestations.html", 642, 686),
        ("p-chantiers.html", 687, 703),
        ("p-avis.html", 704, 721),
        ("p-methode.html", 722, 740),
        ("p-pourquoi.html", 741, 758),
        ("p-gerant.html", 759, 776),
        ("p-zone.html", 777, 805),
        ("p-faq.html", 806, 819),
        ("p-devis.html", 820, 886),
        ("p-contact.html", 887, 902),
        ("p-footer.html", 903, 966),
        ("25-vendor.html", 967, 971),
        ("29-app-open.html", 972, 972),
        ("30-app.js", 973, 1136),
        ("99-close.html", 1137, n),
    ]

    SRC.mkdir(parents=True, exist_ok=True)
    for name, start, end in chunks:
        (SRC / name).write_text(slice_lines(lines, start, end), encoding="utf-8")

    print(f"Découpé {n} lignes → {len(chunks)} fichiers dans {SRC}")


if __name__ == "__main__":
    main()
