// NINJAS NKT - Casos Fechados (Arquivo de Relatórios)

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Archive,
  Calendar,
  User,
  FileText,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Case } from '@/types';

const ClosedCases: React.FC = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingCase, setViewingCase] = useState<Case | null>(null);

  const closedCases = state.cases.filter(c => c.status === 'Fechado');

  const filteredCases = closedCases.filter(case_ =>
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.closingReason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCase = (case_: Case) => {
    setViewingCase(case_);
    setIsViewDialogOpen(true);
  };

  const getPersonName = (personId: string) => {
    const person = state.people.find(p => p.id === personId);
    return person ? person.name : personId;
  };

  const getInvestigatorName = (investigatorId: string) => {
    const investigator = state.investigators.find(i => i.id === investigatorId);
    return investigator ? investigator.name : 'Desconhecido';
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 dia';
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} anos`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neon-text text-primary mb-2">
            Casos Fechados
          </h1>
          <p className="text-muted-foreground">
            Arquivo de relatórios concluídos ({filteredCases.length} casos)
          </p>
        </div>

        <Badge variant="outline" className="cyber-border">
          <Archive className="w-4 h-4 mr-2" />
          Arquivo Digital
        </Badge>
      </div>

      {/* Search */}
      <Card className="cyber-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, ID ou motivo do fechamento..."
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
          <Card key={case_.id} className="cyber-card hover:cyber-glow transition-all opacity-90">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Archive className="w-5 h-5 text-muted-foreground" />
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
                        Fechado em {case_.closedAt ? new Date(case_.closedAt).toLocaleDateString('pt-BR') : 'Data não informada'}
                      </div>
                      {case_.createdAt && case_.closedAt && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Duração: {formatDuration(case_.createdAt, case_.closedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {case_.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewCase(case_)}
                    className="hover:bg-secondary"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {case_.description}
              </p>

              {case_.closingReason && (
                <div className="mb-3 p-3 rounded-lg bg-destructive/10 border-l-2 border-destructive/50">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Motivo do Fechamento:
                  </div>
                  <p className="text-sm text-foreground">
                    {case_.closingReason}
                  </p>
                </div>
              )}
              
              {case_.peopleInvolved.length > 0 && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Pessoas envolvidas:</span>
                  <div className="flex flex-wrap gap-1">
                    {case_.peopleInvolved.map((personId) => (
                      <Badge key={personId} variant="secondary" className="text-xs opacity-75">
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
              <Archive className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {closedCases.length === 0 ? 'Nenhum caso foi fechado ainda' : 'Nenhum caso encontrado'}
              </h3>
              <p className="text-muted-foreground">
                {closedCases.length === 0 
                  ? 'Os casos concluídos aparecerão aqui quando forem fechados'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Case Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="cyber-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="neon-text">
              Caso Arquivado - {viewingCase?.id}
            </DialogTitle>
          </DialogHeader>
          
          {viewingCase && (
            <div className="space-y-6">
              {/* Case Header */}
              <div className="border-b border-border pb-4">
                <h2 className="text-xl font-mono text-foreground mb-2">
                  {viewingCase.title}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Investigador:</span>
                    <p className="font-mono text-foreground">
                      {getInvestigatorName(viewingCase.investigatorId)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                      {viewingCase.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Criado em:</span>
                    <p className="font-mono text-foreground">
                      {new Date(viewingCase.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fechado em:</span>
                    <p className="font-mono text-foreground">
                      {viewingCase.closedAt 
                        ? new Date(viewingCase.closedAt).toLocaleDateString('pt-BR')
                        : 'Data não informada'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Case Description */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição do Caso</h3>
                <div className="cyber-border p-4 rounded-lg bg-secondary/20">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {viewingCase.description}
                  </p>
                </div>
              </div>

              {/* Closing Reason */}
              {viewingCase.closingReason && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Motivo do Fechamento</h3>
                  <div className="p-4 rounded-lg bg-destructive/10 border-l-4 border-destructive/50">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {viewingCase.closingReason}
                    </p>
                  </div>
                </div>
              )}

              {/* People Involved */}
              {viewingCase.peopleInvolved.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Pessoas Envolvidas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {viewingCase.peopleInvolved.map((personId) => {
                      const person = state.people.find(p => p.id === personId);
                      return (
                        <div key={personId} className="cyber-border p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-mono text-sm text-foreground">
                                {personId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {person ? person.name : 'Nome não encontrado'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Case Statistics */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Estatísticas do Caso</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="cyber-border p-3 rounded-lg">
                    <p className="text-lg font-mono text-primary">
                      {viewingCase.peopleInvolved.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pessoas</p>
                  </div>
                  <div className="cyber-border p-3 rounded-lg">
                    <p className="text-lg font-mono text-primary">
                      {viewingCase.createdAt && viewingCase.closedAt
                        ? formatDuration(viewingCase.createdAt, viewingCase.closedAt)
                        : 'N/A'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Duração</p>
                  </div>
                  <div className="cyber-border p-3 rounded-lg">
                    <p className="text-lg font-mono text-primary">Concluído</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClosedCases;