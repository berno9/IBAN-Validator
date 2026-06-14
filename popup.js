document.getElementById("validateBtn").addEventListener("click", () => {
  const iban = document.getElementById("ibanInput").value.trim();
  const result = document.getElementById("result");
  const ibanDetails = document.getElementById("ibanDetails");

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

  if (validation.isValid) {
    displayIbanDetails(iban);
  }
});

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

document.getElementById("generatedIban").addEventListener("click", () => {
  const ibanText = document.getElementById("generatedIban").textContent;
  navigator.clipboard.writeText(ibanText).then(() => {
    const copyHint = document.querySelector(".copy-hint");
    const originalText = copyHint.textContent;
    copyHint.textContent = "Copied!";
    setTimeout(() => { copyHint.textContent = originalText; }, 1000);
  });
});

document.getElementById("ibanInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("validateBtn").click();
});

document.getElementById("ibanInput").addEventListener("input", (e) => {
  let value = e.target.value.replace(/\s/g, "").toUpperCase();
  let formatted = value.match(/.{1,4}/g)?.join(" ") || value;
  if (formatted !== e.target.value) e.target.value = formatted;
});

document.addEventListener("DOMContentLoaded", () => {
  populateCountryDropdown();
});
