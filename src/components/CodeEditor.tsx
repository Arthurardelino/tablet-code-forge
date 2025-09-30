import { useState } from "react";
import { FileText, Play, Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  fileName: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
}

export const CodeEditor = ({ fileName, language, code, onChange }: CodeEditorProps) => {
  const [lineNumbers, setLineNumbers] = useState(code.split('\n').length);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    onChange(newCode);
    setLineNumbers(newCode.split('\n').length);
  };

  const renderLineNumbers = () => {
    return Array.from({ length: lineNumbers }, (_, i) => (
      <div
        key={i + 1}
        className="text-editor-line-number text-xs leading-6 text-right pr-3 select-none"
      >
        {i + 1}
      </div>
    ));
  };

  const highlightSyntax = (code: string) => {
    if (!code) return '';
    
    // Simple syntax highlighting for demonstration
    return code
      .replace(/(function|const|let|var|if|else|for|while|return|import|export|class|interface|type)/g, 
        '<span class="text-syntax-keyword font-semibold">$1</span>')
      .replace(/(["'][^"']*["'])/g, '<span class="text-syntax-string">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-syntax-comment italic">$1</span>')
      .replace(/(\w+)(\s*\()/g, '<span class="text-syntax-function">$1</span>$2');
  };

  return (
    <div className="flex flex-col h-full bg-editor-bg">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-editor-sidebar border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">{fileName}</span>
          <span className="text-xs text-muted-foreground">({language})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Play className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-editor-sidebar border-r border-border min-w-[50px] py-4 overflow-y-auto">
          {renderLineNumbers()}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative overflow-y-auto">
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-foreground font-mono text-sm leading-6 resize-none outline-none z-10 overflow-y-auto"
            style={{
              background: 'transparent',
              color: 'transparent',
              caretColor: 'hsl(var(--accent))',
            }}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
          
          {/* Syntax Highlighted Display */}
          <div 
            className="absolute inset-0 p-4 font-mono text-sm leading-6 pointer-events-none whitespace-pre-wrap break-words overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }}
          />
        </div>
      </div>
    </div>
  );
};