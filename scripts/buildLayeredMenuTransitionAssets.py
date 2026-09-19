"""Prepare existing, complete Procreate layers for menu transitions.

UI layers are copied byte-for-byte; only static scenery is composited to avoid
decoding dozens of full-screen scenery textures on a phone.
"""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

from PIL import Image


CHARACTER_UI = (0, 1, 4, 6, 7, 8, 9, 10, 12, 13, 14, 16, 17, 18, 24, 25)
TRAITS_UI = tuple(range(10))


def compose(layers: Path, indices: tuple[int, ...], destination: Path) -> None:
    canvas = Image.new('RGBA', (1440, 3120))
    for index in indices:
        with Image.open(layers / f'{index:02d}.png') as layer:
            canvas.alpha_composite(layer)
    canvas.save(destination, optimize=True)


def copy_ui(layers: Path, indices: tuple[int, ...], destination: Path) -> None:
    for index in indices:
        shutil.copy2(layers / f'{index:02d}.png', destination / f'{index:02d}.png')


def main(character_layers: Path, traits_layers: Path, output: Path) -> None:
    character = output / 'character'
    traits = output / 'traits'
    character.mkdir(parents=True, exist_ok=True)
    traits.mkdir(parents=True, exist_ok=True)
    copy_ui(character_layers, CHARACTER_UI, character)
    copy_ui(traits_layers, TRAITS_UI, traits)
    compose(character_layers, (34, 33, 32, 30, 29, 28, 27, 26), character / 'scene-back.png')
    compose(character_layers, (23, 22, 21, 20, 19), character / 'scene-mid.png')
    compose(traits_layers, (25, 24, 23, 21, 20, 19, 18, 17, 14, 13, 12, 11), traits / 'scenery.png')


if __name__ == '__main__':
    main(*(Path(value) for value in sys.argv[1:4]))
