// This file will contain logic for retrieving and managing a JWT to log in the user.
// todo
// - set nonce
// - set redirect url

// exchange the code received for a JWT
import { urlEncode } from './url-encode';
import { parseJwt } from './parse-jwt';
import { jwtIsValid } from './type-validations/jwt';

const SIGN_IN_PAGE_URL = 'https://auth-dev.geo.ca/oauth2/authorize';
const CLIENT_ID = '7b4mbo0osnfb6cer4f980kob0t';
const CUSTOM_DOMAIN = 'https://auth-dev.geo.ca';
const OPEN_ID_CONFIGURATION_URL = 'https://id-dev.geo.ca/ca-central-1_7DZIA1rpl/.well-known/openid-configuration'
let openIdConfiguration = null;

// @param url the url to the .well-know/openid-configuration endpoint. (ex: https://id-dev.geo.ca/ca-central-1_7DZIA1rpl/.well-known/openid-configuration)
const getOpenIdConfiguration = async function() {
    if (openIdConfiguration == null) {
        openIdConfiguration = await fetch(OPEN_ID_CONFIGURATION_URL, {
            method: 'GET',
        })       .then((response) => response.json())
        .then((data) => {
            const res = data;
            if (!res) throw 'Falsy openIdConfiguration returned from request.';
            if (res.error) throw 'Error message returned from authorization server:\n' + res.error;
            return res;
        })
        .catch((error) => {
            console.error('Error:', error);
            throw 'Error:' + error;
        });
    }
    return openIdConfiguration;
}

const getJWT = async function (code, signInPageUrl) {
    let x = await getOpenIdConfiguration();
    let y = await getOpenIdConfiguration();
    console.log("oidc config:\n", x)
    console.log("oidc config2:\n", y)
    console.log('getJwt');
    const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: signInPageUrl,
        client_id: CLIENT_ID
    };
    console.log(data);
    const url = CUSTOM_DOMAIN + '/token';
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: urlEncode(data)
    })
        .then((response) => response.json())
        .then((data) => {
            const res = data;
            if (!res) throw 'Falsy Jwt returned.';
            if (res.error) throw 'Error message returned from authorization server:\n' + res.error;
            console.log("getJwt response is:\n", res)
            return res;
        })
        .catch((error) => {
            console.error('Error:', error);
            throw 'Error:' + error;
        });
};

// todo: It should be ensured that redirectUrl is a secure value. The value comming back from the server could be tampered with.
const signIn = async function (code, signInPageUrl, state) {
    const jwt = await getJWT(code, signInPageUrl);
    console.log("setting jwt: \n", jwt)
    sessionStorage.setItem('token', JSON.stringify(jwt));
    console.log(jwt);
    window.location = (state);
};

const getRefreshedJWT = function () {
    const refreshToken = JSON.parse(sessionStorage.getItem('token')).refresh_token;
    const data = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        scope: 'openid'
    };
    const url = CUSTOM_DOMAIN + '/token';
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: urlEncode(data)
    })
        .then((response) => response.json())
        .then((data) => {
            const res = data;
            if (!res) throw 'Falsy Jwt returned.';
            if (res.error) throw 'Error message returned from authorization server:\n' + res.error;
            return res;
        })
        .catch((error) => {
            console.error('Error:', error);
            throw 'Error:' + error;
        });
};

// todo: set nonce
const redirectToAuthProvider = function (signInPageUrl, currentPage) {
    const url = SIGN_IN_PAGE_URL + '?';
    const data = {
        client_id: CLIENT_ID,
        response_type: 'code',
        scope: 'openid',
        redirect_uri: signInPageUrl,
        state: currentPage
    };
    console.log('redirectoauthprovider');
    console.log(url);
    console.log(data);
    window.location = (url + urlEncode(data));
};

const requireLogin = async function (jwt, signInPageUrl, currentPage) {
    console.log('jwt is:\n', jwt);
    if (!currentPage) currentPage = '/';
    if (!signInPageUrl) console.error('signInPageUrl not set in requireLogin function.');
    if (!jwtIsValid(jwt)) {
        console.log('User is not logged in -> logging in');
        console.log('jwt:');
        console.log(jwt);
        console.log('signinpageurl:');
        console.log(signInPageUrl);
        console.log('currentpage:');
        console.log(currentPage);
        redirectToAuthProvider(signInPageUrl, currentPage);
    } else if (parseJwt(jwt.access_token).exp != null && parseJwt(jwt.access_token).exp < Date.now() / 1000 - 300) {
        console.log('User is logged in but token is expired -> refreshing jwt');
        const newJWT = await getRefreshedJWT();
        sessionStorage.setItem('token', JSON.stringify(newJWT));
    } else {
        console.log('User is logged in and token is not expired -> proceding with request');
    }
};

const getToken = function () {
    try {
        const token = JSON.parse(sessionStorage.getItem('token'));
        return token;
    } catch (error) {
        return null;
    }
};

export { requireLogin, signIn, getToken };
