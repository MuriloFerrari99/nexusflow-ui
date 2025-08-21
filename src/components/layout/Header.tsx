import { Search, Bell, Settings, User, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ERP</span>
          </div>
          <h1 className="font-semibold text-xl text-foreground">Sistema ERP</h1>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar em todos os módulos..."
            className="pl-10 pr-4 h-10 bg-muted/30 border-muted-foreground/20 focus:bg-card transition-colors"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Help Button */}
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/60">
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/60">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
            3
          </Badge>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="hover:bg-muted/60">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">admin@empresa.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};