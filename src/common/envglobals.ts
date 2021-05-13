/* eslint-disable prettier/prettier */

export function envglobals() : globalValues {
        switch(process.env.NODE_ENV) {
            case "development":
                return {
                    LOGO_SITE_LINK_URL: { 
                        "en-CA": "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/",
                        "fr-CA": "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev"
                };
            case "staging":
                return {
                    LOGO_SITE_LINK_URL: { 
                        "en-CA": "https://stage.geo.ca/home/",
                        "fr-CA": "https://stage.geo.ca/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging"
                };
            case "poduction":
                return {
                    LOGO_SITE_LINK_URL: { 
                        "en-CA": "https://stage.geo.ca/home/",
                        "fr-CA": "https://stage.geo.ca/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging"
                };    
            default:
                return {
                    LOGO_SITE_LINK_URL: { 
                        "en-CA": "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/home/",
                        "fr-CA": "http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/fr/accueil/"
                    },    
                    APP_API_DOMAIN_URL: "https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev"
                };
        };
}; 

interface globalValues {
    LOGO_SITE_LINK_URL: { 
        "en-CA": string;
        "fr-CA": string;
    };    
    APP_API_DOMAIN_URL: string;
}


