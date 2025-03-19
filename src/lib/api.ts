
/**
 * APIs para transcrição de vídeos e geração de resumos
 */

// Função para transcrever um vídeo do YouTube
export async function transcribeVideo(videoId: string): Promise<string> {
  console.log(`Transcrevendo o vídeo: ${videoId}`);
  
  try {
    // OPÇÃO 1: Usando a API do AssemblyAI (https://www.assemblyai.com/)
    // Você precisará criar uma conta e obter uma API key
    
    // Exemplo de chamada à API AssemblyAI
    // const response = await fetch('https://api.assemblyai.com/v2/transcript', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': process.env.ASSEMBLY_AI_KEY || 'SUA_API_KEY_AQUI'
    //   },
    //   body: JSON.stringify({
    //     audio_url: `https://www.youtube.com/watch?v=${videoId}`,
    //     language_code: 'pt'
    //   })
    // });
    // const data = await response.json();
    // return data.text;
    
    // OPÇÃO 2: Usando a API do YouTube Transcript (https://rapidapi.com/youtube-transcript-api)
    // Você precisará se inscrever na RapidAPI e obter uma API key
    
    // Exemplo de chamada à API YouTube Transcript
    // const response = await fetch(`https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}`, {
    //   method: 'GET',
    //   headers: {
    //     'X-RapidAPI-Host': 'youtube-transcriptor.p.rapidapi.com',
    //     'X-RapidAPI-Key': process.env.RAPID_API_KEY || 'SUA_API_KEY_AQUI'
    //   }
    // });
    // const data = await response.json();
    // return data.transcript.join(' ');
    
    // Verifica se temos uma transcrição simulada para este vídeo ID específico
    if (mockTranscriptions[videoId]) {
      return mockTranscriptions[videoId];
    }
    
    // Para IDs de vídeo desconhecidos, verificamos se devemos simular um erro
    // Simulamos erro em 10% das tentativas para testar o tratamento de erro
    if (Math.random() < 0.1) {
      throw new Error("Simulação de erro de transcrição para teste");
    }
    
    // Em outros casos, retornamos a transcrição simulada padrão
    return defaultTranscription;
    
  } catch (error) {
    console.error('Erro ao transcrever o vídeo:', error);
    
    // Para testes e demonstração, vamos retornar a transcrição padrão em caso de erro
    // Em um ambiente de produção real, você provavelmente desejaria lançar o erro
    // para que a interface possa mostrar uma mensagem apropriada
    
    // Opção 1: Lançar o erro (comportamento atual - mostra erro ao usuário)
    // throw new Error('Não foi possível transcrever o vídeo. Por favor, tente novamente.');
    
    // Opção 2: Degradação graciosa - usar transcrição padrão mesmo em erro
    console.log("Usando transcrição padrão devido a um erro...");
    return defaultTranscription;
  }
}

