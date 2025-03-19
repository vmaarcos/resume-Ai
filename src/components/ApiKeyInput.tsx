
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ApiKeyInput = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiType, setApiType] = useState('huggingface');

  useEffect(() => {
    // Verifica qual API está configurada no localStorage
    const savedApiType = localStorage.getItem('api_type');
    if (savedApiType) {
      setApiType(savedApiType);
    }
    
    // Verifica se a chave OpenAI já existe no localStorage
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setIsKeySet(true);
      setOpenaiKey('************');
    }
  }, []);

  const handleSaveKey = () => {
    // Salva o tipo de API selecionado
    localStorage.setItem('api_type', apiType);
    
    // Se a API for OpenAI, salvamos a chave
    if (apiType === 'openai' && openaiKey.trim()) {
      localStorage.setItem('openai_api_key', openaiKey.trim());
      setIsKeySet(true);
    } else if (apiType === 'huggingface') {
      // Para Hugging Face, removemos qualquer chave OpenAI salva
      localStorage.removeItem('openai_api_key');
      setIsKeySet(false);
      setOpenaiKey('');
    }
    
    setIsDialogOpen(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key');
    setOpenaiKey('');
    setIsKeySet(false);
  };

  const getApiStatusText = () => {
    if (apiType === 'huggingface') {
      return 'API Gratuita (Hugging Face) ✓';
    } else if (apiType === 'openai' && isKeySet) {
      return 'API OpenAI Configurada ✓';
    } else {
      return 'Configurar API para Resumo';
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={
              apiType === 'huggingface' 
                ? "bg-green-50 text-green-600 hover:bg-green-100" 
                : isKeySet 
                  ? "bg-green-50 text-green-600 hover:bg-green-100" 
                  : ""
            }
          >
            {getApiStatusText()}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar API para Resumo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Escolha a API para geração de resumos</Label>
              <RadioGroup value={apiType} onValueChange={setApiType} className="gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="huggingface" id="huggingface" />
                  <Label htmlFor="huggingface" className="cursor-pointer">
                    <span className="font-medium">Hugging Face (Gratuita)</span>
                    <p className="text-xs text-muted-foreground">
                      API pública, com limites de uso mas sem necessidade de cadastro
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="cursor-pointer">
                    <span className="font-medium">OpenAI (Paga)</span>
                    <p className="text-xs text-muted-foreground">
                      Melhor qualidade, mas requer uma chave de API válida
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {apiType === 'openai' && (
              <div className="space-y-2">
                <Label htmlFor="openai-key">Chave da API OpenAI</Label>
                <Input
                  id="openai-key"
                  placeholder="sk-..."
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Sua chave será armazenada apenas no localStorage do seu navegador e não será enviada para nossos servidores.
                </p>
              </div>
            )}
            
            {apiType === 'openai' && !isKeySet && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Nota importante</p>
                  <p>Para usar a API da OpenAI, você precisa de uma chave válida. Você pode obter uma em https://platform.openai.com</p>
                </div>
              </div>
            )}
            
            {apiType === 'huggingface' && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">API Gratuita</p>
                  <p>A API do Hugging Face tem um nível gratuito com limites de uso. Pode ser mais lenta que a OpenAI, mas funciona sem custo.</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              {apiType === 'openai' && isKeySet ? (
                <Button variant="destructive" onClick={handleClearKey}>
                  Remover Chave
                </Button>
              ) : (
                <Button onClick={handleSaveKey}>
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {apiType === 'openai' && !isKeySet && (
        <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
          Com a OpenAI sem chave configurada, o aplicativo tentará usar a API gratuita do Hugging Face como alternativa.
        </p>
      )}
    </div>
  );
};

export default ApiKeyInput;
