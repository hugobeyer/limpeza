// Base de conhecimento sobre serviços de limpeza
const knowledgeBase = {
    colchao: {
        descricao: "Limpeza profunda de colchões remove ácaros, bactérias e manchas",
        processo: "Aspiração profunda, tratamento com produtos específicos, desinfecção e secagem",
        tempo: "2-3 horas",
        preco: "A partir de R$ 150",
        frequencia: "Recomendado a cada 6 meses"
    },
    sofa: {
        descricao: "Limpeza profissional de sofás e estofados",
        processo: "Aspiração, limpeza a seco ou úmido conforme o tecido, tratamento de manchas e desinfecção",
        tempo: "2-4 horas",
        preco: "A partir de R$ 120",
        frequencia: "Recomendado a cada 3-6 meses"
    },
    carro: {
        descricao: "Lavagem completa e detalhamento automotivo",
        processo: "Lavagem externa, aspiração interna, limpeza de estofados, limpeza de vidros e acabamento",
        tempo: "1-2 horas",
        preco: "A partir de R$ 80",
        frequencia: "Recomendado mensalmente"
    },
    casa: {
        descricao: "Limpeza completa de residências",
        processo: "Limpeza de todos os cômodos, banheiros, cozinha, aspiração e organização",
        tempo: "4-6 horas",
        preco: "A partir de R$ 200",
        frequencia: "Semanal, quinzenal ou mensal"
    },
    escritorio: {
        descricao: "Limpeza profissional para escritórios e empresas",
        processo: "Limpeza de salas, banheiros, áreas comuns, desinfecção e organização",
        tempo: "Variável conforme tamanho",
        preco: "Sob consulta",
        frequencia: "Diária, semanal ou conforme contrato"
    },
    tapete: {
        descricao: "Limpeza e restauração de tapetes",
        processo: "Aspiração profunda, tratamento de manchas, lavagem especializada e secagem",
        tempo: "2-3 horas",
        preco: "A partir de R$ 100",
        frequencia: "Recomendado a cada 6 meses"
    }
};

// Respostas pré-definidas para perguntas comuns
const commonResponses = {
    saudacao: [
        "Olá! Como posso ajudá-lo hoje?",
        "Oi! Estou aqui para ajudar com informações sobre nossos serviços de limpeza.",
        "Bem-vindo! Em que posso ajudar?"
    ],
    agendamento: [
        "Para agendar um serviço, você pode usar nossa seção de agendamento ou me informar a data e horário desejados.",
        "Você pode agendar diretamente na página de agendamento. Temos horários disponíveis de segunda a sábado, das 8h às 18h.",
        "Para fazer um agendamento, acesse a seção 'Agendamento' no menu ou me informe qual serviço você precisa."
    ],
    preco: [
        "Nossos preços variam conforme o serviço. Limpeza de carro a partir de R$ 80, sofá a partir de R$ 120, colchão a partir de R$ 150.",
        "Os valores dependem do tipo e tamanho do serviço. Posso fornecer informações específicas sobre qualquer serviço que você precise.",
        "Temos preços competitivos! Me diga qual serviço você precisa e posso dar mais detalhes sobre o valor."
    ],
    horario: [
        "Trabalhamos de segunda a sábado, das 8h às 18h. Também temos disponibilidade aos domingos mediante agendamento prévio.",
        "Nossos horários são de segunda a sábado das 8h às 18h. Para horários especiais, entre em contato.",
        "Atendemos de segunda a sábado das 8h às 18h. Domingos e feriados mediante agendamento."
    ]
};

// Função para processar mensagem do usuário e gerar resposta
function processMessage(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // Verificar saudações
    if (message.match(/^(oi|olá|ola|bom dia|boa tarde|boa noite|hello|hi)/)) {
        return getRandomResponse(commonResponses.saudacao);
    }

    // Verificar perguntas sobre agendamento
    if (message.match(/(agendar|agendamento|marcar|horário|horario|disponível|disponivel|quando)/)) {
        return getRandomResponse(commonResponses.agendamento);
    }

    // Verificar perguntas sobre preço
    if (message.match(/(preço|preco|valor|custo|quanto|quanto custa|quanto é|quanto custa)/)) {
        return getRandomResponse(commonResponses.preco);
    }

    // Verificar perguntas sobre horários de funcionamento
    if (message.match(/(horário|horario|funcionamento|atende|aberto|fechado|quando trabalham)/)) {
        return getRandomResponse(commonResponses.horario);
    }

    // Verificar perguntas sobre serviços específicos
    for (const [service, info] of Object.entries(knowledgeBase)) {
        const serviceNames = {
            colchao: ['colchão', 'colchao', 'colchões', 'colchoes', 'cama'],
            sofa: ['sofá', 'sofa', 'sofás', 'sofas', 'estofado', 'estofados'],
            carro: ['carro', 'automóvel', 'automovel', 'veículo', 'veiculo', 'lavagem'],
            casa: ['casa', 'residência', 'residencia', 'apartamento', 'limpeza residencial'],
            escritorio: ['escritório', 'escritorio', 'comercial', 'empresa', 'escritórios'],
            tapete: ['tapete', 'tapetes', 'carpete', 'carpetes']
        };

        if (serviceNames[service].some(name => message.includes(name))) {
            return generateServiceResponse(service, info, message);
        }
    }

    // Resposta padrão
    return "Entendo sua pergunta. Posso ajudar com informações sobre nossos serviços de limpeza (colchão, sofá, carro, casa, escritório, tapetes), agendamentos e preços. O que você gostaria de saber?";
}

// Gerar resposta específica sobre um serviço
function generateServiceResponse(service, info, message) {
    let response = `Informações sobre ${getServiceName(service)}:\n\n`;

    if (message.match(/(como|processo|método|metodo|como funciona)/)) {
        response += `📋 Processo: ${info.processo}\n\n`;
    }

    if (message.match(/(tempo|duração|duracao|quanto tempo|demora)/)) {
        response += `⏱️ Tempo estimado: ${info.tempo}\n\n`;
    }

    if (message.match(/(preço|preco|valor|custo|quanto)/)) {
        response += `💰 Preço: ${info.preco}\n\n`;
    }

    if (message.match(/(frequência|frequencia|quando|periodicidade|periodo)/)) {
        response += `📅 Frequência recomendada: ${info.frequencia}\n\n`;
    }

    if (!response.includes('Processo') && !response.includes('Tempo') &&
        !response.includes('Preço') && !response.includes('Frequência')) {
        response += `📝 ${info.descricao}\n\n`;
        response += `⏱️ Tempo: ${info.tempo}\n`;
        response += `💰 Preço: ${info.preco}\n`;
        response += `📅 Frequência: ${info.frequencia}\n\n`;
        response += `💡 Dica: Para mais detalhes, pergunte sobre o processo, tempo ou preço específico!`;
    }

    return response;
}

// Obter nome do serviço em português
function getServiceName(service) {
    const names = {
        colchao: 'Limpeza de Colchão',
        sofa: 'Limpeza de Sofá',
        carro: 'Limpeza de Carro',
        casa: 'Limpeza Residencial',
        escritorio: 'Limpeza Comercial',
        tapete: 'Limpeza de Tapetes'
    };
    return names[service] || service;
}

// Obter resposta aleatória de um array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Adicionar mensagem ao chat
function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll para o final
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Inicializar chat
function initChat() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';

            // Simular delay de processamento
            setTimeout(() => {
                const response = processMessage(message);
                addMessage(response, false);
            }, 500);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Exportar para uso global
window.initChat = initChat;
window.knowledgeBase = knowledgeBase;
