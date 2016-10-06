import IRecord from './interfaces/IRecord';
import * as ajax from 'superagent';
import { combineReducers } from 'redux';

export const reducers = combineReducers({
    children, parent, modals, op, user
});

function children(state: IRecord[] = [], action: any): IRecord[] {
    switch (action.type) {
        case 'FETCH_DONE':
            return action.children;
        case 'UPDATE_CHILD':
            return updateChildren(state, action.child);
        case 'REMOVE_CHILD':
            return removeChild(state, action.id);
        case 'NEW_CHILD':
            return addChild(state, action.child);
        case 'FILTER_TAG':
            return action.children
        default:
            return state;
    }
}


function parent(state: number = null, action: any): number {
    switch (action.type) {
        case 'CHANGE_PARENT':
            return action.parent ? action.parent : null;
        default:
            return state;
    }
}

function modals(state = { upload: false }, action: any) {
    let newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case 'SHOW_UPLOAD_DIALOG':
            newState.upload = true;
            return newState;
        case 'HIDE_UPLOAD_DIALOG':
            newState.upload = false;
            return newState;
        default:
            return state;
    }

}

function op(state: any = { id: null, type: 'COPY' }, action: any) {
    switch (action.type) {
        case 'COPY':
        case 'MOVE':
            let newState = JSON.parse(JSON.stringify(state));
            newState.id = action.id;
            newState.type = action.type
            return newState;
        case 'PASTED':
            return { id: null, type: 'COPY' };

        default:
            return state;

    }
}

function user(state: any = {}, action: any) {
    switch (action.type) {
        case 'CHANGE_USER':
            return action.user;
        default:
            return state;
    }
}

function updateChildren(children: IRecord[], child: IRecord): IRecord[] {
    let newChildren = children.map((currentChild) => {
        return (currentChild.id == child.id) ? child : currentChild;
    })
    return newChildren;
}

function removeChild(children: IRecord[], id: number): IRecord[] {
    let newChildren = children.filter((child) => {
        return child.id != id;
    });
    return newChildren;
}

function addChild(children: IRecord[], child: IRecord): IRecord[] {
    return children.concat([child]);
}
