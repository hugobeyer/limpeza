// Configuração da API de IA
const AI_CONFIG = {
    // Configure sua API key aqui ou use variável de ambiente
    // Para OpenAI: https://platform.openai.com/api-keys
    // Para usar outra API, altere o endpoint e headers abaixo
    apiKey: '', // Será configurado via prompt ou variável de ambiente
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo', // ou 'gpt-4' para respostas melhores
    useLocalStorage: true // Salvar API key no localStorage
};

// Contexto do sistema para o assistente de limpeza
const SYSTEM_PROMPT = `Você é um assistente especializado em serviços de limpeza profissional chamado "Limpeza Profissional". 

Sua função é ajudar clientes com informações sobre serviços de limpeza, incluindo:

SERVIÇOS DISPONÍVEIS:
- Limpeza de Colchão: Preço a partir de R$ 150, duração 2-3 horas, recomendado a cada 6 meses
- Limpeza de Sofá: Preço a partir de R$ 120, duração 2-4 horas, recomendado a cada 3-6 meses
- Limpeza de Carro: Preço a partir de R$ 80, duração 1-2 horas, recomendado mensalmente
- Limpeza Residencial: Preço a partir de R$ 200, duração 4-6 horas, frequência variável
- Limpeza Comercial: Preço sob consulta, duração variável, contratos personalizados
- Limpeza de Tapetes: Preço a partir de R$ 100, duração 2-3 horas, recomendado a cada 6 meses

HORÁRIOS DE FUNCIONAMENTO:
- Segunda a Sábado: 8h às 18h
- Domingos e feriados: Mediante agendamento prévio

INFORMAÇÕES IMPORTANTES:
- Forneça dicas detalhadas sobre limpeza quando solicitado
- Explique processos de limpeza profissional
- Ajude com agendamentos direcionando para a seção de agendamento
- Seja amigável, profissional e prestativo
- Responda em português brasileiro
- Forneça informações técnicas sobre produtos, métodos e técnicas de limpeza quando perguntado

Sempre seja útil e forneça informações detalhadas sobre limpeza quando o cliente perguntar.`;

// Histórico de conversa
let conversationHistory = [
    {
        role: 'system',
        content: SYSTEM_PROMPT
    }
];

// Carregar API key do localStorage se disponível
function loadApiKey() {
    if (AI_CONFIG.useLocalStorage) {
        const savedKey = localStorage.getItem('cleaning_ai_api_key');
        if (savedKey) {
            AI_CONFIG.apiKey = savedKey;
        }
    }
}

// Salvar API key no localStorage
function saveApiKey(key) {
    if (AI_CONFIG.useLocalStorage) {
        localStorage.setItem('cleaning_ai_api_key', key);
        AI_CONFIG.apiKey = key;
    }
}

// Verificar se API key está configurada
function isApiKeyConfigured() {
    return AI_CONFIG.apiKey && AI_CONFIG.apiKey.trim() !== '';
}

// Solicitar API key do usuário
function requestApiKey() {
    return new Promise((resolve) => {
        const apiKey = prompt(
            'Para usar o assistente de IA, você precisa de uma API key.\n\n' +
            'Opções:\n' +
            '1. OpenAI: https://platform.openai.com/api-keys\n' +
            '2. Ou use outro serviço de IA compatível\n\n' +
            'Cole sua API key aqui (será salva localmente):'
        );
        
        if (apiKey && apiKey.trim()) {
            saveApiKey(apiKey.trim());
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

// Fazer chamada à API de IA
async function callAIAPI(userMessage) {
    if (!isApiKeyConfigured()) {
        const configured = await requestApiKey();
        if (!configured) {
            return 'Por favor, configure sua API key para usar o assistente de IA.';
        }
    }

    // Adicionar mensagem do usuário ao histórico
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });

    try {
        const response = await fetch(AI_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: AI_CONFIG.model,
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 401) {
                localStorage.removeItem('cleaning_ai_api_key');
                AI_CONFIG.apiKey = '';
                return 'Erro de autenticação. Por favor, verifique sua API key e configure novamente.';
            }
            
            throw new Error(errorData.error?.message || `Erro na API: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Adicionar resposta da IA ao histórico
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });

        // Manter histórico limitado (últimas 10 mensagens + system prompt)
        if (conversationHistory.length > 11) {
            conversationHistory = [
                conversationHistory[0], // system prompt
                ...conversationHistory.slice(-10) // últimas 10 mensagens
            ];
        }

        return aiResponse;
    } catch (error) {
        console.error('Erro ao chamar API de IA:', error);
        return `Desculpe, ocorreu um erro ao processar sua mensagem. Erro: ${error.message}. Por favor, tente novamente.`;
    }
}

// Processar mensagem do usuário usando IA
async function processMessage(userMessage) {
    const message = userMessage.trim();
    
    if (!message) {
        return 'Por favor, digite uma mensagem.';
    }

    // Mostrar indicador de digitação
    showTypingIndicator();

    try {
        const response = await callAIAPI(message);
        hideTypingIndicator();
        return response;
    } catch (error) {
        hideTypingIndicator();
        return 'Desculpe, ocorreu um erro. Por favor, tente novamente.';
    }
}

// Adicionar mensagem ao chat
function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Suportar quebras de linha e formatação básica
    contentDiv.innerHTML = content.replace(/\n/g, '<br>');

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll para o final
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostrar indicador de digitação
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content typing-indicator';
    contentDiv.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(contentDiv);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Esconder indicador de digitação
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Inicializar chat
function initChat() {
    // Carregar API key se disponível
    loadApiKey();

    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            chatInput.disabled = true;
            sendButton.disabled = true;

            try {
                const response = await processMessage(message);
                addMessage(response, false);
            } catch (error) {
                addMessage('Desculpe, ocorreu um erro. Por favor, tente novamente.', false);
            } finally {
                chatInput.disabled = false;
                sendButton.disabled = false;
                chatInput.focus();
            }
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Mensagem inicial se não houver API key
    if (!isApiKeyConfigured()) {
        setTimeout(() => {
            addMessage(
                'Olá! Sou seu assistente de limpeza inteligente. ' +
                'Para começar, você precisará configurar uma API key de IA. ' +
                'Quando fizer sua primeira pergunta, será solicitada a configuração.',
                false
            );
        }, 1000);
    }
}

// Função para configurar API key manualmente (pode ser chamada externamente)
function configureApiKey(key) {
    if (key && key.trim()) {
        saveApiKey(key.trim());
        return true;
    }
    return false;
}

// Exportar para uso global
window.initChat = initChat;
window.configureApiKey = configureApiKey;
window.AI_CONFIG = AI_CONFIG;
