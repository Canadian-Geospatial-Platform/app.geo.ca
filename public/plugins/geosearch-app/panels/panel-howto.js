/* eslint-disable func-names */
/* eslint-disable object-shorthand */
(function () {
    /**
     * GeoSearchAppPanelHowto plugin that will create a react component to list basemaps and switch them
     */
    class GeoSearchAppPanelHowto {
        panel = null;

        // define a translations object to extend the core translations
        translations = {
            'en-CA': {
                geoSearchAppPanelHowto: 'How To',
                geosearch: {
                    name: 'Search',
                    desc:
                        'The geoSearch application uses a map to search data over the area shown. Pan and zoom the map to filter the content based on your area of interest. The results will refresh based on the area of the map. If you are not interested in a given geographic area. Click on the Keyword Only toggle, enter a keyword, and filter the results based on our advanced filters.',
                },
                filters: {
                    name: 'Filters',
                    desc:
                        'The advanced filters can filter data based on organization, type, theme, and foundational layers. You can add as many filters as you need and remove them if they are not given you the result you need.',
                },
            },
            'fr-CA': {
                geoSearchAppPanelHowto: 'Comment',
                geosearch: {
                    name: 'Recherche',
                    desc:
                        "L'application geoSearch utilise une carte pour rechercher des données dans la zone indiquée. Effectuez un panoramique et un zoom sur la carte pour filtrer le contenu en fonction de la zone qui vous intéresse. Les résultats seront rafraîchis en fonction de la zone de la carte. Si vous n'êtes pas intéressé par une zone géographique donnée. Cliquez sur le bouton Mot-clé uniquement, saisissez un mot-clé et filtrez les résultats à l'aide de nos filtres avancés.",
                },
                filters: {
                    name: 'Filtres',
                    desc:
                        "Les filtres avancés peuvent filtrer les données en fonction de l'organisation, du type, du thème et des couches fondamentales. Vous pouvez ajouter autant de filtres que nécessaire et les supprimer s'ils ne vous donnent pas le résultat dont vous avez besoin.",
                },
            },
        };

        // hook is called right after the plugin has been added
        added = () => {
            const { api, makeStyles, translate } = this;
            const { mapId } = this.props;

            // used to create react element
            // use h so instead of calling this.createElement just call h
            const h = this.createElement;

            const { useTranslation } = translate;

            // get used language
            const { language } = api.map(mapId);

            const useStyles = makeStyles(() => ({
                listContainer: {
                    overflowY: 'auto',
                    height: '100%',
                },
            }));

            const Component = () => {
                const classes = useStyles();

                const { t } = useTranslation();

                return h(
                    'div',
                    {
                        className: classes.listContainer,
                    },
                    [
                        h('h3', { key: 'search-title', className: 'section-title' }, [
                            h('i', { key: 'search-icon', className: 'material-icons' }, 'search'),
                            t('geosearch.name'),
                        ]),
                        h('p', { key: 'search-desc' }, t('geosearch.desc')),
                        h('h3', { key: 'filter-title', className: 'section-title' }, [
                            h('i', { key: 'filter-icon', className: 'material-icons' }, 'filter_alt'),
                            t('filters.name'),
                        ]),
                        h('p', { key: 'filter-desc' }, t('filters.desc')),
                    ]
                );
            };

            // button props
            const button = {
                tooltip: this.translations[language].geoSearchAppPanelHowto,
                icon: '<i class="material-icons">help_outline</i>',
            };

            // panel props
            const panel = {
                title: this.translations[language].geoSearchAppPanelHowto,
                icon: '<i class="material-icons">help_outline</i>',
                content: Component,
                width: 200,
            };

            // create a new button panel on the appbar
            this.panel = api.map(mapId).buttonPanel.createAppbarPanel(button, panel, null);
        };

        // hook is called once the plugin has been unmounted, remove any added components
        removed = () => {
            const { mapId } = this.props;

            this.api.map(mapId).buttonPanel.removeAppbarPanel(this.panel.id);
        };
    }

    // export this plugin
    window.plugins = window.plugins || {};
    window.plugins.geoSearchAppPanelHowto = GeoSearchAppPanelHowto;
})();
