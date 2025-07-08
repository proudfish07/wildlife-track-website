// 這裡換成你自己的 Google Apps Script JSON API 網址
const indivListUrl = "https://script.google.com/macros/s/xxx-your-id-xxx/exec";

let indivData = [];
let currentIndiv = null;

// 抓取個體清單並產生選單
fetch(indivListUrl)
  .then(res => res.json())
  .then(data => {
    indivData = data;
    const select = document.getElementById('indiv-select');
    select.innerHTML = '';
    data.forEach((indiv, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = indiv.name + (indiv.id ? ` (${indiv.id})` : '');
      select.appendChild(opt);
    });
    // 預設選第一個
    select.selectedIndex = 0;
    currentIndiv = data[0];
    updateIndivInfo(data[0]);
    document.dispatchEvent(new CustomEvent('indivChange', { detail: data[0] }));
  });

document.getElementById('indiv-select').addEventListener('change', function() {
  const indiv = indivData[this.value];
  currentIndiv = indiv;
  updateIndivInfo(indiv);
  document.dispatchEvent(new CustomEvent('indivChange', { detail: indiv }));
});

function updateIndivInfo(indiv) {
  document.getElementById('indiv-info').innerHTML =
    indiv.sheet_url ? ` | <a href="${indiv.sheet_url}" target="_blank">資料表</a>` : '';
}
