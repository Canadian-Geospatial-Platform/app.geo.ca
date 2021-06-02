/* eslint-disable prettier/prettier */

export function envglobals() : globalValues {
        switch(process.env.NODE_ENV) {
            case "development":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/",
                        fr: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev",
                    APP_API_SEARCH_URL: "https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo"
                };
            case "staging":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://stage.geo.ca/home/",
                        fr: "https://stage.geo.ca/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging",
                    APP_API_SEARCH_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging/search"
                };
            case "production":
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "https://stage.geo.ca/home/",
                        fr: "https://stage.geo.ca/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging",
                    APP_API_SEARCH_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging/search"
                };    
            default:
                return {
                    LOGO_SITE_LINK_URL: { 
                        en: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/",
                        fr: "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev",
                    APP_API_SEARCH_URL: "https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo"
                };
        };
}; 

interface globalValues {
    LOGO_SITE_LINK_URL: { 
        en: string;
        fr: string;
    };    
    APP_API_DOMAIN_URL: string;
    APP_API_SEARCH_URL: string;
}


