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
  
  // Country code to length mapping
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
