// Configuração da API de IA GRATUITA
const AI_CONFIG = {
    // Usando Hugging Face Inference API (GRATUITA, sem necessidade de API key)
    provider: 'huggingface', // 'huggingface' (gratuita) ou 'openai', 'groq', 'gemini'
    apiKey: '', // Opcional para Hugging Face (não necessário)
    useLocalStorage: true,
    
    // Configurações por provedor
    providers: {
        huggingface: {
            // Modelo gratuito - não requer API key (mas funciona melhor com uma)
            // Para melhor qualidade, obtenha API key gratuita em: https://huggingface.co/settings/tokens
            model: 'microsoft/DialoGPT-large',
            endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
            requiresKey: false, // Funciona sem key, mas pode ter rate limits
            keyUrl: 'https://huggingface.co/settings/tokens'
        },
        groq: {
            // Groq API - tem tier gratuito generoso
            model: 'llama-3.1-8b-instant',
            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
            requiresKey: true,
            keyUrl: 'https://console.groq.com/keys'
        },
        gemini: {
            // Google Gemini - tem tier gratuito
            model: 'gemini-pro',
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            requiresKey: true,
            keyUrl: 'https://makersuite.google.com/app/apikey'
        },
        openai: {
            model: 'gpt-3.5-turbo',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            requiresKey: true,
            keyUrl: 'https://platform.openai.com/api-keys'
        }
    }
};

// Obter configuração do provedor atual
function getCurrentProviderConfig() {
    return AI_CONFIG.providers[AI_CONFIG.provider] || AI_CONFIG.providers.huggingface;
}

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

// Carregar configurações do localStorage
function loadConfig() {
    if (!AI_CONFIG.useLocalStorage) return;
    
    const savedProvider = localStorage.getItem('cleaning_ai_provider');
    const savedKey = localStorage.getItem('cleaning_ai_api_key');
    
    // Só usar provider salvo se for válido, senão usar huggingface (gratuito)
    if (savedProvider && AI_CONFIG.providers[savedProvider]) {
        AI_CONFIG.provider = savedProvider;
    } else {
        // Garantir que huggingface seja o padrão
        AI_CONFIG.provider = 'huggingface';
        localStorage.setItem('cleaning_ai_provider', 'huggingface');
    }
    
    // Só carregar API key se o provider atual requerer
    const currentConfig = getCurrentProviderConfig();
    if (savedKey && currentConfig.requiresKey) {
        AI_CONFIG.apiKey = savedKey;
    } else if (!currentConfig.requiresKey) {
        // Limpar API key se não for necessária
        AI_CONFIG.apiKey = '';
    }
}

// Salvar configurações no localStorage
function saveConfig() {
    if (AI_CONFIG.useLocalStorage) {
        localStorage.setItem('cleaning_ai_provider', AI_CONFIG.provider);
        if (AI_CONFIG.apiKey) {
            localStorage.setItem('cleaning_ai_api_key', AI_CONFIG.apiKey);
        }
    }
}

// Verificar se precisa de API key
function needsApiKey() {
    // Hugging Face nunca precisa de API key
    if (AI_CONFIG.provider === 'huggingface') {
        return false;
    }
    
    const providerConfig = getCurrentProviderConfig();
    // Outros provedores só precisam se requiresKey for true E não tiver key
    return providerConfig.requiresKey && (!AI_CONFIG.apiKey || AI_CONFIG.apiKey.trim() === '');
}

