from __future__ import annotations

import plistlib
import sys
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw

from extractProcreateComposite import decode_tile, uid_value


def extract(source: Path, output: Path, selected_indices: set[int] | None = None) -> None:
    with zipfile.ZipFile(source) as archive:
        document = plistlib.loads(archive.read('Document.archive'))
        objects = document['$objects']
        root = uid_value(objects, document['$top']['root'])
        width, height = [int(value) for value in uid_value(objects, root['size']).strip('{}').split(',')]
        layers = uid_value(objects, root['layers'])['NS.objects']
        output.mkdir(parents=True, exist_ok=True)
        contact = Image.new('RGB', (200 * 5, 425 * ((len(layers) + 4) // 5)), 'white')
        draw = ImageDraw.Draw(contact)
        for index, layer_uid in enumerate(layers):
            if selected_indices is not None and index not in selected_indices:
                continue
            layer = uid_value(objects, layer_uid)
            uuid = uid_value(objects, layer['UUID'])
            name = uid_value(objects, layer['name'])
            canvas = Image.new('RGBA', (width, height))
            entries = [item for item in archive.infolist() if item.filename.startswith(f'{uuid}/') and item.filename.endswith('.lz4')]
            for entry in entries:
                tile_x, tile_y = [int(value) for value in Path(entry.filename).stem.split('~')]
                tile_width = min(256, width - tile_x * 256)
                tile_height = min(256, height - tile_y * 256)
                tile = Image.frombytes('RGBA', (tile_width, tile_height), decode_tile(archive.read(entry)), 'raw', 'RGBA')
                tile = tile.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
                y = height - (tile_y * 256 + tile_height)
                canvas.alpha_composite(tile, (tile_x * 256, y))
            bbox = canvas.getbbox()
            if bbox:
                canvas.save(output / f'{index:02d}.png')
                thumbnail = canvas.copy()
                thumbnail.thumbnail((190, 370))
                base = Image.new('RGBA', thumbnail.size, 'white')
                base.alpha_composite(thumbnail)
                x = (index % 5) * 200 + (200 - thumbnail.width) // 2
                y = (index // 5) * 425 + 22
                contact.paste(base.convert('RGB'), (x, y))
            draw.text(((index % 5) * 200 + 5, (index // 5) * 425 + 395), f'{index:02d} {name[:20]} {bbox}', fill='black')
            print(f'{index:02d} {name} hidden={layer.get("hidden")} bbox={bbox}')
        contact.save(output / 'contact.png')


if __name__ == '__main__':
    selection = {int(value) for value in sys.argv[3].split(',')} if len(sys.argv) > 3 else None
    extract(Path(sys.argv[1]), Path(sys.argv[2]), selection)
