import React from 'react';
import ReactDOM from 'react-dom';
// import ReactBootstrapSlider from 'react-bootstrap-slider';
import Slider from '@material-ui/lab/Slider';
import './index.css';
import { ticker_setup, requestData } from './dashboard_utils.js';
import { asset_classes } from './data.js'

// to start : npm start
// old url : http://market-dashboard-mccarvik.c9users.io:8080/
// new url: https://a684d9315bd649a2839d3a9906b8731c.vfs.cloud9.us-east-1.amazonaws.com/
// or http://localhost:8080/
// quandl db searc : https://www.quandl.com/search
// for slider // <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"></link>

class CustSlider extends React.Component {
  // http://seiyria.com/bootstrap-slider/
  constructor() {
    super();
    this.state = {
    };
  }
  
  handleLiveData(data_live, chg, min, max, thresh) {
    this.setState({
      live : data_live,
      min : min,
      max : max,
      chg : chg,
      thresh : thresh
    });
  }
  
  componentWillMount() {
    requestData(this.props.live_url, this.props.hist_url, this, this.props.data_ind, function(err, data) {
      if (err) {
          console.log(this.props.name + " failed after multiple attempts");
      }
    });
    
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
      var font_weight = 'normal';
      var plus = '';
      var chg = this.state.chg.replace('+','').replace('"', '').replace('%', '');
      chg = parseFloat(chg);
      if (chg < 0) {
        color = 'FireBrick';
      } else if (chg > 0) {
        color = 'ForestGreen';
        plus = '+';
      }
      
      if (chg > this.state.thresh) {
        color = 'LimeGreen';
        font_weight = 900;
      } else if (Math.abs(chg) > this.state.thresh) {
        color = 'Red';
        font_weight = 900;
      }
      
      var mid_style = {
        'color' : color,
        'fontWeight' : font_weight
      };
      
      
      if (this.props.group_name !== 'G10 Currencies') {
        return (
          <div>
            <label className='slide-labels-header'>{ this.props.name }</label>
            <div className='slide-labels'>
              <label className='slide-labels min'>{ Math.round(this.state.min * 100) / 100 }</label>
              <label className='slide-labels mid' style={mid_style} >{ Math.round(this.state.live * this.props.sig_figs) / this.props.sig_figs }, { plus }{ chg }%</label>
              <label className='slide-labels max'>{ Math.round(this.state.max * 100) / 100 }</label>
            </div>
            <div className='slide'>
              <Slider
                value={ this.state.live }
                max={ this.state.max }
                min={ this.state.min }
                step={ 0.01 }
                disabled="disabled"
                orientation="horizontal"
              />
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <label className='slide-labels-header'>{ this.props.name }</label>
            <div className='slide-labels'>
              <label className='slide-labels min'>{ Math.round(this.state.min * 100) / 100 }</label>
              <label className='slide-labels mid' style={mid_style} >{ Math.round(this.state.live * this.props.sig_figs) / this.props.sig_figs } ({Math.round(( 1 / this.state.live) * this.props.sig_figs) / this.props.sig_figs }), { plus }{ chg }%</label>
              <label className='slide-labels max'>{ Math.round(this.state.max * 100) / 100 }</label>
            </div>
            <div className='slide'>
              <Slider
                value={ this.state.live }
                max={ this.state.max }
                min={ this.state.min }
                step={ 0.01 }
                disabled="disabled"
                orientation="horizontal"
              />
            </div>
          </div>
        );
      }
    }
  }
}

class SliderGroup extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  
  renderSlider(t, sf, gn) {
    return (
      <CustSlider 
        name={ t.name }
        group_name={ gn }
        live_url={ t.live_url }
        hist_url={ t.hist_url }
        data_ind={ t.data_ind }
        sig_figs={ sf }
        thresh={ t.threshold }
      />
    );
  }
  
  render() {
    var sliders = [];
    for (var i in this.props.tickers_obj) {
      // console.log(this.props.tickers_obj[i]);
      sliders.push(this.renderSlider(this.props.tickers_obj[i], this.props.sig_figs, this.props.name));
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
      refresh : true
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
    // window.location.reload();   NEED TO USE THIS SOMEHOW
    var that = this;
    setTimeout(function() {
      that.setState({
        refresh : !that.state.refresh
      });
      }, 1200000
    );
    
    var ac = [];
    console.log('------------------ Rendering Dashboard ------------------')
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
  }
  
}

ReactDOM.render(
  <Dashboard />,
  document.getElementById('root')
);

// 1000 = 1 second, so 3600000 = 1hr
setInterval(function() {
  console.log('Refreshing');
  window.location.reload(true);
}, 3600000);