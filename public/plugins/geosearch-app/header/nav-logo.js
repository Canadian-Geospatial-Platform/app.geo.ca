/* eslint-disable func-names */
/* eslint-disable object-shorthand */
(function () {
    /**
     * Nav Logo plugin that will create a react component to list basemaps and switch them
     */
    class NavLogo {
        panel = null;

        // define a translations object to extend the core translations
        translations = {
            'en-CA': {
                navLogo: 'Canadian Geospatial Platform homepage',
                logotext: 'logo for the Canadian Geospatial Platform',
                logoLinktext: 'Canadian Geospatial Platform homepage',
            },
            'fr-CA': {
                navLogo: "Page d'accueil de la Plateforme géospatiale fédérale",
                logotext: 'logo de la Plateforme géospatiale fédérale',
                logoLinktext: "Page d'accueil de la Plateforme géospatiale fédérale",
            },
        };

        // hook is called right after the plugin has been added
        added = () => {
            const { api } = this;
            const { mapId } = this.props;

            // used to create react element
            // use h so instead of calling this.createElement just call h
            const h = this.createElement;

            // get used language
            const { language } = api.map(mapId);

            // button props
            const button = {
                tooltip: null,
                icon: h('img', {
                    src: '/plugins/geosearch-app/img/GeoDotCaBanner.jpg',
                    style: { maxHeight: '62px' },
                    alt: this.translations[language].logotext,
                }),
                callback: () => window.open('/'),
            };

            // create a new button panel on the appbar
            api.map(mapId).buttonPanel.createNavbarButtonGroup('app-header');
            this.panel = api.map(mapId).buttonPanel.createNavbarButton(button, 'app-header');
        };

        // hook is called once the plugin has been unmounted, remove any added components
        removed = () => {
            const { mapId } = this.props;

            this.api.map(mapId).buttonPanel.removeNavbarButtonPanel(this.panel.id);
        };
    }

    // export this plugin
    window.plugins = window.plugins || {};
    window.plugins.NavLogo = NavLogo;
})();
