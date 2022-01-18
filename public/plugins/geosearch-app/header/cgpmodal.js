/* eslint-disable func-names */
/* eslint-disable object-shorthand */
(function () {
    /**
     * BasemapSwitcher plugin that will create a react component to list basemaps and switch them
     */
    class CgpModal {
        panel = null;

        // define a translations object to extend the core translations
        translations = {
            'en-CA': {
                cgpModal: 'About the geoSearch application',
                buttonlabel: 'Close',
                description:
                    'The geoSearch application uses a map to search data over the area shown. Pan and zoom the map to filter the content based on your area of interest. The results will refresh based on the area of the map.',
            },
            'fr-CA': {
                cgpModal: "Au sujet de l'application geoSearch",
                buttonlabel: 'Fermer',
                description:
                    "L'application geoSearch utilise une carte pour rechercher des données sur la zone affichée. Effectuez un panoramique et un zoom sur la carte pour filtrer le contenu en fonction de votre zone d'intérêt. Les résultats seront actualisés en fonction de la zone de la carte.",
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
                modalcover: {
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    top: '0',
                    left: '0',
                    background: 'rgba(0, 0, 0, 0.27)',
                },
            }));

            // Local Storage
            const setLocalStorage = () => {
                if (sessionStorage.getItem('cgp-modal-shown') !== 'true') {
                    sessionStorage.setItem('cgp-modal-shown', 'true');
                }
            };
            const getLocalStorage = () => {
                const cgpModalShown = sessionStorage.getItem('cgp-modal-shown');
                return cgpModalShown === 'true';
                // return true;
            };

            const Component = () => {
                const classes = useStyles();

                const { t } = useTranslation();

                return h('div', {}, [
                    h('div', { key: 'modal-description', id: 'modal-description' }, h('p', {}, t('description'))),
                    h(
                        'div',
                        { key: 'modal-footer' },
                        h(
                            'button',
                            {
                                onClick: () => {
                                    this.panel.panel.close();
                                    setLocalStorage();
                                },
                            },
                            t('buttonlabel')
                        )
                    ),
                ]);
            };

            // button props
            const button = {
                tooltip: this.translations[language].cgpModal,
                icon: '<i class="material-icons">about</i>',
                visible: false,
            };

            // panel props
            const panel = {
                title: this.translations[language].cgpModal,
                icon: '<i class="material-icons">about</i>',
                content: Component,
                width: 300,
            };

            // create a new button panel on the appbar
            this.panel = api.map(mapId).buttonPanel.createNavbarButtonPanel(button, panel, 'app-header');
            if (!getLocalStorage()) {
                this.panel.panel.open();
            }
        };

        // hook is called once the plugin has been unmounted, remove any added components
        removed = () => {
            const { mapId } = this.props;

            this.api.map(mapId).buttonPanel.removeNavbarButtonPanel(this.panel.id);
        };
    }

    // export this plugin
    window.plugins = window.plugins || {};
    window.plugins.CgpModal = CgpModal;
})();
