
import React from 'react';

interface VideoPreviewProps {
  videoId: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoId }) => {
  if (!videoId) return null;

  return (
    <div className="w-full max-w-xl mx-auto mt-8 animate-slide-up">
      <div className="glass-card rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wider">Vídeo Selecionado</p>
          <h3 className="text-xl font-medium">Preview do Vídeo</h3>
        </div>
        
        <div className="relative overflow-hidden rounded-lg aspect-video w-full shadow-sm">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
