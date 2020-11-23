
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
  InputGroup,
  InputGroupAddon,
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
import { Sidebar, Tab } from 'react-leaflet-sidetabs'
import { FiHome, FiChevronRight, FiSearch, FiSettings } from "react-icons/fi";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";


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
      selected: 'search',
      id: '',
      open: false,
      value: '',
      keyword: ''

    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSelect(event) {
    this.setState({ id: event});
    this.setState({ open: !this.state.open});
  }

  handleChange(event) {
    this.setState({ keyword: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ loading: true });

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
        let keyword = this.state.keyword;

        console.log(north);
        console.log(east);
        console.log(south);
        console.log(west);
        console.log(keyword);

        this.setState({ bounds: bounds });
        this.setState({ north: north });
        this.setState({ east: east });
        this.setState({ south: south });
        this.setState({ west: west });

        const search = axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: {
          north: north,
          east: east,
          south: south,
          west: west,
          keyword: keyword
        }}).then(response => response.data)
        .then((data) => {

          console.log(data);

          let results = data.Items;

          this.setState({ results: results });

          this.setState({ loading: false });

        })
      })
    } else {
      console.log("navigator not supported");

      this.setState({ lat: 45.4236 });
      this.setState({ lng: 75.7009 });

      this.setState({ loading: false });

    }

  event.preventDefault();

  }

  componentDidMount() {
    this.setState({ loading: true });

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

          this.setState({ loading: false });

        })
      })
    } else {
      console.log("navigator not supported");

      this.setState({ lat: 45.4236 });
      this.setState({ lng: 75.7009 });

      this.setState({ loading: false });

    }

  }

  render() {

    return (
      <>
      <div className="leaflet-container">
      <Sidebar
          id="sidebar"
          position="left"
          collapsed={this.state.collapsed}
          closeIcon={<FiChevronRight />}
          selected={this.state.selected}
          onOpen={this.onOpen.bind(this)}
          onClose={this.onClose.bind(this)}
        >
           <Tab id="search" header="Search" icon={<FiSearch />}>
           <div>
           <div>
           <Form onSubmit={this.handleSubmit}>
           <Row className="align-items-center">
            <Col className="pt-2" xs="10" md="10" xl="10">
              <Input
              placeHolder="Search ..."
              id="search-input"
              type="search"
              onChange={this.handleChange}
            />
            </Col>
            <Col className="pt-2" xs="2">
            <Button type="submit" className="btn-search"><FiSearch /></Button>
            </Col>
            </Row>
            </Form>
            </div>

           {(this.state.loading) ?

             <div className="d-flex justify-content-center">
             <div className="p-5">
             <BeatLoader
              color={'#0074d9'}
              />
              </div>
              </div>

              :

              <div className="container">
              <div className="row pt-2"></div>
              {this.state.results.map((result) => (
                <div className="row" key={result.id} onClick={() => this.handleSelect(result.id)}>
                <div className="col-lg-12 d-flex align-items-stretch">
                <Card className="p-0 col-lg-12">
                <h6 className="text-left font-weight-bold pt-2 pl-2">{result.title}</h6>
                {(this.state.id === result.id && this.state.open === true ?
                <p className="text-left pt-2 pl-2">{result.description}</p>
                :
                <p className="text-left pt-2 pl-2 text-truncate">{result.description}</p>
                )}
                <div className="p-1 text-center">
                {(this.state.id === result.id && this.state.open === true ?
                  <small>Click to Close</small>
                :
                  <small>Click for More</small>
                )}

                </div>
                </Card>
                </div>
                </div>
              ))}
              {/* <div className="p-3">
              <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1">Previous</a>
                  </li>
                  <li class="page-item"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
              </div> */}
              </div>
          }

            </div>
           </Tab>
           <Tab id="settings" header="Settings" anchor="bottom" icon={<FiSettings />}>
            <p>We don't want privacy so much as privacy settings!</p>
           </Tab>
        </Sidebar>

      <Map
      center={[ this.state.lat, this.state.lng ]}
      zoom={10}
      ref="map"
      >
      <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <FullscreenControl position="topright" />

      {this.state.results.map((result) => (
        <div>
        {(this.state.id === result.id && this.state.open === true ?
          <GeoJSON key={result.id} data={{
            "type": "Feature",
            "properties": {
              "id": result.id,
            },
          "geometry": {
            "type": "Polygon",
            "coordinates": JSON.parse(result.coordinates)
        }}} />
        :
        <span/>
        )}
        </div>
      ))}

    {/*{this.state.results.map((result) => (

      <GeoJSON key={result.id} data={{
        "type": "Feature",
        "properties": {
          "id": result.id,
        },
      "geometry": {
        "type": "Polygon",
        "coordinates": JSON.parse(result.coordinates)
    }}} />
  ))} */}

      </Map>
      </div>
      </>
    );
  }
}

export default Main;
