from __future__ import annotations

import plistlib
import shutil
import sys
import zipfile
from pathlib import Path

from PIL import Image

from extractProcreateComposite import uid_value


def build(huntsman_source: Path, huntsman_layers: Path, archer_layers: Path, output: Path) -> None:
    with zipfile.ZipFile(huntsman_source) as archive:
        document = plistlib.loads(archive.read('Document.archive'))
        objects = document['$objects']
        root = uid_value(objects, document['$top']['root'])
        width, height = [int(value) for value in uid_value(objects, root['size']).strip('{}').split(',')]
        layers = uid_value(objects, root['layers'])['NS.objects']

    background = Image.new('RGBA', (width, height))
    for index in reversed(range(len(layers))):
        if index in (3, 5, 11) or uid_value(objects, layers[index])['hidden']:
            continue
        layer_path = huntsman_layers / f'{index:02d}.png'
        if layer_path.exists():
            with Image.open(layer_path) as layer:
                background.alpha_composite(layer)

    output.mkdir(parents=True, exist_ok=True)
    background.save(output / 'character-select-shared.png', optimize=True)
    with Image.open(huntsman_layers / '11.png') as info_layer:
        buttons = Image.new('RGBA', (width, height))
        buttons.alpha_composite(info_layer.crop((0, 2630, width, height)), (0, 2630))
        buttons.save(output / 'character-select-buttons.png', optimize=True)
    sprites = {
        'huntsman-character.png': huntsman_layers / '05.png',
        'huntsman-portrait.png': huntsman_layers / '03.png',
        'elf-archer-character.png': archer_layers / '04.png',
        'elf-archer-portrait.png': archer_layers / '00.png',
    }
    for filename, source in sprites.items():
        shutil.copyfile(source, output / filename)

    print('Built shared character-select artwork, original buttons, and four character sprites')


if __name__ == '__main__':
    build(*(Path(value) for value in sys.argv[1:5]))
