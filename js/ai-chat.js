// Configuração da API de IA GRATUITA
const AI_CONFIG = {
    // Usando Groq - GRATUITO e muito rápido!
    // A API key será carregada do localStorage ou solicitada ao usuário
    provider: 'groq',
    apiKey: '', // Será configurada via localStorage
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
            // Groq API - GRATUITO, rápido e funciona perfeitamente!
            // Obtenha sua API key gratuita em: https://console.groq.com/keys
            // É rápido: apenas crie conta, gere a key e cole aqui
            model: 'llama-3.1-8b-instant',
            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
            requiresKey: true,
            keyUrl: 'https://console.groq.com/keys',
            description: 'Groq - GRATUITO e muito rápido! Recomendado.'
        },
        gemini: {
            // Google Gemini - GRATUITO e funciona bem
            // Obtenha sua API key gratuita em: https://makersuite.google.com/app/apikey
            model: 'gemini-pro',
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            requiresKey: true,
            keyUrl: 'https://makersuite.google.com/app/apikey',
            description: 'Google Gemini - GRATUITO'
        },
        openai: {
            model: 'gpt-3.5-turbo',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            requiresKey: true,
            keyUrl: 'https://platform.openai.com/api-keys'
        },
        deepseek: {
            // DeepSeek - GRATUITO e poderoso!
            // Obtenha sua API key gratuita em: https://platform.deepseek.com/api_keys
            model: 'deepseek-chat',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            requiresKey: true,
            keyUrl: 'https://platform.deepseek.com/api_keys',
            description: 'DeepSeek - GRATUITO e muito inteligente!'
        },
        kimi: {
            // Kimi 2 (Moonshot AI) - GRATUITO
            // Obtenha sua API key gratuita em: https://platform.moonshot.cn/console/api-keys
            model: 'moonshot-v1-8k',
            endpoint: 'https://api.moonshot.cn/v1/chat/completions',
            requiresKey: true,
            keyUrl: 'https://platform.moonshot.cn/console/api-keys',
            description: 'Kimi 2 (Moonshot) - GRATUITO'
        }
    }
};

// Obter configuração do provedor atual
function getCurrentProviderConfig() {
    return AI_CONFIG.providers[currentProvider] || AI_CONFIG.providers.huggingface;
}

// Contexto do sistema para o assistente de limpeza
const SYSTEM_PROMPT = `Você é um assistente de limpeza profissional. Responda de forma CURTA e DIRETA (máximo 2-3 frases).

PREÇOS:
- Colchão: R$ 150+
- Sofá: R$ 120+
- Carro: R$ 80+
- Residencial: R$ 200+
- Comercial: sob consulta
- Tapetes: R$ 100+

Horário: Seg-Sáb 8h-18h

REGRAS:
- Respostas CURTAS (máximo 2-3 frases)
- Seja direto e objetivo
- Português brasileiro
- Só dê detalhes se perguntarem especificamente`;

// Histórico de conversa
let conversationHistory = [
    {
        role: 'system',
        content: SYSTEM_PROMPT
    }
];

// Variáveis mutáveis para configuração (evita problemas com const)
let currentProvider = 'groq';
let currentApiKey = '';

// Carregar configurações do localStorage
function loadConfig() {
    // Usar Groq como padrão
    currentProvider = 'groq';
    currentApiKey = '';
    
    // Tentar carregar API key do localStorage
    try {
        const savedKey = localStorage.getItem('cleaning_ai_api_key');
        const savedProvider = localStorage.getItem('cleaning_ai_provider');
        
        if (savedKey) {
            currentApiKey = savedKey;
        }
        if (savedProvider && AI_CONFIG.providers[savedProvider]) {
            currentProvider = savedProvider;
        }
    } catch (e) {
        console.warn('Erro ao carregar do localStorage:', e);
    }
    
    console.log('Configurado:', currentProvider, currentApiKey ? 'com API key' : 'SEM API key');
}

// Salvar configurações no localStorage
function saveConfig() {
    if (AI_CONFIG.useLocalStorage) {
        localStorage.setItem('cleaning_ai_provider', currentProvider);
        if (currentApiKey) {
            localStorage.setItem('cleaning_ai_api_key', currentApiKey);
        }
    }
}

// Verificar se precisa de API key
function needsApiKey() {
    const providerConfig = getCurrentProviderConfig();
    // Verificar se o provider requer key E não tem key configurada
    return providerConfig.requiresKey && (!currentApiKey || currentApiKey.trim() === '');
}

