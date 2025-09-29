import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen terminal-bg flex items-center justify-center p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-destructive/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-orange/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="relative z-10 w-full max-w-md cyber-card">
        <CardContent className="text-center py-12">
          <AlertTriangle className="w-16 h-16 mx-auto text-destructive mb-6" />
          
          <h1 className="text-6xl font-bold neon-text text-primary mb-4">404</h1>
          
          <h2 className="text-xl font-mono text-foreground mb-4">
            ACESSO NEGADO
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Rota não encontrada no sistema NINJAS NKT
          </p>
          
          <div className="text-xs text-muted-foreground mb-6 font-mono">
            {location.pathname}
          </div>
          
          <Button 
            onClick={() => window.location.href = "/"}
            className="cyber-button"
          >
            Retornar ao Sistema
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
