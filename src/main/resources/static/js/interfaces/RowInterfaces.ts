export interface IProps {
    id: number;
    name: string;
    parent: number;
    folder: boolean;
    trashed: boolean;
    children: number;
    tags: string[];
    changeParent(id: number): any;
    deleteRecord(id: number, trashed: boolean, parent: number): any;
    renameRecord(id: number, newName: string): any;
    untrashRecord(id: number): any;
    addTag(id: number, tag: string): any;
    removeTag(id: number, tag: string): any;
    shareRecord(id: number, userName: string, permission: number): any;
    copy(id: number): any;
    move(id: number): any;
}

export interface IFileProps {
    name: string
    id: number;
    parent: number;
    rename(id: number): void;
    trashed: boolean;
    untrashRecord(id: number): void;
    deleteRecord(id: number, trashed: boolean, parent: number): void;
    addTag(id: number): void;
    tags: string[];
    removeTag(id: number, tag: string): void;
    copy(id: number): void;
    move(id: number): void;
    shareRecord(id: number): void;
}

export interface IFolderProps {
    name: string;
    id: number;
    parent: number;
    rename(id: number): void;
    children: number;
    trashed: boolean;
    untrashRecord(id: number): void;
    deleteRecord(id: number, trashed: boolean, parent: number): void;
    addTag(id: number): void;
    tags: string[];
    removeTag(id: number, tag: string): void;
    move(id: number): void;
    shareRecord(id: number): void;
    changeParent(id: number): void;
}