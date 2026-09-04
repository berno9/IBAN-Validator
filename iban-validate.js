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

function renderValidationTable(rows) {

    document.getElementById("validationHeader").style.display = "flex";

  const resultDiv = document.getElementById("result");
  resultDiv.className = "";
  resultDiv.innerHTML = "";

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>IBAN</th>
        <th>Status</th>
        <th>Country</th>
        <th>Bank Code</th>
        <th>Branch Code</th>
        <th>Account Number</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");
  rows.forEach(({ iban, isValid, message }) => {
    const tr = document.createElement("tr");
    tr.className = isValid ? "valid" : "invalid";

    if (isValid) {
      const parsed = parseIban(iban);
      tr.innerHTML = `
          <td class="iban-cell" title="${iban}">${iban}</td>
          <td title="Valid">Valid</td>
          <td title="${parsed.countryName} (${parsed.countryCode})">${parsed.countryName} (${parsed.countryCode})</td>
          <td title="${parsed.bankCode || "—"}">${parsed.bankCode || "—"}</td>
          <td title="${parsed.branchCode || "—"}">${parsed.branchCode || "—"}</td>
          <td title="${parsed.accountNumber || "—"}">${parsed.accountNumber || "—"}</td>
    `;
    } else {
      tr.innerHTML = `
          <td class="iban-cell" title="${iban}">${iban}</td>
          <td title="Invalid">Invalid</td>
          <td colspan="4" title="${message}">${message}</td>
        `;
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  resultDiv.appendChild(table);

  showCsvButton("validateCsvBtn", () => exportCsv(
      ["#", "IBAN", "Status", "Country", "Bank Code", "Branch Code", "Account Number"],
      rows.map(({ iban, isValid, message }, i) => {
        if (isValid) {
          const parsed = parseIban(iban);
          return [i + 1, iban, "Valid", `${parsed.countryName} (${parsed.countryCode})`, parsed.bankCode || "", parsed.branchCode || "", parsed.accountNumber || ""];
        }
        return [i + 1, iban, "Invalid", message, "", "", ""];
      })
    ));
}
