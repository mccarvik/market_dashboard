import React from 'react';
import ReactDOM from 'react-dom';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import BootstrapSlider from 'react-bootstrap-slider/src/css/bootstrap-slider.min.css';
import './index.css';
import { ticker_setup, requestData } from './dashboard_utils.js';
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
  
  handleLiveData(data_live, chg, hi, lo, data_hist) {
    this.setState({
      live : data_live,
      last : 0,   // dont need anymore
      min : data_hist[1],
      max : data_hist[2],
      // chg : this.dailyChg(data_live, data_hist[0])
      chg : chg
    });
  }
  
  componentWillMount() {
    var rnd = Math.random() * (5000 - 500) + 500;
    setTimeout(function(){ return true;}, rnd);
    requestData(this.props.live_url, this.props.hist_url, this, this.props.data_ind, function(err, data) {
      if (err) {
          console.log(this.props.name + " failed after multiple attempts");
      }
    });
    
    // Need to come up with something for retries here
    // var rnd = Math.random() * (5000 - 500) + 500;
    // for (var x=0; x < 3; x++) {
    //   try {
    //     getData(this.props.live_url, this.props.hist_url, this, this.props.data_ind);
    //     setTimeout(function(){ return true;}, rnd);
    //     if (this.state.min !== undefined) {
    //       break;
    //     } else {
    //       console.log("Trying again for: " + this.props.name);
    //     }
    //   } catch (e) {
    //     console.log("Trying again for: " + this.props.name);
    //     continue;
    //   }
    // }
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
      var color = 'white';
      var plus = '';
      var chg = this.state.chg.replace('+','').replace('"', '').replace('%', '');
      chg = parseFloat(chg.slice(0, chg.length-1));
      if (chg < 0) {
        color = 'red';
      } else if (chg > 0) {
        color = 'green';
        plus = '+';
      }
      var mid_style = {
        color : color
      };
      
      
      
      return (
        <div>
          <label className='slide-labels-header'>{ this.props.name }</label>
          <div className='slide-labels'>
            <label className='slide-labels min'>{ Math.round(this.state.min * 100) / 100 }</label>
            <label className='slide-labels mid' style={mid_style} >{ Math.round(this.state.live * this.props.sig_figs) / this.props.sig_figs }, { plus }{ chg }%</label>
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
  
  renderSlider(t, sf) {
    return (
      <Slider 
        name={ t.name }
        live_url={ t.live_url }
        hist_url={ t.hist_url }
        data_ind={ t.data_ind }
        sig_figs={ sf }
      />
    );
  }
  
  render() {
    var sliders = [];
    for (var i in this.props.tickers_obj) {
      // console.log(this.props.tickers_obj[i]);
      sliders.push(this.renderSlider(this.props.tickers_obj[i], this.props.sig_figs));
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
  
  renderSlideGroup(n, t, sf) {
    return (
      <SliderGroup
          name={ n }
          tickers_obj={ t }
          sig_figs={ sf }
        />
    );
  }
  
  render () {
    var slide_groups = [];
    var ticks = ticker_setup(this.props.asset);
    var sig_figs = 100;
    
    if (this.props.asset === 'Currencies') {
      sig_figs = 10000;
    }
    
    for (var ind in ticks) {
      var tg = ticks[ind];
      slide_groups.push(this.renderSlideGroup(tg.name, tg.tickers, sig_figs));
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
      refresh : 0
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
    // getYahooCrumble();
    // return;
    
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

  componentWillMount() {
    document.title = "Market Dashboard";
    setTimeout(function() {
      console.log('here');
      this.setState({
        refresh : 1
      });
      }, 120000
    );
  }
  
}


ReactDOM.render(
  // <Game />,
  <Dashboard />,
  document.getElementById('root')
);

