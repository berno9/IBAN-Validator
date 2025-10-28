document.getElementById("validateBtn").addEventListener("click", () => {
  const iban = document.getElementById("ibanInput").value.trim();
  const result = document.getElementById("result");
  
  // Clear previous styling
  result.className = "";
  
  if (!iban) {
    result.textContent = "Please enter an IBAN";
    result.className = "warning";
    return;
  }
  
  const validation = validateIBANDetailed(iban);
  result.textContent = validation.message;
  result.className = validation.isValid ? "valid" : "invalid";
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
