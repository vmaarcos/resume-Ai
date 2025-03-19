
/**
 * Verifica se a URL é um link válido do YouTube
 */
export function isValidYoutubeUrl(url: string): boolean {
  // Regex para validar URLs do YouTube
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 */
export function extractVideoId(url: string): string | null {
  // Tenta extrair o ID do vídeo de diferentes formatos de URL do YouTube
  let match;
  
  // Formato youtu.be/ID
  if (url.includes('youtu.be/')) {
    match = url.match(/youtu\.be\/([^?&]+)/);
    if (match && match[1]) return match[1];
  }
  
  // Formato youtube.com/watch?v=ID
  match = url.match(/[?&]v=([^?&]+)/);
  if (match && match[1]) return match[1];
  
  // Formato youtube.com/embed/ID
  match = url.match(/embed\/([^/?&]+)/);
  if (match && match[1]) return match[1];
  
  return null;
}

/**
 * Obtém informações do vídeo do YouTube usando a API pública do oEmbed
 */
export async function getVideoInfo(videoId: string): Promise<{title: string} | null> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) {
      throw new Error('Falha ao obter informações do vídeo');
    }
    
    const data = await response.json();
    return {
      title: data.title || 'Vídeo do YouTube'
    };
  } catch (error) {
    console.error('Erro ao buscar informações do vídeo:', error);
    return null;
  }
}
