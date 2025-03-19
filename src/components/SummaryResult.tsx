
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SummaryResultProps {
  summary: string;
  videoTitle?: string;
}

const SummaryResult: React.FC<SummaryResultProps> = ({ summary, videoTitle }) => {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    
    toast({
      title: "Copiado para a área de transferência",
      description: "O resumo foi copiado com sucesso",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-8 animate-slide-up">
      <div className="glass-card rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wider">Resultado</p>
          <h3 className="text-xl font-medium">
            {videoTitle ? `Resumo: ${videoTitle}` : 'Resumo do Vídeo'}
          </h3>
        </div>
        
        <div className="bg-background/50 rounded-lg p-4 border border-border">
          <p className="whitespace-pre-line text-foreground/90 leading-relaxed">{summary}</p>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="rounded-full h-10 px-4 flex items-center gap-2 transition-all duration-300"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copiar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;
