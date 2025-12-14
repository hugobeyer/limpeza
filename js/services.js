// Informações detalhadas sobre serviços
const serviceDetails = {
    colchao: {
        title: "Limpeza de Colchão",
        icon: "🛏️",
        description: "Serviço especializado de limpeza profunda e higienização de colchões",
        benefits: [
            "Remove ácaros, bactérias e fungos",
            "Elimina odores e manchas",
            "Prolonga a vida útil do colchão",
            "Melhora a qualidade do sono",
            "Ambiente mais saudável"
        ],
        process: [
            "Inspeção inicial do colchão",
            "Aspiração profunda com equipamento especializado",
            "Aplicação de produtos de limpeza específicos",
            "Tratamento de manchas e odores",
            "Desinfecção com produtos anti-bacterianos",
            "Secagem completa e adequada"
        ],
        price: "A partir de R$ 150",
        duration: "2-3 horas",
        frequency: "Recomendado a cada 6 meses",
        tips: "Evite molhar o colchão. Use capas protetoras para prevenir manchas futuras."
    },
    sofa: {
        title: "Limpeza de Sofá",
        icon: "🛋️",
        description: "Limpeza profissional de sofás e estofados com técnicas adequadas para cada tipo de tecido",
        benefits: [
            "Remove sujeira profunda e manchas",
            "Elimina odores e ácaros",
            "Restaura a aparência original",
            "Adequado para diferentes tipos de tecido",
            "Produtos seguros e testados"
        ],
        process: [
            "Identificação do tipo de tecido",
            "Aspiração completa de toda a superfície",
            "Limpeza a seco ou úmido conforme necessário",
            "Tratamento específico de manchas",
            "Aplicação de produtos de proteção",
            "Secagem e finalização"
        ],
        price: "A partir de R$ 120",
        duration: "2-4 horas",
        frequency: "Recomendado a cada 3-6 meses",
        tips: "Informe o tipo de tecido do seu sofá ao agendar. Evite produtos químicos caseiros."
    },
    carro: {
        title: "Limpeza de Carro",
        icon: "🚗",
        description: "Lavagem completa e detalhamento automotivo interno e externo",
        benefits: [
            "Lavagem externa completa",
            "Aspiração e limpeza interna profunda",
            "Limpeza de estofados e carpetes",
            "Limpeza de vidros e espelhos",
            "Acabamento com produtos premium",
            "Valorização do veículo"
        ],
        process: [
            "Lavagem externa com produtos específicos",
            "Aspiração completa do interior",
            "Limpeza de estofados e bancos",
            "Limpeza de carpetes e tapetes",
            "Limpeza de vidros e espelhos",
            "Aplicação de produtos de acabamento",
            "Verificação final"
        ],
        price: "A partir de R$ 80",
        duration: "1-2 horas",
        frequency: "Recomendado mensalmente",
        tips: "Remova objetos pessoais antes da limpeza. Informe sobre manchas específicas."
    },
    casa: {
        title: "Limpeza Residencial",
        icon: "🏠",
        description: "Limpeza completa e profissional de residências, casas e apartamentos",
        benefits: [
            "Limpeza completa de todos os cômodos",
            "Banheiros higienizados",
            "Cozinha limpa e organizada",
            "Aspiração e limpeza de pisos",
            "Organização e arrumação",
            "Ambiente saudável e agradável"
        ],
        process: [
            "Planejamento e organização",
            "Limpeza de banheiros (sanitários, pias, box)",
            "Limpeza da cozinha (fogão, geladeira, pia)",
            "Aspiração e limpeza de pisos",
            "Limpeza de móveis e superfícies",
            "Organização e arrumação",
            "Verificação final e entrega"
        ],
        price: "A partir de R$ 200",
        duration: "4-6 horas",
        frequency: "Semanal, quinzenal ou mensal",
        tips: "Informe áreas específicas que precisam de atenção especial. Disponibilize produtos de limpeza se preferir."
    },
    escritorio: {
        title: "Limpeza Comercial",
        icon: "🏢",
        description: "Serviços de limpeza profissional para escritórios, empresas e espaços comerciais",
        benefits: [
            "Ambiente profissional limpo",
            "Produtividade aumentada",
            "Imagem positiva da empresa",
            "Saúde e bem-estar dos funcionários",
            "Flexibilidade de horários",
            "Contratos personalizados"
        ],
        process: [
            "Avaliação do espaço",
            "Limpeza de salas e escritórios",
            "Higienização de banheiros",
            "Limpeza de áreas comuns",
            "Aspiração e limpeza de pisos",
            "Desinfecção de superfícies",
            "Organização e manutenção"
        ],
        price: "Sob consulta",
        duration: "Variável conforme tamanho",
        frequency: "Diária, semanal ou conforme contrato",
        tips: "Oferecemos pacotes personalizados. Entre em contato para um orçamento adequado às suas necessidades."
    },
    tapete: {
        title: "Limpeza de Tapetes",
        icon: "🧶",
        description: "Limpeza especializada e restauração de tapetes e carpetes",
        benefits: [
            "Remoção profunda de sujeira",
            "Tratamento de manchas",
            "Eliminação de odores",
            "Restauração de cores",
            "Prolongamento da vida útil",
            "Ambiente mais saudável"
        ],
        process: [
            "Inspeção e identificação do tipo de tapete",
            "Aspiração profunda",
            "Tratamento pré-lavagem de manchas",
            "Lavagem especializada",
            "Enxágue completo",
            "Secagem adequada",
            "Finalização e verificação"
        ],
        price: "A partir de R$ 100",
        duration: "2-3 horas",
        frequency: "Recomendado a cada 6 meses",
        tips: "Informe o tipo de tapete ao agendar. Alguns tapetes podem precisar de tratamento especial."
    }
};

