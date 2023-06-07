import { useContext } from "react";

import { AppContext } from "../..";
import { useSelector } from "react-redux";
import { decrement, increment } from "../../features/counter";

export function Appbar(): JSX.Element {
  const appContext = useContext(AppContext);
  const dispatch = appContext.store.dispatch;
  //const count = appContext.store.getState().counter.value;
  const count = useSelector((state: any) => state.counter.value);
  return (
    <div>
      This is appbar
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
