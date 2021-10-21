/* eslint-disable prettier/prettier */

export function envglobals() : globalValues {
        const endpoints = {
            SEARCH: "/geo",
            METADATA: "/id",
            ANALYTIC: "/analytics"
        }
        switch(process.env.NODE_ENV) {
            case "development":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://dev.geo.ca/home/index.html",
                        fr: "https://dev.geo.ca/fr/accueil/index.html"
                    },    
                    APP_API_DOMAIN_URL: "https://geocore-dev.api.geo.ca",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-dev.metadata.geo.ca"
                };
            case "stage":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://stage.geo.ca/home/index.html",
                        fr: "https://stage.geo.ca/fr/accueil/index.html"
                    },    
                    APP_API_DOMAIN_URL: "https://geocore-stage.api.geo.ca",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-stage.metadata.geo.ca"
                };
            case "production":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://geo.ca/home/index.html",
                        fr: "https://geo.ca/fr/accueil/index.html"
                    },    
                    APP_API_DOMAIN_URL: "https://geocore.api.geo.ca",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore.metadata.geo.ca"
                };    
            default:
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://stage.geo.ca/home/",
                        fr: "https://stage.geo.ca/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://geocore-stage.api.geo.ca",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-stage.metadata.geo.ca"
                };
        };
}; 

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
    APP_GEOCORE_URL: string
}


