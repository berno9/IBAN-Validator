# Extension Build Script
# Creates a clean package for web store upload

import os
import shutil
from pathlib import Path

def create_extension_package():
    """Create a clean extension package without development files."""
    
    # Source and destination directories
    source_dir = Path(".")
    package_dir = Path("iban_validator_package")
    
    # Files to include in the extension package
    include_files = [
        "manifest.json",
        "popup.html", 
        "popup.js",
        "icon_16x16.png",
        "icon_32x32.png",
        "icon_48x48.png",
        "icon_128x128.png"
    ]
    
    # Create package directory
    if package_dir.exists():
        shutil.rmtree(package_dir)
    package_dir.mkdir()
    
    # Copy only the necessary files
    for file_name in include_files:
        source_file = source_dir / file_name
        if source_file.exists():
            shutil.copy2(source_file, package_dir / file_name)
            print(f"Copied: {file_name}")
        else:
            print(f"Warning: {file_name} not found!")
    
    print(f"\nExtension package created in: {package_dir}")
    print("This folder is ready for web store upload!")

if __name__ == "__main__":
    create_extension_package()