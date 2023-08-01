/* eslint-disable prettier/prettier */

export function envglobals(): globalValues {
    const { hostname } = window.location;
    // console.log(hostname);
    const endpoints = {
        SEARCH: '/geo',
        METADATA: '/id',
        COLLECTIONS: '/collections',
        ANALYTIC: '/analytics',
        SORTBY: '/sorting',
    };
    switch (hostname) {
        case 'localhost':
            return {
                LOGO_SITE_LINK_URL: {
                    en: 'http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/',
                    fr: 'http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/',
                },
                APP_API_DOMAIN_URL: 'https://qgqt1tniy2.execute-api.ca-central-1.amazonaws.com/live',
                APP_API_ENDPOINTS: endpoints,
                APP_GEOCORE_URL: 'https://geocore-dev.metadata.geo.ca',
                SITE_NAME: 'localhost',
                JSON_SERVER_URL: 'http://localhost:3000',
                APP_GEOLOCATOR_URL: 'https://tkyuwlg5f7.execute-api.ca-central-1.amazonaws.com/live/',
            };
        case 'app-dev.geo.ca':
            return {
                LOGO_SITE_LINK_URL: {
                    en: 'https://dev.geo.ca/home/index.html',
                    fr: 'https://dev.geo.ca/fr/accueil/index.html',
                },
                APP_API_DOMAIN_URL: 'https://geocore-dev.api.geo.ca',
                APP_API_ENDPOINTS: endpoints,
                APP_GEOCORE_URL: 'https://geocore-dev.metadata.geo.ca',
                SITE_NAME: 'dev.geo.ca',
                APP_GEOLOCATOR_URL: 'https://geolocator-dev.api.geo.ca/',
            };
        case 'app-stage.geo.ca':
            return {
                LOGO_SITE_LINK_URL: {
                    en: 'https://stage.geo.ca/home/index.html',
                    fr: 'https://stage.geo.ca/fr/accueil/index.html',
                },
                APP_API_DOMAIN_URL: 'https://geocore-stage.api.geo.ca',
                APP_API_ENDPOINTS: endpoints,
                APP_GEOCORE_URL: 'https://geocore-stage.metadata.geo.ca',
                SITE_NAME: 'stage.geo.ca',
                APP_GEOLOCATOR_URL: 'https://geolocator-stage.api.geo.ca/',
            };
        case 'app.geo.ca':
            return {
                LOGO_SITE_LINK_URL: {
                    en: 'https://geo.ca/home/index.html',
                    fr: 'https://geo.ca/fr/accueil/index.html',
                },
                APP_API_DOMAIN_URL: 'https://geocore.api.geo.ca',
                APP_API_ENDPOINTS: endpoints,
                APP_GEOCORE_URL: 'https://geocore.metadata.geo.ca',
                SITE_NAME: 'geo.ca',
                APP_GEOLOCATOR_URL: 'https://geolocator.api.geo.ca/',
            };
        default:
            return {
                LOGO_SITE_LINK_URL: {
                    en: 'http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/',
                    fr: 'http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/',
                },
                APP_API_DOMAIN_URL: 'https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev',
                APP_API_ENDPOINTS: endpoints,
                APP_GEOCORE_URL: 'https://geocore-dev.metadata.geo.ca',
                SITE_NAME: 'dev.geo.ca',
                APP_GEOLOCATOR_URL: 'https://geolocator-dev.api.geo.ca/',
            };
    }
}

interface globalValues {
    LOGO_SITE_LINK_URL: {
        en: string;
        fr: string;
    };
    APP_API_DOMAIN_URL: string;
    APP_API_ENDPOINTS: {
        SEARCH: string;
        METADATA: string;
        ANALYTIC: string;
    };
    APP_GEOCORE_URL: string;
    SITE_NAME: string;
    JSON_SERVER_URL?: string;
    APP_GEOLOCATOR_URL?: string;
}
