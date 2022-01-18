/* eslint-disable func-names */
/* eslint-disable object-shorthand */
(function () {
    /**
     * Nav MyMap plugin that will create a react component to list basemaps and switch them
     */
    class NavMap {
        panel = null;

        // define a translations object to extend the core translations
        translations = {
            'en-CA': {
                mymap: 'MyMap',
                nomap: 'Your map is empty, please add data to map',
            },
            'fr-CA': {
                mymap: 'MyMap',
                nomap: 'Votre carte est vide, veuillez ajouter des données à la carte',
            },
        };

        // hook is called right after the plugin has been added
        added = () => {
            const { api, react, makeStyles, translate } = this;
            const { mapId } = this.props;

            // used to create react element
            // use h so instead of calling this.createElement just call h
            const h = this.createElement;

            // const { useState, useEffect } = react;
            const { useTranslation } = translate;

            // get used language
            const { language } = api.map(mapId);

            const useStyles = makeStyles(() => ({
                logoImg: {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    background: '#fff',
                    borderBottom: '1px solid #dcdcdc',
                    boxShadow: '0px 2px 5px 3px rgba(0, 0, 0, 0.27)',
                    height: '62px',
                    margin: '0',
                    padding: '0',
                },
            }));

            const Component = () => {
                const classes = useStyles();

                const { t } = useTranslation();

                return h('div', {}, t('nomap'));
            };

            // button props
            const button = {
                tooltip: null,
                icon: this.translations[language].mymap,
            };

            // panel props
            const panel = {
                title: this.translations[language].mymap,
                icon: '<i class="material-icons">map</i>',
                content: Component,
                width: 0,
            };

            // create a new button panel on the appbar
            this.panel = api.map(mapId).buttonPanel.createNavbarButtonPanel(button, panel, 'app-header');
        };

        // hook is called once the plugin has been unmounted, remove any added components
        removed = () => {
            const { mapId } = this.props;

            this.api.map(mapId).buttonPanel.removeNavbarButtonPanel(this.panel.id);
        };
    }

    // export this plugin
    window.plugins = window.plugins || {};
    window.plugins.NavMap = NavMap;
})();
