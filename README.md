# Limpeza Profissional - Site com Assistente de IA

Site de serviços de limpeza profissional com assistente de IA integrado.

## 🚀 Funcionalidades

- **Chat com IA**: Assistente inteligente para responder perguntas sobre serviços de limpeza
- **Agendamento**: Sistema de agendamento de serviços
- **Informações de Serviços**: Detalhes sobre todos os serviços oferecidos

## 🤖 Configuração do Assistente de IA (GRATUITA)

O chat utiliza uma API de IA gratuita para gerar respostas dinâmicas. **Por padrão, usa Hugging Face Inference API que é COMPLETAMENTE GRATUITA e não requer API key!**

### ✅ Opção 1: Hugging Face (GRATUITA - Padrão)

**Não requer configuração!** O sistema já está configurado para usar Hugging Face Inference API gratuitamente.

- ✅ Completamente gratuito
- ✅ Não precisa de API key
- ✅ Funciona imediatamente
- ✅ Sem limites de uso para uso pessoal

**O chat já funciona sem nenhuma configuração!**

### Opção 2: Groq API (GRATUITA - Mais Rápida)

Groq oferece um tier gratuito muito generoso e é extremamente rápido:

1. Acesse [Groq Console](https://console.groq.com/keys)
2. Crie uma conta gratuita
3. Gere uma API key
4. Configure via console do navegador (F12):

```javascript
configureAIProvider('groq', 'sua-api-key-aqui');
```

### Opção 3: Google Gemini (GRATUITA)

Google oferece tier gratuito generoso:

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma API key gratuita
3. Configure via console:

```javascript
configureAIProvider('gemini', 'sua-api-key-aqui');
```

### Opção 4: OpenAI (Paga)

Se preferir usar OpenAI (requer créditos):

1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Configure via console:

```javascript
configureAIProvider('openai', 'sua-api-key-aqui');
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

