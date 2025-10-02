import { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  File, 
  Plus, 
  MoreHorizontal,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: FileItem[];
}

interface FileExplorerProps {
  onFileSelect: (file: FileItem) => void;
  selectedFile?: string;
}

const sampleFiles: FileItem[] = [];

export const FileExplorer = ({ onFileSelect, selectedFile }: FileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? FolderOpen : Folder;
    }
    
    switch (file.extension) {
      case 'tsx':
      case 'jsx':
      case 'ts':
      case 'js':
        return FileText;
      case 'json':
      case 'html':
      case 'css':
        return File;
      default:
        return FileText;
    }
  };

  const getFileColor = (file: FileItem) => {
    if (file.type === 'folder') return 'text-accent';
    
    switch (file.extension) {
      case 'tsx':
      case 'jsx':
        return 'text-syntax-variable';
      case 'ts':
      case 'js':
        return 'text-syntax-function';
      case 'json':
        return 'text-syntax-string';
      case 'css':
        return 'text-syntax-keyword';
      case 'html':
        return 'text-orange-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const renderFileItem = (file: FileItem, depth = 0) => {
    const Icon = getFileIcon(file);
    const isExpanded = expandedFolders.has(file.id);
    const isSelected = selectedFile === file.id;

    return (
      <div key={file.id}>
        <div
          className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-muted/50 transition-colors ${
            isSelected ? 'bg-accent/20 text-accent' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id);
            } else {
              onFileSelect(file);
            }
          }}
        >
          {file.type === 'folder' && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
          )}
          <Icon className={`w-4 h-4 ${getFileColor(file)}`} />
          <span className="text-sm truncate">{file.name}</span>
        </div>
        
        {file.type === 'folder' && isExpanded && file.children && (
          <div>
            {file.children.map(child => renderFileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-editor-sidebar border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Explorer
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {sampleFiles.length > 0 ? (
            sampleFiles.map(file => renderFileItem(file))
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              <p>Nenhum arquivo disponível</p>
              <p className="mt-2 text-xs">Aguardando integração com backend</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};