import React, { Component } from "react";
// reactstrap components
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
//import { Map, GeoJSON } from 'react-leaflet';
import PanelApp from './component/appbar/panel';
//import { Typography } from '@material-ui/core';
//import SearchIcon from '@material-ui/icons/Search';



export default function RecordPanel(props: RecordProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
   
    //const {bounds, recordResult} = props;

    return (
        <PanelApp
            title={'Record'}            
            content={
                ((
                   // Add contents here
                ) as unknown) as Element
            }
        />
    );
}

interface RecordProps {
    bounds: React.ReactNode,
    selectResult: Function
}