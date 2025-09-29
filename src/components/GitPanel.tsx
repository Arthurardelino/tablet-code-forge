import { useState } from "react";
import { GitBranch, GitCommit, Upload, FileX, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GitPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface FileChange {
  name: string;
  status: 'modified' | 'added' | 'deleted';
  path: string;
}

export const GitPanel = ({ isOpen, onToggle }: GitPanelProps) => {
  const [commitMessage, setCommitMessage] = useState("");
  const [branch, setBranch] = useState("main");
  const [changes, setChanges] = useState<FileChange[]>([
    { name: "App.tsx", status: "modified", path: "src/App.tsx" },
    { name: "index.css", status: "modified", path: "src/index.css" },
    { name: "NewComponent.tsx", status: "added", path: "src/components/NewComponent.tsx" }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'modified':
        return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
      case 'added':
        return <Plus className="w-3 h-3 text-green-500" />;
      case 'deleted':
        return <Minus className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    
    // Simular commit
    console.log("Committing changes:", {
      message: commitMessage,
      branch: branch,
      files: changes
    });
    
    setCommitMessage("");
    setChanges([]);
    alert("Commit realizado com sucesso! (simulação)");
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-editor-sidebar border-l border-border h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Source Control</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <FileX className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Branch Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Branch Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="text-sm"
              placeholder="Nome da branch"
            />
          </CardContent>
        </Card>

        {/* Changes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Alterações ({changes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {changes.map((change, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-editor-bg cursor-pointer"
                >
                  {getStatusIcon(change.status)}
                  <div className="flex-1">
                    <div className="text-sm text-foreground">{change.name}</div>
                    <div className="text-xs text-muted-foreground">{change.path}</div>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {change.status}
                  </div>
                </div>
              ))}
              
              {changes.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma alteração para commit
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Commit */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitCommit className="w-4 h-4" />
              Commit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Mensagem do commit..."
              className="min-h-[80px] text-sm"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleCommit}
                disabled={!commitMessage.trim() || changes.length === 0}
                className="flex-1"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Commit & Push
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {changes.length} arquivo(s) selecionado(s)
            </div>
          </CardContent>
        </Card>

        {/* Repository Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Repositório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>Origin: https://github.com/user/vscode-online</div>
              <div>Branch: {branch}</div>
              <div>Status: Up to date</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};