function validateIBANDetailed(iban) {
  iban = iban.replace(/\s+/g, "").toUpperCase();

  if (!iban) {
    return { isValid: false, message: "Please enter an IBAN" };
  }

  if (!/^[A-Z]{2}[0-9]{2}/.test(iban)) {
    return { isValid: false, message: "IBAN must start with 2 letters and 2 digits" };
  }

  const countryCode = iban.slice(0, 2);
  const country = countryData[countryCode];

  if (!country) {
    return { isValid: false, message: `Unsupported country code: ${countryCode}` };
  }

  if (iban.length !== country.length) {
    return { isValid: false, message: `Invalid length for ${countryCode}: expected ${country.length}, got ${iban.length}` };
  }

  if (!/^[A-Z0-9]+$/.test(iban)) {
    return { isValid: false, message: "IBAN contains invalid characters" };
  }

  if (!performMod97Check(iban)) {
    return { isValid: false, message: "Invalid IBAN checksum" };
  }

  return { isValid: true, message: `Valid ${countryCode} IBAN` };
}

function performMod97Check(iban) {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (char) => char.charCodeAt(0) - 55);

  let remainder = numeric;
  while (remainder.length > 9) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(9);
  }

  return parseInt(remainder, 10) % 97 === 1;
}

function parseIban(iban) {
  iban = iban.replace(/\s+/g, "").toUpperCase();

  const countryCode = iban.slice(0, 2);
  const structure = ibanStructures[countryCode];

  return {
    countryCode,
    countryName: countryData[countryCode]?.name || "Unknown",
    checkDigits: iban.slice(2, 4),
    bankCode:      structure?.bankCode   ? iban.slice(...structure.bankCode)   : null,
    branchCode:    structure?.branchCode ? iban.slice(...structure.branchCode) : null,
    accountNumber: structure?.account    ? iban.slice(...structure.account)    : null,
    bban: iban.slice(4)
  };
}

function renderValidationResults(ibans) {
  const rows = ibans.map(raw => {
    const iban = raw.trim();
    if (!iban) return null;
    const result = validateIBANDetailed(iban);
    return { iban, ...result };
  }).filter(Boolean);

  return rows;
}

// nice funcionality, maybe for later use
// function displayIbanDetails(iban) {
//   const parsed = parseIban(iban);
//   const detailsDiv = document.getElementById("ibanDetails");
//   const structureDiv = document.getElementById("ibanStructure");
//   const infoDiv = document.getElementById("ibanInfo");
//
//   const cleanIban = iban.replace(/\s+/g, "").toUpperCase();
//   const structure = ibanStructures[parsed.countryCode];
//
//   let structureHTML = '<div class="structure-parts">';
//   structureHTML += `<span class="part-country" title="Country Code">${cleanIban.slice(0, 2)}</span>`;
//   structureHTML += `<span class="part-check" title="Check Digits">${cleanIban.slice(2, 4)}</span>`;
//
//   if (structure?.bankCode) {
//     structureHTML += `<span class="part-bank" title="Bank Code">${cleanIban.slice(...structure.bankCode)}</span>`;
//   }
//   if (structure?.branchCode) {
//     structureHTML += `<span class="part-branch" title="Branch Code">${cleanIban.slice(...structure.branchCode)}</span>`;
//   }
//   if (structure?.account) {
//     structureHTML += `<span class="part-account" title="Account Number">${cleanIban.slice(...structure.account)}</span>`;
//   } else {
//     structureHTML += `<span class="part-bban" title="Basic Bank Account Number">${cleanIban.slice(4)}</span>`;
//   }
//
//   structureHTML += '</div>';
//   structureDiv.innerHTML = structureHTML;
//
//   let infoHTML = '<div class="info-grid">';
//   infoHTML += `<div class="info-row"><span class="info-label">Country:</span><span class="info-value">${parsed.countryName} (${parsed.countryCode})</span></div>`;
//   infoHTML += `<div class="info-row"><span class="info-label">Check Digits:</span><span class="info-value">${parsed.checkDigits}</span></div>`;
//
//   if (parsed.bankCode) {
//     infoHTML += `<div class="info-row"><span class="info-label">Bank Code:</span><span class="info-value">${parsed.bankCode}</span></div>`;
//   }
//   if (parsed.branchCode) {
//     infoHTML += `<div class="info-row"><span class="info-label">Branch Code:</span><span class="info-value">${parsed.branchCode}</span></div>`;
//   }
//   if (parsed.accountNumber) {
//     infoHTML += `<div class="info-row"><span class="info-label">Account Number:</span><span class="info-value">${parsed.accountNumber}</span></div>`;
//   }
//
//   infoHTML += `<div class="info-row"><span class="info-label">BBAN:</span><span class="info-value">${parsed.bban}</span></div>`;
//   infoHTML += `<div class="info-row"><span class="info-label">Length:</span><span class="info-value">${cleanIban.length} characters</span></div>`;
//   infoHTML += '</div>';
//
//   infoDiv.innerHTML = infoHTML;
//   detailsDiv.style.display = "block";
// }
