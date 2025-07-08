(function() {
  let gsheetMarkers = [];
  let lastIndiv = null;

  // 監聽 indivChange 事件
  document.addEventListener('indivChange', e => {
    const indiv = e.detail;
    if (!indiv) return;
    lastIndiv = indiv;
    // 清除標記
    gsheetMarkers.forEach(m => map.removeLayer(m));
    gsheetMarkers = [];

    // 這裡假設 indiv 有不同分頁的 gid，你可根據 indiv.sheet_tabs 設定 url
    const mainSheetUrl = indiv.sheet_url_csv || indiv.sheet_url; // 你可以在 indiv JSON 預先存好 CSV 連結
    if (!mainSheetUrl) return;

    Papa.parse(mainSheetUrl, {
      download: true,
      header: true,
      complete: function(results) {
        const data = results.data;
        data.forEach(row => {
          const lat = parseFloat(row.lat || row.Lat || row.緯度);
          const lng = parseFloat(row.lng || row.Lng || row.Longitude || row.經度);
          if (!lat || !lng) return;
          const marker = L.circleMarker([lat, lng], {
            radius: 7,
            color: '#007AFB',
            fillColor: '#80c9fe',
            fillOpacity: 0.85
          }).addTo(map);
          marker.bindPopup(`<b>個體：</b>${indiv.name}<br><b>經度：</b>${lng}<br><b>緯度：</b>${lat}`);
          gsheetMarkers.push(marker);
        });
        if (gsheetMarkers.length) {
          const group = L.featureGroup(gsheetMarkers);
          map.fitBounds(group.getBounds().pad(0.3));
        }
      }
    });
  });
})();
