// NINJAS NKT - Casos Abertos (Gestão de Inquéritos Ativos)

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit3, 
  X,
  FolderOpen,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Case } from '@/types';

const Cases: React.FC = () => {
  const { state, addCase, updateCase, closeCase } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [closingCase, setClosingCase] = useState<Case | null>(null);
  const [closingReason, setClosingReason] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    peopleInvolved: [] as string[],
    vehiclePlate: '',
    vehicleModel: ''
  });

  const openCases = state.cases.filter(c => c.status === 'Aberto');
  const currentInvestigator = state.investigators.find(inv => inv.id === state.currentInvestigator);

  const filteredCases = openCases.filter(case_ =>
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      peopleInvolved: [],
      vehiclePlate: '',
      vehicleModel: ''
    });
  };

  const handleAddCase = () => {
    if (!formData.title.trim() || !currentInvestigator) return;

    addCase({
      title: formData.title,
      description: formData.description,
      peopleInvolved: formData.peopleInvolved,
      vehiclePlate: formData.vehiclePlate,
      vehicleModel: formData.vehicleModel,
      status: 'Aberto',
      investigatorId: currentInvestigator.id,
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditCase = (case_: Case) => {
    setEditingCase(case_);
    setFormData({
      title: case_.title,
      description: case_.description,
      peopleInvolved: case_.peopleInvolved,
      vehiclePlate: case_.vehiclePlate || '',
      vehicleModel: case_.vehicleModel || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCase = () => {
    if (!editingCase || !formData.title.trim()) return;

    updateCase(editingCase.id, {
      title: formData.title,
      description: formData.description,
      peopleInvolved: formData.peopleInvolved,
      vehiclePlate: formData.vehiclePlate,
      vehicleModel: formData.vehicleModel
    });

    resetForm();
    setEditingCase(null);
    setIsEditDialogOpen(false);
  };

  const handleCloseCase = (case_: Case) => {
    setClosingCase(case_);
    setClosingReason('');
    setIsCloseDialogOpen(true);
  };

  const handleConfirmCloseCase = () => {
    if (!closingCase || !closingReason.trim()) return;

    closeCase(closingCase.id, closingReason);
    setClosingCase(null);
    setClosingReason('');
    setIsCloseDialogOpen(false);
  };

  const getPersonName = (personId: string) => {
    const person = state.people.find(p => p.id === personId);
    return person ? person.name : personId;
  };

  const getInvestigatorName = (investigatorId: string) => {
    const investigator = state.investigators.find(i => i.id === investigatorId);
    return investigator ? investigator.name : 'Desconhecido';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neon-text text-primary mb-2">
            Casos Abertos
          </h1>
          <p className="text-muted-foreground">
            Gestão de inquéritos ativos ({filteredCases.length} casos)
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button">
              <Plus className="w-4 h-4 mr-2" />
              Novo Caso
            </Button>
          </DialogTrigger>
          <DialogContent className="cyber-card max-w-2xl">
            <DialogHeader>
              <DialogTitle className="neon-text">Criar Novo Caso</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Caso</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="cyber-border"
                  placeholder="Digite o título do caso"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="cyber-border min-h-[120px]"
                  placeholder="Descreva os detalhes do caso"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehiclePlate">Placa do Veículo</Label>
                  <Input
                    id="vehiclePlate"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value }))}
                    className="cyber-border"
                    placeholder="ABC-1234"
                  />
                </div>
                
                <div>
                  <Label htmlFor="vehicleModel">Modelo do Veículo</Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                    className="cyber-border"
                    placeholder="Honda Civic 2020"
                  />
                </div>
              </div>

              <div>
                <Label>Pessoas Envolvidas</Label>
                <Select
                  value=""
                  onValueChange={(personId) => {
                    if (!formData.peopleInvolved.includes(personId)) {
                      setFormData(prev => ({
                        ...prev,
                        peopleInvolved: [...prev.peopleInvolved, personId]
                      }));
                    }
                  }}
                >
                  <SelectTrigger className="cyber-border">
                    <SelectValue placeholder="Selecione uma pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.people.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name} ({person.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.peopleInvolved.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.peopleInvolved.map((personId) => (
                      <Badge key={personId} variant="outline" className="flex items-center gap-1">
                        {getPersonName(personId)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive/20"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            peopleInvolved: prev.peopleInvolved.filter(id => id !== personId)
                          }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddCase} className="cyber-button">
                  Criar Caso
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="cyber-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou ID do caso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 cyber-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="grid gap-4">
        {filteredCases.map((case_) => (
          <Card key={case_.id} className="cyber-card hover:cyber-glow transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg font-mono">
                      {case_.id} - {case_.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="w-4 h-4 mr-1" />
                        {getInvestigatorName(case_.investigatorId)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(case_.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="cyber-border">
                    {case_.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCase(case_)}
                    className="hover:bg-secondary"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCloseCase(case_)}
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {case_.description}
              </p>
              
              {case_.peopleInvolved.length > 0 && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Pessoas envolvidas:</span>
                  <div className="flex flex-wrap gap-1">
                    {case_.peopleInvolved.map((personId) => (
                      <Badge key={personId} variant="secondary" className="text-xs">
                        {getPersonName(personId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredCases.length === 0 && (
          <Card className="cyber-card">
            <CardContent className="text-center py-8">
              <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum caso encontrado
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie um novo caso para começar'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog - Similar structure to Add Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="cyber-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="neon-text">
              Editar Caso {editingCase?.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título do Caso</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="cyber-border"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="cyber-border min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-vehiclePlate">Placa do Veículo</Label>
                <Input
                  id="edit-vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value }))}
                  className="cyber-border"
                  placeholder="ABC-1234"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-vehicleModel">Modelo do Veículo</Label>
                <Input
                  id="edit-vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                  className="cyber-border"
                  placeholder="Honda Civic 2020"
                />
              </div>
            </div>

            <div>
              <Label>Pessoas Envolvidas</Label>
              <Select
                value=""
                onValueChange={(personId) => {
                  if (!formData.peopleInvolved.includes(personId)) {
                    setFormData(prev => ({
                      ...prev,
                      peopleInvolved: [...prev.peopleInvolved, personId]
                    }));
                  }
                }}
              >
                <SelectTrigger className="cyber-border">
                  <SelectValue placeholder="Selecione uma pessoa" />
                </SelectTrigger>
                <SelectContent>
                  {state.people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name} ({person.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {formData.peopleInvolved.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.peopleInvolved.map((personId) => (
                    <Badge key={personId} variant="outline" className="flex items-center gap-1">
                      {getPersonName(personId)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive/20"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          peopleInvolved: prev.peopleInvolved.filter(id => id !== personId)
                        }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  resetForm();
                  setEditingCase(null);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateCase} className="cyber-button">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Case Dialog */}
      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <DialogContent className="cyber-card">
          <DialogHeader>
            <DialogTitle className="neon-text">
              Fechar Caso {closingCase?.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Você está prestes a fechar o caso "{closingCase?.title}". 
              Esta ação moverá o caso para o arquivo de casos fechados.
            </p>
            
            <div>
              <Label htmlFor="closing-reason">Motivo do Fechamento</Label>
              <Textarea
                id="closing-reason"
                value={closingReason}
                onChange={(e) => setClosingReason(e.target.value)}
                className="cyber-border"
                placeholder="Descreva o motivo do fechamento..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setClosingCase(null);
                  setClosingReason('');
                  setIsCloseDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmCloseCase} 
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                disabled={!closingReason.trim()}
              >
                Fechar Caso
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cases;