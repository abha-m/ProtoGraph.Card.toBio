import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Form from 'react-jsonschema-form';

export default class BioCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      oasisObj: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    }
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON.card_data,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.dataJSON.configs,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    return getDataObj;
  }

  componentDidMount() {
    console.log("componentDidMount", this.props.dataURL)
    console.log(this.props)
    // get sample json data based on type i.e string or object
    if (typeof this.props.dataURL === "string"){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          this.setState({
            dataJSON: {
              card_data: card.data,
              configs: opt_config.data
            },
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data,
            oasisObj: this.props.oasisObj
          });
        }));
    }
  }

  getScreenSize() {
    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      width = w.innerWidth || e.clientWidth || g.clientWidth,
      height = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {
      width: width,
      height: height
    };
  }

  onChangeHandler({formData}) {
    switch (this.state.step) {
      case 1:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.card_data = formData
          return {
            dataJSON: dataJSON
          }
        })
        break;
      case 2:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          console.log(dataJSON, "dataJSON")
          dataJSON.configs = formData
          return {
            dataJSON: dataJSON
            // optionalConfigJSON: dataJSON
          }
        })
        break;
    }
  }

  onSubmitHandler({formData}) {
    switch(this.state.step) {
      case 1:
        this.setState({
          step: 2
        });
        break;
      case 2:
        alert("The card is published");
        break;
    }
  }

  renderAdditionalInformation() {

    let styles1 = {
      fontSize: 20,
      paddingBottom: 20
    }
    const data = this.state.dataJSON.card_data;
    let list = data.additional_info.map((e, i) => {
             //console.log(e, 'ASDASDASDASDAS')


         const keyName = Object.keys(e)[0];
         const keyValue = e[keyName];
         return (
           
           <div key={i}>

             <div className = "card-additional-info-keys"> {keyName} </div>
             <div className = "card-additional-info-key-values" style = {styles1}> {keyValue} </div>
           </div>
         );

    })
    console.log(list)

   return list;
}

  renderLaptop() {
    // console.log(this.state.schemaJSON, this.state, this.props, "inside renderLaptop")
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.card_data;
      let styles = this.state.dataJSON.configs ? {backgroundColor: this.state.dataJSON.configs.background_color} : undefined
      let styles1 = {
        width: 200,
        height: 200
      }
      let styles2 = {
        fontSize: 20,
        paddingBottom: 20
      }

      //console.log(data, "data-----", this.state.step, this.state.configJSON)
      return (
        <div className = "proto-card-div ui grid" style = {styles}>
          {/* <div className = "col-sm-6"> */}

          <div className = "twelve wide column">
            <div className = "card-keys">Name</div>
            <div className = "card-key-values" style={styles2}>{data.name}</div>
            <div className = "card-keys">Description</div>
            <div className = "card-key-values" style={styles2}>{data.description}</div>

            {this.renderAdditionalInformation()}
            {/* <div className = "card-key-values">{renderAdditionalInformation()}</div> */}

          </div>
        {/* </div> */}

        <div className = "four wide column">
          <img src = {data.url} style = {styles1}></img>
        </div>

         </div>
      )
    }
  }

  renderSEOAdditionalInformation() {

    let styles1 = {
      fontSize: 20,
      paddingBottom: 20
    }
    const data = this.state.dataJSON.card_data;
    let list = data.additional_info.map((e, i) => {
             //console.log(e, 'ASDASDASDASDAS')


         const keyName = Object.keys(e)[0];
         const keyValue = e[keyName];
         let seo_blockquote = `
           <div key=${i}>
             <div className = "card-additional-info-keys"> ${keyName} </div>
             <div className = "card-additional-info-key-values" style = ${styles1}> ${keyValue} </div>
           </div>`
         return seo_blockquote;

    })
  }

  renderSEO() {
    console.log(this.state.dataJSON.card_data, "this.state.dataJSON in seo mode")
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.card_data;
    }
    let seo_blockquote = `<blockquote>
      <div className = "twelve wide column">
        <div className = "card-keys">Name</div>
        <div className = "card-key-values" style=${styles2}>${data.name}</div>
        <div className = "card-keys">Description</div>
        <div className = "card-key-values" style=${styles2}>${data.description}</div>
        ${this.renderSEOAdditionalInformation()}
      </div>

      <div className = "four wide column">
        <img src = ${data.url} style = ${styles1}></img>
      </div>

    </blockquote>`
    return seo_blockquote;
  }

  renderSchemaJSON() {
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON;
        break;
      case 2:
        return this.state.optionalConfigSchemaJSON;
        break;
    }
  }

  renderFormData() {
    switch(this.state.step) {
      case 1:
        return this.state.dataJSON.card_data;
        break;
      case 2:
        return this.state.dataJSON.configs;
        break;
    }
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
        return '< Back to building the card';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
        return 'Proceed to next step';
        break;
      case 2:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    })
  }

  renderEdit() {
    // console.log(this.state.dataJSON, this.props, this.state.schemaJSON, "schema data")
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      console.log(this.state.dataJSON);
      return (
         <div className="ui grid">
           <div className = "eight wide column" id="protograph_bio_form_div">
            <Form schema = {this.renderSchemaJSON()}
            onSubmit = {((e) => this.onSubmitHandler(e))}
            onChange = {((e) => this.onChangeHandler(e))}
            formData = {this.renderFormData()}>
            <div className="prev-and-submit-button-div">
              <a id="protograph_prev_link" onClick = {((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
              <button type="submit" className="ui primary button">{this.showButtonText()}</button>
            </div>
            </Form>
          </div>
          <div className = "eight wide column" id="proto_bio_card_div">
            {this.renderLaptop()}
          </div>
        // </div>
      )
    }
  }

  render() {
    let functionToReturn;
    switch(this.props.mode) {
      case 'laptop' :
        return this.renderLaptop();
        break;
      case 'mobile' :
        return this.renderLaptop();
        break;
      case 'tablet' :
        return this.renderLaptop();
        break;
      case 'edit' :
        return this.renderEdit();
        break;
      case 'SEO' :
        return this.renderSEO();
        break;

    }

  }
}
