export interface IProps {
    id: number;
    name: string;
    parent: number;
    folder: boolean;
    trashed: boolean;
    children: number;
    tags: string[];
    changeParent(id: Number): void;
    deleteRecord(id: Number, trashed: boolean): void;
    renameRecord(id: Number, newName: String): void;
    untrashRecord(id: number): void;
    addTag(id: Number, tag: String): void;
    removeTag(id: Number, tag: String): void;
    shareRecord(id: Number, userName: String, permission: Number): void;
    copy(id: Number): void;
    move(id: Number): void;
}

export interface IFileProps {
    name:string
    id: Number;
    parent: number;
    rename(id: Number): void;
    trashed: boolean;
    untrashRecord(id: Number): void;
    deleteRecord(id: Number, trashed: boolean,parent:Number): void;
    addTag(id: Number): void;
    tags: String[];
    removeTag(id: Number, tag: String): void;
    copy(id: Number): void;
    move(id: Number): void;
    shareRecord(id: Number): void;
}

export interface IFolderProps {
    name: string;
    id: Number;    
    parent: number;
    rename(id: Number): void;
    children: Number;
    trashed: boolean;
    untrashRecord(id: Number): void;
    deleteRecord(id: Number, trashed: boolean,parent:Number): void;
    addTag(id: Number): void;
    tags: String[];
    removeTag(id: Number, tag: String): void;
    move(id: Number): void;
    shareRecord(id: Number): void;
    changeParent(id: Number): void;
}