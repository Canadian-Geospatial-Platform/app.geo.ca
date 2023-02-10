/* eslint-disable prettier/prettier */

export function envglobals() : globalValues {
        const { hostname }= window.location;
        // console.log(hostname);
        const endpoints = {
            SEARCH: "/geo",
            METADATA: "/id",
            COLLECTIONS: "/collections",
            ANALYTIC: "/analytics",
            ANNOUNCEMENTS:"/announcements",
            MYCOMMUNITY:"/community/my_community"
        }
        switch(hostname) {
            case "localhost":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/",
                        fr: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://qgqt1tniy2.execute-api.ca-central-1.amazonaws.com/live",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-dev.metadata.geo.ca",
                    SITE_NAME: "localhost"
                };
            case "app-dev.geo.ca":   
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://dev.geo.ca/home/index.html",
                        fr: "https://dev.geo.ca/fr/accueil/index.html"
                    },    
                    APP_API_DOMAIN_URL: "https://geocore-dev.api.geo.ca",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-dev.metadata.geo.ca",
                    SITE_NAME: "dev.geo.ca"
                };
            case "app-stage.geo.ca":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://stage.geo.ca/home/index.html",
                        fr: "https://stage.geo.ca/fr/accueil/index.html"
                    },    
                    APP_API_DOMAIN_URL: "https://geocore-stage.api.geo.ca",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-stage.metadata.geo.ca",
                    SITE_NAME: "stage.geo.ca"
                };
            case "app.geo.ca":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://geo.ca/home/index.html",
                        fr: "https://geo.ca/fr/accueil/index.html"
                    },    
                    APP_API_DOMAIN_URL: "https://geocore.api.geo.ca",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore.metadata.geo.ca",
                    SITE_NAME: "geo.ca"
                };    
            default:
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/",
                        fr: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev",
                    APP_API_ENDPOINTS: endpoints,
                    APP_GEOCORE_URL: "https://geocore-dev.metadata.geo.ca",
                    SITE_NAME: "dev.geo.ca"
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
        ANNOUNCEMENTS: string;
        MYCOMMUNITY: string;
    };
    APP_GEOCORE_URL: string;
    SITE_NAME: string;
}


