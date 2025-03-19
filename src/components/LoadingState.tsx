
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto mt-8 animate-fade-in">
      <div className="glass-card rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <div className="w-32 h-4 bg-muted rounded animate-pulse-light"></div>
          <div className="w-64 h-6 bg-muted rounded animate-pulse-light"></div>
        </div>
        
        <div className="space-y-3">
          <div className="w-full h-4 bg-muted rounded animate-pulse-light"></div>
          <div className="w-full h-4 bg-muted rounded animate-pulse-light"></div>
          <div className="w-5/6 h-4 bg-muted rounded animate-pulse-light"></div>
          <div className="w-full h-4 bg-muted rounded animate-pulse-light"></div>
          <div className="w-4/6 h-4 bg-muted rounded animate-pulse-light"></div>
        </div>
        
        <div className="flex justify-center py-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-muted"></div>
            <div className="w-12 h-12 rounded-full border-4 border-t-primary animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground">
          Processando o vídeo e gerando o resumo. Isso pode levar alguns instantes...
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