// Inicializar serviços
function initServices() {
    setupServiceCards();
    setupServiceModal();
}

// Configurar cards de serviços
function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceKey = card.dataset.service;
            showServiceDetails(serviceKey);
        });

        // Também adicionar evento ao botão
        const button = card.querySelector('.info-button');
        if (button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceKey = card.dataset.service;
                showServiceDetails(serviceKey);
            });
        }
    });
}

// Mostrar detalhes do serviço no modal
function showServiceDetails(serviceKey) {
    const service = serviceDetails[serviceKey];
    if (!service) return;

    const modal = document.getElementById('serviceModal');
    const detailsDiv = document.getElementById('serviceDetails');

    let html = `
        <h2>${service.icon} ${service.title}</h2>
        <p style="font-size: 1.1rem; color: #666; margin-bottom: 1.5rem;">${service.description}</p>

        <h3 style="color: var(--dark-color); margin-top: 1.5rem; margin-bottom: 0.5rem;">✅ Benefícios:</h3>
        <ul>
            ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>

        <h3 style="color: var(--dark-color); margin-top: 1.5rem; margin-bottom: 0.5rem;">📋 Processo:</h3>
        <ol>
            ${service.process.map(step => `<li>${step}</li>`).join('')}
        </ol>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1.5rem;">
            <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px;">
                <strong>💰 Preço:</strong><br>
                ${service.price}
            </div>
            <div style="background: #f0fff0; padding: 1rem; border-radius: 8px;">
                <strong>⏱️ Duração:</strong><br>
                ${service.duration}
            </div>
            <div style="background: #fff8f0; padding: 1rem; border-radius: 8px;">
                <strong>📅 Frequência:</strong><br>
                ${service.frequency}
            </div>
            <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px;">
                <strong>💡 Dica:</strong><br>
                ${service.tips}
            </div>
        </div>
    `;

    detailsDiv.innerHTML = html;
    modal.style.display = 'block';
}

// Configurar modal
function setupServiceModal() {
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Exportar para uso global
window.initServices = initServices;
window.serviceDetails = serviceDetails;