// Solicitar API key do usuário
function requestApiKey() {
    return new Promise((resolve) => {
        const providerConfig = getCurrentProviderConfig();
        const providerName = currentProvider.toUpperCase();
        const keyUrl = providerConfig.keyUrl || '';
        const description = providerConfig.description || '';
        
        const message = `🤖 ${providerName} - ${description || 'API de IA'}\n\n` +
            `Para usar o assistente de IA, você precisa de uma API key GRATUITA.\n\n` +
            `É rápido e fácil:\n` +
            `1. Acesse: ${keyUrl}\n` +
            `2. Crie uma conta (gratuito)\n` +
            `3. Gere uma API key\n` +
            `4. Cole aqui abaixo\n\n` +
            `Cole sua API key aqui (será salva apenas no seu navegador):`;
        
        const apiKey = prompt(message);
        
        if (apiKey && apiKey.trim()) {
            currentApiKey = apiKey.trim();
            saveConfig();
            resolve(true);
        } else {
            // Se cancelar, oferecer usar fallback temporariamente
            const useFallback = confirm('Sem API key, usarei respostas pré-programadas (limitadas).\n\nDeseja continuar assim ou prefere configurar a API key agora?');
            if (useFallback) {
                resolve(false); // Continuar com fallback
            } else {
                resolve(requestApiKey()); // Tentar novamente
            }
        }
    });
}

// Gerar resposta inteligente de fallback quando API falhar
function generateFallbackResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Respostas para saudações
    if (message.match(/^(oi|olá|ola|bom dia|boa tarde|boa noite|hello|hi|e aí|eai)/)) {
        return 'Olá! Como posso ajudá-lo hoje? Posso fornecer informações sobre nossos serviços de limpeza profissional, incluindo limpeza de colchão, sofá, carro, residencial, comercial e tapetes. O que você gostaria de saber?';
    }
    
    // Respostas sobre serviços
    if (message.match(/(colchão|colchao|cama)/)) {
        return 'Nossa limpeza de colchão remove ácaros, bactérias e manchas profundas. O serviço inclui aspiração profunda, tratamento com produtos específicos, desinfecção e secagem completa. Preço a partir de R$ 150, duração de 2-3 horas, recomendado a cada 6 meses.';
    }
    
    if (message.match(/(sofá|sofa|estofado)/)) {
        return 'Oferecemos limpeza profissional de sofás e estofados com técnicas adequadas para cada tipo de tecido. Processo: aspiração, limpeza a seco ou úmido conforme necessário, tratamento de manchas e desinfecção. Preço a partir de R$ 120, duração 2-4 horas.';
    }
    
    if (message.match(/(carro|automóvel|automovel|veículo|veiculo|lavagem)/)) {
        return 'Lavagem completa e detalhamento automotivo incluindo lavagem externa, aspiração interna, limpeza de estofados, vidros e acabamento. Preço a partir de R$ 80, duração 1-2 horas, recomendado mensalmente.';
    }
    
    if (message.match(/(casa|residência|residencia|apartamento)/)) {
        return 'Limpeza completa de residências incluindo todos os cômodos, banheiros, cozinha, aspiração e organização. Preço a partir de R$ 200, duração 4-6 horas. Oferecemos serviços semanais, quinzenais ou mensais.';
    }
    
    if (message.match(/(preço|preco|valor|custo|quanto)/)) {
        return 'Nossos preços variam conforme o serviço:\n• Limpeza de carro: a partir de R$ 80\n• Limpeza de sofá: a partir de R$ 120\n• Limpeza de colchão: a partir de R$ 150\n• Limpeza residencial: a partir de R$ 200\n• Limpeza comercial: sob consulta\n\nQual serviço você precisa?';
    }
    
    if (message.match(/(agendar|agendamento|marcar|horário|horario)/)) {
        return 'Para agendar um serviço, você pode usar nossa seção de agendamento na página ou me informar a data e horário desejados. Trabalhamos de segunda a sábado, das 8h às 18h. Domingos mediante agendamento prévio.';
    }
    
    // Resposta genérica
    return 'Entendo sua pergunta. Posso ajudar com informações sobre nossos serviços de limpeza (colchão, sofá, carro, casa, escritório, tapetes), agendamentos e preços. O que você gostaria de saber especificamente?';
}

