import * as ajax from 'superagent';
import * as Redux from 'redux';
import IRecord from './interfaces/IRecord';
import * as bootbox from 'bootbox';

export function changeParent(parent: number) {
    return (dispatch: Redux.Dispatch<any>) => ajax.get(`files/${parent}/children`).end(function (err, res) {
        if (!err && res) {
            let children = JSON.parse(res.text);
            dispatch({
                type: 'CHANGE_PARENT',
                parent
            })
            dispatch({
                type: 'FETCH_DONE',
                children
            });
        }
    })
}

export function deleteRecord(id: number, trashed: boolean, parent: number) {
    let getUrl = `files/${id}`;
    if (trashed) {
        getUrl = `${getUrl}/trash`;
    }
    return (dispatch: Redux.Dispatch<any>) => {
        ajax.delete(getUrl).end((err, res) => {
            if (!trashed) {
                changePage(err, res, parent, dispatch)
            }
            else {
                if (!err && res) {
                    dispatch({
                        type: 'REMOVE_CHILD',
                        id
                    })
                }
            }
        });
    }
}

export function renameRecord(id: number, name: string) {
    return (dispatch: Redux.Dispatch<any>) => ajax.post(`files/${id}/rename`)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "newName": name })).end((err, res) => updateChild(err, res, dispatch));
}

export function untrashRecord(id: number) {

    return (dispatch: Redux.Dispatch<any>) => ajax.post(`files/${id}/untrash`).end((err, res) => {
        if (!err && res) {
            getTrashedRecords()(dispatch);
        }
        //updateChild(err, res, dispatch);
    });


}

export function doFetch(parent: number) {
    let path = 'root';
    if (!parent)
        return function (dispatch: Redux.Dispatch<any>) {
            ajax.get(`/files/${path}`).end(
                function (err: any, response: ajax.Response) {

                    if (!err && response) {

                        let root = {};
                        try {
                            root = JSON.parse(response.text);
                        }
                        catch (e) {
                            return;
                        }
                        let parent = (root as IRecord).id;
                        ajax.get(`/files/${parent}/children`).end(
                            function (err: any, response: ajax.Response) {
                                if (!err && response) {
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
                            });
                    }
                });
        }
    if (parent) {
        path = `${parent}/children`;
    }
    return function (dispatch: Redux.Dispatch<any>) {
        ajax.get(`/files/${path}`).end(
            function (err: any, response: ajax.Response) {

                if (!err && response) {
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
            });
    }
}

export function addRecord(name: string, parent: number, folder: boolean) {
    let body = { name, parent, folder };
    return (dispatch: Redux.Dispatch<any>) => { return ajax.post('/files').set('Content-Type', 'application/json').send(JSON.stringify(body)).end((err, res) => { newChild(err, res, dispatch) }) }
}

export function addTag(id: number, tag: string) {
    let body = { tags: [tag] };
    return (dispatch: Redux.Dispatch<any>) => { return ajax.post(`/files/${id}/tags`).set('Content-Type', 'application/json').send(JSON.stringify(body)).end((err, res) => { updateChild(err, res, dispatch) }) }
}

export function removeTag(id: number, tag: string) {
    return (dispatch: Redux.Dispatch<any>) => {
        ajax.delete(`files/${id}/tags`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ "tag": tag })).end((err, res) => { updateChild(err, res, dispatch) })
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
    return (dispatch: Redux.Dispatch<any>) => {
        return ajax.post('/files/add_file')
            .send(formData).end((err, res) => { newChild(err, res, dispatch) })
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
    return (dispatch: Redux.Dispatch<any>) => {
        return ajax.post(`/files/${id}/${op}`).set('Content-Type', 'application/json').send(JSON.stringify(body)).end((err, res) => {
            if (!err && res) {
                dispatch({
                    type: 'PASTED'
                });
                changePage(err, res, parent, dispatch)
            }
            else {
                showError(err);
            }
        });
    }
}

export function searchTag(tag: string) {
    return (dispatch: Redux.Dispatch<any>) => {
        ajax.get(`files/list/${tag}`)
            .end((err, res) => {
                if (!err && res) {
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
            })
    }
}

export function searchName(search: string) {
    let body = { search }
    return (dispatch: Redux.Dispatch<any>) => {
        ajax.post(`files/search`)
            .set('Content-Type', 'application/json').
            send(JSON.stringify(body))
            .end((err, res) => {
                if (!err && res) {
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
            })
    }
}

export function shareRecord(recordId: number, userName: string, permission: number = 1) {
    return (dispatch: Redux.Dispatch<any>) => {
        ajax.post('shared/add')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({
                record_id: recordId,
                user_name: userName,
                permission: permission
            })).end((err, res) => {
                if (!err && res) {
                    bootbox.alert('Shared File Sucessfully');
                }
                else {
                    showError(err);
                }

            })
    }
}

export function getSharedRecords() {
    return (dispatch: Redux.Dispatch<any>) => {
        ajax.get(`shared/list/`)
            .end((err, res) => {
                if (!err && res) {
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
            })
    }
}

export function getLoggedInUser() {
    return (dispatch: Redux.Dispatch<any>) => {
        ajax.get(`users/getLoggedInUser`).end((err, res) => {
            if (!err && res) {
                let user = JSON.parse(res.text);
                dispatch({
                    type: 'CHANGE_USER',
                    user
                })
            }
        })
    }
}

export function getTrashedRecords() {
    return (dispatch: Redux.Dispatch<any>) => {
        ajax.get(`files/list/trash/`)
            .end((err, res) => {
                if (!err && res) {
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
            })
    }
}

function newChild(err: any, res: ajax.Response, dispatch: Redux.Dispatch<any>) {
    if (!err && res) {
        let child = JSON.parse(res.text);
        dispatch({
            type: 'NEW_CHILD',
            child
        });
    }
}
function updateChild(err: any, res: ajax.Response, dispatch: Redux.Dispatch<any>) {
    if (!err && res) {
        let child = JSON.parse(res.text);
        dispatch({
            type: 'UPDATE_CHILD',
            child
        });
    }

}

function changePage(err: any, res: ajax.Response, parent: number, dispatch: Redux.Dispatch<any>) {
    if (!err && res) {
        ajax.get(`files/${parent}/children`).end(function (err, res) {
            if (!err && res) {
                let children = JSON.parse(res.text);
                dispatch({
                    type: 'FETCH_DONE',
                    children
                })
            }
        });
    }
}
function showError(err: any) {
    bootbox.alert(JSON.parse(err.response.text).message);
}