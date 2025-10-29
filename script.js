document.addEventListener("DOMContentLoaded", function() {

    // --- CÓDIGO DO MENU HAMBURGER (Simplificado) ---
    const hamburger = document.getElementById('menu-hamburger');
    const navLinks = document.getElementById('nav-links'); 

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // --- CÓDIGO DO MENU SANFONA (O mesmo) ---
    const dropdownTriggers = document.querySelectorAll('.nav-links .dropdown > a');
    
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(event) {
            const isMobile = hamburger.offsetParent !== null;
            if (isMobile) {
                event.preventDefault(); 
                const submenu = this.parentElement.querySelector('.dropdown-menu');
                const caret = this.querySelector('.caret');
                if (submenu) { submenu.classList.toggle('open'); }
                if (caret) { caret.classList.toggle('open'); }
            }
        });
    });

    // --- MUDANÇA: CARREGAR EVENTOS OU AGENDA ---
    // Verifica se estamos na página inicial (onde está o grid de eventos)
    if (document.getElementById('eventos-grid')) {
        carregarEventosHome(); // Renomeado para clareza
    } 
    // Verifica se estamos na página da agenda
    else if (document.getElementById('agenda-lista')) {
        carregarAgendaCompleta(); // Nova função
    }
});


// --- FUNÇÃO PARA CARREGAR EVENTOS NA HOME (Layout Grid) ---
// (Mesma função de antes, apenas renomeada)
async function carregarEventosHome() {
    const grid = document.getElementById('eventos-grid');
    if (!grid) return; 
    grid.innerHTML = '<p class="carregando">Carregando eventos...</p>';
    try {
        const response = await fetch('eventos.json');
        const eventos = await response.json();
        grid.innerHTML = '';
        eventos.forEach(evento => {
            const card = document.createElement('article');
            card.className = 'noticia-card'; 
            card.innerHTML = `
                <div class="card-imagem-container">
                    <img src="${evento.imagem}" alt="Imagem do evento: ${evento.titulo}">
                    <div class="card-data">
                        <span class="dia">${evento.dia}</span>
                        <span class="mes">${evento.mes}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${evento.titulo}</h3>
                    <p>${evento.resumo}</p>
                    <a href="#" class="ler-mais">Ver Detalhes</a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        grid.innerHTML = '<p class="erro">Falha ao carregar eventos.</p>';
    }
}

// --- NOVA FUNÇÃO: CARREGAR EVENTOS NA PÁGINA AGENDA (Layout Lista) ---
async function carregarAgendaCompleta() {
    const listaContainer = document.getElementById('agenda-lista');
    if (!listaContainer) return;
    listaContainer.innerHTML = '<p class="carregando">Carregando agenda...</p>';
    try {
        const response = await fetch('eventos.json');
        const eventos = await response.json();
        listaContainer.innerHTML = ''; // Limpa o carregando

        if (eventos.length === 0) {
            listaContainer.innerHTML = '<p>Nenhum evento agendado no momento.</p>';
            return;
        }

        eventos.forEach(evento => {
            const item = document.createElement('div');
            item.className = 'agenda-item';
            // Monta o HTML para o item da lista
            item.innerHTML = `
                <div class="agenda-data">
                    <span class="dia">${evento.dia}</span>
                    <span class="mes">${evento.mes}</span>
                    <span class="dia-semana">QUA</span> </div>
                <div class="agenda-detalhes">
                    <h3>${evento.titulo}</h3>
                    <p class="agenda-info">
                        <span class="horario">⏰ 19:30</span> <span class="local">📍 Local Principal</span> </p>
                    <p class="agenda-resumo">${evento.resumo}</p>
                </div>
            `;
            listaContainer.appendChild(item);
            // Poderíamos adicionar lógica aqui para pegar dia da semana real, horário, local, etc.
            // Por enquanto, usaremos placeholders no HTML/CSS.
        });

    } catch (error) {
        console.error('Erro ao buscar agenda:', error);
        listaContainer.innerHTML = '<p class="erro">Falha ao carregar agenda.</p>';
    }
}