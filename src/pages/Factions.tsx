// NINJAS NKT - Gerenciar Facções (Estrutura e Hierarquia)

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2,
  Shield,
  Users,
  Crown,
  User,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Faction, Person } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Factions: React.FC = () => {
  const { state, addFaction, updateFaction, deleteFaction } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFaction, setEditingFaction] = useState<Faction | null>(null);
  const [expandedFactions, setExpandedFactions] = useState<Set<string>>(new Set());
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const filteredFactions = state.factions.filter(faction =>
    faction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
  };

  const handleAddFaction = () => {
    if (!formData.name.trim()) return;

    addFaction({
      name: formData.name,
      description: formData.description,
      members: []
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditFaction = (faction: Faction) => {
    setEditingFaction(faction);
    setFormData({
      name: faction.name,
      description: faction.description
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateFaction = () => {
    if (!editingFaction || !formData.name.trim()) return;

    updateFaction(editingFaction.id, {
      name: formData.name,
      description: formData.description
    });

    resetForm();
    setEditingFaction(null);
    setIsEditDialogOpen(false);
  };

  const getFactionMembers = (factionName: string): Person[] => {
    const members = state.people.filter(person => person.faction === factionName);
    
    // Sort hierarchically: Líder, Sub-Líder, then others
    const roleOrder = ['Líder', 'Sub-Líder', 'Membro', 'Associado', 'Informante', 'Suspeito'];
    
    return members.sort((a, b) => {
      const aIndex = roleOrder.indexOf(a.role);
      const bIndex = roleOrder.indexOf(b.role);
      
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      
      return a.name.localeCompare(b.name);
    });
  };

  const getRoleIcon = (role: Person['role']) => {
    switch (role) {
      case 'Líder':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Sub-Líder':
        return <Shield className="w-4 h-4 text-orange-500" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleColor = (role: Person['role']) => {
    const colors = {
      'Líder': 'bg-destructive',
      'Sub-Líder': 'bg-neon-orange',
      'Membro': 'bg-neon-cyan',
      'Associado': 'bg-neon-purple',
      'Informante': 'bg-neon-green',
      'Suspeito': 'bg-muted'
    };
    return colors[role] || 'bg-muted';
  };

  const toggleFactionExpanded = (factionId: string) => {
    const newExpanded = new Set(expandedFactions);
    if (newExpanded.has(factionId)) {
      newExpanded.delete(factionId);
    } else {
      newExpanded.add(factionId);
    }
    setExpandedFactions(newExpanded);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neon-text text-primary mb-2">
            Gerenciar Facções
          </h1>
          <p className="text-muted-foreground">
            Estrutura e hierarquia das organizações ({filteredFactions.length} facções)
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button">
              <Plus className="w-4 h-4 mr-2" />
              Nova Facção
            </Button>
          </DialogTrigger>
          <DialogContent className="cyber-card max-w-xl">
            <DialogHeader>
              <DialogTitle className="neon-text">Criar Nova Facção</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Facção</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="cyber-border"
                  placeholder="Digite o nome da facção"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="cyber-border min-h-[100px]"
                  placeholder="Descreva a facção, seus objetivos e características"
                />
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
                <Button onClick={handleAddFaction} className="cyber-button">
                  Criar Facção
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
              placeholder="Buscar facções por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 cyber-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Factions List */}
      <div className="space-y-4">
        {filteredFactions.map((faction) => {
          const members = getFactionMembers(faction.name);
          const isExpanded = expandedFactions.has(faction.id);
          
          return (
            <Card key={faction.id} className="cyber-card">
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleFactionExpanded(faction.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                          <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-mono text-foreground">
                            {faction.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {members.length} {members.length === 1 ? 'membro' : 'membros'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="cyber-border">
                          <Users className="w-3 h-3 mr-1" />
                          {members.length}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditFaction(faction);
                          }}
                          className="hover:bg-secondary"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFaction(faction.id);
                          }}
                          className="hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {faction.description && (
                      <p className="text-sm text-muted-foreground mb-4 border-l-2 border-primary/30 pl-4">
                        {faction.description}
                      </p>
                    )}
                    
                    {members.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Membros da Organização
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 cyber-border"
                            >
                              <div className="flex items-center space-x-3">
                                {getRoleIcon(member.role)}
                                <div>
                                  <p className="font-mono text-sm text-foreground">
                                    {member.id}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {member.name}
                                  </p>
                                </div>
                              </div>
                              <Badge className={`${getRoleColor(member.role)} text-xs text-white`}>
                                {member.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Nenhum membro registrado</p>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}

        {filteredFactions.length === 0 && (
          <Card className="cyber-card">
            <CardContent className="text-center py-8">
              <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma facção encontrada
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie uma nova facção para começar'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="cyber-card max-w-xl">
          <DialogHeader>
            <DialogTitle className="neon-text">
              Editar Facção
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome da Facção</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="cyber-border"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="cyber-border min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  resetForm();
                  setEditingFaction(null);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateFaction} className="cyber-button">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Factions;