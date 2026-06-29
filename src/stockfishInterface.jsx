

export class StockfishInterface {
    constructor() {
        Stockfish("1")
        this.stockfish = require("stockfish")("lite-single", function onReady() {
            this.stockfish.sendCommand("uci");
            this.stockfish.sendCommand("position startpos");
            this.stockfish.sendCommand("go movetime 300");
        });
        this.bestmove = "NONE"

        this.stockfish.listener = function (line) {
            // console.log("STDOUT:", line);
            if (/bestmove \S+/.test(line)) {
                this.bestmove = line.match(/bestmove (\S+)/)[1]
                console.log("The best move is " + this.bestmove + ".");
            }
        };

    }    
    
    setSkillLevel(level) {
        this.stockfish.sendCommand("setoption name Skill Level value " + level)
    }

    setPosition(moves) {
        this.stockfish.sendCommand("position startpos moves " + moves.join(" "))
        this.stockfish.sendCommand("go movetime 300");
        this.bestmove = "NONE"
    }

    getBestmove() {
        return this.bestmove
    }
}