// Função para resumir um texto utilizando IA
export async function summarizeText(text: string): Promise<string> {
  console.log('Resumindo o texto...');
  
  try {
    // Verificar qual API usar com base na configuração do usuário
    const apiType = localStorage.getItem('api_type') || 'huggingface';
    
    // OPÇÃO 1: Usando a API OpenAI (https://api.openai.com)
    // Você precisará criar uma conta e obter uma API key
    // Armazene sua chave no localStorage para testes ou em variáveis de ambiente para produção
    if (apiType === 'openai') {
      // Obtém a chave da API do localStorage (só para testes locais)
      const openaiKey = localStorage.getItem('openai_api_key');
      
      // Se você tem uma chave da API OpenAI, usar a API real
      if (openaiKey) {
        try {
          console.log("Tentando usar a API da OpenAI com a chave fornecida...");
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: 'Você é um assistente especializado em resumir vídeos. Crie um resumo conciso e bem organizado do seguinte texto transcrito de um vídeo.'
                },
                {
                  role: 'user',
                  content: text
                }
              ],
              max_tokens: 500
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro na resposta da OpenAI:", errorData);
            throw new Error(`Erro na API da OpenAI: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
          }
          
          const data = await response.json();
          return data.choices[0].message.content;
        } catch (apiError) {
          console.error("Erro ao chamar a API da OpenAI:", apiError);
          // Se a API falhar, tentamos usar o Hugging Face como fallback
          console.log("Tentando usar Hugging Face como fallback...");
          return await useHuggingFaceAPI(text);
        }
      }
    }
    
    // OPÇÃO 2: Usando a API Hugging Face Inference (gratuita)
    if (apiType === 'huggingface' || apiType === 'free') {
      return await useHuggingFaceAPI(text);
    }
    
    // Se nenhuma API estiver configurada, gerar um resumo simulado
    return generateSimulatedSummary(text);
    
  } catch (error) {
    console.error('Erro ao resumir o texto:', error);
    
    // Para testes e demonstração, vamos retornar um resumo simulado em vez de lançar um erro
    console.log("Utilizando resumo simulado devido a um erro...");
    return generateSimulatedSummary(text);
  }
}

// Função para usar a API gratuita do Hugging Face
async function useHuggingFaceAPI(text: string): Promise<string> {
  try {
    console.log("Usando a API pública do Hugging Face...");
    
    // Reduzir o texto para atender aos limites da API gratuita
    const truncatedText = text.slice(0, 2000) + (text.length > 2000 ? '...' : '');
    
    // A API gratuita do Hugging Face
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: truncatedText,
        parameters: {
          max_length: 500,
          min_length: 100
        }
      })
    });
    
    if (!response.ok) {
      console.error("Erro na resposta do Hugging Face:", response.status);
      throw new Error(`Erro na API do Hugging Face: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Resumo gerado pelo Hugging Face:", data);
    
    return Array.isArray(data) ? data[0].summary_text : data.summary_text;
  } catch (error) {
    console.error("Erro ao usar a API do Hugging Face:", error);
    // Se a API falhar, usamos o resumo simulado
    return generateSimulatedSummary(text);
  }
}

// Função para gerar um resumo simulado
function generateSimulatedSummary(text: string): string {
  const words = text.split(' ');
  const summaryLength = Math.max(Math.floor(words.length * 0.3), 50);
  
  const summary = `
Principais pontos do vídeo:

• ${words.slice(0, 15).join(' ')}...
• ${words.slice(20, 35).join(' ')}...
• ${words.slice(40, 60).join(' ')}...

Em resumo, ${words.slice(0, summaryLength).join(' ')}...

Este vídeo é recomendado para pessoas interessadas em ${getRandomTopic()}.
  `;
  
  return summary.trim();
}

// Algumas transcrições simuladas para demonstração
const mockTranscriptions: {[key: string]: string} = {
  // Adicione alguns IDs de vídeos conhecidos e suas "transcrições"
  'dQw4w9WgXcQ': `Nunca vou te abandonar, nunca vou te decepcionar, nunca vou correr e te desertár. 
  Nunca vou te fazer chorar, nunca vou dizer adeus, nunca vou contar uma mentira e te machucar. 
  Nós nos conhecemos há tanto tempo, seu coração tem doído, mas você é tímido para dizer isso.
  Por dentro nós dois sabemos o que está acontecendo, nós conhecemos o jogo e vamos jogá-lo.
  E se você me perguntar como eu estou me sentindo, não me diga que você é cego demais para ver.`,
};

// Transcrição padrão para IDs de vídeo desconhecidos
const defaultTranscription = `Este é um exemplo de transcrição para demonstração do aplicativo. 
Em uma implementação real, esta seria a transcrição do áudio do vídeo do YouTube.
A transcrição incluiria todo o conteúdo falado no vídeo, permitindo que nosso modelo de IA 
possa analisar e criar um resumo conciso e informativo. Este processo envolve a conversão do 
áudio em texto e depois a análise desse texto para identificar os pontos principais e as 
informações mais relevantes. Em uma aplicação completa, poderíamos até mesmo separar diferentes 
seções do vídeo ou identificar diferentes assuntos discutidos ao longo do conteúdo. Isso tornaria 
o resumo ainda mais útil e informativo para os usuários que desejam obter rapidamente as 
principais ideias de um vídeo sem ter que assisti-lo por completo.`;

// Função auxiliar para gerar tópicos aleatórios para a simulação
function getRandomTopic(): string {
  const topics = [
    "tecnologia",
    "ciência",
    "desenvolvimento pessoal",
    "negócios",
    "educação",
    "entretenimento"
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}
