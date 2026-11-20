#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Converte arquivos PNG, JPG e JPEG de uma pasta para WebP usando Pillow.

Uso:
  py convert_images_to_webp.py <pasta> [qualidade]
  py convert_images_to_webp.py images 80
  py convert_images_to_webp.py . 80 --recursive
  py convert_images_to_webp.py images 80 --overwrite --delete-original
"""

from __future__ import annotations

import argparse
from pathlib import Path

SUPPORTED_EXTENSIONS = {".png", ".webp", ".jpeg"}


def convert_to_webp(
    image_path: Path,
    quality: int = 80,
    overwrite: bool = False,
    delete_original: bool = False,
) -> bool:
    """Converte uma imagem PNG/JPG/JPEG para WebP usando Pillow."""
    try:
        from PIL import Image, ImageOps
    except ImportError:
        print("❌ Pillow não está instalado!")
        print("   Instale com: pip install Pillow")
        return False

    if not image_path.is_file():
        print(f"❌ Arquivo não encontrado: {image_path}")
        return False

    webp_path = image_path.with_suffix(".webp")
    original_size = image_path.stat().st_size

    if webp_path.exists() and not overwrite:
        print(f"⏭️  Já existe, pulando: {webp_path.name}")
        return True

    print(f"🔄 Convertendo: {image_path.name}")
    print(f"   Original: {original_size / 1024:.2f} KB | Qualidade: {quality}")

    try:
        with Image.open(image_path) as raw_img:
            img = ImageOps.exif_transpose(raw_img)

            # Preserva alfa em PNG quando existir; converte CMYK/P/outros para RGB/RGBA
            if img.mode == "P":
                img = img.convert("RGBA" if "transparency" in img.info else "RGB")
            elif img.mode == "LA":
                img = img.convert("RGBA")
            elif img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGB")

            img.save(webp_path, "WEBP", quality=quality, method=6)

        webp_size = webp_path.stat().st_size
        savings = original_size - webp_size
        percent = (savings / original_size * 100) if original_size > 0 else 0

        print(f"   ✅ WebP: {webp_size / 1024:.2f} KB | Economia: {percent:.1f}%")

        if delete_original and webp_path.exists():
            image_path.unlink()
            print(f"   🗑️  Original removido: {image_path.name}")

        return True

    except Exception as exc:
        print(f"   ❌ Erro: {exc}")
        return False


def listar_imagens(pasta: Path, recursive: bool) -> list[Path]:
    """Lista arquivos PNG, JPG e JPEG da pasta (opcionalmente em subpastas)."""
    iterator = pasta.rglob("*") if recursive else pasta.iterdir()
    arquivos = [
        p
        for p in iterator
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
    ]
    return sorted(arquivos)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Converte arquivos PNG, JPG e JPEG de uma pasta para WebP.",
    )
    parser.add_argument("pasta", help="Pasta com arquivos .png, .webp ou .jpeg")
    parser.add_argument(
        "qualidade",
        nargs="?",
        type=int,
        default=80,
        help="Qualidade WebP (0-100, default: 80)",
    )
    parser.add_argument(
        "--recursive",
        "-r",
        action="store_true",
        help="Incluir imagens em subpastas",
    )
    parser.add_argument(
        "--overwrite",
        "-f",
        action="store_true",
        help="Sobrescrever arquivos .webp existentes",
    )
    parser.add_argument(
        "--delete-original",
        "-d",
        action="store_true",
        help="Remover o arquivo original após conversão bem-sucedida",
    )
    args = parser.parse_args()

    pasta = Path(args.pasta).expanduser().resolve()
    if not pasta.is_dir():
        print(f"❌ Pasta não encontrada: {pasta}")
        return 1

    if not 0 <= args.qualidade <= 100:
        print("❌ Qualidade deve estar entre 0 e 100.")
        return 1

    imagens = listar_imagens(pasta, args.recursive)
    if not imagens:
        print(f"⚠️  Nenhum arquivo PNG/JPG/JPEG encontrado em: {pasta}")
        return 0

    print(f"📁 Pasta: {pasta}")
    print(f"🖼️  Imagens encontradas (PNG/JPG/JPEG): {len(imagens)}")
    print(f"🎨 Qualidade: {args.qualidade}")
    if args.recursive:
        print("📂 Modo recursivo: ativo")
    print()

    ok = 0
    falhas = 0
    for img_path in imagens:
        if convert_to_webp(
            img_path,
            quality=args.qualidade,
            overwrite=args.overwrite,
            delete_original=args.delete_original,
        ):
            ok += 1
        else:
            falhas += 1
        print()

    print("=" * 50)
    print("📊 Resumo")
    print(f"   Convertidos/pulados: {ok}")
    print(f"   Falhas: {falhas}")
    print(f"   Total: {len(imagens)}")

    return 0 if falhas == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
