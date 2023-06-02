/* eslint-disable prettier/prettier */
import { useEffect } from "react";
import { TypeIconButtonProps, TypePanelProps } from "geoview-core-types";
import { TypeWindow } from "geoview-core-types";
import translationEn from "../../locales/en-CA/translation.json";
import translationFr from "../../locales/fr-CA/translation.json";
import { Appbar } from "../appbar/app-bar";
const w = window as TypeWindow;
// get reference to geoview apis
const cgpv = w["cgpv"];
export function Map2(): JSX.Element {
  const { react, useTranslation } = cgpv;

  // const { t } = useTranslation();
  // get the needed projection. Web Mercator is out of the box but we need to create LCC
  // the projection will work with CBMT basemap. If another basemap would be use, update...

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
        id: "geolocatorButtonPanel",
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
