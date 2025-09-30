import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tab {
  id: number;
  name: string;
  isModified?: boolean;
  isActive?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  onTabSelect: (tabId: number) => void;
  onTabClose: (tabId: number) => void;
  activeTab?: number;
}

export const TabBar = ({ tabs, onTabSelect, onTabClose, activeTab }: TabBarProps) => {
  return (
    <div className="flex items-center bg-editor-tab border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer transition-colors min-w-0 ${
            activeTab === tab.id
              ? 'bg-editor-tab-active text-foreground'
              : 'bg-editor-tab text-muted-foreground hover:bg-editor-tab-active/50 hover:text-foreground'
          }`}
          onClick={() => onTabSelect(tab.id)}
        >
          <span className="text-sm truncate max-w-[120px]">
            {tab.name}
            {tab.isModified && <span className="text-accent ml-1">•</span>}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
      
      {tabs.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-8 text-muted-foreground">
          <span className="text-sm">Nenhum arquivo aberto</span>
        </div>
      )}
    </div>
  );
};