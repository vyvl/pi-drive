import * as ajax from 'superagent';
import * as Redux from 'redux';
import IRecord from './interfaces/IRecord';
import * as bootbox from 'bootbox';

export function changeParent(parent: number) {
    return async (dispatch: Redux.Dispatch<any>) => {
        try {
            let res = await ajax.get(`files/${parent}/children`);
            let children = JSON.parse(res.text);
            dispatch({
                type: 'CHANGE_PARENT',
                parent
            })
            dispatch({
                type: 'FETCH_DONE',
                children
            });
        } catch (error) {

        }
    }
}

export function deleteRecord(id: number, trashed: boolean, parent: number) {
    let getUrl = `files/${id}`;
    if (trashed) {
        getUrl = `${getUrl}/trash`;
    }
    return async (dispatch: Redux.Dispatch<any>) => {
        try {
            let res = await ajax.delete(getUrl);
            if (!trashed) {
                changePage(res, parent, dispatch);
            }
            else {
                dispatch({
                    type: 'REMOVE_CHILD',
                    id
                })
            }
        } catch (error) {

        }
    }
}

export function renameRecord(id: number, name: string) {
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.post(`files/${id}/rename`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ "newName": name }));
        updateChild(res, dispatch);
    }
}

export function untrashRecord(id: number) {
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.post(`files/${id}/untrash`);
        getTrashedRecords()(dispatch);
    }
}

export function doFetch(parent: number) {
    let path = 'root';
    if (!parent)
        return async function (dispatch: Redux.Dispatch<any>) {
            let res = await ajax.get(`/files/${path}`);
            let root = {};
            try {
                root = JSON.parse(res.text);
            }
            catch (e) {
                return;
            }
            let parent = (root as IRecord).id;
            let response = await ajax.get(`/files/${parent}/children`);
            let children = JSON.parse(response.text);
            dispatch({
                type: 'CHANGE_PARENT',
                parent
            })
            dispatch({
                type: 'FETCH_DONE',
                children
            })
        }
    if (parent) {
        path = `${parent}/children`;
    }
    return async function (dispatch: Redux.Dispatch<any>) {
        let res = await ajax.get(`/files/${path}`);
        let children = JSON.parse(res.text);
        dispatch({
            type: 'CHANGE_PARENT',
            parent
        })
        dispatch({
            type: 'FETCH_DONE',
            children
        })
    }
}

export function addRecord(name: string, parent: number, folder: boolean) {
    let body = { name, parent, folder };
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.post('/files').set('Content-Type', 'application/json').send(JSON.stringify(body));
        newChild(res, dispatch);
    }
}

export function addTag(id: number, tag: string) {
    let body = { tags: [tag] };
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.post(`/files/${id}/tags`).set('Content-Type', 'application/json').send(JSON.stringify(body));
        updateChild(res, dispatch)
    }
}

export function removeTag(id: number, tag: string) {
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.delete(`files/${id}/tags`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ "tag": tag }));
        updateChild(res, dispatch);
    }
}

export function fileUploadModal() {

    return ({
        type: 'SHOW_UPLOAD_DIALOG'
    });

}

export function closeFileUploadModal() {

    return ({
        type: 'HIDE_UPLOAD_DIALOG'
    });

}

export function uploadFile(parent: number, file: File) {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('parentId', parent || -1);
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.post('/files/add_file').send(formData);
        newChild(res, dispatch);
    }
}

export function move(id: number) {
    return {
        id, type: 'MOVE'
    };
}

export function copy(id: number) {
    return {
        id, type: 'COPY'
    };
}

export function paste(id: number, parent: number, op: string) {
    let body = { newParent: parent };
    op = op.toLowerCase();
    return async (dispatch: Redux.Dispatch<any>) => {
        try {
            let res = await ajax.post(`/files/${id}/${op}`).set('Content-Type', 'application/json').send(JSON.stringify(body));
            dispatch({
                type: 'PASTED'
            });
            changePage(res, parent, dispatch)
        } catch (error) {
            showError(error);
        }
    }
}

export function searchTag(tag: string) {
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.get(`files/list/${tag}`)
        if (res) {
            let children: IRecord[] = JSON.parse(res.text);
            dispatch({
                type: 'CHANGE_PARENT',
                parent: null
            })
            dispatch({
                type: 'FETCH_DONE',
                children
            });
        }
    }
}

export function searchName(search: string) {
    let body = { search }
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.post(`files/search`)
            .set('Content-Type', 'application/json').
            send(JSON.stringify(body));
        if (res) {
            let children: IRecord[] = JSON.parse(res.text);
            dispatch({
                type: 'CHANGE_PARENT',
                parent: null
            })
            dispatch({
                type: 'FETCH_DONE',
                children
            });
        }

    }
}

export function shareRecord(recordId: number, userName: string, permission: number = 1) {
    return async (dispatch: Redux.Dispatch<any>) => {
        try {
            let res = await ajax.post('shared/add')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify({
                    record_id: recordId,
                    user_name: userName,
                    permission: permission
                }));
            bootbox.alert('Shared File Sucessfully');
        } catch (error) {
            showError(error);

        }
    }
}

export function getSharedRecords() {
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.get(`shared/list/`);
        let children: IRecord[] = JSON.parse(res.text);
        dispatch({
            type: 'CHANGE_PARENT',
            parent: null
        })
        dispatch({
            type: 'FETCH_DONE',
            children
        });
    }
}

export function getLoggedInUser() {
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.get(`users/getLoggedInUser`);
        let user = JSON.parse(res.text);
        dispatch({
            type: 'CHANGE_USER',
            user
        })
    }
}

export function getTrashedRecords() {
    return async (dispatch: Redux.Dispatch<any>) => {
        let res = await ajax.get(`files/list/trash/`);
        let children: IRecord[] = JSON.parse(res.text);
        dispatch({
            type: 'CHANGE_PARENT',
            parent: null
        })
        dispatch({
            type: 'FETCH_DONE',
            children
        });
    }
}

function newChild(res: ajax.Response, dispatch: Redux.Dispatch<any>) {
    let child = JSON.parse(res.text);
    dispatch({
        type: 'NEW_CHILD',
        child
    });
}
function updateChild(res: ajax.Response, dispatch: Redux.Dispatch<any>) {
    let child = JSON.parse(res.text);
    dispatch({
        type: 'UPDATE_CHILD',
        child
    });
}

async function changePage(res: ajax.Response, parent: number, dispatch: Redux.Dispatch<any>) {
    let response = await ajax.get(`files/${parent}/children`);
    let children = JSON.parse(response.text);
    dispatch({
        type: 'FETCH_DONE',
        children
    })
}

function showError(err: any) {
    bootbox.alert(JSON.parse(err.response.text).message);
}