const ibanInput = document.getElementById("ibanInput");
const clearBtn = document.getElementById("clearBtn");
const validateBtn = document.getElementById("validateBtn");
const scanBtn = document.getElementById("scanBtn");
const generateBtn = document.getElementById("generateBtn");
const copyAllBtn = document.getElementById("copyAllBtn");
const toggleBtn = document.getElementById("toggleGenerated");


validateBtn.addEventListener("click", () => {
  const lines = document.getElementById("ibanInput").value
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const resultDiv = document.getElementById("result");

  if (!lines.length) {
    resultDiv.className = "warning";
    resultDiv.textContent = "Please enter at least one IBAN";
    return;
  }

  const rows = renderValidationResults(lines);
  renderValidationTable(rows);
});

scanBtn.addEventListener("click", async () => {
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
    textarea.value = merged.join("\n") + "\n";
    clearBtn.style.display = "block";
});

// ---------- Generation ----------

generateBtn.addEventListener("click", () => {
  const countryCode = document.getElementById("countrySelect").value;
  const count = parseInt(document.getElementById("generateCount").value, 10);

  if (!countryCode) {
    alert("Please select a country first");
    return;
  }

  const ibans = Array.from({ length: count }, () => generateSampleIban(countryCode));
  renderGenerationTable(ibans);
});

copyAllBtn.addEventListener("click", () => {
    const rows = document.querySelectorAll("#generatedIbans tbody tr");
    const text = Array.from(rows).map(tr => tr.querySelector("td").textContent).join("\n") + "\n";
    navigator.clipboard.writeText(text).then(() => {
        const original = copyAll.textContent;
        copyAll.textContent = "Copied!";
        setTimeout(() => copyAll.textContent = original, 1000);
    });
});

// ---------- Toggle table appearance ----------

function setupToggle(toggleId, targetId) {
    const toggle = document.getElementById(toggleId);
    toggle.addEventListener("click", () => {
        const table = document.querySelector(`#${targetId} table`);
        if (!table) return;
        const isVisible = table.style.display !== "none";
        table.style.display = isVisible ? "none" : "";
        toggle.textContent = isVisible ? "▸" : "▾";
    });
}

setupToggle("toggleGenerated", "generatedIbans");
setupToggle("toggleValidation", "result");

// ---------- Input formatting ----------

ibanInput.addEventListener("input", (e) => {

  clearBtn.style.display = e.target.value ? "block" : "none"; 

  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;

  const lines = e.target.value.split("\n");
  const formatted = lines.map(line => {
    // if (!line.trim()) return line;
    const value = line.replace(/\s/g, "").toUpperCase();
    return value.match(/.{1,4}/g)?.join(" ") || value;
  });
  const result = formatted.join("\n");

  if (result !== e.target.value) {
    e.target.value = result;
    e.target.setSelectionRange(start, end);
  }
});

clearBtn.addEventListener("click", () => {
    ibanInput.value = "";
    clearBtn.style.display = "none";
    ibanInput.focus();
});

// ---------- Misc ----------

document.getElementById("ibanInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    document.getElementById("validateBtn").click();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  populateCountryDropdown();
    const options = document.querySelectorAll("#countrySelect option[value]:not([value=''])");
    const random = options[Math.floor(Math.random() * options.length)];
    random.selected = true;
});
