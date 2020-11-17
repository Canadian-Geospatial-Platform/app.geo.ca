
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
import { Map, TileLayer, Marker, Popup, Circle, Polygon, GeoJSON } from 'react-leaflet';
import 'react-leaflet-fullscreen/dist/styles.css'
import FullscreenControl from 'react-leaflet-fullscreen';
import axios from "axios";
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';


class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      noData: false,
      lat: '',
      lng: '',
      bounds: '',
      north: '',
      east: '',
      south: '',
      west: '',
      results: [],
      features: [],
      properties: '',
      collapsed: false,
      selected: 'home',

    };

  }

  hideLoader = () => {
    this.setState({ loading: false });
  }

  showLoader = () => {
    this.setState({ loading: true });
  }

  onClose() {
    this.setState({collapsed: true});
  }
  onOpen(id) {
    this.setState({
      collapsed: false,
      selected: id,
    })
  }

  componentDidMount() {

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition( async (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        this.setState({ lat: lat });
        this.setState({ lng: lng });

        let bounds =  this.refs.map.leafletElement.getBounds();
        let north = bounds._northEast.lat;
        let east = bounds._northEast.lng;
        let south = bounds._southWest.lat;
        let west = bounds._southWest.lng;

        console.log(north);
        console.log(east);
        console.log(south);
        console.log(west);


        this.setState({ bounds: bounds });
        this.setState({ north: north });
        this.setState({ east: east });
        this.setState({ south: south });
        this.setState({ west: west });

        const search = axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: {
          north: north,
          east: east,
          south: south,
          west: west
        }}).then(response => response.data)
        .then((data) => {

          let results = data.Items;

          this.setState({ results: results });

          this.state.results.map((result) => (
            console.log(result.id),
            console.log(result.coordinates)
          ))

          console.log(results);

        })
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
      <div>
      <Sidebar id="sidebar" collapsed={this.state.collapsed} selected={this.state.selected}
                 onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)}>
          <Tab id="home" header="Home" icon="fa fa-home">
            <p>No place like home!</p>
          </Tab>
          <Tab id="settings" header="Settings" icon="fa fa-cog" anchor="bottom">
            <p>Settings dialogue.</p>
          </Tab>
        </Sidebar>
      <Map
      center={[ this.state.lat, this.state.lng ]}
      zoom={9}
      ref="map"
      >
      <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <FullscreenControl position="topright" />

    {this.state.results.map((result) => (

      <GeoJSON key={result.id} data={{
        "type": "Feature",
        "properties": {
          "id": result.id,
        },
      "geometry": {
        "type": "Polygon",
        "coordinates": JSON.parse(result.coordinates)
    }}} />
  ))}

      </Map>
      </div>
      </>
    );
  }
}

export default Main;
