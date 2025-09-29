// NINJAS NKT - Investigações (Relatórios Detalhados)

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
  Trash2,
  FileText,
  Calendar,
  User,
  Paperclip,
  X,
  Upload,
  Eye
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Report, Attachment } from '@/types';

const Investigations: React.FC = () => {
  const { state, addReport, updateReport, deleteReport } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    peopleInvolved: [] as string[],
    attachments: [] as Attachment[]
  });

  const currentInvestigator = state.investigators.find(inv => inv.id === state.currentInvestigator);

  const filteredReports = state.reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      peopleInvolved: [],
      attachments: []
    });
  };

  const handleAddReport = () => {
    if (!formData.title.trim() || !currentInvestigator) return;

    addReport({
      title: formData.title,
      content: formData.content,
      peopleInvolved: formData.peopleInvolved,
      attachments: formData.attachments,
      investigatorId: currentInvestigator.id,
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      content: report.content,
      peopleInvolved: report.peopleInvolved,
      attachments: report.attachments
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateReport = () => {
    if (!editingReport || !formData.title.trim()) return;

    updateReport(editingReport.id, {
      title: formData.title,
      content: formData.content,
      peopleInvolved: formData.peopleInvolved,
      attachments: formData.attachments
    });

    resetForm();
    setEditingReport(null);
    setIsEditDialogOpen(false);
  };

  const handleViewReport = (report: Report) => {
    setViewingReport(report);
    setIsViewDialogOpen(true);
  };

  const addAttachment = () => {
    const url = prompt('Digite a URL do arquivo ou imagem:');
    if (!url) return;

    const name = prompt('Digite um nome para o arquivo:') || 'Arquivo';
    const type = url.toLowerCase().includes('.jpg') || url.toLowerCase().includes('.png') || 
                 url.toLowerCase().includes('.gif') || url.toLowerCase().includes('.jpeg') ? 'image' : 'document';

    const newAttachment: Attachment = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      url,
      name
    };

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment]
    }));
  };

  const removeAttachment = (attachmentId: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      const url = URL.createObjectURL(file);
      
      const newAttachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        type: fileType,
        url,
        name: file.name,
        file // Store the actual file object for potential use
      };

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment]
      }));
    });

    // Reset the input
    event.target.value = '';
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
            Investigações
          </h1>
          <p className="text-muted-foreground">
            Relatórios detalhados e documentação ({filteredReports.length} relatórios)
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cyber-button">
              <Plus className="w-4 h-4 mr-2" />
              Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="cyber-card max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="neon-text">Criar Novo Relatório</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Relatório</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="cyber-border"
                  placeholder="Digite o título do relatório"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Conteúdo do Relatório</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="cyber-border min-h-[200px]"
                  placeholder="Descreva detalhadamente os achados da investigação..."
                />
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

              {/* Attachments Section */}
              <div>
                <Label>Anexos (Opcional)</Label>
                <div className="flex space-x-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAttachment}
                    className="cyber-border"
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Inserir URL
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/*,application/pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cyber-border relative z-10 pointer-events-none"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload de Arquivo
                    </Button>
                  </div>
                </div>
                
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{attachment.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {attachment.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (attachment.type === 'image') {
                                window.open(attachment.url, '_blank');
                              } else {
                                const link = document.createElement('a');
                                link.href = attachment.url;
                                link.download = attachment.name;
                                link.click();
                              }
                            }}
                            className="hover:bg-secondary"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(attachment.id)}
                            className="hover:bg-destructive/20 hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
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
                <Button onClick={handleAddReport} className="cyber-button">
                  Criar Relatório
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
              placeholder="Buscar relatórios por título ou conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 cyber-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="cyber-card hover:cyber-glow transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg font-mono">
                      {report.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="w-4 h-4 mr-1" />
                        {getInvestigatorName(report.investigatorId)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      {report.attachments.length > 0 && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Paperclip className="w-4 h-4 mr-1" />
                          {report.attachments.length} anexos
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewReport(report)}
                    className="hover:bg-secondary"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditReport(report)}
                    className="hover:bg-secondary"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReport(report.id)}
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {report.content}
              </p>
              
              {report.peopleInvolved.length > 0 && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Pessoas envolvidas:</span>
                  <div className="flex flex-wrap gap-1">
                    {report.peopleInvolved.map((personId) => (
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

        {filteredReports.length === 0 && (
          <Card className="cyber-card">
            <CardContent className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum relatório encontrado
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie um novo relatório para começar'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="cyber-card max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="neon-text">
              Visualizar Relatório
            </DialogTitle>
          </DialogHeader>
          
          {viewingReport && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-mono text-foreground mb-2">
                  {viewingReport.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {getInvestigatorName(viewingReport.investigatorId)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(viewingReport.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="cyber-border p-4 rounded-lg bg-secondary/20">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">
                    {viewingReport.content}
                  </pre>
                </div>
              </div>

              {viewingReport.peopleInvolved.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Pessoas Envolvidas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewingReport.peopleInvolved.map((personId) => (
                      <Badge key={personId} variant="outline" className="cyber-border">
                        {getPersonName(personId)} ({personId})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingReport.attachments.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Anexos</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {viewingReport.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 rounded bg-secondary/50">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{attachment.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {attachment.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (attachment.type === 'image') {
                              window.open(attachment.url, '_blank');
                            } else {
                              const link = document.createElement('a');
                              link.href = attachment.url;
                              link.download = attachment.name;
                              link.click();
                            }
                          }}
                          className="hover:bg-secondary"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {attachment.type === 'image' ? 'Visualizar' : 'Baixar'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar structure to Add Dialog but with pre-filled data */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="cyber-card max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="neon-text">
              Editar Relatório
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título do Relatório</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="cyber-border"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-content">Conteúdo do Relatório</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="cyber-border min-h-[200px]"
              />
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

            {/* Attachments for Edit Dialog */}
            <div>
              <Label>Anexos</Label>
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttachment}
                  className="cyber-border"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                    Inserir URL
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload-edit"
                      multiple
                      accept="image/*,application/pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cyber-border relative z-10 pointer-events-none"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload de Arquivo
                    </Button>
                  </div>
              </div>
              
              {formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{attachment.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {attachment.type}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                        className="hover:bg-destructive/20 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  resetForm();
                  setEditingReport(null);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateReport} className="cyber-button">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Investigations;