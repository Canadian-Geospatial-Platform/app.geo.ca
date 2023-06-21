import { useEffect } from "react";
import { TypeIconButtonProps, TypePanelProps } from "geoview-core-types";
import { TypeWindow } from "geoview-core-types";
import translationEn from "../../locales/en-CA/translation.json";
import translationFr from "../../locales/fr-CA/translation.json";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HowtoPanel from "../panels/howto-panel";
import GitHubIcon from "@mui/icons-material/GitHub";
import Version from "../panels/version";
import { GITUHUB_REPO } from "../../common/constant";
import { cgpv } from "../../app";

export function Map(): JSX.Element {
  const { useTranslation } = cgpv;
  const { t } = useTranslation();
  function getRepo(): void {
    window.open(GITUHUB_REPO, "_blank");
  }
  useEffect(() => {
    cgpv.init(function () {
      const translations = {
        en: translationEn,
        fr: translationFr,
      };

      // get map instance
      const mapInstance = cgpv.api.map("mapWM");

      // add custom languages
      mapInstance.i18nInstance.addResourceBundle(
        "en",
        "translation",
        translations["en"],
        true,
        false
      );
      mapInstance.i18nInstance.addResourceBundle(
        "fr",
        "translation",
        translations["fr"],
        true,
        false
      );

      // button props
      const searchButton: TypeIconButtonProps = {
        // set ID so that it can be accessed from the core viewer
        tooltip: t("appbar.search"),
        tooltipPlacement: "right",
        children: <SearchIcon />,
        visible: true,
      };

      // panel props
      const searchPanel: TypePanelProps = {
        title: t("appbar.search"),
        icon: <SearchIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const searchButtonPanel = cgpv.api
        .map("mapWM")
        .appBarButtons.createAppbarPanel(searchButton, searchPanel, null);

      // set panel content
      //geolocatorButtonPanel?.panel?.changeContent(<Appbar />);
      const filterButton: TypeIconButtonProps = {
        // set ID so that it can be accessed from the core viewer
        tooltip: "filters",
        tooltipPlacement: "right",
        children: <FilterAltIcon />,
        visible: true,
      };

      // panel props
      const filterPanel: TypePanelProps = {
        title: "Filters",
        icon: <FilterAltIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const filterButtonPanel = cgpv.api
        .map("mapWM")
        .appBarButtons.createAppbarPanel(filterButton, filterPanel, null);

      const analyticsButton: TypeIconButtonProps = {
        // set ID so that it can be accessed from the core viewer
        tooltip: "analytics",
        tooltipPlacement: "right",
        children: <AnalyticsIcon />,
        visible: true,
      };

      // panel props
      const analyticsPanel: TypePanelProps = {
        title: "Analytics",
        icon: <AnalyticsIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const analyticsButtonPanel = cgpv.api
        .map("mapWM")
        .appBarButtons.createAppbarPanel(analyticsButton, analyticsPanel, null);

      const helpButton: TypeIconButtonProps = {
        // set ID so that it can be accessed from the core viewer
        tooltip: t("appbar.howto"),
        tooltipPlacement: "right",
        children: <HelpOutlineIcon />,
        visible: true,
      };

      // panel props
      const helpPanel: TypePanelProps = {
        title: t("appbar.howto"),
        icon: <HelpOutlineIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const helpButtonPanel = cgpv.api
        .map("mapWM")
        .appBarButtons.createAppbarPanel(helpButton, helpPanel, null);
      helpButtonPanel?.panel?.changeContent(<HowtoPanel />);

      const versionButton: TypeIconButtonProps = {
        // set ID so that it can be accessed from the core viewer
        tooltip: t("appbar.version"),
        tooltipPlacement: "right",
        children: <GitHubIcon />,
        visible: true,
      };
      versionButton.onClick = getRepo;
      // panel props
      const versionPanel: TypePanelProps = {
        title: t("appbar.version"),
        icon: <GitHubIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const versionButtonPanel = cgpv.api
        .map("mapWM")
        .appBarButtons.createAppbarPanel(versionButton, versionPanel, null);
      versionButtonPanel?.panel?.changeContent(<Version />);
    });

    console.log("map inited");
  }, []);

  return (
    <>
      <div
        id="mapWM"
        className="llwp-map"
        style={{ height: "calc(100vh - 90px)", width: "100%" }}
        data-lang="en"
        data-config="{
                    'map': {
                      'interaction': 'dynamic',
                      'viewSettings': {
                        'zoom': 4,
                        'center': [-100, 60],
                        'projection': 3857
                      },
                      'basemapOptions': {
                        'basemapId': 'transport',
                        'shaded': false,
                        'labeled': true
                      }
                    },
                    'theme': 'dark',
                    'components': ['app-bar','nav-bar','overview-map'],
                    'suportedLanguages': ['en', 'fr']
                    }"
      ></div>
    </>
  );
}
