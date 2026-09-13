from __future__ import annotations

import io
import plistlib
import struct
import sys
import zipfile
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


def decode_lz4_block(data: bytes, expected: int, history: bytes = b'') -> bytes:
    src = 0
    out = bytearray(history[-65536:])
    initial_length = len(out)
    while src < len(data):
        token = data[src]
        src += 1
        literal_length = token >> 4
        if literal_length == 15:
            while True:
                value = data[src]
                src += 1
                literal_length += value
                if value != 255:
                    break
        out.extend(data[src:src + literal_length])
        src += literal_length
        if src >= len(data):
            break
        offset = data[src] | (data[src + 1] << 8)
        src += 2
        match_length = token & 15
        if match_length == 15:
            while True:
                value = data[src]
                src += 1
                match_length += value
                if value != 255:
                    break
        match_length += 4
        copy_at = len(out) - offset
        if copy_at < 0:
            raise ValueError(f'Invalid LZ4 offset {offset} at source {src}, output {len(out)}')
        for _ in range(match_length):
            out.append(out[copy_at])
            copy_at += 1
    decoded = bytes(out[initial_length:])
    if len(decoded) != expected:
        raise ValueError(f'Unexpected LZ4 block size: {len(decoded)} != {expected}')
    return decoded


def decode_tile(blob: bytes) -> bytes:
    cursor = 0
    decoded = bytearray()
    while cursor + 12 <= len(blob):
        magic = blob[cursor:cursor + 4]
        if magic == b'bvx$':
            break
        raw_length, stored_length = struct.unpack_from('<II', blob, cursor + 4)
        cursor += 12
        block = blob[cursor:cursor + stored_length]
        cursor += stored_length
        if magic == b'bv41':
            decoded.extend(decode_lz4_block(block, raw_length, decoded))
        elif magic == b'bv4-':
            decoded.extend(block)
        else:
            raise ValueError(f'Unknown Procreate block {magic!r}')
    return bytes(decoded)


def uid_value(objects, value):
    while isinstance(value, plistlib.UID):
        value = objects[value.data]
    return value


def main(source: Path, output: Path) -> None:
    with zipfile.ZipFile(source) as archive:
        document = plistlib.loads(archive.read('Document.archive'))
        objects = document['$objects']
        root = uid_value(objects, document['$top']['root'])
        width, height = [int(value) for value in uid_value(objects, root['size']).strip('{}').split(',')]
        composite = uid_value(objects, root['composite'])
        uuid = uid_value(objects, composite['UUID'])
        entries = [entry for entry in archive.infolist() if entry.filename.startswith(f'{uuid}/') and entry.filename.endswith('.lz4')]
        reference = Image.open(io.BytesIO(archive.read('QuickLook/Thumbnail.png'))).convert('RGB')
        tiles = []
        for entry in entries:
            stem = Path(entry.filename).stem
            tile_x, tile_y = [int(value) for value in stem.split('~')]
            try:
                raw = decode_tile(archive.read(entry))
            except Exception as error:
                raise ValueError(f'Could not decode {entry.filename}: {error}') from error
            tiles.append((tile_x, tile_y, raw, min(256, width - tile_x * 256), min(256, height - tile_y * 256)))
        candidates = []
        for raw_mode in ('RGBA', 'BGRA'):
            for flip_y in (False, True):
                for flip_tile_y in (False, True):
                    for flip_tile_x in (False, True):
                        canvas = Image.new('RGBA', (width, height))
                        for tile_x, tile_y, raw, tile_width, tile_height in tiles:
                            tile = Image.frombytes('RGBA', (tile_width, tile_height), raw, 'raw', raw_mode)
                            if flip_tile_y:
                                tile = tile.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
                            if flip_tile_x:
                                tile = tile.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
                            y = height - (tile_y * 256 + tile_height) if flip_y else tile_y * 256
                            canvas.alpha_composite(tile, (tile_x * 256, y))
                        preview = canvas.convert('RGB').resize(reference.size, Image.Resampling.LANCZOS)
                        score = sum(ImageStat.Stat(ImageChops.difference(preview, reference)).mean)
                        candidates.append((score, canvas, raw_mode, flip_y, flip_tile_y, flip_tile_x))
        score, best, raw_mode, flip_y, flip_tile_y, flip_tile_x = min(candidates, key=lambda candidate: candidate[0])
        output.parent.mkdir(parents=True, exist_ok=True)
        best.save(output, optimize=True)
        print(f'Wrote {output} ({width}x{height}); match score {score:.2f}; {raw_mode}, flip_y={flip_y}, flip_tile_y={flip_tile_y}, flip_tile_x={flip_tile_x}')


if __name__ == '__main__':
    main(Path(sys.argv[1]), Path(sys.argv[2]))
