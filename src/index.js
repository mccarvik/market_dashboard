import React from 'react';
import ReactDOM from 'react-dom';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import BootstrapSlider from 'react-bootstrap-slider/src/css/bootstrap-slider.min.css';
import './index.css';
import { ticker_setup, getData, getYahooCrumble } from './dashboard_utils.js';
import { asset_classes } from './data.js'

// url : http://market-dashboard-mccarvik.c9users.io:8080/
// quandl db searc : https://www.quandl.com/search
// for slider // <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"></link>


class Slider extends React.Component {
  // http://seiyria.com/bootstrap-slider/
  constructor() {
    super();
    this.state = {
    };
  }
  
  handleLiveData(data_live, data_hist) {
    this.setState({
      live : data_live,
      last : data_hist[0],
      min : data_hist[1],
      max : data_hist[2],
      chg : this.dailyChg(data_live, data_hist[0])
    });
  }
  
  componentWillMount() {
    var rnd = Math.random() * (10000 - 500) + 500;
    setTimeout(getData(this.props.live_url, this.props.hist_url, this), rnd);
  }
  
  dailyChg(live, last) {
    return Math.round((live / last - 1) * 10000) / 100; // in percent terms
  }
  
  render() {
    if (this.state.max === undefined || this.state.live === undefined) {
      return (
        <div></div>
        );
    } else {
      // want to set up css to change to green or red depneding on the value
      // and then set up the html for the slider
      console.log(this.props.name, this.state);
      var color = 'black';
      var plus = '';
      if (this.state.chg < 0) {
        color = 'red';
      } else if (this.state.chg > 0) {
        color = 'green';
        plus = '+';
      }
      var mid_style = {
        color : color
      }
      
      
      return (
        <div>
          <label className='slide-labels-header'>{ this.props.name }</label>
          <div className='slide-labels'>
            <label className='slide-labels min'>{ Math.round(this.state.min * 100) / 100 }</label>
            <label className='slide-labels mid' style={mid_style} >{ Math.round(this.state.live * 100) / 100 }, { plus }{ this.state.chg }%</label>
            <label className='slide-labels max'>{ Math.round(this.state.max * 100) / 100 }</label>
          </div>
          <ReactBootstrapSlider
            value={ this.state.live }
            max={ this.state.max }
            min={ this.state.min }
            step={ 0.01 }
            disabled="disabled"
            orientation="horizontal"
             />
        </div>
      );
    }
  }
}

class SliderGroup extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  
  renderSlider(t) {
    return (
      <Slider 
        name={ t.name }
        live_url={ t.live_url }
        hist_url={ t.hist_url }
      />
    );
  }
  
  render() {
    var sliders = [];
    for (var i in this.props.tickers_obj) {
      // console.log(this.props.tickers_obj[i]);
      sliders.push(this.renderSlider(this.props.tickers_obj[i]));
    }
    
    return (
      <div key={this.props.name} className='sliderGroup'>
        <label className='sliderGroup'>{ this.props.name }</label>
        { sliders }
      </div>
    );
  }
}

class AssetClass extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  
  renderSlideGroup(n, t) {
    return (
      <SliderGroup
          name={ n }
          tickers_obj={ t }
        />
    );
  }
  
  render () {
    var slide_groups = [];
    var ticks = ticker_setup(this.props.asset);
    
    for (var ind in ticks) {
      var tg = ticks[ind];
      slide_groups.push(this.renderSlideGroup(tg.name, tg.tickers));
    }
    
    return (
        <div className='asset_class'>
          <div>
            { slide_groups }
          </div>
        </div>
    );
  }
}

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  
  renderAssetClass(a) {
    return (
      <AssetClass
          asset={ a }
        />
    );
  }
    
    
  render () {
    var ac = [];
    getYahooCrumble();
    return;
    
    for (var a in asset_classes) {
      ac.push(this.renderAssetClass(a));
    }
    
    return (
        <div className='dashboard'>
          <h1>Market Dashboard</h1>
          <div>
            { ac }
          </div>
        </div>
    );
  }
}


ReactDOM.render(
  // <Game />,
  <Dashboard />,
  document.getElementById('root')
);

