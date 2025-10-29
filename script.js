document.addEventListener("DOMContentLoaded", function() {

    // --- CONTROLE DO MENU MODERNO ---
    const hamburger = document.getElementById('menu-hamburger');
    // const overlay = document.getElementById('menu-overlay'); // Desativado
    const navLinks = document.getElementById('nav-links'); 

    // Função para fechar o menu
    function closeMenu() {
        document.body.classList.remove('nav-open');
    }

    // Função para abrir/fechar o menu
    function toggleMenu() {
        document.body.classList.toggle('nav-open');
    }

    // Ouve o clique no hamburger
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    
    // Ouve clique em links DENTRO do menu para fechar
    if (navLinks) {
        navLinks.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                 const isMobile = hamburger.offsetParent !== null;
                 if (isMobile) closeMenu();
            }
        });
    }
    
    // --- LÓGICA DROPDOWN REMOVIDA ---

    // --- CARREGAR EVENTOS OU AGENDA ---
    // Verifica se existe o elemento com id="eventos-grid" (HomePage)
    if (document.getElementById('eventos-grid')) {
        console.log("Chamando carregarEventosHome..."); // Log para depuração
        carregarEventosHome(); 
    } 
    // Verifica se existe o elemento com id="agenda-lista" (AgendaPage)
    else if (document.getElementById('agenda-lista')) {
        console.log("Chamando carregarAgendaCompleta..."); // Log para depuração
        carregarAgendaCompleta(); 
    } else {
        console.log("Nenhum container de eventos/agenda encontrado."); // Log para depuração
    }
});


// --- FUNÇÃO PARA CARREGAR EVENTOS NA HOME (Layout Grid) ---
async function carregarEventosHome() { 
    const grid = document.getElementById('eventos-grid');
    // Verificação extra para garantir que o grid existe ANTES de tentar usá-lo
    if (!grid) {
        console.error("Elemento com ID 'eventos-grid' não encontrado na função carregarEventosHome.");
        return; 
    }
    grid.innerHTML = '<p class="carregando">Carregando eventos...</p>';
    try {
        const response = await fetch('eventos.json');
        // Verifica se a resposta da rede foi OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const eventos = await response.json();
        grid.innerHTML = ''; // Limpa o "carregando"
        
        // Verifica se 'eventos' é um array antes de iterar
        if (Array.isArray(eventos)) {
            eventos.forEach(evento => {
                const card = document.createElement('article');
                card.className = 'noticia-card'; 
                card.innerHTML = `
                    <div class="card-imagem-container">
                        <img src="${evento.imagem}" alt="Imagem do evento: ${evento.titulo}">
                        <div class="card-data">
                            <span class="dia">${evento.dia || '??'}</span> <span class="mes">${evento.mes || '???'}</span>   </div>
                    </div>
                    <div class="card-content">
                        <h3>${evento.titulo || 'Sem Título'}</h3>     <p>${evento.resumo || 'Sem descrição.'}</p> <a href="#" class="ler-mais">Ver Detalhes</a>
                    </div>
                `;
                grid.appendChild(card);
            });
        } else {
            console.error("O arquivo eventos.json não contém um array válido.");
            grid.innerHTML = '<p class="erro">Erro ao processar dados dos eventos.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar eventos (Home):', error);
        // Mostra o erro específico no grid para facilitar depuração
        grid.innerHTML = `<p class="erro">Falha ao carregar eventos. Detalhe: ${error.message}</p>`;
    }
}

// --- FUNÇÃO PARA CARREGAR EVENTOS NA PÁGINA AGENDA (Layout Lista) ---
async function carregarAgendaCompleta() { 
    const listaContainer = document.getElementById('agenda-lista');
    if (!listaContainer) {
         console.error("Elemento com ID 'agenda-lista' não encontrado na função carregarAgendaCompleta.");
        return;
    }
    listaContainer.innerHTML = '<p class="carregando">Carregando agenda...</p>';
    try {
        const response = await fetch('eventos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const eventos = await response.json();
        listaContainer.innerHTML = ''; 

        if (!Array.isArray(eventos) || eventos.length === 0) {
            listaContainer.innerHTML = '<p>Nenhum evento agendado no momento.</p>';
            return;
        }

        eventos.forEach(evento => {
            const item = document.createElement('div');
            item.className = 'agenda-item';
            item.innerHTML = `
                <div class="agenda-data">
                    <span class="dia">${evento.dia || '??'}</span>
                    <span class="mes">${evento.mes || '???'}</span>
                    <span class="dia-semana">???</span> </div>
                <div class="agenda-detalhes">
                    <h3>${evento.titulo || 'Sem Título'}</h3>
                    <p class="agenda-info">
                        <span class="horario">⏰ ??:??</span> <span class="local">📍 ???</span>   </p>
                    <p class="agenda-resumo">${evento.resumo || 'Sem descrição.'}</p>
                </div>
            `;
            listaContainer.appendChild(item);
        });

    } catch (error) {
        console.error('Erro ao buscar agenda:', error);
        listaContainer.innerHTML = `<p class="erro">Falha ao carregar agenda. Detalhe: ${error.message}</p>`;
    }
}
