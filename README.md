# IBAN Validator Browser Extension

## Installation

Install this extension via [https://chromewebstore.google.com/detail/iban-validator/ejddhihhcckmpkidmnlhjjfgbmjgdcgh](https://chromewebstore.google.com/detail/iban-validator/ejddhihhcckmpkidmnlhjjfgbmjgdcgh).

## Introduction

A powerful and user-friendly browser extension for validating International Bank Account Numbers (IBANs) with detailed error messages and country-specific validation .

## 🚧 Work in Progress

This extension is actively being developed with new features planned for future releases.

## ✨ Features

### Current Features
- **Real-time IBAN Validation**: Instant validation with detailed error messages
- **IBAN Structure Parsing**: Color-coded breakdown showing country, check digits, bank code, branch code, and account number
- **Detailed Information Display**: Extracts and displays all IBAN components for valid IBANs
- **Sample IBAN Generator**: Generate valid IBANs for any of 79+ supported countries
- **One-Click Copy**: Click generated IBANs to instantly copy them to clipboard
- **Country-Specific Validation**: Supports 79+ countries with proper length checks
- **Auto-formatting**: Automatically adds spaces every 4 characters for readability
- **Mod-97 Checksum Verification**: Full mathematical validation according to ISO 13616
- **Detailed Error Messages**: Specific feedback for different validation failures
- **Clean Interface**: Modern, intuitive popup design
- **Keyboard Support**: Validate with Enter key
- **Offline Operation**: No internet connection required

### Supported Countries
The extension validates IBANs for all EU countries plus:
- Middle East: UAE, Bahrain, Jordan, Kuwait, Lebanon, Qatar, Saudi Arabia
- Europe: Switzerland, Norway, Iceland, UK, and more
- Other regions: Brazil, Pakistan, and many others

## 📦 Installation

### 🌟 Recommended: Chrome Web Store
The easiest and safest way to install IBAN Validator:  [https://chromewebstore.google.com/detail/iban-validator/ejddhihhcckmpkidmnlhjjfgbmjgdcgh](https://chromewebstore.google.com/detail/iban-validator/ejddhihhcckmpkidmnlhjjfgbmjgdcgh)

**📍 Extension will be available on:**
- **Chrome Web Store** - One-click installation for Chrome/Edge users
- **Microsoft Edge Add-ons** - Native installation for Edge users

**✅ Benefits of Web Store Installation:**
- Automatic updates when new features are released
- Verified security and safety
- Easy management through browser settings
- No technical setup required

### 🔧 Manual Installation

**For Users (Preview Access):**
1. Download the extension files from the repository
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked" and select the extension folder
5. The IBAN Validator icon will appear in your browser toolbar

**For Developers:**
```bash
git clone https://github.com/berno9/IBAN-Validator.git
cd IBAN-Validator
# Load the folder as an unpacked extension in your browser
```

> **💡 Note**: Manual installation is intended for testing and development. For the best user experience, we recommend using the official web store release.

## 🚀 Usage

### IBAN Validation
1. **Click the extension icon** in your browser toolbar
2. **Enter an IBAN** in the input field (e.g., `DE89370400440532013000`)
3. **Click "Validate IBAN"** or press Enter
4. **View the result** with detailed feedback:
   - ✅ **Green**: Valid IBAN
   - ❌ **Red**: Invalid IBAN with specific error message
   - ⚠️ **Yellow**: Warning (e.g., empty input)
5. **For valid IBANs**, see the detailed breakdown:
   - Color-coded structure visualization
   - Country information
   - Bank code, branch code (when applicable)
   - Account number
   - BBAN (Basic Bank Account Number)
   - IBAN length

### IBAN Generation
1. **Select a country** from the dropdown menu
2. **Click "Generate Sample IBAN"** to create a valid IBAN
3. **Click the generated IBAN** to copy it to your clipboard
4. **Test the generated IBAN** using the validation feature above

### Example IBANs for Testing
- **Valid German IBAN**: `DE89 3704 0044 0532 0130 00`
- **Valid French IBAN**: `FR14 2004 1010 0505 0001 3M02 606`
- **Valid UK IBAN**: `GB29 NWBK 6016 1331 9268 19`

## 🔧 Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: None required (fully client-side)
- **Dependencies**: Vanilla JavaScript (no external libraries)
- **Validation Standard**: ISO 13616 compliant
- **Browser Support**: Chrome, Edge, and other Chromium-based browsers

### Validation Process
1. **Format Check**: Ensures IBAN starts with 2 letters + 2 digits
2. **Country Validation**: Verifies country code is supported
3. **Length Validation**: Checks country-specific IBAN length
4. **Character Validation**: Ensures only alphanumeric characters
5. **Checksum Validation**: Performs mod-97 calculation per ISO 13616

## 🛠️ Development

### File Structure
```
iban_validator/
├── manifest.json      # Extension configuration
├── popup.html         # Extension popup interface
├── popup.js           # Main validation logic
├── icon_128x128.png           # Extension icon
├── README.md          # This file
└── PRIVACY.md         # Privacy policy
```

### Code Highlights
- **Comprehensive Country Support**: 79+ countries with accurate length validation
- **IBAN Generation**: Creates mathematically valid sample IBANs for testing
- **Robust Error Handling**: Specific error messages for different failure types
- **Modern JavaScript**: ES6+ features with clean, readable code
- **Performance Optimized**: Efficient mod-97 algorithm for large numbers

## 🔮 Planned Features

- 🌍 **Multi-language Support**: Interface in multiple languages
-  **Validation History**: Keep track of recently validated IBANs
- 🎨 **Theme Options**: Dark mode and custom themes
- 📱 **Mobile Support**: Firefox Mobile extension
- 🔍 **Bank Information**: Display bank details for valid IBANs
- ⚡ **Batch Validation**: Validate multiple IBANs at once
- 📈 **Statistics**: Usage analytics and validation stats

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source. See the repository for license details.

## 🔒 Privacy

This extension operates entirely offline and does not collect, store, or transmit any user data. See [PRIVACY.md](PRIVACY.md) for full details.

## 📞 Support
- **Repository**: [https://github.com/berno9/IBAN-Validator](https://github.com/berno9/IBAN-Validator)
- **Web Store**: Official releases coming soon to Chrome Web Store and Edge Add-ons
- **Issues**: Report bugs or request features via GitHub Issues
- **Updates**: Follow the repository for release announcements

---

**Note**: This extension is a work in progress. New features and improvements are continuously being added based on user feedback and requirements.