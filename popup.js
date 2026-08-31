document.getElementById("validateBtn").addEventListener("click", () => {
  const lines = document.getElementById("ibanInput").value
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const resultDiv = document.getElementById("result");

  if (!lines.length) {
    resultDiv.textContent = "Please enter at least one IBAN";
    resultDiv.className = "warning";
    return;
  }

  const rows = renderValidationResults(lines);
  renderValidationTable(rows);
});

function renderValidationTable(rows) {
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

document.getElementById("scanBtn").addEventListener("click", async () => {
    const scanStatus = document.getElementById("scanStatus");
    scanStatus.style.display = "none";

    let tab, results;

    try {
        [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const text = document.body.innerText;
                const ibanRegex = /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}\b/g;
                return text.match(ibanRegex) || [];
            }
        });
    } catch {
        scanStatus.textContent = "This page doesn't allow scanning.";
        scanStatus.style.display = "block";
        return;
    }

    const ibans = results[0].result;

    if (!ibans.length) {
        scanStatus.textContent = "No IBANs found on this page.";
        scanStatus.style.display = "block";
        return;
    }

    // scanning the page adds no duplicates
    const textarea = document.getElementById("ibanInput");
    const existing = textarea.value.split("\n").map(l => l.trim()).filter(Boolean);
    const formatted = ibans.map(iban => iban.replace(/\s/g, "").match(/.{1,4}/g)?.join(" ") || iban);
    const merged = [...new Set([...existing, ...formatted])];
    textarea.value = merged.join("\n");

});

// ---------- Generation ----------

document.getElementById("generateBtn").addEventListener("click", () => {
  const countryCode = document.getElementById("countrySelect").value;
  const count = parseInt(document.getElementById("generateCount").value, 10);

  if (!countryCode) {
    alert("Please select a country first");
    return;
  }

  const ibans = Array.from({ length: count }, () => generateSampleIban(countryCode));
  renderGenerationTable(ibans);
});

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

  document.querySelector(".copy-hint").style.display = "block";

  showCsvButton("generateCsvBtn", () => exportCsv(
    ["#", "IBAN"],
    ibans.map((iban, i) => [i + 1, iban])
  ));
}

// ---------- Shared utils ----------

function showCsvButton(id, handler) {
  let btn = document.getElementById(id);
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "csv-btn";
    btn.id = id;
    btn.textContent = "Download CSV";
    btn.addEventListener("click", handler);
    document.getElementById(
      id === "validateCsvBtn" ? "result" : "generatedIbans"
    ).after(btn);
  }
  btn.style.display = "block";
}

function exportCsv(headers, rows) {
  const lines = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([lines], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ibans.csv";
  a.click();
}

// ---------- Input formatting ----------

document.getElementById("ibanInput").addEventListener("input", (e) => {
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;

  const lines = e.target.value.split("\n");
  const formatted = lines.map(line => {
    const value = line.replace(/\s/g, "").toUpperCase();
    return value.match(/.{1,4}/g)?.join(" ") || value;
  });
  const result = formatted.join("\n");

  if (result !== e.target.value) {
    e.target.value = result;
    e.target.setSelectionRange(start, end);
  }
});

// ---------- Misc ----------

document.getElementById("ibanInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    document.getElementById("validateBtn").click();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  populateCountryDropdown();
    const options = document.querySelectorAll("#countrySelect option[value]");
    const random = options[Math.floor(Math.random() * options.length)];
    random.selected = true;
});
