
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
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

// core components
import { Map, TileLayer, Marker, Popup, FeatureGroup, Circle, Polygon, GeoJSON } from 'react-leaflet';
import 'react-leaflet-fullscreen/dist/styles.css'
import FullscreenControl from 'react-leaflet-fullscreen';
import axios from "axios";
import { Sidebar, Tab } from 'react-leaflet-sidetabs'
import { FiHome, FiChevronRight, FiSearch, FiSettings, FiCrosshair, FiUser } from "react-icons/fi";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import { EditControl } from "react-leaflet-draw";

import Dashboard from '../cognito-auth/Dashboard';

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
      keyword: '',
      modal: false

    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleAOI = this.handleAOI.bind(this);
    this.handleModal = this.handleModal.bind(this);
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

  handleCreate(event) {
    console.log(event.target.getLatLngs());
  }

  handleModal(event) {
    this.setState({ modal: !this.state.modal});
  }

  handleAOI(event) {
    this.setState({ loading: true });

    this.setState({ selected: 'search' });

    let bounds =  this.refs.map.leafletElement.getBounds();
    let north = bounds._northEast.lat;
    let east = bounds._northEast.lng;
    let south = bounds._southWest.lat;
    let west = bounds._southWest.lng;
    let keyword = this.state.keyword;

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

    event.preventDefault();
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

          let options = JSON.stringify(data.Items[1].options);

          console.log(options);

          this.setState({ results: results });

          console.log(results);

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
    const {hash} = this.props.location;
    //console.log(hash);
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
           <Tab id="search" header="geo.ca" icon={<FiSearch />}>
           <div>
           <div>
           <Form onSubmit={this.handleSubmit}>
           <Row className="align-items-center">
            <Col className="pt-2" xs="10" md="10" xl="10">
              <Input
              placeholder="Search ..."
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
                <div className="row" key={result.id}>
                <div className="col-lg-12 d-flex align-items-stretch">
                <Card className="p-0 col-lg-12">
                {(this.state.id === result.id && this.state.open === true ?
                <div>
                <div onClick={() => this.handleSelect(result.id)}>
                <h6 className="text-left font-weight-bold pt-2 pl-2">{result.title}</h6>
                <p className="text-left pt-2 pl-2">{result.description.substr(0,240)} <span onClick={this.handleModal}>...show more</span></p>
                <p className="text-left pt-1 pl-2"><strong>Organisation: </strong>{result.organisation}</p>
                <p className="text-left pl-2"><strong>Published: </strong>{result.published}</p>
                <p className="text-left pl-2"><strong>Keywords: </strong>{result.keywords.substring(0, result.keywords.length - 2)}</p>
                </div>
                <div className="pt-2 pl-2 pb-3"><Button color="primary" size="sm" className="on-top" onClick={this.handleModal}>Show Metadata</Button></div>
                <Modal isOpen={this.state.modal} toggle={this.handleModal}>
                  <ModalHeader toggle={this.handleModal}>{result.title}</ModalHeader>
                  <ModalBody>
                    <p><strong>Description:</strong></p>
                    <p>{result.description}</p>
                    <p><strong>Organisation:</strong> {result.organisation}</p>
                    <p><strong>Published:</strong> {result.published}</p>
                    <p><strong>Keywords:</strong> {result.keywords.substring(0, result.keywords.length - 2)}</p>
                  </ModalBody>
                  <ModalFooter>
                    <a href={`https://cgp-meta-l1-geojson-dev.s3.ca-central-1.amazonaws.com/` + result.id + `.geojson`} target="_blank" ><Button color="primary">View Full Metadata</Button></a>{' '}
                    <Button color="secondary" onClick={this.handleModal}>Close</Button>
                  </ModalFooter>
                </Modal>
                </div>
                :
                <div onClick={() => this.handleSelect(result.id)}>
                <h6 className="text-left font-weight-bold pt-2 pl-2">{result.title}</h6>
                <p className="text-left pt-2 pl-2 text-truncate">{result.description}</p>
                </div>
                )}
                <div className="p-1 text-center">
                {(this.state.id === result.id && this.state.open === true ?
                  <small onClick={() => this.handleSelect(result.id)}>Click to Close</small>
                :
                  <small onClick={() => this.handleSelect(result.id)}>Click for More</small>
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
           <Tab id="aoi" header="Area of Interest" icon={<FiCrosshair />}>
             <div>
              <h4 className="pt-4 text-center">Would you like to set an Area of Interest?</h4>
              <p className="pt-2 text-center">Do set a new Area of Interest, please zoom to the area of your choice and press the button below. Once pressed, you will be brought back to the results page with your new results. </p>
              <div className="pt-2 justify-content-center text-center">
              <Button className="btn-search text-center" onClick={this.handleAOI}>Set AOI</Button>
              </div>
            </div>  
           </Tab>
           <Tab id="account" header="Account" anchor="bottom" icon={<FiUser />}>
            <Dashboard pname={hash} />
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
      {/* <FeatureGroup>
      <EditControl
        position='topright'
        onEdited={this._onEditPath}
        onCreated={this.handleCreate}
        onDeleted={this._onDeleted}
        draw={{
          rectangle: true,
          circle: false,
          polygon: false,
          polyline: false,
          circle: false,
          marker: false,
          circlemarker: false
        }}
      />
      </FeatureGroup> */}

      {this.state.results.map((result) => (
        <div key={'result'+result.id}>
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
