# Creates a clean package for web store upload

import shutil
import zipfile
from pathlib import Path

def create_extension_package():
    
    # Source directory and output paths
    source_dir = Path(".")
    package_dir = Path("iban_validator_package")
    zip_file_path = Path("iban_validator_package.zip")
    
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
    
    # Remove existing outputs if they exist
    if zip_file_path.exists():
        zip_file_path.unlink()
        print(f"Removed existing: {zip_file_path}")
    
    if package_dir.exists():
        shutil.rmtree(package_dir)
        print(f"Removed existing: {package_dir}")
    
    # Create package directory
    package_dir.mkdir()
    
    # Copy files to directory and add to zip
    missing_files = []
    with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for file_name in include_files:
            source_file = source_dir / file_name
            if source_file.exists():
                # Copy to folder
                shutil.copy2(source_file, package_dir / file_name)
                # Add to zip at root level
                zip_file.write(source_file, file_name)
                print(f"Processed: {file_name}")
            else:
                missing_files.append(file_name)
                print(f"Warning: {file_name} not found!")
    
    # Summary
    print(f"\nExtension package created:")
    print(f"  📁 Folder: {package_dir}")
    print(f"  📦 Zip file: {zip_file_path}")
    print("\nBoth are ready for web store upload!")
    
    if missing_files:
        print(f"\n⚠️  Missing files: {', '.join(missing_files)}")

if __name__ == "__main__":
    create_extension_package()