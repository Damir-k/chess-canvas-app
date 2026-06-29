// stockfishWorkerInterface.js
export class StockfishInterface {
    constructor() {
        this.bestmove = "NONE";
        this.ready = false;
        this.worker = null;
        this.listeners = [];
    }

    static async create() {
        const instance = new StockfishInterface();
        await instance.init();
        return instance;
    }

    async init() {
        return new Promise((resolve, reject) => {
            try {
                // Create a Worker from the stockfish file
                this.worker = new Worker(
                    new URL('./stockfish-18-lite-single.js', import.meta.url),
                    { type: 'classic' }
                );
                
                this.worker.onmessage = (event) => {
                    const line = typeof event.data === 'string' ? event.data : '';
                    console.log(line)
                    // Notify listeners
                    this.listeners.forEach(listener => listener(line));
                    
                    // Check if engine is ready
                    if (line.includes('uciok')) {
                        this.ready = true;
                        
                        // Set up position and start analysis
                        this.sendCommand("position startpos");
                        this.sendCommand("go movetime 300");
                        
                        resolve();
                    }
                    
                    // Parse bestmove
                    if (/bestmove \S+/.test(line)) {
                        const match = line.match(/bestmove (\S+)/);
                        if (match) {
                            this.bestmove = match[1];
                            console.log("The best move is " + this.bestmove + ".");
                        }
                    }
                };
                
                this.worker.onerror = (error) => {
                    console.error('Worker error:', error);
                    reject(error);
                };
                
                // Initialize UCI
                setTimeout(() => {
                    this.sendCommand('uci');
                }, 100);
                
                // Timeout if initialization takes too long
                setTimeout(() => {
                    if (!this.ready) {
                        reject(new Error('Stockfish initialization timeout'));
                    }
                }, 10000);
                
            } catch (error) {
                console.error('Failed to create worker:', error);
                reject(error);
            }
        });
    }

    sendCommand(cmd) {
        if (this.worker) {
            this.worker.postMessage(cmd);
        }
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    setSkillLevel(level) {
        this.sendCommand("setoption name Skill Level value " + level);
    }

    setPosition(fen) {
        this.bestmove = "NONE";
        console.warn("position fen " + fen);
        this.sendCommand("position fen " + fen);
        this.sendCommand("go movetime 300");
    }

    getBestmove() {
        return this.bestmove;
    }

    destroy() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.listeners = [];
        this.ready = false;
    }
}