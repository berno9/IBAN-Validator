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
