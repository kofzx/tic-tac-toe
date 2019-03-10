import React from 'react';
import './index.css';

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
      return {winner:squares[a], line:[a, b, c]};
    }
  }
  return {winner:null, line:[]};
}

class Square extends React.Component {
  render() {
    return (
      <button 
        className="square"
        onClick={this.props.onClick}
        style={{color: this.props.winnerFlag ? "red" : "black"}}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, j) {
    const { squares, winnerLine } = this.props;
    let flag;

    if (winnerLine[i]) {
      const [ a, b ] = winnerLine[i].split(",");
      flag = a == i && b == j;
    }

    return (
      <Square 
        key={j}
        value={squares[i][j]}
        winnerFlag={flag}
        onClick={() => this.props.onClick(i, j)}
         />
    );
  }

  render() {
    const squares = this.props.squares;

    let boardRows = [];
    for (let row = 0; row < squares.length; row++) {
      let boardRow = [];
      for (let col = 0; col < squares[row].length; col++) {
        boardRow.push(this.renderSquare(row, col));
      }
      boardRows.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    return (
      <div>
        {boardRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      // 历史记录
      history: [{
        squares: [
          [null,null,null],
          [null,null,null],
          [null,null,null]
        ],
      }],
      stepNumber: 0,  // 行走的记录次数
      lastSelect: -1, // 最后一次选中的记录
      xIsNext: true,  // 'X'是否为下一次的落子
      sort: false,
    };
  }

  /**
   * [handleClick 点击进行落子]
   * @param  {[Number]} i [格子的序号]
   * @return {[void]}
   */
  handleClick(i, j) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = JSON.parse(JSON.stringify(current.squares));
    // 若当前格子 已经有落子/已有一方胜利，就无法继续落子
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }

    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ 
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  /**
   * [jumpTo 跳转到指定记录]
   * @param  {[Number]} step [记录的索引]
   * @return {[void]}
   */
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      lastSelect: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  toggleSort() {
    this.setState({
      sort: !this.state.sort
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];   // 当前的行走记录
    const winner = calculateWinner(current.squares);

    if (this.state.sort) {
      history = this.state.history.slice();
      history.reverse();
    }
    // 行走记录功能
    const moves = history.map((step, move) => {
      const desc = move ? `Move #${move}` : "Game start";

      return (
        <li key={move}>
          <a 
            href="#" 
            className={this.state.lastSelect === move ? "happy" : ""}
            onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;   // 游戏状况的信息
    let winner_line = [];
    if (winner) {
      status = "Winner is: " + winner.result;
      winner_line = winner.line;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerLine={winner_line}
            onClick={(i, j) => this.handleClick(i, j)} />
        </div>
        <div className="game-info">
          <div>
            <span>{status} </span> 
            <button onClick={() => this.toggleSort()}>switch</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;