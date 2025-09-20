#!/usr/bin/env python3
"""
Icon Resizer Script for Browser Extensions

This script resizes PNG square icons to reduce file size while maintaining quality.
Specifically designed for browser extension icons that need multiple sizes.

Usage:
    python resize_icons.py input_icon.png
    python resize_icons.py input_icon.png --sizes 16 32 48 128
    python resize_icons.py input_icon.png --output resized_icon.png --quality 85
"""

import argparse
import os
import sys
from pathlib import Path
from typing import List, Tuple

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Error: Pillow library is required.")
    print("Install it with: pip install Pillow")
    sys.exit(1)


def optimize_png(image: Image.Image, quality: int = 85) -> Image.Image:
    """
    Optimize PNG image for smaller file size while maintaining quality.
    
    Args:
        image: PIL Image object
        quality: Optimization level (0-100, higher = better quality)
    
    Returns:
        Optimized PIL Image object
    """
    # Convert to RGB if necessary (for better compression)
    if image.mode in ('RGBA', 'P'):
        # Create a white background for transparency
        background = Image.new('RGB', image.size, (255, 255, 255))
        if image.mode == 'P':
            image = image.convert('RGBA')
        background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
        image = background
    elif image.mode != 'RGB':
        image = image.convert('RGB')
    
    return image


def resize_icon(input_path: str, output_path: str = None, 
                target_size: int = None, quality: int = 85, 
                maintain_aspect: bool = True) -> bool:
    """
    Resize a square icon to reduce file size.
    
    Args:
        input_path: Path to input PNG file
        output_path: Path for output file (optional)
        target_size: Target width/height in pixels (optional)
        quality: Optimization quality (0-100)
        maintain_aspect: Whether to maintain aspect ratio
    
    Returns:
        True if successful, False otherwise
    """
    try:
        # Open and validate image
        with Image.open(input_path) as img:
            original_size = img.size
            print(f"Original size: {original_size[0]}x{original_size[1]} pixels")
            
            # Check if image is square
            if original_size[0] != original_size[1]:
                print("Warning: Image is not square. Making it square...")
                # Crop to square (center crop)
                min_dim = min(original_size)
                left = (original_size[0] - min_dim) // 2
                top = (original_size[1] - min_dim) // 2
                right = left + min_dim
                bottom = top + min_dim
                img = img.crop((left, top, right, bottom))
            
            # Determine target size
            if target_size is None:
                # If no target size specified, keep original dimensions but optimize
                target_size = img.size[0]
            
            # Resize if necessary
            if img.size[0] != target_size:
                if maintain_aspect:
                    img = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
                else:
                    img = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
                print(f"Resized to: {target_size}x{target_size} pixels")
            
            # Optimize the image
            img = optimize_png(img, quality)
            
            # Determine output path
            if output_path is None:
                input_path_obj = Path(input_path)
                output_path = input_path_obj.parent / f"{input_path_obj.stem}_resized{input_path_obj.suffix}"
            
            # Save optimized image
            img.save(output_path, 'PNG', optimize=True, quality=quality)
            
            # Get file size information
            original_size_bytes = os.path.getsize(input_path)
            new_size_bytes = os.path.getsize(output_path)
            size_reduction = ((original_size_bytes - new_size_bytes) / original_size_bytes) * 100
            
            print(f"Original file size: {original_size_bytes:,} bytes")
            print(f"New file size: {new_size_bytes:,} bytes")
            print(f"Size reduction: {size_reduction:.1f}%")
            print(f"Saved to: {output_path}")
            
            return True
            
    except Exception as e:
        print(f"Error processing {input_path}: {str(e)}")
        return False


def create_extension_icon_set(input_path: str, sizes: List[int] = None, 
                             output_dir: str = None, quality: int = 85) -> bool:
    """
    Create a complete set of extension icons in multiple sizes.
    
    Args:
        input_path: Path to input PNG file
        sizes: List of sizes to generate (default: [16, 32, 48, 128])
        output_dir: Output directory (default: same as input)
        quality: Optimization quality (0-100)
    
    Returns:
        True if all icons created successfully
    """
    if sizes is None:
        sizes = [16, 32, 48, 128]  # Standard extension icon sizes
    
    if output_dir is None:
        output_dir = Path(input_path).parent
    else:
        output_dir = Path(output_dir)
        output_dir.mkdir(exist_ok=True)
    
    input_path_obj = Path(input_path)
    base_name = input_path_obj.stem
    
    success_count = 0
    total_original_size = 0
    total_new_size = 0
    
    print(f"\nCreating extension icon set from: {input_path}")
    print(f"Target sizes: {sizes}")
    print("-" * 50)
    
    for size in sizes:
        output_path = output_dir / f"{base_name}_{size}x{size}.png"
        print(f"\nCreating {size}x{size} icon...")
        
        if resize_icon(input_path, str(output_path), size, quality):
            success_count += 1
            total_original_size += os.path.getsize(input_path)
            total_new_size += os.path.getsize(output_path)
    
    print("\n" + "=" * 50)
    print(f"Successfully created {success_count}/{len(sizes)} icons")
    
    if success_count > 0:
        total_reduction = ((total_original_size - total_new_size) / total_original_size) * 100
        print(f"Total original size: {total_original_size:,} bytes")
        print(f"Total new size: {total_new_size:,} bytes")
        print(f"Overall size reduction: {total_reduction:.1f}%")
    
    return success_count == len(sizes)


def main():
    """Main function to handle command line arguments and execute resizing."""
    parser = argparse.ArgumentParser(
        description="Resize and optimize PNG square icons for browser extensions",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Resize single icon (optimized version)
  python resize_icons.py icon.png
  
  # Create extension icon set (16, 32, 48, 128px)
  python resize_icons.py icon.png --icon-set
  
  # Custom sizes for icon set
  python resize_icons.py icon.png --icon-set --sizes 16 24 32 48 96 128
  
  # Resize to specific size with custom quality
  python resize_icons.py icon.png --size 64 --quality 90 --output small_icon.png
  
  # Create icon set in specific directory
  python resize_icons.py icon.png --icon-set --output-dir ./icons/
        """
    )
    
    parser.add_argument('input', help='Input PNG file path')
    parser.add_argument('--size', type=int, help='Target size (width/height in pixels)')
    parser.add_argument('--output', '-o', help='Output file path')
    parser.add_argument('--quality', '-q', type=int, default=85, 
                       help='Optimization quality (0-100, default: 85)')
    parser.add_argument('--icon-set', action='store_true', 
                       help='Create a complete extension icon set')
    parser.add_argument('--sizes', nargs='+', type=int, 
                       help='Custom sizes for icon set (e.g., --sizes 16 32 48 128)')
    parser.add_argument('--output-dir', help='Output directory for icon set')
    
    args = parser.parse_args()
    
    # Validate input file
    if not os.path.exists(args.input):
        print(f"Error: Input file '{args.input}' not found.")
        sys.exit(1)
    
    if not args.input.lower().endswith('.png'):
        print("Warning: Input file is not a PNG. Results may vary.")
    
    # Validate quality parameter
    if not 0 <= args.quality <= 100:
        print("Error: Quality must be between 0 and 100.")
        sys.exit(1)
    
    try:
        if args.icon_set:
            # Create extension icon set
            success = create_extension_icon_set(
                args.input, 
                args.sizes, 
                args.output_dir, 
                args.quality
            )
            if not success:
                sys.exit(1)
        else:
            # Single icon resize
            success = resize_icon(
                args.input, 
                args.output, 
                args.size, 
                args.quality
            )
            if not success:
                sys.exit(1)
                
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()