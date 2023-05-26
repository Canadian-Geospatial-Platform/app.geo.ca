/* eslint-disable prettier/prettier */

import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

export function Appbar(): JSX.Element {
  const location = useLocation();
  //const dispatch = useDispatch();
  return <div> This is appbar</div>;
}
