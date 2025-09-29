// NINJAS NKT - Investigator Selection Screen (Windows 7/Vista Style)

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit2, LogIn, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const InvestigatorSelection: React.FC = () => {
  const { state, selectInvestigator, updateInvestigator } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');

  const handleEnter = (investigatorId: string) => {
    selectInvestigator(investigatorId);
  };

  const handleEdit = (investigator: any) => {
    setEditingId(investigator.id);
    setEditName(investigator.name);
    setEditPhoto(investigator.photo);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      updateInvestigator(editingId, {
        name: editName,
        photo: editPhoto,
      });
      setEditingId(null);
      setEditName('');
      setEditPhoto('');
    }
  };

  return (
    <div className="min-h-screen terminal-bg flex items-center justify-center p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Container */}
      <Card className="relative z-10 w-full max-w-2xl cyber-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold neon-text text-primary mb-2">
            NINJAS NKT
          </h1>
          <p className="text-muted-foreground">
            Sistema de Investigação Cyberpunk
          </p>
          <div className="w-20 h-1 bg-gradient-cyber mx-auto mt-4"></div>
        </div>

        {/* Investigators Grid */}
        <div className="grid grid-cols-2 gap-4">
          {state.investigators.map((investigator) => (
            <Card key={investigator.id} className="investigator-card p-4">
              <div className="flex items-center space-x-3">
                {/* Profile Photo */}
                <div className="w-12 h-12 rounded-full bg-secondary cyber-border flex items-center justify-center">
                  {investigator.photo === '/placeholder.svg' ? (
                    <User className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <img 
                      src={investigator.photo} 
                      alt={investigator.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className="font-mono text-sm text-foreground">
                    {investigator.name}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(investigator)}
                    className="h-8 w-8 p-0 hover:bg-secondary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => handleEnter(investigator.id)}
                    className="cyber-button text-xs px-3"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    ENTRAR
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>Selecione um investigador para acessar o sistema</p>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent className="cyber-card">
          <DialogHeader>
            <DialogTitle className="neon-text">Editar Investigador</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 cyber-border"
                placeholder="Nome do investigador"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">URL da Foto</label>
              <Input
                value={editPhoto}
                onChange={(e) => setEditPhoto(e.target.value)}
                className="mt-1 cyber-border"
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => setEditingId(null)}
                className="hover:bg-secondary"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="cyber-button"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestigatorSelection;