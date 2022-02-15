import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
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

function MenuScreen({ winner, qtdX, qtdO, restartGame, continueGame }) {
    return (
        <div className="end-game-screen">
            <div className='texto-winner'>
                { winner === 'draw' && (
                    <div>Foi um empate!</div>
                )}
                { winner != 'draw' && (
                <div>O ganhador foi o {winner}</div>
                )}
                <div>Pontuacao de X: {qtdX}</div>
                <div>Pontuacao de O: {qtdO}</div>
            </div>
            <button className='btn' onClick={continueGame}>Continue</button>
            <button className='btn' onClick={restartGame}>Reiniciar</button>
        </div>
    );
}

function InicioMenuScreen({startGame}) {
    return (
        <div className="end-game-screen">
            <h1 className='titulo-game'>TIC TAC TOE</h1>
            <div className='opcoes-btn'>
                <button className='btn' onClick={startGame}>Iniciar</button>
            </div>
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            resX: 0,
            resO: 0,
            inicio: true,
            scoreWin: 1,
        }
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            history: this.state.history.slice(0, step + 1)
        });
    }
    startGame() {
        this.setState({
            inicio: false,
            scoreWin: 2
        })
    }
    restartGame() {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            resX: 0,
            resO: 0,
        });
    }
    continueGame() {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            resX: this.state.resX,
            resO: this.state.resO,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
            if (winner === 'X') {
                this.state.resX += 1;
            } else if (winner === 'O') {
                this.state.resO += 1;
            }
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                {this.state.inicio && (
                    <InicioMenuScreen
                        startGame={() => this.startGame()}
                    />
                )}
                {winner && (
                    <MenuScreen
                        winner={winner}
                        qtdX={this.state.resX}
                        qtdO={this.state.resO}
                        restartGame={() => this.restartGame()}
                        continueGame={() => this.continueGame()}
                    />
                )}
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className='info-jogador'>{status}</div>
                    <button className='btn' onClick={() => this.restartGame()}>Reiniciar</button>
                    <div className='info-total'>
                        <div className='info-placar'>Placar!!!</div>
                        <div className='informacoes'>
                            <div className='info-placar-x'>Pontuacao de X: {this.state.resX}</div>
                            <div className='info-placar-y'>Pontuacao de O: {this.state.resO}</div>
                        </div>
                    </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
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
    if (squares.includes(null)){
        return null;
    } else {
        return squares[0] = ('draw')
    }
}