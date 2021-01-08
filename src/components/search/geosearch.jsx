
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
//import { Map, GeoJSON } from 'react-leaflet';
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";
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
    this.handleModal = this.handleModal.bind(this);
  }

//   onClose() {
//     this.setState({collapsed: true});
//   }
//   onOpen(id) {
//     this.setState({
//       collapsed: false,
//       selected: id,
//     });
//   }

  handleSelect(event) {
    const {id, open} = this.state; 
    const cardOpen = id === event ? !open : true;
    this.setState({ id: event, open: cardOpen });
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

  handleSearch(keyword)  {
    this.setState({ loading: true });
    const {bounds} =  this.props;
    //const {keyword} = this.state;

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition( async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const searchParams = {
            north: bounds._northEast.lat,
            east: bounds._northEast.lng,
            south: bounds._southWest.lat,
            west: bounds._southWest.lng,
            keyword: keyword  
        }
        //const north = bounds._northEast.lat;
        //const east = bounds._northEast.lng;
        //const south = bounds._southWest.lat;
        //const west = bounds._southWest.lng;
        console.log(searchParams);
        axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: searchParams})
        .then(response => response.data)
        .then((data) => {

          console.log(data);

          const results = data.Items;
          
          this.setState({...{
            results: results,  
            lat: lat,
            lng: lng,
            bounds: bounds,
            loading: false},
            ...searchParams
          });

        });
      });
    } else {
      console.log("navigator not supported");
      this.setState({ lat: 45.4236, lng: 75.7009, loading: false });
    }
  }  

  handleSubmit(event) {
    event.preventDefault();
    this.handleSearch(this.keywordInput.value);
  }

  componentDidMount() {
    //this.handleSearch("");
  }

  render() {
    const {loading, results, id, open, modal} = this.state; 
     
    return (
      <div className="geoSearchContainer">
        <div className="searchInput">
            <input
              placeholder="Search ..."
              id="search-input"
              type="search"
              ref={e=>this.keywordInput=e}
              disabled = {loading}
              //onChange={this.handleChange}
            />
            <button className="icon-button" disabled = {loading} type="button" onClick={!loading ? this.handleSubmit : null}><SearchIcon /></button>
        </div>
        <div className="container">
           {loading ?
             <BeatLoader
              color={'#0074d9'}
              />
              :
              (!Array.isArray(results) || results.length===0 || results[0].id===undefined ? 
              (Array.isArray(results) && results.length===0 ? 'Input keyword to search' : 'No result') : 
              results.map((result) => (  
                <div className="row" key={result.id}>
                    <div className="col-lg-12 d-flex align-items-stretch">
                    <Card className="p-0 col-lg-12">
                    {(id === result.id && open === true ?
                    <div>
                        <div onClick={() => this.handleSelect(result.id)}>
                            <h6 className="text-left font-weight-bold pt-2 pl-2">{result.title}</h6>
                            <p className="text-left pt-2 pl-2">{result.description.substr(0,240)} <span onClick={this.handleModal}>...show more</span></p>
                            <p className="text-left pt-1 pl-2"><strong>Organisation: </strong>{result.organisation}</p>
                            <p className="text-left pl-2"><strong>Published: </strong>{result.published}</p>
                            <p className="text-left pl-2"><strong>Keywords: </strong>{result.keywords.substring(0, result.keywords.length - 2)}</p>
                        </div>
                        <div className="pt-2 pl-2 pb-3"><Button color="primary" size="sm" className="on-top" onClick={this.handleModal}>Show Metadata</Button></div>
                        <Modal isOpen={modal} toggle={this.handleModal}>
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
                        <small onClick={() => this.handleSelect(result.id)}>
                        {id === result.id && open === true ? "Click to Close":"Click for More" }
                        </small>
                    </div>
                    </Card>
                </div>
                </div>
              )))
            }
        </div>
      </div>
    );
  }
}

