import { useEffect } from "react";
import { TypeIconButtonProps, TypePanelProps } from "geoview-core-types";
import { TypeWindow } from "geoview-core-types";
import translationEn from "../../locales/en-CA/translation.json";
import translationFr from "../../locales/fr-CA/translation.json";
import { Appbar } from "../appbar/app-bar";
import { useDispatch } from "react-redux";

const w = window as TypeWindow;

const cgpv = w["cgpv"];
export function Map(): JSX.Element {
  const dispatch = useDispatch();
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

      const MapIcon = cgpv.ui.elements.MapIcon;

      // button props
      const geolocatorButton: TypeIconButtonProps = {
        // set ID so that it can be accessed from the core viewer

        tooltip: "test1",
        tooltipPlacement: "right",
        children: <MapIcon />,
        visible: true,
      };

      // panel props
      const geolocatorPanel: TypePanelProps = {
        title: "App Panel",
        icon: <MapIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const geolocatorButtonPanel = cgpv.api
        .map("mapWM")
        .appBarButtons.createAppbarPanel(
          geolocatorButton,
          geolocatorPanel,
          null
        );

      // set panel content
      geolocatorButtonPanel?.panel?.changeContent(<Appbar />);
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
