
import cairosvg
import os

svg_path = "public/clean_shield.svg"
sizes = {
    "public/favicon-16x16.png": 16,
    "public/favicon-32x32.png": 32,
    "public/apple-touch-icon.png": 180,
    "public/android-chrome-192x192.png": 192,
    "public/android-chrome-512x512.png": 512,
    "public/favicon.png": 64  # Standard fallback
}

for output_path, size in sizes.items():
    print(f"Converting {svg_path} to {output_path} ({size}x{size})...")
    cairosvg.svg2png(url=svg_path, write_to=output_path, output_width=size, output_height=size)

print("Conversion complete.")
