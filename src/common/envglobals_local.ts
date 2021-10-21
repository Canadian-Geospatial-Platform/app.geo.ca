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
                        en: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/",
                        fr: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-dev.metadata.geo.ca"
                };
            case "stage":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://stage.geo.ca/home/",
                        fr: "https://stage.geo.ca/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-stage.metadata.geo.ca"
                };
            case "production":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://stage.geo.ca/home/",
                        fr: "https://stage.geo.ca/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore.metadata.geo.ca"
                };    
            default:
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://stage.geo.ca/home/",
                        fr: "https://stage.geo.ca/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging",
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

