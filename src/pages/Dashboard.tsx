// NINJAS NKT - Dashboard Principal (Status NKT)

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Archive, 
  Users, 
  Shield,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  
  const openCases = state.cases.filter(c => c.status === 'Aberto');
  const closedCases = state.cases.filter(c => c.status === 'Fechado');
  const totalPeople = state.people.length;
  const totalFactions = state.factions.length;
  const totalReports = state.reports.length;

  const statsCards = [
    {
      title: 'Casos Ativos',
      value: openCases.length,
      icon: FolderOpen,
      color: 'neon-cyan',
      description: 'Em investigação'
    },
    {
      title: 'Casos Fechados', 
      value: closedCases.length,
      icon: Archive,
      color: 'neon-green',
      description: 'Concluídos'
    },
    {
      title: 'Pessoas Registradas',
      value: totalPeople,
      icon: Users, 
      color: 'neon-purple',
      description: 'Base de dados'
    },
    {
      title: 'Facções Mapeadas',
      value: totalFactions,
      icon: Shield,
      color: 'neon-orange',
      description: 'Organizações'
    },
  ];

  const recentCases = openCases.slice(-5);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neon-text text-primary mb-2">
            Dashboard Principal
          </h1>
          <p className="text-muted-foreground">
            Status geral do sistema NINJAS NKT
          </p>
        </div>
        
        <Badge variant="outline" className="cyber-border">
          <Activity className="w-4 h-4 mr-2" />
          Sistema Online
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="cyber-card hover:cyber-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 text-${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold neon-text text-primary mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Casos Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCases.length > 0 ? (
              <div className="space-y-3">
                {recentCases.map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-mono text-sm text-foreground">
                        {case_.id}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {case_.title}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {case_.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum caso ativo encontrado
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Activity */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Atividade do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total de Registros</span>
                <span className="font-mono text-sm text-foreground">
                  {totalPeople + totalFactions + state.cases.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Relatórios Gerados</span>
                <span className="font-mono text-sm text-foreground">
                  {totalReports}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Conclusão</span>
                <span className="font-mono text-sm text-foreground">
                  {state.cases.length > 0 
                    ? Math.round((closedCases.length / state.cases.length) * 100)
                    : 0
                  }%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-cyber/10">
              <div className="w-8 h-8 rounded-full bg-neon-green mx-auto mb-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-foreground font-medium">Database</p>
              <p className="text-xs text-muted-foreground">Operacional</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-cyber/10">
              <div className="w-8 h-8 rounded-full bg-neon-cyan mx-auto mb-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-foreground font-medium">Security</p>
              <p className="text-xs text-muted-foreground">Ativo</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-cyber/10">
              <div className="w-8 h-8 rounded-full bg-neon-purple mx-auto mb-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-neon-purple rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-foreground font-medium">Network</p>
              <p className="text-xs text-muted-foreground">Estável</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;