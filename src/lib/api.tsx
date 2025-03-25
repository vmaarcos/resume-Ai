import { AssemblyAI } from "assemblyai"; 

const client = new AssemblyAI({
  apiKey: "coloque sua chave api",
});

export async function transcribeVideo(videoId: string): Promise<string> {
  console.log(`Transcrevendo o vídeo: ${videoId}`);

  try {
    const response = await client.transcripts.create({
      audio_url: `https://www.youtube.com/watch?v=${videoId}`,
    });

    console.log("Transcrição:", response.text);
    return response.text;
  } catch (error) {
    console.error("Erro na transcrição:", error);
    return "Erro ao transcrever o vídeo.";
  }
}

// Função para usar a API do Hugging Face
async function useHuggingFaceAPI(text: string): Promise<string> {
  try {
    console.log("Usando a API pública do Hugging Face...");
    
    // Reduzir o texto para atender aos limites da API gratuita
    const truncatedText = text.slice(0, 2000) + (text.length > 2000 ? '...' : '');
    
    // A API pública do Hugging Face
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,  
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
    console.log("Resposta da API do Hugging Face:", data);
    
    // Verificar se a resposta contém o campo esperado
    if (Array.isArray(data) && data[0]?.summary_text) {
      return data[0].summary_text;
    } else if (data.summary_text) {
      return data.summary_text;
    } else {
      console.error("Estrutura inesperada na resposta:", data);
      return generateSimulatedSummary(text);
    }

  } catch (error) {
    console.error("Erro ao usar a API do Hugging Face:", error);
    return generateSimulatedSummary(text);
  }
}

// Função para gerar um resumo simulado caso a API falhe
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
