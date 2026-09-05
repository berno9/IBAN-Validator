function showCsvButton(id, handler) {
  let btn = document.getElementById(id);
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "csv-btn";
    btn.id = id;
    btn.textContent = "Download CSV";
    document.getElementById(
      id === "validateCsvBtn" ? "validationHeader" : "copyHint"
    ).before(btn);
  } else {
    btn.replaceWith(btn.cloneNode(true)); 
    btn = document.getElementById(id);
  }
  btn.addEventListener("click", handler);
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
