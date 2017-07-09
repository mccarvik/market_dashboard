import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ticker_setup, get_values } from './dashboard_utils.js';

// url : http://market-dashboard-mccarvik.c9users.io:8080/
// quandl db searc : https://www.quandl.com/search

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
  
  dailyChg(live, last) {
    return Math.round((live / last - 1) * 100) / 100;
  }
  
  render() {
    // want to set up css to change to green or red depneding on the value
    // and then set up the html for the slider
    var stats = get_values(this.props.ticker);
    var chg = this.dailyChg(stats[0], stats[1]);
    console.log(chg);
    return (
      <div>
        <div>{ this.props.name }</div>
        <div>{ stats[0] }</div>   
      </div>
    );
  }
}

class SliderGroup extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  
  renderSlider(n, t) {
    return (
      <Slider 
        name={ n }
        ticker={ t }
      />
    );
  }
  
  render() {
    var sliders = [];
    for (var i in this.props.tick_obj) {
      sliders.push(this.renderSlider(i, this.props.tick_obj[i]));
    }
    
    return (
      <div key={this.props.name} className='sliderGroup'>
        { this.props.name }
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
          tick_obj={ t }
        />
    );
  }
    
    
  render () {
    var slide_groups = [];
    var ticks = ticker_setup();
    
    console.log(ticks);
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

// class Slider extends React.Component {
  
// }

// ========================================


ReactDOM.render(
  // <Game />,
  <Dashboard />,
  document.getElementById('root')
);