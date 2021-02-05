import React, { createContext, useContext, useState, useReducer } from 'react';
//import { IContact } from './Contact';
import { reducer, Action } from './reducer';

export interface StateContext {
  mapping: string[];
}
export interface Store {
  state: StateContext;
  dispatch?: React.Dispatch<Action>;
}
const defaultState: StateContext = { mapping: [] };
const myContext = createContext< Store >( { state: defaultState } );
export const useStateContext = () => useContext(myContext);
export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return <myContext.Provider value={{ state, dispatch }} children={children} />;
};