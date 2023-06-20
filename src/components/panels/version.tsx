import makeStyles from "@mui/styles/makeStyles";
import { AppVersion, GITUHUB_REPO } from "../../common/constant";
// eslint-disable-next-line no-underscore-dangle
const __VERSION__: AppVersion = {
  hash: "",
  major: 1,
  minor: 0,
  patch: 0,
  timestamp: "06/16/2023",
};

const useStyles = makeStyles(() => ({
  github: {
    textAlign: "center",
    margin: "5px",
    "& .cgp-version": {
      fontWeight: "bold",
      display: "block",
      fontSize: "0.8rem",

      "& .cgp-hash": {
        display: "inline",
        fontWeight: "normal",
        fontSize: "0.7rem",
      },
    },
    "& .cgp-timestamp": {
      fontWeight: "normal",
      fontSize: "0.7rem",
    },
  },
}));

export default function Version(): JSX.Element {
  const classes = useStyles();

  function getRepo(): void {
    window.open(GITUHUB_REPO, "_blank");
  }

  function getVersion(): string {
    return `v.${__VERSION__.major}.${__VERSION__.minor}.${__VERSION__.patch}`;
  }
  function getTimestamp(): string {
    return new Date(__VERSION__.timestamp).toLocaleDateString();
  }

  return (
    <div className={classes.github}>
      <span className="cgp-version">{getVersion()}</span>
      <span className="cgp-timestamp">{getTimestamp()}</span>
    </div>
  );
}
