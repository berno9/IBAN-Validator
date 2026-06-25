# IBAN Validator Browser Extension

A fast, private, and accurate browser extension for validating and generating IBANs — one at a time or in bulk.

Install via [Chrome Web Store](https://chromewebstore.google.com/detail/iban-validator/ejddhihhcckmpkidmnlhjjfgbmjgdcgh).

## Features

### Validation
- Paste one or more IBANs (one per line) and validate all at once
- Results displayed in a table showing status, country, bank code, branch code, and account number
- Invalid IBANs show the exact reason they failed
- Export results as CSV

### Generation
- Select a country and how many IBANs to generate
- Results displayed in a table — click any row to copy that IBAN
- Export results as CSV

### General
- Full mod-97 checksum validation per ISO 13616
- Country-specific length checks for 79+ countries
- Auto-formats IBANs with spaces as you type
- All processing happens locally — no internet required, no data sent anywhere

### Supported Countries
All EU countries plus: UAE, Bahrain, Jordan, Kuwait, Lebanon, Qatar, Saudi Arabia, Switzerland, Norway, Iceland, UK, Brazil, Pakistan, and more.

## Installation

### Chrome Web Store (recommended)
[Install from Chrome Web Store](https://chromewebstore.google.com/detail/iban-validator/ejddhihhcckmpkidmnlhjjfgbmjgdcgh)

### Manual
1. Clone the repository:
```bash
   git clone https://github.com/berno9/IBAN-Validator.git
```
2. Go to `chrome://extensions/` in your browser
3. Enable Developer mode
4. Click "Load unpacked" and select the extension folder

## Usage

### Validation
1. Click the extension icon in your toolbar
2. Paste one or more IBANs into the text area, one per line
3. Click "Validate" or press Enter
4. Review results in the table — green rows are valid, red rows are invalid
5. Download as CSV if needed

### Generation
1. Select a country from the dropdown
2. Enter how many IBANs to generate
3. Click "Generate"
4. Click any row to copy that IBAN, or download all as CSV

### Example IBANs for Testing
- **Germany**: `DE89 3704 0044 0532 0130 00`
- **France**: `FR14 2004 1010 0505 0001 3M02 606`
- **UK**: `GB29 NWBK 6016 1331 9268 19`

## Technical Details

- **Version**: 1.3
- **Manifest Version**: 3
- **Permissions**: None required
- **Dependencies**: Vanilla JavaScript
- **Validation Standard**: ISO 13616
- **Browser Support**: Chrome, Edge, and other Chromium-based browsers

### Validation Process
1. Format check — ensures IBAN starts with 2 letters + 2 digits
2. Country validation — verifies country code is supported
3. Length validation — checks country-specific IBAN length
4. Character validation — ensures only alphanumeric characters
5. Checksum validation — performs mod-97 calculation per ISO 13616

## File Structure

```
iban_validator/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js            # Event listeners and UI rendering
├── iban-data.js        # Shared country data and IBAN structures
├── iban-validate.js    # Validation and parsing logic
├── iban-generate.js    # Generation logic
├── icon_128x128.png    # Extension icon
├── README.md           # This file
└── PRIVACY.md          # Privacy policy
```

## Planned Features

- Multi-language support
- Validation history
- Dark mode
- Firefox Mobile support
- Bank information lookup

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Privacy

This extension operates entirely offline and does not collect, store, or transmit any data. See [PRIVACY.md](PRIVACY.md) for full details.

## Support

- **Repository**: [github.com/berno9/IBAN-Validator](https://github.com/berno9/IBAN-Validator)
- **Issues**: Report bugs or request features via GitHub Issues
