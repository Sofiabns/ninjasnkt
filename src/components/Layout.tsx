// NINJAS NKT - Main Layout Component

import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useApp } from '@/contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useApp();
  
  const currentInvestigator = state.investigators.find(
    inv => inv.id === state.currentInvestigator
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-16 items-center border-b border-border bg-card/50 backdrop-blur-sm px-6">
            <SidebarTrigger className="cyber-border hover:cyber-glow transition-all" />
            
            <div className="flex-1 ml-4">
              <h1 className="text-lg font-mono font-semibold neon-text text-primary">
                NINJAS NKT System
              </h1>
            </div>
            
            {currentInvestigator && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-mono text-foreground">
                    {currentInvestigator.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Investigador Ativo
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary cyber-border flex items-center justify-center">
                  <span className="text-xs font-mono text-foreground">
                    {currentInvestigator.name.charAt(0)}
                  </span>
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;