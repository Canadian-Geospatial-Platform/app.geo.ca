/* eslint-disable func-names */
/* eslint-disable object-shorthand */
(function () {
    /**
     * Language Switcher plugin that will create a react component to list basemaps and switch them
     */
    class NavLang {
        panel = null;

        // define a translations object to extend the core translations
        translations = {
            'en-CA': {
                navLang: {
                    code: 'fr-CA',
                    name: 'Français',
                },
            },
            'fr-CA': {
                navLang: {
                    code: 'en-CA',
                    name: 'English',
                },
            },
        };

        // hook is called right after the plugin has been added
        added = () => {
            const { api, i18n } = this;
            const { mapId } = this.props;

            // get used language
            const { language } = api.map(mapId);

            // button props
            const button = {
                tooltip: null,
                icon: this.translations[language].navLang.name,
                callback: () => i18n.changeLanguage(this.translations[language].navLang.code),
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
    window.plugins.NavLang = NavLang;
})();
