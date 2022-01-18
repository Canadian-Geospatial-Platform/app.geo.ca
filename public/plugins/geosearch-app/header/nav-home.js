/* eslint-disable func-names */
/* eslint-disable object-shorthand */
(function () {
    /**
     * Nav Home plugin that will create a react component to list basemaps and switch them
     */
    class NavHome {
        panel = null;

        // define a translations object to extend the core translations
        translations = {
            'en-CA': {
                navHome: 'Home',
            },
            'fr-CA': {
                navHome: 'Accueil',
            },
        };

        // hook is called right after the plugin has been added
        added = () => {
            const { api } = this;
            const { mapId } = this.props;

            // get used language
            const { language } = api.map(mapId);

            // button props
            const button = {
                tooltip: null,
                icon: this.translations[language].navHome,
                callback: () => window.open('/', '_self'),
            };

            // create a new button panel on the appbar
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
    window.plugins.NavHome = NavHome;
})();
