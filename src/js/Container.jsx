import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Form from 'react-jsonschema-form';

export default class BioCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      schemaJSON: undefined,
      configSchemaJSON: undefined,
      configJSON: {}
    }
  }

  exportData() {
    return this.state;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (typeof this.props.dataURL === "string"){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.configURL), axios.get(this.props.configSchemaURL)])
        .then(axios.spread((card, schema, config, config_schema) => {
          // let newDataJson = card.data;
          // newDataJson.additional_info = [
          //   {"age" : 20},
          //   {"date_of_birth" : "1-1-1997"}
          // ];
          this.setState({
            dataJSON: /*newDataJson*/ card.data,
            schemaJSON: schema.data,
            configSchemaJSON: config_schema.data,
            configJSON: config.data.optional
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
    // console.log(formData, this.state.step, "...................")
    switch (this.state.step) {
      case 1:
        break;
      case 2:
        this.setState({
          dataJSON: formData
        });
        //console.log(this.state.dataJSON);
        break;
      case 3:
        this.setState({
          configJSON: formData
        })
        break;
    }
  }

  onSubmitHandler({formData}) {
     //console.log(formData, "on Submit =======================")
    switch(this.state.step) {
      case 1:
        this.setState({
          step: 2
        });
        break;
      case 2:
        this.setState({
          step: 3,
          dataJSON: formData
        });
        break;
      case 3:
        alert("The card is published");
        break;
    }
  }

  renderAdditionalInformation() {
    let styles = {

    }
    let styles1 = {
      fontSize: 20,
      paddingBottom: 20
    }
    const data = this.state.dataJSON;
    let list = data.additional_info.map((e, i) => {
             //console.log(e, 'ASDASDASDASDAS')


         const keyName = Object.keys(e)[0];
         const keyValue = e[keyName];
         return (

           <div key={i}>

             <div className = "card-additional-info-keys" style = {styles}> {keyName} </div>
             <div className = "card-additional-info-key-values" style = {styles1}> {keyValue} </div>
           </div>
         );

    })
    console.log(list)

   return list;
}

  renderLaptop() {
    // console.log(this.state.configJSON, this.state.step,"inside this.state.configJSON")
    const data = this.state.dataJSON;
    let styles = {
      backgroundColor: this.state.configJSON.background_color
    }
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
      <div className = "proto-card-div col-sm-12" style = {styles}>
        {/* <div className = "col-sm-6"> */}

        <div className = "col-sm-9">
          <div className = "card-keys">Name</div>
          <div className = "card-key-values" style={styles2}>{data.name}</div>
          <div className = "card-keys">Description</div>
          <div className = "card-key-values" style={styles2}>{data.description}</div>

          {this.renderAdditionalInformation()}
          {/* <div className = "card-key-values">{renderAdditionalInformation()}</div> */}

        </div>
      {/* </div> */}

      <div className = "col-sm-3">
        <img src = {data.url} style = {styles1}></img>
      </div>

       </div>
    )
  }

  renderSchemaJSON() {
  //  console.log(this.state.step, "renderSchemaJSON")
    switch(this.state.step){
      case 1:
        return this.state.configSchemaJSON.properties.mandatory;
        break;
      case 3:
        return this.state.configSchemaJSON.properties.optional;
        break;
      case 2:
        return this.state.schemaJSON;
        break;
    }
  }

  renderFormData() {
    switch(this.state.step) {
      case 1:
        return this.state.configJSON.mandatory;
        break;
      case 3:
        return this.state.configJSON;
        break;
      case 2:
        return this.state.dataJSON;
        break;
    }
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
        return '< Back to Mandatory selection';
        break;
      case 3:
        return '< Back to building the card';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
      case 2:
        return 'Proceed to next step';
        break;
      case 3:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    })
    //console.log("show prev step", this.state.step)
  }

  renderEdit() {
    // console.log(this.state.dataJSON, this.props, this.state.schemaJSON, "schema data")
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      return (
        // <div className="col-sm-12">
        //   <div className = "col-sm-6" id="proto_bio_form_div">
        //     <Form schema = {this.renderSchemaJSON()}
        //     onSubmit = {((e) => this.onSubmitHandler(e))}
        //     onChange = {((e) => this.onChangeHandler(e))}
        //     formData = {this.renderFormData()}>
        //     <a id="proto_prev_link"onClick = {((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
        //     <button type="submit" className="btn btn-info">{this.showButtonText()}</button>
        //     </Form>
        //   </div>
          <div className = "col-sm-6" id="proto_bio_card_div">
            {this.renderLaptop()}
           </div>
        // </div>
      )
    }
  }

  render() {
    // console.log(this.props.mode, "mode")
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
    }

  }
}
