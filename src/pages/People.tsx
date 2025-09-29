// NINJAS NKT - Registro de Pessoas (Base de Dados Biométricos/Alvos)

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2,
  Users,
  Phone,
  Car,
  Shield,
  User,
  Filter,
  Eye
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Person } from '@/types';

const ROLES = ['Líder', 'Sub-Líder', 'Membro', 'Associado', 'Informante', 'Suspeito'];

const People: React.FC = () => {
  const { state, addPerson, updatePerson, deletePerson } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [viewingPerson, setViewingPerson] = useState<Person | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    phone: '',
    vehiclePlate: '',
    vehicleModel: '',
    faction: '',
    role: '' as Person['role'] | ''
  });

  const filteredPeople = state.people.filter(person => {
    const matchesSearch = 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm) ||
      person.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFaction = selectedFaction === '' || selectedFaction === 'all' || person.faction === selectedFaction;
    
    return matchesSearch && matchesFaction;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      photo: '',
      phone: '',
      vehiclePlate: '',
      vehicleModel: '',
      faction: '',
      role: ''
    });
  };

  const handleAddPerson = () => {
    if (!formData.name.trim() || !formData.role) return;

    addPerson({
      name: formData.name,
      photo: formData.photo || '/placeholder.svg',
      phone: formData.phone,
      vehiclePlate: formData.vehiclePlate,
      vehicleModel: formData.vehicleModel,
      faction: formData.faction,
      role: formData.role as Person['role']
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      photo: person.photo,
      phone: person.phone,
      vehiclePlate: person.vehiclePlate,
      vehicleModel: person.vehicleModel,
      faction: person.faction,
      role: person.role
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePerson = () => {
    if (!editingPerson || !formData.name.trim() || !formData.role) return;

    updatePerson(editingPerson.id, {
      name: formData.name,
      photo: formData.photo || '/placeholder.svg',
      phone: formData.phone,
      vehiclePlate: formData.vehiclePlate,
      vehicleModel: formData.vehicleModel,
      faction: formData.faction,
      role: formData.role as Person['role']
    });

    resetForm();
    setEditingPerson(null);
    setIsEditDialogOpen(false);
  };

  const handleViewPerson = (person: Person) => {
    setViewingPerson(person);
    setIsViewDialogOpen(true);
  };

  const getPersonCases = (personId: string) => {
    return state.cases.filter(case_ => case_.peopleInvolved.includes(personId));
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neon-text text-primary mb-2">
            Registro de Pessoas
          </h1>
          <p className="text-muted-foreground">
            Base de dados biométricos e alvos ({filteredPeople.length} registros)
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button">
              <Plus className="w-4 h-4 mr-2" />
              Nova Pessoa
            </Button>
          </DialogTrigger>
          <DialogContent className="cyber-card max-w-2xl">
            <DialogHeader>
              <DialogTitle className="neon-text">Registrar Nova Pessoa</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="cyber-border"
                    placeholder="Nome da pessoa"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="cyber-border"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="photo">URL da Foto</Label>
                <Input
                  id="photo"
                  value={formData.photo}
                  onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                  className="cyber-border"
                  placeholder="https://exemplo.com/foto.jpg"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Facção</Label>
                  <Select
                    value={formData.faction}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, faction: value }))}
                  >
                    <SelectTrigger className="cyber-border">
                      <SelectValue placeholder="Selecione uma facção" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.factions.map((faction) => (
                        <SelectItem key={faction.id} value={faction.name}>
                          {faction.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Função/Hierarquia</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as Person['role'] }))}
                  >
                    <SelectTrigger className="cyber-border">
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                <Button onClick={handleAddPerson} className="cyber-button">
                  Registrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="cyber-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone, placa ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 cyber-border"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedFaction}
                onValueChange={setSelectedFaction}
              >
                <SelectTrigger className="pl-10 cyber-border">
                  <SelectValue placeholder="Filtrar por facção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as facções</SelectItem>
                  {state.factions.map((faction) => (
                    <SelectItem key={faction.id} value={faction.name}>
                      {faction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeople.map((person) => (
          <Card key={person.id} className="cyber-card hover:cyber-glow transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-secondary cyber-border flex items-center justify-center">
                    {person.photo === '/placeholder.svg' ? (
                      <User className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <img 
                        src={person.photo} 
                        alt={person.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-mono">
                      {person.id}
                    </CardTitle>
                    <p className="text-sm text-foreground">
                      {person.name}
                    </p>
                  </div>
                </div>
                
                <Badge className={`${getRoleColor(person.role)} text-xs text-white`}>
                  {person.role}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              {person.phone && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Phone className="w-3 h-3 mr-2" />
                  {person.phone}
                </div>
              )}
              
              {person.vehiclePlate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Car className="w-3 h-3 mr-2" />
                  {person.vehiclePlate}
                </div>
              )}
              
              {person.faction && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 mr-2" />
                  {person.faction}
                </div>
              )}
              
              <div className="flex justify-between pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewPerson(person)}
                  className="hover:bg-secondary"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPerson(person)}
                    className="hover:bg-secondary"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePerson(person.id)}
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPeople.length === 0 && (
          <Card className="cyber-card col-span-full">
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma pessoa encontrada
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedFaction
                  ? 'Tente ajustar os filtros de busca'
                  : 'Registre uma nova pessoa para começar'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Person Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="cyber-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="neon-text">
              Ficha Criminal - {viewingPerson?.id}
            </DialogTitle>
          </DialogHeader>
          
          {viewingPerson && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Nome Completo</Label>
                    <p className="font-mono text-foreground">{viewingPerson.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">ID</Label>
                    <p className="font-mono text-primary">{viewingPerson.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefone</Label>
                    <p className="font-mono text-foreground">{viewingPerson.phone || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-lg bg-secondary cyber-border flex items-center justify-center">
                    {viewingPerson.photo === '/placeholder.svg' ? (
                      <User className="w-16 h-16 text-muted-foreground" />
                    ) : (
                      <img 
                        src={viewingPerson.photo} 
                        alt={viewingPerson.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Placa do Veículo</Label>
                  <p className="font-mono text-foreground">{viewingPerson.vehiclePlate || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Modelo do Veículo</Label>
                  <p className="font-mono text-foreground">{viewingPerson.vehicleModel || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Facção</Label>
                  <p className="font-mono text-foreground">{viewingPerson.faction || 'Independente'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Função</Label>
                  <Badge className={`${getRoleColor(viewingPerson.role)} text-white`}>
                    {viewingPerson.role}
                  </Badge>
                </div>
              </div>

              {/* Case History */}
              <div>
                <Label className="text-muted-foreground">Histórico de Casos</Label>
                <div className="mt-2 space-y-2">
                  {getPersonCases(viewingPerson.id).map((case_) => (
                    <div key={case_.id} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                      <div>
                        <p className="font-mono text-sm text-foreground">{case_.id}</p>
                        <p className="text-xs text-muted-foreground">{case_.title}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {case_.status}
                      </Badge>
                    </div>
                  ))}
                  {getPersonCases(viewingPerson.id).length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum caso associado</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Person Dialog - Similar to Add Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="cyber-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="neon-text">
              Editar Pessoa {editingPerson?.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="cyber-border"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="cyber-border"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-photo">URL da Foto</Label>
              <Input
                id="edit-photo"
                value={formData.photo}
                onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                className="cyber-border"
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
                />
              </div>
              
              <div>
                <Label htmlFor="edit-vehicleModel">Modelo do Veículo</Label>
                <Input
                  id="edit-vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                  className="cyber-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Facção</Label>
                <Select
                  value={formData.faction}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, faction: value }))}
                >
                  <SelectTrigger className="cyber-border">
                    <SelectValue placeholder="Selecione uma facção" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.factions.map((faction) => (
                      <SelectItem key={faction.id} value={faction.name}>
                        {faction.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Função/Hierarquia</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as Person['role'] }))}
                >
                  <SelectTrigger className="cyber-border">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  resetForm();
                  setEditingPerson(null);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdatePerson} className="cyber-button">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default People;