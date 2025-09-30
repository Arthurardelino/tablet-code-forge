import { set } from "date-fns";
import { createInflate } from "zlib";

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

export class filemanager {
    private root: FileExplorer[] = [];
    private currentFildId: string | null = null;
    private changeListeners: Set<() => void> = new Set();
}

createInflate(
    
)