import { BASE_URL } from '../constants'


const request = async (options, token) => {
    const headers = new Headers();

    if (options.setContentType !== false) {
        headers.append("Content-Type", "application/json");
    }

    headers.append(
        "Authorization",
        "Bearer " + token
    );


    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return await fetch(options.url, options).then((response) =>
        response.json().then((json) => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
}


export function getGroupMessages(token) {
    return request({
        url: BASE_URL + "/chat/messages",
        method: "GET",
    }, token);
}
export function countNewMessages(senderId, recipientId, token) {
    return request({
        url: BASE_URL + "/messages/" + senderId + "/" + recipientId + "/count",
        method: "GET",
    }, token);
}

export function findChatMessages(senderId, recipientId, token) {

    return request({
        url: BASE_URL + "/messages/" + senderId + "/" + recipientId,
        method: "GET",
    }, token);
}

export function findChatMessage(id) {


    return request({
        url: BASE_URL + "/messages/" + id,
        method: "GET",
    });
}

export function getUsers() {
    return request({
        url: BASE_URL + "/users",
        method: "GET",
    });
}