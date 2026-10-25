document.getElementById("pageTitle").textContent="Tree Map";
document.getElementById("content").innerHTML=`<div id="map" aria-label="Map of surveyed trees"></div><p class="muted">Marker colour shows condition: green healthy, light green good, yellow moderate, orange needs attention.</p>`;
const colors={Healthy:"#2f7d4f",Good:"#6ba43a",Moderate:"#d2a21f","Needs Attention":"#c4561c"};
const map=L.map("map").setView([19.447,73.3198],17);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap contributors"}).addTo(map);
api("/trees").then(trees=>{
  trees.forEach(t=>L.circleMarker([t.lat,t.lng],{radius:9,color:"#fff",weight:2,fillColor:colors[t.condition],fillOpacity:1}).addTo(map)
    .bindPopup(`<b>${escapeHtml(t.treeId)} · ${escapeHtml(t.name)}</b><br><i>${escapeHtml(t.scientificName)}</i><br>${escapeHtml(t.location)}<br>${escapeHtml(t.condition)}${t.height?" · "+escapeHtml(t.height):""}<br>${escapeHtml(t.remarks)}`));
  if(trees.length)map.fitBounds(L.latLngBounds(trees.map(t=>[t.lat,t.lng])).pad(0.4),{maxZoom:19});
  setTimeout(()=>map.invalidateSize(),200);
}).catch(e=>document.getElementById("content").insertAdjacentHTML("afterbegin",`<div class="msg">${escapeHtml(e.message)}</div>`));