// Chamar Hugging Face API (GRATUITA)
async function callHuggingFaceAPI(userMessage) {
    const providerConfig = getCurrentProviderConfig();
    
    // Construir headers condicionalmente
    const headers = {
        'Content-Type': 'application/json',
        ...(currentApiKey && { 'Authorization': `Bearer ${currentApiKey}` })
    };
    
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
            const errorText = await response.text();
            console.warn('API retornou erro:', response.status, errorText);
            
            // Usar fallback para qualquer erro da API
            const fallbackResponse = generateFallbackResponse(userMessage);
            
            // Adicionar ao histórico
            conversationHistory.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: fallbackResponse }
            );
            
            // Manter histórico limitado
            if (conversationHistory.length > 11) {
                conversationHistory = [
                    conversationHistory[0],
                    ...conversationHistory.slice(-10)
                ];
            }
            
            return fallbackResponse;
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
            console.warn('Formato de resposta inesperado, usando fallback:', data);
            return generateFallbackResponse(userMessage);
        }
        
        // Limpar resposta (remover prompt se incluído)
        if (aiResponse.includes('Assistente:')) {
            aiResponse = aiResponse.split('Assistente:').pop().trim();
        }
        if (aiResponse.includes('Usuário:')) {
            const parts = aiResponse.split('Usuário:');
            aiResponse = parts[parts.length - 1].split('Assistente:').pop() || parts[parts.length - 1];
            aiResponse = aiResponse.trim();
        }
        
        // Se a resposta estiver vazia ou muito curta, usar fallback
        if (!aiResponse || aiResponse.length < 10) {
            aiResponse = generateFallbackResponse(userMessage);
        }
        
        // Adicionar ao histórico
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
        console.warn('Erro ao chamar Hugging Face API (usando fallback):', error.message);
        // Sempre retornar resposta de fallback em caso de erro (incluindo Failed to fetch)
        const fallbackResponse = generateFallbackResponse(userMessage);
        
        // Adicionar ao histórico mesmo em caso de erro
        conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: fallbackResponse }
        );
        
        // Manter histórico limitado
        if (conversationHistory.length > 11) {
            conversationHistory = [
                conversationHistory[0],
                ...conversationHistory.slice(-10)
            ];
        }
        
        return fallbackResponse;
    }
}

// Chamar API compatível com OpenAI (Groq, OpenAI, DeepSeek, etc.)
// Usa proxy CORS para contornar bloqueio do navegador
async function callOpenAICompatibleAPI(userMessage) {
    const providerConfig = getCurrentProviderConfig();
    
    // Proxy CORS para contornar bloqueio do navegador
    const CORS_PROXY = 'https://corsproxy.io/?';
    
    console.log('Chamando API:', currentProvider, providerConfig.endpoint);
    console.log('Usando API key:', currentApiKey ? 'Sim (' + currentApiKey.substring(0, 10) + '...)' : 'Não');
    
    // Preparar mensagens para a API
    const messagesToSend = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
    ];

    const requestBody = {
        model: providerConfig.model,
        messages: messagesToSend,
        temperature: 0.7,
        max_tokens: 150
    };

    try {
        // Usar proxy CORS
        const targetUrl = CORS_PROXY + encodeURIComponent(providerConfig.endpoint);
        console.log('Chamando via proxy:', targetUrl);
        
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentApiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        const aiResponse = data.choices[0].message.content;
        
        // Adicionar ao histórico após sucesso
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
        console.warn('Erro ao chamar API (usando fallback):', error.message || error);
        // Em caso de erro, usar fallback
        const fallbackResponse = generateFallbackResponse(userMessage);
        
        // Adicionar ao histórico
        conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: fallbackResponse }
        );
        
        // Manter histórico limitado
        if (conversationHistory.length > 11) {
            conversationHistory = [
                conversationHistory[0],
                ...conversationHistory.slice(-10)
            ];
        }
        
        return fallbackResponse;
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
        const response = await fetch(`${providerConfig.endpoint}?key=${currentApiKey}`, {
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
        console.warn('Erro ao chamar Gemini API (usando fallback):', error.message || error);
        // Em caso de erro, usar fallback
        const fallbackResponse = generateFallbackResponse(userMessage);
        
        // Adicionar ao histórico
        conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: fallbackResponse }
        );
        
        // Manter histórico limitado
        if (conversationHistory.length > 11) {
            conversationHistory = [
                conversationHistory[0],
                ...conversationHistory.slice(-10)
            ];
        }
        
        return fallbackResponse;
    }
}

