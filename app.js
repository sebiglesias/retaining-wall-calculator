
const state = { len: 30, hgt: 3, blockWid: 16, blockHgt: 8, backfill: 12 };

function init() {
  const l = document.getElementById('wallLen');
  const h = document.getElementById('wallHgt');
  const bw = document.getElementById('blockWid');
  const bh = document.getElementById('blockHgt');
  const bf = document.getElementById('backfillDepth');

  l.addEventListener('input', e => { state.len = parseFloat(e.target.value)||0; calc(); });
  h.addEventListener('input', e => { state.hgt = parseFloat(e.target.value)||0; calc(); });
  bw.addEventListener('change', e => { state.blockWid = parseFloat(e.target.value)||16; calc(); });
  bh.addEventListener('change', e => { state.blockHgt = parseFloat(e.target.value)||8; calc(); });
  bf.addEventListener('input', e => { state.backfill = parseFloat(e.target.value)||12; calc(); });
  calc();
}

function calc() {
  const blocksPerRow = Math.ceil((state.len * 12) / state.blockWid);
  const visibleCourses = Math.ceil((state.hgt * 12) / state.blockHgt);
  const totalCourses = visibleCourses + 1; // 1 buried base course minimum

  const rawBlocks = blocksPerRow * totalCourses;
  const totalBlocks = Math.ceil(rawBlocks * 1.05); // +5% cut waste

  const faceArea = state.len * state.hgt;

  // Gravel: backfill behind full wall height
  const fullHgtFt = (totalCourses * state.blockHgt) / 12;
  const gravelCuFt = state.len * fullHgtFt * (state.backfill / 12);
  const gravelYds = gravelCuFt / 27;
  const gravelTons = gravelYds * 1.4;

  // Geogrid: required if height >= 3 ft
  let geogridYds = 0;
  let layers = 0;
  if (state.hgt >= 3) {
    layers = Math.floor(state.hgt / 2);
    // Geogrid length into soil = approx 0.8 * wall height
    const gridDepth = state.hgt * 0.8;
    geogridYds = Math.ceil((state.len * gridDepth * layers) / 9);
  }

  // Adhesive: 1 tube (28oz) covers approx 35 linear feet
  const adhesiveTubes = Math.max(1, Math.ceil(state.len / 35) * (visibleCourses > 1 ? 2 : 1));

  document.getElementById('totalBlocks').textContent = totalBlocks;
  document.getElementById('baseCourseText').textContent = `Includes ${blocksPerRow} Buried Base Blocks (+5% Waste)`;
  document.getElementById('gravelTons').textContent = `${gravelTons.toFixed(1)} Tons`;
  document.getElementById('gravelYards').textContent = `≈ ${gravelYds.toFixed(2)} Cu Yards`;
  document.getElementById('faceArea').textContent = `${Math.round(faceArea)} sq ft`;
  document.getElementById('totalCourses').textContent = `${totalCourses} Courses (1 Buried)`;
  document.getElementById('pipeLen').textContent = `${Math.round(state.len)} Linear ft`;
  document.getElementById('geogridSqYd').textContent = layers > 0 ? `${geogridYds} sq yds (${layers} Layer${layers>1?'s':''})` : 'Not Needed (<3ft)';
  document.getElementById('adhesiveTubes').textContent = `${adhesiveTubes} Tubes (28 oz)`;
}
window.addEventListener('DOMContentLoaded', init);
