
import IUser from "./IUser";
import IRecord from "./IRecord";
export interface IState {
    parent: number;
    children: IRecord[];
    op: IOp;
    user: IUser;
    modals: Modal;

}

interface IOp {
    id: number;
    type: string;
}

interface Modal {
    upload: boolean;
}

export default IState;