// Fazer chamada à API de IA
async function callAIAPI(userMessage) {
    if (needsApiKey()) {
        const configured = await requestApiKey();
        if (!configured) {
            // Se não configurou, usar fallback mas avisar
            const fallbackResponse = generateFallbackResponse(userMessage);
            return fallbackResponse + '\n\n💡 Dica: Configure uma API key GRATUITA para respostas mais inteligentes e personalizadas!';
        }
    }

    try {
        let response;
        
        switch (currentProvider) {
            case 'huggingface':
                response = await callHuggingFaceAPI(userMessage);
                break;
            case 'gemini':
                response = await callGeminiAPI(userMessage);
                break;
            case 'groq':
            case 'openai':
            case 'deepseek':
            case 'kimi':
                response = await callOpenAICompatibleAPI(userMessage);
                break;
            default:
                response = await callHuggingFaceAPI(userMessage);
        }
        
        // Garantir que sempre retornamos uma resposta válida
        if (!response || response.trim() === '') {
            const fallbackResponse = generateFallbackResponse(userMessage);
            // Adicionar ao histórico se ainda não foi adicionado
            if (conversationHistory[conversationHistory.length - 1]?.role !== 'assistant') {
                conversationHistory.push(
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: fallbackResponse }
                );
            }
            return fallbackResponse;
    }

    return response;
    } catch (error) {
        console.warn('Erro ao chamar API de IA (usando fallback):', error.message || error);
        // Usar resposta de fallback em caso de qualquer erro (incluindo Failed to fetch)
        // As funções individuais já devem ter retornado fallback, mas garantimos aqui também
        return generateFallbackResponse(userMessage);
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
        
        // Garantir que sempre temos uma resposta válida
        if (!response || response.trim() === '') {
            return generateFallbackResponse(message);
        }
        
        return response;
    } catch (error) {
        hideTypingIndicator();
        console.warn('Erro em processMessage (usando fallback):', error.message || error);
        // Sempre retornar resposta de fallback em caso de erro
        // Não mostrar mensagem de erro ao usuário, apenas usar fallback
        return generateFallbackResponse(message);
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
    currentProvider = 'groq';
    currentApiKey = '';
    if (AI_CONFIG.useLocalStorage) {
        localStorage.setItem('cleaning_ai_provider', 'groq');
        localStorage.removeItem('cleaning_ai_api_key');
    }
}

// Inicializar chat
function initChat() {
    // Carregar configuração salva
    loadConfig();
    
    // Se não tiver provider configurado, usar Groq (recomendado)
    if (!currentProvider || !AI_CONFIG.providers[currentProvider]) {
        currentProvider = 'groq';
        currentApiKey = '';
    }
    
    // Garantir que o provider está válido
    if (!AI_CONFIG.providers[currentProvider]) {
        currentProvider = 'groq';
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
                // processMessage sempre retorna uma resposta válida (fallback se necessário)
                addMessage(response, false);
            } catch (error) {
                // Fallback final caso algo inesperado aconteça
                console.warn('Erro inesperado, usando fallback:', error);
                const fallbackResponse = generateFallbackResponse(message);
                addMessage(fallbackResponse, false);
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
        let providerName = currentProvider.toUpperCase();
        if (currentProvider === 'groq') {
            providerName = 'Groq (GRATUITO e RÁPIDO)';
        } else if (currentProvider === 'gemini') {
            providerName = 'Google Gemini (GRATUITO)';
        } else if (currentProvider === 'deepseek') {
            providerName = 'DeepSeek (GRATUITO)';
        } else if (currentProvider === 'kimi') {
            providerName = 'Kimi 2 / Moonshot (GRATUITO)';
        }
        
        if (needsApiKey()) {
            const freeOptions = 'Opções GRATUITAS: Groq, DeepSeek, Kimi 2, Gemini';
            addMessage(
                `Olá! Sou seu assistente de limpeza inteligente.\n\n` +
                `⚙️ Configuração necessária: Para usar IA real, você precisa de uma API key GRATUITA.\n` +
                `📝 ${freeOptions}\n` +
                `🔗 Acesse: ${providerConfig.keyUrl}\n` +
                `✨ É rápido: Crie conta e gere sua key (gratuito!)\n\n` +
                `💬 Por enquanto, posso responder com informações básicas. Faça sua primeira pergunta e será solicitada a configuração!`,
                false
            );
        } else {
            addMessage(
                `Olá! Sou seu assistente de limpeza inteligente usando ${providerName}.\n\n` +
                'Posso ajudar com informações detalhadas sobre serviços de limpeza, técnicas profissionais e muito mais.\n\n' +
                'Faça qualquer pergunta sobre limpeza!',
                false
            );
        }
    }, 1000);
}

// Função para configurar provedor e API key
function configureAIProvider(provider, apiKey = '') {
    if (AI_CONFIG.providers[provider]) {
        currentProvider = provider;
        if (apiKey) {
            currentApiKey = apiKey.trim();
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