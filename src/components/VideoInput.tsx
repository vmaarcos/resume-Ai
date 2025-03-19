
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidYoutubeUrl, extractVideoId } from '@/utils/youtube';

interface VideoInputProps {
  onSubmit: (videoUrl: string, videoId: string) => void;
  isLoading: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onSubmit, isLoading }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl.trim()) {
      setError('Por favor, insira um URL do YouTube');
      return;
    }
    
    if (!isValidYoutubeUrl(videoUrl)) {
      setError('URL inválido. Insira um link válido do YouTube');
      return;
    }
    
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError('Não foi possível extrair o ID do vídeo');
      return;
    }
    
    setError('');
    onSubmit(videoUrl, videoId);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-slide-up">
      <div className="glass-card rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">Link do YouTube</p>
            <h2 className="text-2xl font-medium">Insira o link do vídeo para resumir</h2>
          </div>
          
          <div className="relative">
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                if (error) setError('');
              }}
              className={`h-12 px-4 rounded-lg bg-background/50 border ${error ? 'border-destructive' : 'border-input'} focus:border-primary focus:ring-1 focus:ring-primary`}
              disabled={isLoading}
            />
            {error && (
              <p className="text-destructive text-sm mt-1 animate-fade-in">{error}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Resumir Vídeo'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VideoInput;
