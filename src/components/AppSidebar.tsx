// NINJAS NKT - Application Sidebar

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Monitor,
  FileText,
  FolderOpen,
  Users,
  Shield,
  Archive,
  LogOut,
  User
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const menuItems = [
  { title: 'Dashboard Principal', url: '/dashboard', icon: Monitor },
  { title: 'Investigações', url: '/investigations', icon: FileText },
  { title: 'Casos Abertos', url: '/cases', icon: FolderOpen },
  { title: 'Registro de Pessoas', url: '/people', icon: Users },
  { title: 'Gerenciar Facções', url: '/factions', icon: Shield },
  { title: 'Casos Fechados', url: '/closed-cases', icon: Archive },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { state: appState, logout } = useApp();
  
  const collapsed = state === 'collapsed';
  
  const currentInvestigator = appState.investigators.find(
    inv => inv.id === appState.currentInvestigator
  );

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center w-full transition-colors ${
      isActive 
        ? 'bg-primary/20 text-primary border-r-2 border-primary' 
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
    }`;

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} border-r border-border`}>
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-border">
        {!collapsed && (
          <div className="text-center">
            <h2 className="text-xl font-bold neon-text text-primary">NINJAS</h2>
            <p className="text-xs text-muted-foreground">NKT SYSTEM</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">
            {!collapsed && 'Menu Principal'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-4 w-4`} />
                      {!collapsed && <span className="font-mono text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-border">
        {currentInvestigator && (
          <div className={`${collapsed ? 'text-center' : 'flex items-center justify-between'} mb-3`}>
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-secondary cyber-border flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-mono text-foreground">{currentInvestigator.name}</p>
                  <p className="text-xs text-muted-foreground">Investigador</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <Button
          onClick={logout}
          variant="ghost" 
          size={collapsed ? "icon" : "sm"}
          className="w-full hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-2'}`} />
          {!collapsed && 'Sair'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}