
import IUser from "./IUser";
import IRecord from "./IRecord";
export interface IState {
    parent: number;
    children: IRecord[];
    op: IOp;
    user: IUser;
    modals: modal

}

interface IOp {
    id: number;
    type: string;
}

interface modal {
    upload: boolean;
}

export default IState;