import { header, handleResponse } from 'helpers';

export const service = {
    get, put, post, _import, destroy, download, downloadWithPost
};

function post(url: any, request_data: any) {
    const form = new FormData();
    Object.keys(request_data).forEach(function (item) {
        if (request_data[item] !== undefined) {
            if (Array.isArray(request_data[item])) {
                request_data[item].forEach(function (value: any, index: any) {
                    form.append(item + '[' + index + ']', JSON.stringify(value));
                });
            } else {
                form.append(item, request_data[item]);
            }
        }
    });
    const requestOptions = {
        method: "POST",
        headers: header(),
        body: form
    };
    return fetch(
        url,
        requestOptions
    ).then(handleResponse);
}

function put(url: any, request_data: any) {
    const requestOptions = {
        method: "PUT",
        headers: header('PUT'),
        body: JSON.stringify(request_data)
    };
    return fetch(
        url,
        requestOptions
    ).then(handleResponse);
}

function get(url: any) {
    const requestOptions = {
        method: "GET",
        headers: header('GET'),
    };
    return fetch(
        url,
        requestOptions
    ).then(handleResponse);
}

function destroy(url: any, request_data = null) {
    const requestOptions = {
        method: "DELETE",
        headers: header('DELETE'),
        body: JSON.stringify(request_data ? request_data : [])
    };
    return fetch(
        url,
        requestOptions
    ).then(handleResponse);
}

function _import(url: any, request_data: any) {
    const form = new FormData();
    Object.keys(request_data).forEach(function (item) {
        if (item === "column") {
            form.append(item, JSON.stringify(request_data[item]));
        } else {
            form.append(item, request_data[item]);
        }
    });
    const requestOptions = {
        method: "POST",
        headers: header(),
        body: form
    };
    return fetch(
        url,
        requestOptions
    ).then(handleResponse);
}

function download(url: any) {
    const requestOptions = {
        method: "GET",
        headers: header('GET'),
    };
    return fetch(
        url,
        requestOptions
    );
}

function downloadWithPost(url: any, request_data: any) {
    const form = new FormData();
    Object.keys(request_data).forEach(function (item) {
        if (request_data[item] !== undefined) {
            if (Array.isArray(request_data[item])) {
                request_data[item].forEach(function (value: any, index: any) {
                    form.append(item + '[' + index + ']', value);
                });
            } else {
                form.append(item, request_data[item]);
            }
        }
    });
    const requestOptions = {
        method: "POST",
        headers: header(),
        body: form
    };
    return fetch(
        url,
        requestOptions
    );
}