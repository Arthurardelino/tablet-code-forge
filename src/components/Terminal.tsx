import { useState } from "react";
import { Terminal as TerminalIcon, Minimize2, X, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TerminalProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Terminal = ({ isOpen, onToggle }: TerminalProps) => {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([
    "Welcome to VS Code Online Terminal",
    "$ npm start",
    "Starting development server...",
    "Server running on http://localhost:3000",
    ""
  ]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newHistory = [...history, `$ ${command}`];
      
      // Simulate command responses
      switch (command.toLowerCase().trim()) {
        case 'clear':
          setHistory([""]);
          break; //"break é como se fosse quebrar um looping"
        case 'ls':
          newHistory.push("src/  public/  package.json  README.md");
          break;
        case 'npm install':
          newHistory.push("Installing dependencies...", "✅ Dependencies installed successfully");
          break;
        case 'npm run build':
          newHistory.push("Building for production...", "✅ Build completed successfully");
          break;
        case 'help':
          newHistory.push("Available commands:", "  ls - list files", "  clear - clear terminal", "  npm install - install dependencies", "  npm run build - build project");
          break;
        default:
          if (command.trim()) {
            newHistory.push(`bash: ${command}: command not found`);
          }
      }
      
      if (command.toLowerCase().trim() !== 'clear') {
        newHistory.push("");
        setHistory(newHistory);
      }
      
      setCommand("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-editor-sidebar border-t border-border slide-right">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-editor-tab border-b border-border">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Square className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={onToggle}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="h-48 p-4 overflow-y-auto font-mono text-sm">
        {/* Command History */}
        <div className="space-y-1">
          {history.map((line, index) => (
            <div
              key={index}
              className={`${
                line.startsWith('$') 
                  ? 'text-syntax-variable' 
                  : line.includes('✅') 
                  ? 'text-syntax-string' 
                  : line.includes('bash:') 
                  ? 'text-destructive' 
                  : 'text-muted-foreground'
              }`}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Input Line */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-syntax-variable">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent outline-none text-foreground"
            placeholder="Digite um comando..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};