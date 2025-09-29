import { 
  Menu, 
  Search, 
  GitBranch, 
  Bug, 
  Play,
  Settings,
  User,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface MenuBarProps {
  onTerminalToggle: () => void;
  onSidebarToggle: () => void;
  onGitPanelToggle: () => void;
}

export const MenuBar = ({ onTerminalToggle, onSidebarToggle, onGitPanelToggle }: MenuBarProps) => {
  return (
    <div className="h-12 bg-editor-sidebar border-b border-border flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onSidebarToggle}
          className="lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-primary rounded-sm flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">VS</span>
          </div>
          <span className="font-semibold text-accent">Code Online</span>
        </div>

        {/* Menu Items */}
        <nav className="hidden md:flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">
                Arquivo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Novo Arquivo</DropdownMenuItem>
              <DropdownMenuItem>Abrir Pasta</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Salvar</DropdownMenuItem>
              <DropdownMenuItem>Salvar Como</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">
                Editar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Desfazer</DropdownMenuItem>
              <DropdownMenuItem>Refazer</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Copiar</DropdownMenuItem>
              <DropdownMenuItem>Colar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">
                Ver
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onTerminalToggle}>
                Terminal
              </DropdownMenuItem>
              <DropdownMenuItem>Painel de Problemas</DropdownMenuItem>
              <DropdownMenuItem>Debug Console</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-4 hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar arquivos..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm hidden md:flex"
          onClick={onGitPanelToggle}
        >
          <GitBranch className="w-4 h-4 mr-1" />
          Git
        </Button>

        <Button variant="ghost" size="sm">
          <Bug className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm">
          <Play className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Monitor className="w-4 h-4 mr-2" />
              Tema do Sistema
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Moon className="w-4 h-4 mr-2" />
              Tema Escuro
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Sun className="w-4 h-4 mr-2" />
              Tema Claro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Extensões</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};