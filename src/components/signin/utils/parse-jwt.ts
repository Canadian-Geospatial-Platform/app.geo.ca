// todo: might need to be changed to take into account front end and back end context. (atob does not exist in node context)

type ParsedJWT = {
    given_name: string,
    name: string,
    family_name: string,
    email: string,
    'cognito:username': string,
    exp: number
}

const parseJwt = function (unparsedToken: string) {
    var base64Url = unparsedToken.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload) as ParsedJWT;
};

export { parseJwt };
