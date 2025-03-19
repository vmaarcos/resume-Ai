
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ApiKeyInput = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Verifica se a chave já existe no localStorage
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setIsKeySet(true);
      setOpenaiKey('************');
    }
  }, []);

  const handleSaveKey = () => {
    if (openaiKey.trim()) {
      localStorage.setItem('openai_api_key', openaiKey.trim());
      setIsKeySet(true);
      setIsDialogOpen(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key');
    setOpenaiKey('');
    setIsKeySet(false);
  };

  return (
    <div className="flex justify-center mb-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {isKeySet ? 'API Key Configurada ✓' : 'Configurar API Key para OpenAI'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              {isKeySet ? (
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
    </div>
  );
};

export default ApiKeyInput;
