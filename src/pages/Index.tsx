import { useState } from "react";
import { MenuBar } from "@/components/MenuBar";
import { FileExplorer } from "@/components/FileExplorer";
import { TabBar } from "@/components/TabBar";
import { CodeEditor } from "@/components/CodeEditor";
import { Terminal } from "@/components/Terminal";
import { GitPanel } from "@/components/GitPanel";



interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: FileItem[];
}

interface Tab {
  id: string;
  name: string;
  isModified?: boolean;
  content: string;
  language: string;
}

const sampleCode = `import React, { useState, useEffect } from 'react';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // API call simulation
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de Usuários</h1>
      </header>
      
      <main>
        {users.length > 0 ? (
          <ul className="user-list">
            {users.map(user => (
              <li key={user.id} className="user-item">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum usuário encontrado</p>
        )}
      </main>
    </div>
  );
}

export default App;`;

const Index = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  
  const [activeTab, setActiveTab] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGitPanelOpen, setIsGitPanelOpen] = useState(false);

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      const existingTab = tabs.find(tab => tab.id === file.id);
      
      if (!existingTab) {
        const newTab: Tab = {
          id: file.id,
          name: file.name,
          content: `// Conteúdo do arquivo ${file.name}\n\nconsole.log('Hello from ${file.name}');`,
          language: file.extension === 'tsx' ? 'typescript' : file.extension || 'text',
          isModified: false
        };
        
        setTabs(prev => [...prev, newTab]);
      }
      
      setActiveTab(file.id);
    }
  };

  const handleTabClose = (tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[0].id : '');
    }
  };

  const handleCodeChange = (code: string) => {
    setTabs(prev => 
      prev.map(tab => 
        tab.id === activeTab 
          ? { ...tab, content: code, isModified: true }
          : tab
      )
    );
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="h-screen flex flex-col bg-editor-bg overflow-hidden">
      <MenuBar 
        onTerminalToggle={() => setIsTerminalOpen(!isTerminalOpen)}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onGitPanelToggle={() => setIsGitPanelOpen(!isGitPanelOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-200 overflow-hidden`}>
          <FileExplorer 
            onFileSelect={handleFileSelect}
            selectedFile={activeTab}
          />
        </div>

        {/* Main Editor Area */}
        <div className="flex flex-col flex-1">
          <TabBar
            tabs={tabs.map(tab => ({
              id: tab.id,
              name: tab.name,
              isModified: tab.isModified
            }))}
            onTabSelect={setActiveTab}
            onTabClose={handleTabClose}
            activeTab={activeTab}
          />
          
          <div className="flex-1 overflow-hidden">
            {currentTab ? (
              <CodeEditor
                fileName={currentTab.name}
                language={currentTab.language}
                code={currentTab.content}
                onChange={handleCodeChange}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-editor-bg">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">VS Code Online</h2>
                  <p className="text-muted-foreground">Selecione um arquivo no explorador para começar a editar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Git Panel */}
        {isGitPanelOpen && (
          <GitPanel 
            isOpen={isGitPanelOpen}
            onToggle={() => setIsGitPanelOpen(!isGitPanelOpen)}
          />
        )}
      </div>

      {/* Terminal */}
      <Terminal 
        isOpen={isTerminalOpen}
        onToggle={() => setIsTerminalOpen(!isTerminalOpen)}
      />
    </div>
  );
};

export default Index;
