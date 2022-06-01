/* eslint-disable prettier/prettier */
export function getQueryParams(querystring: string):{ [key: string]: string } {
    const queryParams: { [key: string]: string } = {};

    if (querystring && querystring !== '') {
        querystring
            .substr(1)
            .split('&')
            .replace(/\+/g, ' ')
            .forEach((q: string) => {
                const item = q.split('=');
                /* const item = item_split.replace(/\+/g, ' ');*/
                queryParams[item[0]] = decodeURI(item[1]);
            });
    }
    return queryParams;
}
