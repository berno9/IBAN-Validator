import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow library is required. Install it with: pip install Pillow")
    sys.exit(1)


ICON_SIZES = [16, 32, 48, 128]


def create_icon_set(input_path: str, output_dir: str = None) -> None:
    output_dir = Path(output_dir) if output_dir else Path(input_path).parent
    output_dir.mkdir(exist_ok=True)
    base_name = Path(input_path).stem

    with Image.open(input_path) as img:
        # Ensure square by center-cropping if needed
        w, h = img.size
        if w != h:
            min_dim = min(w, h)
            img = img.crop((
                (w - min_dim) // 2,
                (h - min_dim) // 2,
                (w + min_dim) // 2,
                (h + min_dim) // 2,
            ))

        # Ensure RGBA for transparency support
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        for size in ICON_SIZES:
            out_path = output_dir / f"{base_name}_{size}x{size}.png"
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            resized.save(out_path, "PNG", optimize=True)
            print(f"Saved {out_path} ({os.path.getsize(out_path):,} bytes)")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python resize_icons.py <input.png> [output_dir]")
        sys.exit(1)

    input_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.exists(input_path):
        print(f"Error: '{input_path}' not found.")
        sys.exit(1)

    create_icon_set(input_path, output_dir)
