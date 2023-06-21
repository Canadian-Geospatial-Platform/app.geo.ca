/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from "react";

import { Button, Collapse } from "reactstrap";

import { envglobals } from "../../common/envglobals";

import "./header.scss";
import { cgpv } from "../../app";

// Reacstrap Collapse - Responsive Navbar

const EnvGlobals = envglobals();

export default function Header(): JSX.Element {
  const { useTranslation } = cgpv;
  const { t } = useTranslation();

  const [collapse, setCollapse] = useState(false);
  const clanguage = t("app.language");

  const gotoHome = () => {
    setCollapse(false);
    if (location.pathname === "/" && !location.search) {
      if (clanguage === "en") {
        history.go(0);
      } else {
        window.location.href = `/?lang=${clanguage}`;
      }
    } else {
      history.push({
        pathname: "/",
        search: "",
      });
    }
  };

  // Reacstrap Collapse - Responsive Navbar
  const toggle = () => setCollapse(!collapse);
  // console.log(location.pathname);

  const rvScript = document.getElementById("rvJS");
  if (rvScript) {
    rvScript.remove();
  }
  const rvApiScript = document.getElementById("rvApi");
  if (rvApiScript) {
    rvApiScript.remove();
  }
  const rvSVG = document.getElementsByTagName("svg");
  if (rvSVG.length > 0) {
    for (const item of rvSVG) {
      if (item.id && item.id.indexOf("SvgjsSvg") === 0) {
        item.remove();
      }
    }
  }

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 header-nav-col">
            <nav className="navbar navbar-light navbar-expand-lg header-nav">
              <a
                href={`${EnvGlobals.LOGO_SITE_LINK_URL[clanguage]}`}
                target="_blank"
                aria-label={t("nav.logoLinktext")}
              >
                <img
                  src="/assets/img/GeoDotCaBanner.jpg"
                  alt={t("nav.logotext")}
                />
              </a>
              <Button
                onClick={toggle}
                id="toggler"
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                aria-controls="navbar-menu"
                aria-expanded={collapse}
                aria-label="Toggle navigation"
              >
                <span
                  className={
                    collapse
                      ? "navbar-toggler-icon nav-bar-open"
                      : "navbar-toggler-icon nav-bar-closed"
                  }
                />
              </Button>

              <Collapse
                isOpen={collapse}
                className="navbar-collapse navbar-wrap"
              >
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <button type="button" onClick={gotoHome}>
                      {t("nav.search")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button id="myMapBtn" type="button">
                      {t("nav.mymap")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button type="button" lang={t("nav.language.htmllangcode")}>
                      {t("nav.language.name")}
                    </button>
                  </li>
                </ul>
              </Collapse>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
