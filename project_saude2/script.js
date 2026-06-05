// ── NAVIGATION ──
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  document.querySelectorAll('.nav-item').forEach((el,i) => {
    const names = ['home','triage','dashboard','cadastro'];
    el.classList.toggle('active', names[i] === name);
  });
  window.scrollTo(0,0);
  if (name === 'triage') { currentQ = 0; renderQ(); }
}

// ── TRIAGE LOGIC ──
const questions = [
  {
    q: "Qual é o seu sintoma principal?",
    opts: ["🌡️ Febre", "🤕 Dor de cabeça", "🤧 Tosse / Constipação", "🫁 Dificuldade respiratória",
           "🤢 Vómitos / Náuseas", "😴 Fadiga extrema", "🩸 Diarreia", "Outro"],
    type: "grid"
  },
  {
    q: "Há quanto tempo tem estes sintomas?",
    opts: ["Menos de 1 dia", "1 a 3 dias", "4 a 7 dias", "Mais de uma semana"],
    type: "grid"
  },
  {
    q: "Qual é a intensidade dos sintomas?",
    opts: ["1","2","3","4","5","6","7","8","9","10"],
    type: "scale",
    label: "1 = Leve · 10 = Muito grave"
  },
  {
    q: "Tem febre? Se sim, qual a temperatura aproximada?",
    opts: ["Não tenho febre", "Febre baixa (37–38°C)", "Febre moderada (38–39°C)", "Febre alta (acima de 39°C)"],
    type: "grid"
  },
  {
    q: "Esteve em zona de risco de malária recentemente?",
    opts: ["Sim, área rural/campo", "Sim, zona periurbana", "Não saí da cidade", "Não sei"],
    type: "grid"
  },
  {
    q: "Tem alguma condição médica pré-existente?",
    opts: ["Nenhuma conhecida", "Hipertensão", "Diabetes", "VIH/SIDA", "Estou grávida", "Outra condição"],
    type: "grid"
  }
];

let currentQ = 0;
let answers = [];

function renderQ() {
  const q = questions[currentQ];
  const total = questions.length;
  const pct = Math.round(((currentQ+1)/total)*100);
  document.getElementById('prog-label').textContent = `Pergunta ${currentQ+1} de ${total}`;
  document.getElementById('prog-pct').textContent = pct + '%';
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('btn-back').style.display = currentQ > 0 ? 'block' : 'none';
  document.getElementById('btn-next').textContent = currentQ === total-1 ? 'Ver Resultado ✓' : 'Próxima →';

  let html = `<div class="question-card">
    <div class="q-num">PERGUNTA ${currentQ+1}/${total}</div>
    <div class="q-text">${q.q}</div>`;

  if (q.type === 'scale') {
    html += `<div style="font-size:12px;color:var(--text3);margin-bottom:14px">${q.label}</div>`;
    html += `<div class="scale-options">`;
    q.opts.forEach(o => {
      html += `<button class="scale-btn" onclick="selectOpt(this,'${o}')">${o}</button>`;
    });
    html += `</div>`;
  } else {
    html += `<div class="options-grid">`;
    q.opts.forEach((o, i) => {
      const isLast = i === q.opts.length - 1 && q.opts.length % 2 !== 0;
      html += `<button class="opt-btn${isLast?' full':''}" onclick="selectOpt(this,'${o}')">${o}</button>`;
    });
    html += `</div>`;
  }
  html += `</div>`;
  document.getElementById('q-container').innerHTML = html;
  if (answers[currentQ]) {
    document.querySelectorAll('.opt-btn, .scale-btn').forEach(b => {
      if (b.textContent === answers[currentQ]) b.classList.add('selected');
    });
  }
}

function selectOpt(el, val) {
  el.closest('.question-card').querySelectorAll('.opt-btn, .scale-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  answers[currentQ] = val;
}

function nextQ() {
  if (currentQ < questions.length - 1) {
    currentQ++;
    renderQ();
  } else {
    showScreen('result');
  }
}

function prevQ() {
  if (currentQ > 0) { currentQ--; renderQ(); }
}

// ── CHECKBOX TOGGLE ──
function toggleCheck(el) {
  el.classList.toggle('checked');
  if (el.textContent === 'Nenhuma') {
    document.querySelectorAll('#chronic-checks .checkbox-item').forEach(c => {
      if (c !== el) c.classList.remove('checked');
    });
  } else {
    document.querySelector('#chronic-checks .checkbox-item:last-child').classList.remove('checked');
  }
}

// Init
renderQ();