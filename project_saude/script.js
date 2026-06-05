document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    let currentSection = 0;
    let sintomas = {};

    // Dados do paciente
    let paciente = {};

    // Perguntas de triagem
    const perguntas = [
        { pergunta: 'Qual é o sintoma principal?', campo: 'sintoma_principal' },
        { pergunta: 'Há quanto tempo você tem esse sintoma?', campo: 'duracao' },
        { pergunta: 'Qual é a intensidade do sintoma (1-10)?', campo: 'intensidade', tipo: 'number' },
        { pergunta: 'Você tem outros sintomas associados?', campo: 'outros_sintomas' },
        { pergunta: 'Você tem fatores de risco (ex: fumo, dieta, etc.)?', campo: 'fatores_risco' }
    ];
    let perguntaAtual = 0;

    // Cadastro
    document.getElementById('form-cadastro').addEventListener('submit', (e) => {
        e.preventDefault();
        paciente.nome = document.getElementById('nome').value;
        paciente.idade = document.getElementById('idade').value;
        paciente.sexo = document.getElementById('sexo').value;
        paciente.contato = document.getElementById('contato').value;
        paciente.historico = document.getElementById('historico').value;
        showSection(1);
        iniciarTriagem();
    });

    function showSection(index) {
        sections.forEach((sec, i) => {
            sec.classList.toggle('active', i === index);
        });
        currentSection = index;
    }

    function iniciarTriagem() {
        mostrarPergunta();
    }

    function mostrarPergunta() {
        const divPerguntas = document.getElementById('perguntas');
        if (perguntaAtual < perguntas.length) {
            const p = perguntas[perguntaAtual];
            divPerguntas.innerHTML = `
                <label for="${p.campo}">${p.pergunta}</label>
                <input type="${p.tipo || 'text'}" id="${p.campo}" required>
            `;
            document.getElementById('proximo-pergunta').style.display = 'block';
            document.getElementById('finalizar-triagem').style.display = 'none';
        } else {
            document.getElementById('proximo-pergunta').style.display = 'none';
            document.getElementById('finalizar-triagem').style.display = 'block';
        }
    }

    document.getElementById('proximo-pergunta').addEventListener('click', () => {
        const p = perguntas[perguntaAtual];
        sintomas[p.campo] = document.getElementById(p.campo).value;
        perguntaAtual++;
        mostrarPergunta();
    });

    document.getElementById('finalizar-triagem').addEventListener('click', () => {
        gerarHipoteses();
        showSection(2);
    });

    function gerarHipoteses() {
        // Simulação simples de hipóteses baseada em sintomas
        const lista = document.getElementById('lista-hipoteses');
        lista.innerHTML = '';
        if (sintomas.sintoma_principal.toLowerCase().includes('dor de cabeça')) {
            lista.innerHTML += '<li>Migrânea</li><li>Tensão</li>';
        } else if (sintomas.sintoma_principal.toLowerCase().includes('febre')) {
            lista.innerHTML += '<li>Infecção viral</li><li>Malária</li>';
        } else {
            lista.innerHTML += '<li>Condição não identificada - consulte médico</li>';
        }
    }

    document.getElementById('encaminhar').addEventListener('click', () => {
        // Simulação de envio para médico e resultado
        setTimeout(() => {
            document.getElementById('diagnostico').textContent = 'Diagnóstico: Infecção viral (validado por médico licenciado)';
            document.getElementById('receita').textContent = 'Receita: Paracetamol 500mg, 3x ao dia por 5 dias.';
            document.getElementById('dicas').innerHTML = '<li>Descanse bastante</li><li>Hidrate-se</li><li>Procure atendimento se sintomas piorarem</li>';
            showSection(3);
        }, 2000); // Simula delay
    });

    document.getElementById('salvar-acompanhamento').addEventListener('click', () => {
        const evolucao = document.getElementById('evolucao').value;
        alert('Evolução salva: ' + evolucao);
        // Aqui poderia salvar em localStorage ou enviar para servidor
    });
});