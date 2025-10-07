
// fileManager.ts - Sistema de Gerenciamento de Arquivos para VS Code Online

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  parentId?: string;
  isOpen?: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export class FileManager {
  private root: FileNode[] = [];
  private currentFileId: string | null = null;
  private changeListeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  // ============ CRIAR ============
  
  createFile(
    name: string, 
    parentId?: string, 
    content: string = '',
    language?: string
  ): FileNode | null {
    // Validar nome
    if (!this.isValidName(name)) {
      console.error('Nome de arquivo inválido');
      return null;
    }

    // Verificar duplicados
    if (this.isDuplicate(name, parentId)) {
      console.error('Arquivo já existe nesta pasta');
      return null;
    }

    const newFile: FileNode = {
      id: this.generateId(),
      name,
      type: 'file',
      content,
      language: language || this.detectLanguage(name),
      parentId,
      isOpen: false,
      createdAt: new Date(),
      modifiedAt: new Date()
    };

    if (parentId) {
      const parent = this.findById(parentId);
      if (parent?.type === 'folder') {
        parent.children = parent.children || [];
        parent.children.push(newFile);
      } else {
        return null;
      }
    } else {
      this.root.push(newFile);
    }

    this.notifyChanges();
    this.saveToStorage();
    return newFile;
  }

  createFolder(name: string, parentId?: string): FileNode | null {
    if (!this.isValidName(name)) {
      console.error('Nome de pasta inválido');
      return null;
    }

    if (this.isDuplicate(name, parentId)) {
      console.error('Pasta já existe');
      return null;
    }

    const newFolder: FileNode = {
      id: this.generateId(),
      name,
      type: 'folder',
      children: [],
      parentId,
      createdAt: new Date(),
      modifiedAt: new Date()
    };

    if (parentId) {
      const parent = this.findById(parentId);
      if (parent?.type === 'folder') {
        parent.children = parent.children || [];
        parent.children.push(newFolder);
      } else {
        return null;
      }
    } else {
      this.root.push(newFolder);
    }

    this.notifyChanges();
    this.saveToStorage();
    return newFolder;
  }

  // ============ LER ============

  findById(id: string): FileNode | null {
    const search = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(this.root);
  }

  getFileContent(id: string): string | null {
    const file = this.findById(id);
    return file?.type === 'file' ? (file.content || '') : null;
  }

  getFilePath(id: string): string {
    const path: string[] = [];
    let node = this.findById(id);

    while (node) {
      path.unshift(node.name);
      node = node.parentId ? this.findById(node.parentId) : null;
    }

    return '/' + path.join('/');
  }

  getAllFiles(): FileNode[] {
    return this.root;
  }

  getCurrentFile(): FileNode | null {
    return this.currentFileId ? this.findById(this.currentFileId) : null;
  }

  // ============ ATUALIZAR ============

  updateFileContent(id: string, content: string): boolean {
    const file = this.findById(id);
    if (file?.type === 'file') {
      file.content = content;
      file.modifiedAt = new Date();
      this.notifyChanges();
      this.saveToStorage();
      return true;
    }
    return false;
  }

  renameFile(id: string, newName: string): boolean {
    if (!this.isValidName(newName)) return false;

    const node = this.findById(id);
    if (!node) return false;

    // Verificar duplicados
    if (this.isDuplicate(newName, node.parentId, id)) {
      console.error('Nome já existe');
      return false;
    }

    node.name = newName;
    node.modifiedAt = new Date();
    
    if (node.type === 'file') {
      node.language = this.detectLanguage(newName);
    }

    this.notifyChanges();
    this.saveToStorage();
    return true;
  }

  moveFile(id: string, newParentId?: string): boolean {
    const node = this.findById(id);
    if (!node) return false;

    // Não pode mover para dentro de si mesmo
    if (this.isDescendant(id, newParentId)) {
      console.error('Não pode mover para dentro de si mesmo');
      return false;
    }

    // Remover do local atual
    if (!this.removeFromParent(id)) return false;

    // Adicionar no novo local
    node.parentId = newParentId;

    if (newParentId) {
      const parent = this.findById(newParentId);
      if (parent?.type === 'folder') {
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        return false;
      }
    } else {
      this.root.push(node);
    }

    this.notifyChanges();
    this.saveToStorage();
    return true;
  }

  setCurrentFile(id: string | null): void {
    this.currentFileId = id;
    this.notifyChanges();
  }

  toggleFileOpen(id: string): void {
    const file = this.findById(id);
    if (file?.type === 'file') {
      file.isOpen = !file.isOpen;
      this.notifyChanges();
    }
  }

  // ============ DELETAR ============

  deleteFile(id: string): boolean {
    const node = this.findById(id);
    if (!node) return false;

    // Se for o arquivo atual, desselecionar
    if (this.currentFileId === id) {
      this.currentFileId = null;
    }

    // Fechar arquivos deletados
    this.closeFile(id);

    const result = this.removeFromParent(id);
    if (result) {
      this.notifyChanges();
      this.saveToStorage();
    }
    return result;
  }

  private removeFromParent(id: string): boolean {
    const remove = (nodes: FileNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && remove(nodes[i].children!)) {
          return true;
        }
      }
      return false;
    };
    return remove(this.root);
  }

  // ============ UTILIDADES ============

  private generateId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isValidName(name: string): boolean {
    if (!name || name.trim() === '') return false;
    const invalidChars = /[<>:"/\\|?*]/;
    return !invalidChars.test(name);
  }

  private isDuplicate(name: string, parentId?: string, excludeId?: string): boolean {
    const siblings = parentId 
      ? this.findById(parentId)?.children || []
      : this.root;

    return siblings.some(node => 
      node.name === name && node.id !== excludeId
    );
  }

  private isDescendant(ancestorId: string, descendantId?: string): boolean {
    if (!descendantId) return false;
    if (ancestorId === descendantId) return true;

    let current = this.findById(descendantId);
    while (current?.parentId) {
      if (current.parentId === ancestorId) return true;
      current = this.findById(current.parentId);
    }
    return false;
  }

  private detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const langMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'sql': 'sql',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml'
    };
    return langMap[ext] || 'plaintext';
  }

  private closeFile(id: string): void {
    const file = this.findById(id);
    if (file) {
      file.isOpen = false;
      if (file.children) {
        file.children.forEach(child => this.closeFile(child.id));
      }
    }
  }

  // ============ BUSCA E FILTROS ============

  searchFiles(query: string): FileNode[] {
    const results: FileNode[] = [];
    const search = (nodes: FileNode[]) => {
      for (const node of nodes) {
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(node);
        }
        if (node.children) search(node.children);
      }
    };
    search(this.root);
    return results;
  }

  findByExtension(extension: string): FileNode[] {
    const results: FileNode[] = [];
    const search = (nodes: FileNode[]) => {
      for (const node of nodes) {
        if (node.type === 'file' && node.name.endsWith(`.${extension}`)) {
          results.push(node);
        }
        if (node.children) search(node.children);
      }
    };
    search(this.root);
    return results;
  }

  getOpenFiles(): FileNode[] {
    const results: FileNode[] = [];
    const search = (nodes: FileNode[]) => {
      for (const node of nodes) {
        if (node.type === 'file' && node.isOpen) {
          results.push(node);
        }
        if (node.children) search(node.children);
      }
    };
    search(this.root);
    return results;
  }

  // ============ ESTATÍSTICAS ============

  getStats(): {
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
    filesByLanguage: Record<string, number>;
  } {
    let totalFiles = 0;
    let totalFolders = 0;
    let totalSize = 0;
    const filesByLanguage: Record<string, number> = {};

    const count = (nodes: FileNode[]) => {
      for (const node of nodes) {
        if (node.type === 'file') {
          totalFiles++;
          totalSize += node.content?.length || 0;
          const lang = node.language || 'unknown';
          filesByLanguage[lang] = (filesByLanguage[lang] || 0) + 1;
        } else {
          totalFolders++;
        }
        if (node.children) count(node.children);
      }
    };

    count(this.root);
    return { totalFiles, totalFolders, totalSize, filesByLanguage };
  }

  // ============ PERSISTÊNCIA ============

  private saveToStorage(): void {
    const data = {
      root: this.root,
      currentFileId: this.currentFileId,
      timestamp: new Date().toISOString()
    };
    // Salvar em memória (pode adaptar para localStorage/IndexedDB)
    // localStorage.setItem('vscode_files', JSON.stringify(data));
  }

  private loadFromStorage(): void {
    // const saved = localStorage.getItem('vscode_files');
    // if (saved) {
    //   const data = JSON.parse(saved);
    //   this.root = data.root;
    //   this.currentFileId = data.currentFileId;
    // }
  }

  exportProject(): string {
    return JSON.stringify({
      root: this.root,
      stats: this.getStats(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importProject(json: string): boolean {
    try {
      const data = JSON.parse(json);
      this.root = data.root;
      this.notifyChanges();
      this.saveToStorage();
      return true;
    } catch {
      return false;
    }
  }

  // ============ SISTEMA DE EVENTOS ============

  onChange(callback: () => void): () => void {
    this.changeListeners.add(callback);
    return () => this.changeListeners.delete(callback);
  }

  private notifyChanges(): void {
    this.changeListeners.forEach(callback => callback());
  }

  // ============ TEMPLATES ============

  createFromTemplate(type: 'react-component' | 'react-page' | 'typescript' | 'javascript' | 'html', name: string, parentId?: string): FileNode | null {
    const templates = {
      'react-component': {
        extension: 'tsx',
        content: `import React from 'react';\n\ninterface ${name}Props {}\n\nexport const ${name}: React.FC<${name}Props> = () => {\n  return (\n    <div>\n      <h1>${name}</h1>\n    </div>\n  );\n};\n`
      },
      'react-page': {
        extension: 'tsx',
        content: `import React from 'react';\n\nconst ${name}Page: React.FC = () => {\n  return (\n    <div className="page">\n      <h1>${name}</h1>\n      <p>Welcome to ${name}</p>\n    </div>\n  );\n};\n\nexport default ${name}Page;\n`
      },
      'typescript': {
        extension: 'ts',
        content: `// ${name}.ts\n\nexport class ${name} {\n  constructor() {}\n}\n`
      },
      'javascript': {
        extension: 'js',
        content: `// ${name}.js\n\nexport const ${name} = () => {\n  console.log('${name} initialized');\n};\n`
      },
      'html': {
        extension: 'html',
        content: `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${name}</title>\n</head>\n<body>\n  <h1>${name}</h1>\n</body>\n</html>\n`
      }
    };

    const template = templates[type];
    const filename = `${name}.${template.extension}`;
    
    return this.createFile(filename, parentId, template.content);
  }
}