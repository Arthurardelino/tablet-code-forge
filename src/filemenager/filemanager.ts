export interface FileExplorer {
    id: string;
    name: string;
    type: 'file' | 'folder';
    content?: string;
    language?: string;
    children?: FileExplorer[];
    parentId?: string;
    isOpen?: boolean;
    createdAt: Date;
    modifiedAt: Date;
}

export class FileManager {
    private root: FileExplorer[] = [];
    private currentFileId: string | null = null;
    private changeListeners: Set<() => void> = new Set();

    // Implementação futura do gerenciador de arquivos
}
