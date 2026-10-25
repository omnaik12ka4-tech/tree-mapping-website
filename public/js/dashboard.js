document.getElementById("pageTitle").textContent="Dashboard";
(async()=>{
  const s=await api("/trees/stats");
  const healthy=(s.byCondition.Healthy||0)+(s.byCondition.Good||0);
  const pct=s.total?Math.round(healthy/s.total*100):0;
  document.getElementById("content").innerHTML=`
  <div class="cards">
    <div class="card"><div class="label">Trees mapped</div><div class="value balance">${s.total}</div></div>
    <div class="card"><div class="label">Kinds of tree</div><div class="value">${s.species}</div></div>
    <div class="card"><div class="label">Healthy or good</div><div class="value income">${pct}%</div></div>
    <div class="card"><div class="label">Need attention</div><div class="value expense">${s.byCondition["Needs Attention"]||0}</div></div>
  </div>
  <div class="grid2">
    <div class="section"><h2>Trees by category</h2><div class="chartbox"><canvas id="cat"></canvas></div></div>
    <div class="section"><h2>Tree condition</h2><div class="chartbox"><canvas id="cond"></canvas></div></div>
  </div>
  <div class="section" style="margin-top:20px"><h2>Recently added</h2><div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Tree</th><th>Location</th><th>Condition</th></tr></thead><tbody>
  ${s.recent.map(t=>`<tr><td>${escapeHtml(t.treeId)}</td><td>${escapeHtml(t.name)}</td><td>${escapeHtml(t.location)}</td><td>${pill(t.condition)}</td></tr>`).join("")||'<tr><td colspan="4" class="empty">No trees yet. Add one in Tree Inventory.</td></tr>'}
  </tbody></table></div></div>`;
  const colors=["#2f7d4f","#6ba43a","#d2a21f","#c4561c","#2b6f8f"];
  new Chart(document.getElementById("cat"),{type:"bar",data:{labels:Object.keys(s.byCategory),datasets:[{data:Object.values(s.byCategory),backgroundColor:"#2f7d4f"}]},options:{maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
  new Chart(document.getElementById("cond"),{type:"doughnut",data:{labels:Object.keys(s.byCondition),datasets:[{data:Object.values(s.byCondition),backgroundColor:colors}]},options:{maintainAspectRatio:false}});
})().catch(e=>document.getElementById("content").innerHTML=`<div class="section msg">${escapeHtml(e.message)}</div>`);
