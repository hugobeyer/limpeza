# Limpeza Profissional - Site com Assistente de IA

Site de serviços de limpeza profissional com assistente de IA integrado.

## 🚀 Funcionalidades

- **Chat com IA**: Assistente inteligente para responder perguntas sobre serviços de limpeza
- **Agendamento**: Sistema de agendamento de serviços
- **Informações de Serviços**: Detalhes sobre todos os serviços oferecidos

## 🤖 Configuração do Assistente de IA

O chat utiliza uma API de IA para gerar respostas dinâmicas. Você precisa configurar uma API key.

### Opção 1: OpenAI (Recomendado)

1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crie uma conta ou faça login
3. Gere uma nova API key
4. Quando usar o chat pela primeira vez, cole a API key quando solicitado
5. A chave será salva localmente no navegador

### Opção 2: Configuração Manual via Console

Você também pode configurar a API key manualmente abrindo o console do navegador (F12) e executando:

```javascript
configureApiKey('sua-api-key-aqui');
```

### Opção 3: Usar Outra API de IA

Para usar outra API compatível com OpenAI (como Ollama, LocalAI, etc.), edite `js/ai-chat.js`:

```javascript
const AI_CONFIG = {
    apiEndpoint: 'https://sua-api.com/v1/chat/completions',
    model: 'seu-modelo',
    // ...
};
```

## 📁 Estrutura do Projeto

```
limpeza-site/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos
├── js/
│   ├── ai-chat.js     # Lógica do chat com IA
│   ├── main.js        # Inicialização
│   ├── schedule.js    # Sistema de agendamento
│   └── services.js    # Informações dos serviços
└── README.md          # Este arquivo
```

## 🔧 Como Usar

1. Abra `index.html` em um navegador
2. Na primeira mensagem do chat, configure sua API key quando solicitado
3. Comece a conversar com o assistente sobre serviços de limpeza!

## 💡 Recursos do Assistente

O assistente pode ajudar com:
- Informações sobre serviços de limpeza
- Dicas e técnicas de limpeza profissional
- Processos de limpeza detalhados
- Agendamentos e horários
- Preços e duração dos serviços

## 🔒 Segurança

- A API key é armazenada apenas localmente no navegador (localStorage)
- Nunca compartilhe sua API key publicamente
- Para produção, considere usar um backend para gerenciar a API key

## 📝 Notas

- O chat mantém histórico da conversa para contexto
- As respostas são geradas dinamicamente pela IA
- O sistema é configurado para português brasileiro

## 🌐 Deploy

Para fazer deploy, você pode usar:
- GitHub Pages
- Netlify
- Vercel
- Qualquer serviço de hospedagem estática

**Importante**: Para produção, considere criar um backend para gerenciar as chamadas à API de IA, evitando expor sua API key no frontend.

