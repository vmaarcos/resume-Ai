import React, { useState, useEffect } from 'react';
import VideoInput from '@/components/VideoInput';
import VideoPreview from '@/components/VideoPreview';
import SummaryResult from '@/components/SummaryResult';
import LoadingState from '@/components/LoadingState';
import ApiKeyInput from '@/components/ApiKeyInput';
import { transcribeVideo, summarizeText } from '@/lib/api';
import { getVideoInfo } from '@/utils/youtube';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideoInfo = async () => {
      if (videoId) {
        const info = await getVideoInfo(videoId);
        if (info) {
          setVideoTitle(info.title);
        }
      }
    };

    fetchVideoInfo();
  }, [videoId]);

  const handleVideoSubmit = async (url: string, id: string) => {
    setVideoUrl(url);
    setVideoId(id);
    setSummary('');
    setIsLoading(true);

    try {
      const transcription = await transcribeVideo(id);
      
      const generatedSummary = await summarizeText(transcription);
      
      setSummary(generatedSummary);
      
      toast({
        title: "Resumo gerado com sucesso!",
        description: "O resumo do vídeo está pronto para visualização.",
      });
    } catch (error) {
      console.error('Erro ao processar o vídeo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar o vídeo",
        description: "Não foi possível gerar o resumo. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background px-4 py-16 md:px-0">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12 space-y-4 animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            AI Video QuickDigest
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transforme vídeos longos em resumos concisos usando inteligência artificial. 
            Obtenha os principais pontos de qualquer vídeo do YouTube em segundos.
          </p>
        </header>
        
        <main className="space-y-8">
          <ApiKeyInput />
          
          <VideoInput onSubmit={handleVideoSubmit} isLoading={isLoading} />
          
          {videoId && <VideoPreview videoId={videoId} />}
          
          {isLoading && <LoadingState />}
          
          {!isLoading && summary && (
            <SummaryResult summary={summary} videoTitle={videoTitle} />
          )}
        </main>
        
        <footer className="mt-20 text-center text-sm text-muted-foreground animate-fade-in">
          <p>Desenvolvido com tecnologia de ponta em processamento de linguagem natural e IA</p>
        </footer>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;
