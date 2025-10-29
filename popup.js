document.getElementById("validateBtn").addEventListener("click", () => {
  const iban = document.getElementById("ibanInput").value.trim();
  const result = document.getElementById("result");
  const ibanDetails = document.getElementById("ibanDetails");
  
  // Clear previous styling and details
  result.className = "";
  ibanDetails.style.display = "none";
  
  if (!iban) {
    result.textContent = "Please enter an IBAN";
    result.className = "warning";
    return;
  }
  
  const validation = validateIBANDetailed(iban);
  result.textContent = validation.message;
  result.className = validation.isValid ? "valid" : "invalid";
  
  // If valid, display detailed information
  if (validation.isValid) {
    displayIbanDetails(iban);
  }
});

// IBAN Generator functionality
document.getElementById("generateBtn").addEventListener("click", () => {
  const countryCode = document.getElementById("countrySelect").value;
  const generatedIbanDiv = document.getElementById("generatedIban");
  const copyHint = document.querySelector(".copy-hint");
  
  if (!countryCode) {
    alert("Please select a country first");
    return;
  }
  
  const sampleIban = generateSampleIban(countryCode);
  generatedIbanDiv.textContent = sampleIban;
  generatedIbanDiv.style.display = "block";
  copyHint.style.display = "block";
});

// Copy generated IBAN to clipboard when clicked
document.getElementById("generatedIban").addEventListener("click", () => {
  const ibanText = document.getElementById("generatedIban").textContent;
  navigator.clipboard.writeText(ibanText).then(() => {
    const originalText = document.querySelector(".copy-hint").textContent;
    document.querySelector(".copy-hint").textContent = "Copied!";
    setTimeout(() => {
      document.querySelector(".copy-hint").textContent = originalText;
    }, 1000);
  });
});

// Allow validation on Enter key press
document.getElementById("ibanInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("validateBtn").click();
  }
});

// Auto-format IBAN input (add spaces every 4 characters)
document.getElementById("ibanInput").addEventListener("input", (e) => {
  let value = e.target.value.replace(/\s/g, "").toUpperCase();
  let formatted = value.match(/.{1,4}/g)?.join(" ") || value;
  if (formatted !== e.target.value) {
    e.target.value = formatted;
  }
});

// Populate country dropdown on page load
document.addEventListener("DOMContentLoaded", () => {
  populateCountryDropdown();
});

// Detailed IBAN validation with specific error messages
function validateIBANDetailed(iban) {
  const originalIban = iban;
  iban = iban.replace(/\s+/g, "").toUpperCase();
  
  // Check if empty
  if (!iban) {
    return { isValid: false, message: "Please enter an IBAN" };
  }
  
  // Check basic format
  if (!/^[A-Z]{2}[0-9]{2}/.test(iban)) {
    return { isValid: false, message: "IBAN must start with 2 letters and 2 digits" };
  }
  
  const countryLengths = {
    AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22,
    BH: 22, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22,
    DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27,
    GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28,
    IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
    LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22,
    MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28,
    PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24, SE: 24, SI: 19,
    SK: 24, SM: 27, TN: 24, TR: 26, UA: 29, VG: 24, XK: 20
  };
  
  const countryCode = iban.slice(0, 2);
  const expectedLength = countryLengths[countryCode];
  
  if (!expectedLength) {
    return { isValid: false, message: `Unsupported country code: ${countryCode}` };
  }
  
  if (iban.length !== expectedLength) {
    return { isValid: false, message: `Invalid length for ${countryCode}: expected ${expectedLength}, got ${iban.length}` };
  }
  
  // Check if contains only valid characters
  if (!/^[A-Z0-9]+$/.test(iban)) {
    return { isValid: false, message: "IBAN contains invalid characters" };
  }
  
  // Perform mod-97 check
  if (!performMod97Check(iban)) {
    return { isValid: false, message: "Invalid IBAN checksum" };
  }
  
  return { isValid: true, message: `Valid ${countryCode} IBAN` };
}