// Solicitar API key do usuário
function requestApiKey() {
    return new Promise((resolve) => {
        const providerConfig = getCurrentProviderConfig();
        const providerName = AI_CONFIG.provider.toUpperCase();
        const keyUrl = providerConfig.keyUrl || '';
        
        const message = `Para usar ${providerName}, você precisa de uma API key.\n\n` +
            (keyUrl ? `Obtenha sua chave em: ${keyUrl}\n\n` : '') +
            'Cole sua API key aqui (será salva localmente):';
        
        const apiKey = prompt(message);
        
        if (apiKey && apiKey.trim()) {
            AI_CONFIG.apiKey = apiKey.trim();
            saveConfig();
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

// Chamar Hugging Face API (GRATUITA)
async function callHuggingFaceAPI(userMessage) {
    const providerConfig = getCurrentProviderConfig();
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Adicionar Authorization header apenas se tiver API key
    if (AI_CONFIG.apiKey) {
        headers['Authorization'] = `Bearer ${AI_CONFIG.apiKey}`;
    }
    
    // Construir prompt com contexto
    let fullPrompt = SYSTEM_PROMPT + '\n\nConversa:\n';
    conversationHistory.slice(1).forEach(msg => {
        if (msg.role === 'user') {
            fullPrompt += `Usuário: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
            fullPrompt += `Assistente: ${msg.content}\n`;
        }
    });
    fullPrompt += `Usuário: ${userMessage}\nAssistente:`;
    
    try {
        const response = await fetch(providerConfig.endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                inputs: fullPrompt,
                parameters: {
                    max_new_tokens: 300,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            if (response.status === 503) {
                // Modelo carregando, tentar novamente
                await new Promise(resolve => setTimeout(resolve, 5000));
                return callHuggingFaceAPI(userMessage);
            }
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        let aiResponse;
        
        // Diferentes formatos de resposta da Hugging Face API
        if (Array.isArray(data) && data[0]?.generated_text) {
            aiResponse = data[0].generated_text.trim();
        } else if (data.generated_text) {
            aiResponse = data.generated_text.trim();
        } else if (data[0]?.generated_text) {
            aiResponse = data[0].generated_text.trim();
        } else if (typeof data === 'string') {
            aiResponse = data.trim();
        } else {
            console.error('Formato de resposta inesperado:', data);
            throw new Error('Resposta inesperada da API');
        }
        
        // Limpar resposta (remover prompt se incluído)
        if (aiResponse.includes('Assistente:')) {
            aiResponse = aiResponse.split('Assistente:').pop().trim();
        }
        if (aiResponse.includes('Usuário:')) {
            // Pegar apenas a última parte após o último "Usuário:"
            const parts = aiResponse.split('Usuário:');
            aiResponse = parts[parts.length - 1].split('Assistente:').pop() || parts[parts.length - 1];
            aiResponse = aiResponse.trim();
        }
        
        return aiResponse || 'Desculpe, não consegui gerar uma resposta. Tente novamente.';
    } catch (error) {
        console.error('Erro ao chamar Hugging Face API:', error);
        throw error;
    }
}

// Chamar API compatível com OpenAI (Groq, OpenAI, etc.)
async function callOpenAICompatibleAPI(userMessage) {
    const providerConfig = getCurrentProviderConfig();
    
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });

    try {
        const response = await fetch(providerConfig.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: providerConfig.model,
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
                throw new Error('Erro de autenticação. Verifique sua API key.');
            }
            
            throw new Error(errorData.error?.message || `Erro na API: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });

        // Manter histórico limitado
        if (conversationHistory.length > 11) {
            conversationHistory = [
                conversationHistory[0],
                ...conversationHistory.slice(-10)
            ];
        }

        return aiResponse;
    } catch (error) {
        console.error('Erro ao chamar API:', error);
        throw error;
    }
}

// Chamar Google Gemini API
async function callGeminiAPI(userMessage) {
    const providerConfig = getCurrentProviderConfig();
    
    // Construir contexto da conversa
    const conversationText = conversationHistory.slice(1).map(msg => {
        return `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`;
    }).join('\n');
    
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${conversationText}\nUsuário: ${userMessage}\nAssistente:`;

    try {
        const response = await fetch(`${providerConfig.endpoint}?key=${AI_CONFIG.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Erro na API: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: aiResponse }
        );

        // Manter histórico limitado
        if (conversationHistory.length > 11) {
            conversationHistory = [
                conversationHistory[0],
                ...conversationHistory.slice(-10)
            ];
        }

        return aiResponse;
    } catch (error) {
        console.error('Erro ao chamar Gemini API:', error);
        throw error;
    }
}

// Fazer chamada à API de IA
async function callAIAPI(userMessage) {
    if (needsApiKey()) {
        const configured = await requestApiKey();
        if (!configured) {
            return 'Por favor, configure sua API key para usar o assistente de IA.';
        }
    }

    try {
        let response;
        
        switch (AI_CONFIG.provider) {
            case 'huggingface':
                response = await callHuggingFaceAPI(userMessage);
                break;
            case 'gemini':
                response = await callGeminiAPI(userMessage);
                break;
            case 'groq':
            case 'openai':
                response = await callOpenAICompatibleAPI(userMessage);
                break;
            default:
                response = await callHuggingFaceAPI(userMessage);
        }
        
        return response;
    } catch (error) {
        console.error('Erro ao chamar API de IA:', error);
        return `Desculpe, ocorreu um erro: ${error.message}. Por favor, tente novamente.`;
    }
}

// Processar mensagem do usuário usando IA
async function processMessage(userMessage) {
    const message = userMessage.trim();
    
    if (!message) {
        return 'Por favor, digite uma mensagem.';
    }

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
    contentDiv.innerHTML = content.replace(/\n/g, '<br>');

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
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

// Resetar para configuração gratuita padrão
function resetToFreeProvider() {
    AI_CONFIG.provider = 'huggingface';
    AI_CONFIG.apiKey = '';
    if (AI_CONFIG.useLocalStorage) {
        localStorage.setItem('cleaning_ai_provider', 'huggingface');
        localStorage.removeItem('cleaning_ai_api_key');
    }
}

// Inicializar chat
function initChat() {
    // Garantir que sempre comece com Hugging Face (gratuito)
    if (!AI_CONFIG.provider || AI_CONFIG.provider === '') {
        AI_CONFIG.provider = 'huggingface';
    }
    
    loadConfig();
    
    // Garantir novamente após carregar (caso tenha algo inválido salvo)
    if (!AI_CONFIG.providers[AI_CONFIG.provider]) {
        resetToFreeProvider();
    }

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

    // Mensagem inicial
    setTimeout(() => {
        const providerConfig = getCurrentProviderConfig();
        const providerName = AI_CONFIG.provider === 'huggingface' ? 'Hugging Face (GRATUITA)' : AI_CONFIG.provider.toUpperCase();
        addMessage(
            `Olá! Sou seu assistente de limpeza inteligente usando ${providerName}. ` +
            'Posso ajudar com informações detalhadas sobre serviços de limpeza, técnicas profissionais e muito mais. ' +
            'Faça qualquer pergunta sobre limpeza!',
            false
        );
    }, 1000);
}

// Função para configurar provedor e API key
function configureAIProvider(provider, apiKey = '') {
    if (AI_CONFIG.providers[provider]) {
        AI_CONFIG.provider = provider;
        if (apiKey) {
            AI_CONFIG.apiKey = apiKey.trim();
        }
        saveConfig();
        return true;
    }
    return false;
}

// Exportar para uso global
window.initChat = initChat;
window.configureAIProvider = configureAIProvider;
window.resetToFreeProvider = resetToFreeProvider;
window.AI_CONFIG = AI_CONFIG;
