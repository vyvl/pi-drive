
export interface IRecord {
    id: number;
    name: string;
    folder: boolean;
    trashed: boolean;
    children: number;
    tags: string[];
    parent: number;
}

export default IRecord;