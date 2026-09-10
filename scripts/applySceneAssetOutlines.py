"""Apply Eldra's standard ink-and-paper separation outline to a layered asset set."""

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

PADDING = 10
INK = (39, 30, 26, 105)
TEXTURE_PATH = Path(__file__).resolve().parent.parent / "assets" / "ported" / "materials" / "eldra_paper_fiber.png"
REMOVED_COMPONENTS = {
    "tavernUpstairs": {
        # Standalone shelf candle and wall lantern intentionally hidden from this scene.
        "ELD-ENC-TU-020": [(120, 500, 270, 680), (920, 440, 1085, 630)],
    },
}


def paper_texture(size: tuple[int, int]) -> Image.Image:
    texture = Image.open(TEXTURE_PATH).convert("RGB")
    return texture.resize(size, Image.Resampling.LANCZOS).convert("RGBA")


def slug(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")
    return value or "layer"


def outlined(source: Path, destination: Path, removals: list[tuple[int, int, int, int]]) -> None:
    original = Image.open(source).convert("RGBA")
    for box in removals:
        original.paste((0, 0, 0, 0), box)
    original_alpha = original.getchannel("A")
    histogram = original_alpha.histogram()
    nontransparent = sum(histogram[1:])
    soft_pixels = sum(histogram[1:96])
    is_soft_effect = nontransparent > 0 and soft_pixels / nontransparent > 0.5

    # Glows, lighting washes and shadows must stay translucent. Turning their
    # faint pixels into paper edges creates visible rectangular colour blocks.
    if is_soft_effect:
        padded = Image.new("RGBA", (original.width + PADDING * 2, original.height + PADDING * 2))
        padded.paste(original, (PADDING, PADDING))
        destination.parent.mkdir(parents=True, exist_ok=True)
        padded.save(destination, optimize=True)
        return

    # Flatten the colour range slightly and press paper fibres into the artwork,
    # matching the crisp layered-paper treatment used by the exterior scene.
    cut_colour = original.quantize(colors=96, method=Image.Quantize.FASTOCTREE).convert("RGBA")
    cut_colour.putalpha(original_alpha)
    texture = paper_texture(original.size)
    textured_rgb = ImageChops.multiply(cut_colour.convert("RGB"), texture.convert("RGB")).convert("RGBA")
    textured_rgb.putalpha(original_alpha)
    original = Image.blend(cut_colour, textured_rgb, 0.16)
    original.putalpha(original_alpha)

    padded = Image.new("RGBA", (original.width + PADDING * 2, original.height + PADDING * 2))
    padded.paste(original, (PADDING, PADDING))
    alpha = padded.getchannel("A")

    shadow_alpha = alpha.filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.GaussianBlur(0.8))
    shadow_alpha = shadow_alpha.point(lambda value: value * INK[3] // 255)
    offset_shadow = Image.new("L", padded.size)
    offset_shadow.paste(shadow_alpha, (2, 3))
    shadow = Image.new("RGBA", padded.size, INK[:3] + (0,))
    shadow.putalpha(offset_shadow)

    paper_alpha = alpha.filter(ImageFilter.MaxFilter(13))
    paper = paper_texture(padded.size)
    paper.putalpha(paper_alpha)

    result = Image.alpha_composite(shadow, paper)
    result = Image.alpha_composite(result, padded)
    destination.parent.mkdir(parents=True, exist_ok=True)
    result.save(destination, optimize=True)


def main() -> None:
    set_root = Path(sys.argv[1])
    module_path = Path(sys.argv[2])
    export_name = sys.argv[3]
    manifest = json.loads((set_root / "AssetManifest.json").read_text(encoding="utf-8"))
    assets = [asset for asset in manifest["assets"] if asset["status"] == "exported" and not asset["hidden"]]
    next_number = max(int(asset["id"].rsplit("-", 1)[1]) for asset in manifest["assets"]) + 1
    derived_root = set_root / "Derived" / "Consistency"

    lines = [
        "import type { ArtworkLayer } from './layerAssets';",
        "",
        f"export const {export_name}_SOURCE_IDS = new Set([",
        *[f"  {asset['id']!r}," for asset in assets],
        "]);",
        "",
        f"export const {export_name}_LAYERS: ArtworkLayer[] = [",
    ]

    for offset, asset in enumerate(assets):
        destination_name = f"{asset['id']}_{slug(asset['displayName'])}_outlined.png"
        removals = REMOVED_COMPONENTS.get(set_root.name, {}).get(asset["id"], [])
        outlined(set_root / asset["file"], derived_root / destination_name, removals)
        rect = asset["pixelRect"]
        metadata = {
            "id": f"{asset['id'].rsplit('-', 1)[0]}-{next_number + offset:03d}",
            "displayName": f"{asset['displayName']} - Consistency Outline",
            "hidden": False,
            "opacity": asset["opacity"],
            "order": asset["sourceOrderTopToBottom"],
            "rect": {
                "x": rect["x"] - PADDING,
                "y": rect["y"] - PADDING,
                "width": rect["width"] + PADDING * 2,
                "height": rect["height"] + PADDING * 2,
            },
        }
        relative = f"../../assets/ported/layers/{set_root.name}/Derived/Consistency/{destination_name}"
        packed = json.dumps(metadata, separators=(",", ":")).replace("false", "false").replace("true", "true")
        lines.append(f"  {{...{packed},source:require({json.dumps(relative)})}},")

    lines.append("];")
    module_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
