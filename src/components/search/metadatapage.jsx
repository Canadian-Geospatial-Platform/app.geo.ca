import React, { useState, Component, useEffect, createRef } from "react";
import axios from "axios";  

//const [results, setResults] = useState([]);
//const [loading, setLoading] = useState(false);
class MetaDataPage extends Component {
   
  constructor(props){
    super(props);
    this.state = {
      id: '',
      lang: '',
      result: ''
    }
  }

  setID(){    
      console.log('Our data is fetched');
      var urlParams = new URLSearchParams(window.location.hash.replace("#/result","")); // Update according to routing
      var idFromURL = urlParams.get('id');
      var langFromURL = urlParams.get('lang');
      this.setState({
        id: idFromURL,
        lang: langFromURL,
        result: ''
      })
  }

  handleIDSearch = (id) => {    
    const searchParams = {
        id: this.state.id,
        lang: this.state.lang
    }
    
    axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/id", { params: searchParams})
        .then(response => {
            console.log(JSON.stringify(response));        
            var formattedResponse = JSON.stringify(response);
            this.setState({                         
                result:  formattedResponse 
          })        
        })
        .catch(error=>{
            console.log(error);
        });
    }; 

    componentDidMount(){
        var urlParams = new URLSearchParams(window.location.hash.replace("#/result",""));
        var hash1 = urlParams.get('id');
        this.setID();

        setTimeout(() => {
            this.handleIDSearch(this.state.id);    
        }, 3000)
    }

    render() {
        return(
            <div>
                {this.state.result}
            </div>
        )
    }
}

export default MetaDataPage;
