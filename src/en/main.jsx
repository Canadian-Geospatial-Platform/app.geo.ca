import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardTitle,
  CardDeck,
  CardSubtitle,
  CardText,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Form,
  FormGroup,
  Input,
  Label,
  CustomInput,
  ListGroupItem,
  ListGroup,
  Media,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

// core components
import { Map as LeafletMap, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'react-leaflet-fullscreen/dist/styles.css'
import FullscreenControl from 'react-leaflet-fullscreen';


class Main extends Component {

constructor(props) {
    super(props);

    this.state = {
      loading: false,
      noData: false,
      lat: '',
      lng: ''

  };

}

hideLoader = () => {
    this.setState({ loading: false });
  }

showLoader = () => {
    this.setState({ loading: true });
  }

  componentDidMount() {

    if (window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition( async (position) => {
                  let lat = position.coords.latitude;
                  let lng = position.coords.longitude;

                  this.setState({ lat: lat });
                  this.setState({ lng: lng });

                })
    } else {
      console.log("navigator not supported");

      this.setState({ lat: 45.4236 });
      this.setState({ lng: 75.7009 });

    }

  }

  render() {

    return (
      <>
      <LeafletMap
            center={[ this.state.lat, this.state.lng ]}
            zoom={9}
        >
          <TileLayer
            url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <FullscreenControl position="topright" />

        </LeafletMap>
        </>
    );
  }
}

export default Main;
