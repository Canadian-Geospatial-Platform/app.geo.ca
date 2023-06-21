import { Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { cgpv } from "../../app";

export default function HowtoPanel(): JSX.Element {
  const { useTranslation } = cgpv;
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: "white" }}>
      <Typography variant="body2" color="textSecondary" component="div">
        <h3 className="section-title">
          <SearchIcon /> {t("appbar.search")}{" "}
        </h3>
        <p>{t("howto.geosearchdescription")}</p>
        <h3 className="section-title">
          <FilterAltIcon /> {t("appbar.filters")}{" "}
        </h3>
        <p>{t("howto.filtersdescription")}</p>
        <h3 className="section-title">{t("appbar.searchoperators")}</h3>
        <p>{t("howto.searchoperators")}</p>
      </Typography>
    </div>
  );
}
