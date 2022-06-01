/* eslint-disable prettier/prettier */
export function getQueryParams(querystring: string):{ [key: string]: string } {
    const queryParams: { [key: string]: string } = {};

    if (querystring && querystring !== '') {
        querystring
            .substr(1)
            .split('&')
            .forEach((q: string) => {
                q.replace(/\+/g, ' ');
                console.log(q);
                const item = q.split('=');
                queryParams[item[0]] = decodeURI(item[1]);
            });
    }
    return queryParams;
}