function performMod97Check(iban) {
  // Rearrange: move first 4 characters to the end
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  
  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  const numeric = rearranged.replace(/[A-Z]/g, (char) => char.charCodeAt(0) - 55);
  
  // Perform mod-97 check using the algorithm for large numbers
  let remainder = numeric;
  while (remainder.length > 9) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(9);
  }
  
  return parseInt(remainder, 10) % 97 === 1;
}

const countryData = {
  AD: { name: "Andorra", length: 24 },
  AE: { name: "United Arab Emirates", length: 23 },
  AL: { name: "Albania", length: 28 },
  AT: { name: "Austria", length: 20 },
  AZ: { name: "Azerbaijan", length: 28 },
  BA: { name: "Bosnia and Herzegovina", length: 20 },
  BE: { name: "Belgium", length: 16 },
  BG: { name: "Bulgaria", length: 22 },
  BH: { name: "Bahrain", length: 22 },
  BR: { name: "Brazil", length: 29 },
  BY: { name: "Belarus", length: 28 },
  CH: { name: "Switzerland", length: 21 },
  CR: { name: "Costa Rica", length: 22 },
  CY: { name: "Cyprus", length: 28 },
  CZ: { name: "Czech Republic", length: 24 },
  DE: { name: "Germany", length: 22 },
  DK: { name: "Denmark", length: 18 },
  DO: { name: "Dominican Republic", length: 28 },
  EE: { name: "Estonia", length: 20 },
  EG: { name: "Egypt", length: 29 },
  ES: { name: "Spain", length: 24 },
  FI: { name: "Finland", length: 18 },
  FO: { name: "Faroe Islands", length: 18 },
  FR: { name: "France", length: 27 },
  GB: { name: "United Kingdom", length: 22 },
  GE: { name: "Georgia", length: 22 },
  GI: { name: "Gibraltar", length: 23 },
  GL: { name: "Greenland", length: 18 },
  GR: { name: "Greece", length: 27 },
  GT: { name: "Guatemala", length: 28 },
  HR: { name: "Croatia", length: 21 },
  HU: { name: "Hungary", length: 28 },
  IE: { name: "Ireland", length: 22 },
  IL: { name: "Israel", length: 23 },
  IS: { name: "Iceland", length: 26 },
  IT: { name: "Italy", length: 27 },
  JO: { name: "Jordan", length: 30 },
  KW: { name: "Kuwait", length: 30 },
  KZ: { name: "Kazakhstan", length: 20 },
  LB: { name: "Lebanon", length: 28 },
  LC: { name: "Saint Lucia", length: 32 },
  LI: { name: "Liechtenstein", length: 21 },
  LT: { name: "Lithuania", length: 20 },
  LU: { name: "Luxembourg", length: 20 },
  LV: { name: "Latvia", length: 21 },
  MC: { name: "Monaco", length: 27 },
  MD: { name: "Moldova", length: 24 },
  ME: { name: "Montenegro", length: 22 },
  MK: { name: "North Macedonia", length: 19 },
  MR: { name: "Mauritania", length: 27 },
  MT: { name: "Malta", length: 31 },
  MU: { name: "Mauritius", length: 30 },
  NL: { name: "Netherlands", length: 18 },
  NO: { name: "Norway", length: 15 },
  PK: { name: "Pakistan", length: 24 },
  PL: { name: "Poland", length: 28 },
  PS: { name: "Palestine", length: 29 },
  PT: { name: "Portugal", length: 25 },
  QA: { name: "Qatar", length: 29 },
  RO: { name: "Romania", length: 24 },
  RS: { name: "Serbia", length: 22 },
  SA: { name: "Saudi Arabia", length: 24 },
  SE: { name: "Sweden", length: 24 },
  SI: { name: "Slovenia", length: 19 },
  SK: { name: "Slovakia", length: 24 },
  SM: { name: "San Marino", length: 27 },
  TN: { name: "Tunisia", length: 24 },
  TR: { name: "Turkey", length: 26 },
  UA: { name: "Ukraine", length: 29 },
  VG: { name: "British Virgin Islands", length: 24 },
  XK: { name: "Kosovo", length: 20 }
};

