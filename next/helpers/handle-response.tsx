export async function handleResponse(response: { text: () => Promise<any>; ok: any; status: number; statusText: any; }) {
    const text = await response?.text();
    const data = text && JSON.parse(text);
    if (!response.ok && response.status === 401) {
        localStorage.removeItem('token');
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    } else if (!response.ok && response.status === 503) {
        const error_1 = (data && data.message) || response.statusText;
        return Promise.reject(error_1);
    }
    return data;
}