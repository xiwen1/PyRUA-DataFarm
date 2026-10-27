// DataFarm project page: contents highlight, scroll-to-top, BibTeX copy, real-robot chart, video tabs.
function copyBibTeX() {
  const code = document.querySelector('#bibtex-code code');
  const btn = document.querySelector('.copy-bibtex-btn');
  if (!code) return;
  const done = () => { btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 1600); };
  if (navigator.clipboard) navigator.clipboard.writeText(code.textContent).then(done).catch(() => {});
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

window.addEventListener('scroll', () => {
  const b = document.querySelector('.scroll-to-top');
  if (b) b.classList.toggle('visible', window.scrollY > 300);
});

function setupToc() {
  const links = Array.from(document.querySelectorAll('.toc a'));
  const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const toc = document.querySelector('.toc'), hero = document.querySelector('.hero');
  function update() {
    // wide screens: the sidebar contents appear once the title block has scrolled away
    if (toc && hero) toc.classList.toggle('shown', window.scrollY > hero.offsetTop + hero.offsetHeight - 80);
    const y = window.scrollY + 120;
    let cur = secs[0];
    secs.forEach(s => { if (s.offsetTop <= y) cur = s; });
    links.forEach(a => a.classList.toggle('active', cur && a.getAttribute('href') === '#' + cur.id));
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs, text) {
  const e = document.createElementNS(SVGNS, tag);
  Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
  if (text !== undefined) e.textContent = text;
  return e;
}

function setupChart(data) {
  const host = document.getElementById('rr-chart');
  const note = document.getElementById('rr-note');
  if (!host) return;
  const W = 820, H = 330, L = 44, R = 10, T = 30, B = 46;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });
  host.appendChild(svg);
  const ph = H - T - B, n = data.tasks.length, gw = (W - L - R) / n, bw = Math.min(26, gw * 0.24);
  [0, 25, 50, 75, 100].forEach(v => {
    const y = T + ph * (1 - v / 100);
    svg.appendChild(svgEl('line', { x1: L, x2: W - R, y1: y, y2: y, stroke: '#E6E9ED' }));
    svg.appendChild(svgEl('text', { x: L - 8, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#64748b' }, v + '%'));
  });
  // highlight the total group
  svg.appendChild(svgEl('rect', { x: L + (n - 1) * gw + 6, y: T - 14, width: gw - 12, height: ph + 14, rx: 6, fill: '#F8EDED' }));
  const bars = [];
  data.tasks.forEach((t, i) => {
    const cx = L + (i + 0.5) * gw;
    const fill = { teleop: '#A3ADB8', simdr: '#B39250', ours: '#8B1414' };
    const ink = { teleop: '#7D8BA3', simdr: '#8E7235', ours: '#8B1414' };
    ['teleop', 'simdr', 'ours'].forEach((k, j) => {
      const x = cx + (j - 1.5) * (bw + 3) + 1.5;
      const r = svgEl('rect', { class: 'bar', x, width: bw, y: T + ph, height: 0, rx: 2, fill: fill[k] });
      const tip = svgEl('title'); r.appendChild(tip);
      const lb = svgEl('text', { x: x + bw / 2, y: T + ph, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: ink[k] });
      svg.appendChild(r); svg.appendChild(lb);
      bars.push({ r, tip, lb, i, k });
    });
    const name = svgEl('text', { x: cx, y: H - B + 20, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': i === n - 1 ? 800 : 600, fill: '#1F2A44' }, t);
    svg.appendChild(name);
    if (i === n - 1) svg.appendChild(svgEl('text', { x: cx, y: H - B + 36, 'text-anchor': 'middle', 'font-size': 11, fill: '#64748b' }, '100 trials'));
  });
  function show(cond) {
    const d = data[cond];
    bars.forEach(b => {
      const v = d[b.k][b.i], n = d.n[b.i], h = ph * v / n, y = T + ph - h;
      b.r.setAttribute('y', y); b.r.setAttribute('height', h);
      b.lb.setAttribute('y', y - 5); b.lb.textContent = v;
      b.tip.textContent = `${data.tasks[b.i]}, ${{ ours: 'DataFarm', simdr: 'Sim + DR', teleop: 'teleop data' }[b.k]}: ${v} / ${n}`;
    });
    note.textContent = d.note;
    document.querySelectorAll('.df-seg-btn').forEach(b => b.classList.toggle('active', b.dataset.cond === cond));
  }
  document.querySelectorAll('.df-seg-btn').forEach(b => b.addEventListener('click', () => show(b.dataset.cond)));
  show('ood');
}

function swapVideo(v, src) {
  if (!v || v.querySelector('source').getAttribute('src') === src) return;  // already showing it
  v.poster = src.replace(/\.mp4$/, '.jpg');
  v.querySelector('source').src = src;
  v.load();
  const p = v.play(); if (p && p.catch) p.catch(() => { v.controls = true; });
}

function setupTabs(data) {
  document.querySelectorAll('.df-tabs').forEach(group => {
    const kind = group.dataset.group;
    const buttons = Array.from(group.querySelectorAll('button'));
    function pick(task) {
      buttons.forEach(b => b.classList.toggle('active', b.dataset.task === task));
      if (kind === 'real') {
        const i = data.keys.indexOf(task);
        swapVideo(document.getElementById('real-teleop'), `static/videos/real_${task}_teleop.mp4`);
        swapVideo(document.getElementById('real-ours'), `static/videos/real_${task}_ours.mp4`);
        document.getElementById('real-teleop-score').textContent = `${data.ood.teleop[i]} / 20 successes`;
        document.getElementById('real-ours-score').textContent = `${data.ood.ours[i]} / 20 successes`;
      } else {
        swapVideo(document.getElementById('gen-video'), `static/videos/gen_${task}.mp4`);
        document.getElementById('gen-ours-label').textContent = data.genLabel[task];
      }
    }
    buttons.forEach(b => b.addEventListener('click', () => pick(b.dataset.task)));
    pick('cups');
  });
}

// play clips while they are on screen; show controls if the browser blocks autoplay
function setupClips() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => { v.controls = true; }); }
    else v.pause();
  }), { threshold: 0.25 });
  document.querySelectorAll('video').forEach(v => io.observe(v));
}

document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(document.getElementById('site-data').textContent);
  setupToc();
  setupClips();
  setupChart(data);
  setupTabs(data);
});
