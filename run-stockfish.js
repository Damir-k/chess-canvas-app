var stockfish = require("stockfish")("lite-single", function onReady() {
    stockfish.sendCommand("uci");
    stockfish.sendCommand("go depth 5");
});
stockfish.listener = function (line) {
    console.log("STDOUT:", line);
    if (/bestmove \S+/.test(line)) {
        console.log("The best move is " + line.match(/bestmove (\S+)/)[1] + ".");
    }
};
