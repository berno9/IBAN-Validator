function populateCountryDropdown() {
  const select = document.getElementById("countrySelect");

  Object.entries(countryData)
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .forEach(([code, data]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${data.name} (${code})`;
      select.appendChild(option);
    });
}

function generateSampleIban(countryCode) {
  const country = countryData[countryCode];
  if (!country) throw new Error(`Unsupported country: ${countryCode}`);

  let iban = countryCode + "00";
  const remainingLength = country.length - 4;
  for (let i = 0; i < remainingLength; i++) {
    iban += Math.floor(Math.random() * 10);
  }

  const checkDigits = calculateCheckDigits(iban);
  iban = countryCode + checkDigits + iban.slice(4);

  return iban.match(/.{1,4}/g).join(" ");
}

function calculateCheckDigits(iban) {
  const ibanForCalc = iban.slice(0, 2) + "00" + iban.slice(4);
  const rearranged = ibanForCalc.slice(4) + ibanForCalc.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (char) => char.charCodeAt(0) - 55);

  let remainder = numeric;
  while (remainder.length > 9) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(9);
  }

  return (98 - (parseInt(remainder, 10) % 97)).toString().padStart(2, "0");
}

function renderGenerationTable(ibans) {
  const container = document.getElementById("generatedIbans");
  container.innerHTML = "";

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  ibans.forEach(iban => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${iban}</td>`;
    tr.addEventListener("click", () => {
      navigator.clipboard.writeText(iban).then(() => {
        tr.classList.add("copied");
        setTimeout(() => tr.classList.remove("copied"), 1000);
      });
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  document.querySelector(".copy-hint").style.display = "flex";

  showCsvButton("generateCsvBtn", () => exportCsv(
    ["#", "IBAN"],
    ibans.map((iban, i) => [i + 1, iban])
  ));
}
