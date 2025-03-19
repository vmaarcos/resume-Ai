
// Simulação de API para o protótipo inicial
// Em uma versão real, isso seria substituído por chamadas a APIs reais

/**
 * Simula a transcrição de um vídeo do YouTube
 */
export async function transcribeVideo(videoId: string): Promise<string> {
  console.log(`Simulando transcrição do vídeo: ${videoId}`);
  
  // Em uma aplicação real, você usaria uma API como a Google Cloud Speech-to-Text
  // ou outras APIs de transcrição de vídeo
  
  // Simula o tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Retorna uma transcrição simulada baseada no ID do vídeo
  // Em um ambiente real, isso seria o texto transcrito do vídeo
  return mockTranscriptions[videoId] || defaultTranscription;
}

/**
 * Simula o resumo de um texto utilizando IA
 */
export async function summarizeText(text: string): Promise<string> {
  console.log('Simulando resumo do texto...');
  
  // Em uma aplicação real, você usaria um modelo de IA como GPT ou
  // uma biblioteca como Hugging Face Transformers
  
  // Simula o tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Simulação simples de resumo - em uma implementação real, 
  // isso seria processado por um modelo de IA
  const words = text.split(' ');
  const summaryLength = Math.max(Math.floor(words.length * 0.3), 50);
  
  // Implementação de simulação - cria um "resumo" encurtando o texto
  // e adicionando alguns marcadores comuns de resumo
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
