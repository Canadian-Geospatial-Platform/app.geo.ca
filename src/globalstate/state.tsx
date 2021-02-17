import React, { createContext, useContext, useState, useReducer } from 'react';
//import { IContact } from './Contact';
//import { connectRouter, routerMiddleware } from 'connected-react-router'
import { reducer, Action } from './reducer';

export interface StateContext {
  mapping: string[];
  orgfilter: string[];
  typefilter: string[];
  themefilter: string[];
  foundational: boolean;
}
export interface Store {
  state: StateContext;
  dispatch?: React.Dispatch<Action>;
}
const defaultState: StateContext = { mapping: [], orgfilter: [], typefilter: [], themefilter: [], foundational: false };
const mappingContext = createContext< Store >( { state: defaultState } );
export const useStateContext = () => useContext(mappingContext);
export const StateProvider = ( {children} ) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return <mappingContext.Provider value={{state, dispatch}} children={children} />;
};