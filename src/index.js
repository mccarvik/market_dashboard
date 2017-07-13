import React from 'react';
import ReactDOM from 'react-dom';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import BootstrapSlider from 'react-bootstrap-slider/src/css/bootstrap-slider.min.css';
import './index.css';
import { ticker_setup, getData } from './dashboard_utils.js';

// url : http://market-dashboard-mccarvik.c9users.io:8080/
// quandl db searc : https://www.quandl.com/search
// for slider // <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"></link>

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
  
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }
  
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
          squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

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
    getData(this.props.live_url, this.props.hist_url, this);
  }
  
  dailyChg(live, last) {
    return Math.round((live / last - 1) * 10000) / 100; // in percent terms
  }
  
  render() {
    if (this.state.max === undefined) {
      return (
        <div></div>
        );
    } else {
      // want to set up css to change to green or red depneding on the value
      // and then set up the html for the slider
      console.log(this.state);
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
            orientation="horizontal"
            disabled="disabled" />
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
      console.log(this.props.tickers_obj[i]);
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

class Dashboard extends React.Component {
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
    var ticks = ticker_setup();
    
    for (var ind in ticks) {
      var tg = ticks[ind];
      slide_groups.push(this.renderSlideGroup(tg.name, tg.tickers));
    }
    
    return (
        <div className='dashboard'>
          <h1>Market Dashboard</h1>
          <div>
            { slide_groups }
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