function populateCountryDropdown() {
  const select = document.getElementById("countrySelect");
  
  const sortedCountries = Object.entries(countryData)
    .sort((a, b) => a[1].name.localeCompare(b[1].name));
  
  sortedCountries.forEach(([code, data]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${data.name} (${code})`;
    select.appendChild(option);
  });
}

function generateSampleIban(countryCode) {
  const country = countryData[countryCode];
  if (!country) {
    throw new Error(`Unsupported country: ${countryCode}`);
  }
  
  let iban = countryCode + "00";
  
  // Generate random digits for the rest of the IBAN
  const remainingLength = country.length - 4;
  for (let i = 0; i < remainingLength; i++) {
    iban += Math.floor(Math.random() * 10);
  }
  
  const checkDigits = calculateCheckDigits(iban);
  iban = countryCode + checkDigits + iban.slice(4);
  
  return iban.match(/.{1,4}/g).join(" ");
}

function calculateCheckDigits(iban) {
  // Replace the check digits with 00 for calculation
  const ibanForCalc = iban.slice(0, 2) + "00" + iban.slice(4);
  
  // Rearrange: move first 4 characters to the end
  const rearranged = ibanForCalc.slice(4) + ibanForCalc.slice(0, 4);
  
  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  const numeric = rearranged.replace(/[A-Z]/g, (char) => char.charCodeAt(0) - 55);
  
  let remainder = numeric;
  while (remainder.length > 9) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(9);
  }
  
  const finalRemainder = parseInt(remainder, 10) % 97;
  const checkDigits = 98 - finalRemainder;
  
  // Ensure check digits are always 2 digits (pad with leading zero if needed)
  return checkDigits.toString().padStart(2, "0");
}

const ibanStructures = {
  AD: { bankCode: [4, 8], branchCode: [8, 12], account: [12, 24] },
  AE: { bankCode: [4, 7], account: [7, 23] },
  AL: { bankCode: [4, 11], branchCode: [11, 15], account: [15, 28] },
  AT: { bankCode: [4, 9], account: [9, 20] },
  AZ: { bankCode: [4, 8], account: [8, 28] },
  BA: { bankCode: [4, 7], branchCode: [7, 13], account: [13, 20] },
  BE: { bankCode: [4, 7], account: [7, 16] },
  BG: { bankCode: [4, 8], branchCode: [8, 12], account: [12, 22] },
  BH: { bankCode: [4, 8], account: [8, 22] },
  BR: { bankCode: [4, 12], branchCode: [12, 17], account: [17, 27] },
  BY: { bankCode: [4, 8], branchCode: [8, 12], account: [12, 28] },
  CH: { bankCode: [4, 9], account: [9, 21] },
  CR: { bankCode: [4, 8], account: [8, 22] },
  CY: { bankCode: [4, 7], branchCode: [7, 12], account: [12, 28] },
  CZ: { bankCode: [4, 8], account: [8, 24] },
  DE: { bankCode: [4, 12], account: [12, 22] },
  DK: { bankCode: [4, 8], account: [8, 18] },
  DO: { bankCode: [4, 8], account: [8, 28] },
  EE: { bankCode: [4, 6], branchCode: [6, 8], account: [8, 20] },
  EG: { bankCode: [4, 8], branchCode: [8, 12], account: [12, 29] },
  ES: { bankCode: [4, 8], branchCode: [8, 12], account: [14, 24] },
  FI: { bankCode: [4, 10], account: [10, 18] },
  FO: { bankCode: [4, 8], account: [8, 18] },
  FR: { bankCode: [4, 9], branchCode: [9, 14], account: [14, 25] },
  GB: { bankCode: [4, 8], branchCode: [8, 14], account: [14, 22] },
  GE: { bankCode: [4, 6], account: [6, 22] },
  GI: { bankCode: [4, 8], account: [8, 23] },
  GL: { bankCode: [4, 8], account: [8, 18] },
  GR: { bankCode: [4, 7], branchCode: [7, 11], account: [11, 27] },
  GT: { bankCode: [4, 8], account: [8, 28] },
  HR: { bankCode: [4, 11], account: [11, 21] },
  HU: { bankCode: [4, 7], branchCode: [7, 11], account: [12, 28] },
  IE: { bankCode: [4, 8], branchCode: [8, 14], account: [14, 22] },
  IL: { bankCode: [4, 7], branchCode: [7, 10], account: [10, 23] },
  IS: { bankCode: [4, 8], branchCode: [8, 10], account: [10, 26] },
  IT: { bankCode: [5, 10], branchCode: [10, 15], account: [15, 27] },
  JO: { bankCode: [4, 8], branchCode: [8, 12], account: [12, 30] },
  KW: { bankCode: [4, 8], account: [8, 30] },
  KZ: { bankCode: [4, 7], account: [7, 20] },
  LB: { bankCode: [4, 8], account: [8, 28] },
  LC: { bankCode: [4, 8], account: [8, 32] },
  LI: { bankCode: [4, 9], account: [9, 21] },
  LT: { bankCode: [4, 9], account: [9, 20] },
  LU: { bankCode: [4, 7], account: [7, 20] },
  LV: { bankCode: [4, 8], account: [8, 21] },
  MC: { bankCode: [4, 9], branchCode: [9, 14], account: [14, 25] },
  MD: { bankCode: [4, 6], account: [6, 24] },
  ME: { bankCode: [4, 7], account: [7, 20] },
  MK: { bankCode: [4, 7], account: [7, 17] },
  MR: { bankCode: [4, 9], branchCode: [9, 14], account: [14, 27] },
  MT: { bankCode: [4, 8], branchCode: [8, 13], account: [13, 31] },
  MU: { bankCode: [4, 8], branchCode: [8, 14], account: [14, 28] },
  NL: { bankCode: [4, 8], account: [8, 18] },
  NO: { bankCode: [4, 8], account: [8, 15] },
  PK: { bankCode: [4, 8], account: [8, 24] },
  PL: { bankCode: [4, 12], account: [12, 28] },
  PS: { bankCode: [4, 8], account: [8, 29] },
  PT: { bankCode: [4, 8], branchCode: [8, 12], account: [12, 25] },
  QA: { bankCode: [4, 8], account: [8, 29] },
  RO: { bankCode: [4, 8], account: [8, 24] },
  RS: { bankCode: [4, 7], account: [7, 20] },
  SA: { bankCode: [4, 6], account: [6, 24] },
  SE: { bankCode: [4, 7], account: [7, 24] },
  SI: { bankCode: [4, 9], account: [9, 17] },
  SK: { bankCode: [4, 8], account: [8, 24] },
  SM: { bankCode: [5, 10], branchCode: [10, 15], account: [15, 27] },
  TN: { bankCode: [4, 6], branchCode: [6, 9], account: [9, 24] },
  TR: { bankCode: [4, 9], account: [9, 26] },
  UA: { bankCode: [4, 10], account: [10, 29] },
  VG: { bankCode: [4, 8], account: [8, 24] },
  XK: { bankCode: [4, 6], branchCode: [6, 8], account: [8, 20] }
};

function parseIban(iban) {
  iban = iban.replace(/\s+/g, "").toUpperCase();
  
  const countryCode = iban.slice(0, 2);
  const checkDigits = iban.slice(2, 4);
  const structure = ibanStructures[countryCode];
  
  const parsed = {
    countryCode: countryCode,
    countryName: countryData[countryCode]?.name || "Unknown",
    checkDigits: checkDigits,
    bankCode: null,
    branchCode: null,
    accountNumber: null,
    bban: iban.slice(4) // Basic Bank Account Number (everything after country code and check digits)
  };
  
  if (structure) {
    if (structure.bankCode) {
      parsed.bankCode = iban.slice(structure.bankCode[0], structure.bankCode[1]);
    }
    if (structure.branchCode) {
      parsed.branchCode = iban.slice(structure.branchCode[0], structure.branchCode[1]);
    }
    if (structure.account) {
      parsed.accountNumber = iban.slice(structure.account[0], structure.account[1]);
    }
  }
  
  return parsed;
}

function displayIbanDetails(iban) {
  const parsed = parseIban(iban);
  const detailsDiv = document.getElementById("ibanDetails");
  const structureDiv = document.getElementById("ibanStructure");
  const infoDiv = document.getElementById("ibanInfo");
  
  // Create visual structure breakdown
  const cleanIban = iban.replace(/\s+/g, "").toUpperCase();
  let structureHTML = '<div class="structure-parts">';
  
  // Country Code
  structureHTML += `<span class="part-country" title="Country Code">${cleanIban.slice(0, 2)}</span>`;
  
  // Check Digits
  structureHTML += `<span class="part-check" title="Check Digits">${cleanIban.slice(2, 4)}</span>`;
  
  // Bank Code
  const structure = ibanStructures[parsed.countryCode];
  if (structure && structure.bankCode) {
    structureHTML += `<span class="part-bank" title="Bank Code">${cleanIban.slice(structure.bankCode[0], structure.bankCode[1])}</span>`;
  }
  
  // Branch Code
  if (structure && structure.branchCode) {
    structureHTML += `<span class="part-branch" title="Branch Code">${cleanIban.slice(structure.branchCode[0], structure.branchCode[1])}</span>`;
  }
  
  // Account Number
  if (structure && structure.account) {
    structureHTML += `<span class="part-account" title="Account Number">${cleanIban.slice(structure.account[0], structure.account[1])}</span>`;
  } else {
    // If no specific structure, show remaining as BBAN
    structureHTML += `<span class="part-bban" title="Basic Bank Account Number">${cleanIban.slice(4)}</span>`;
  }
  
  structureHTML += '</div>';
  structureDiv.innerHTML = structureHTML;
  
  // Create information list
  let infoHTML = '<div class="info-grid">';
  infoHTML += `<div class="info-row"><span class="info-label">Country:</span><span class="info-value">${parsed.countryName} (${parsed.countryCode})</span></div>`;
  infoHTML += `<div class="info-row"><span class="info-label">Check Digits:</span><span class="info-value">${parsed.checkDigits}</span></div>`;
  
  if (parsed.bankCode) {
    infoHTML += `<div class="info-row"><span class="info-label">Bank Code:</span><span class="info-value">${parsed.bankCode}</span></div>`;
  }
  
  if (parsed.branchCode) {
    infoHTML += `<div class="info-row"><span class="info-label">Branch Code:</span><span class="info-value">${parsed.branchCode}</span></div>`;
  }
  
  if (parsed.accountNumber) {
    infoHTML += `<div class="info-row"><span class="info-label">Account Number:</span><span class="info-value">${parsed.accountNumber}</span></div>`;
  }
  
  infoHTML += `<div class="info-row"><span class="info-label">BBAN:</span><span class="info-value">${parsed.bban}</span></div>`;
  infoHTML += `<div class="info-row"><span class="info-label">Length:</span><span class="info-value">${cleanIban.length} characters</span></div>`;
  infoHTML += '</div>';
  
  infoDiv.innerHTML = infoHTML;
  detailsDiv.style.display = "block";
}

