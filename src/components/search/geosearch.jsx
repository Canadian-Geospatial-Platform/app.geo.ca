
import React, { Component } from "react";
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
import { Map, GeoJSON } from 'react-leaflet';
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";

export default class GeoSearch extends Component {

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
    //this.map = useMap();
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    //this.handleCreate = this.handleCreate.bind(this);
    //this.handleAOI = this.handleAOI.bind(this);
    //this.handleModal = this.handleModal.bind(this);
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

//   handleCreate(event) {
//     console.log(event.target.getLatLngs());
//   }

  handleModal(event) {
    this.setState({ modal: !this.state.modal});
  }

  handleSearch()  {
    this.setState({ loading: true });
    const {bounds} =  this.props;
    const {keyword} = this.state;

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition( async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const north = bounds._northEast.lat;
        const east = bounds._northEast.lng;
        const south = bounds._southWest.lat;
        const west = bounds._southWest.lng;

        axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: {
          north: north,
          east: east,
          south: south,
          west: west,
          keyword: keyword
        }}).then(response => response.data)
        .then((data) => {

          console.log(data);

          const results = data.Items;
          
          this.setState({ 
            results: results,  
            lat: lat,
            lng: lng,
            bounds: bounds,
            north: north,
            east: east,
            south: south,
            west: west,
            loading: false });

        });
      });
    } else {
      console.log("navigator not supported");
      this.setState({ lat: 45.4236, lng: 75.7009, loading: false });
    }
  }  

  handleSubmit(event) {
    event.preventDefault();
    this.handleSearch();
  }

  componentDidMount() {
    this.handleSearch();
  }

  render() {
    const {loading, results, id, open} = this.state;  
    return (
      <div className="geoSearchContainer">
        <div className="searchInput">
            <input
              placeholder="Search ..."
              id="search-input"
              type="search"
              onChange={this.handleChange}
            />
            <button className="icon-button" type="button" onClick={this.handleSubmit}><SearchIcon /></button>
        </div>
        <div className="searchResult">
           {loading && Array.isArray(results) ?
             <BeatLoader
              color={'#0074d9'}
              />
              :
              results.map((result) => (
                <div  key={result.id} className="resultCard">
                {id === result.id && open === true ?
                    <div>
                        <div onClick={() => this.handleSelect(result.id)}>
                        <h6>{result.title}</h6>
                        <p>{result.description.substr(0,240)} <span onClick={this.handleModal}>...show more</span></p>
                        <p><strong>Organisation: </strong>{result.organisation}</p>
                        <p><strong>Published: </strong>{result.published}</p>
                        <p><strong>Keywords: </strong>{result.keywords.substring(0, result.keywords.length - 2)}</p>
                        </div>
                        <div><Button color="primary" size="sm" className="on-top" onClick={this.handleModal}>Show Metadata</Button></div>
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
                        <h6>{result.title}</h6>
                        <p>{result.description}</p>
                    </div>
                    }
                    <div className="smallClick" onClick={() => this.handleSelect(result.id)}>
                        {id === result.id && open === true ? "Click to Close":"Click for More" }
                    </div>
                </div>
              ))
            }
        </div>
      </div>
    );
  }
}

