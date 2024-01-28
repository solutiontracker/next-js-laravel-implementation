export function header(method = 'POST'): any {
    const token: any = localStorage?.getItem('token') as any;
    if (token !== undefined && token !== null) {
        if (method === 'PUT' || method === 'DELETE')
            return { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'Content-Type': 'application/json' };
        else
            return { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' };

    } else {
        if (method === 'PUT' || method === 'DELETE')
            return { 'Accept': 'application/json', 'Content-Type': 'application/json' };
        else
            return { 'Accept': 'application/json' };
    }
}