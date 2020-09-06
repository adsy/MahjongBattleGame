"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var ws_1 = __importDefault(require("ws"));
//Setup object which will hold player data
var players = {};
//Start up express app and connect it to the dist folder in client
var app = express_1.default();
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
app.listen(80, function () {
    console.log("BattleJong server is ready.");
});
//Construct WebSocket Server
var wsServer = new ws_1.default.Server({ port: 8080 }, function () {
    console.log("BattleJong WebSocket server ready");
});
//Turn on WebSocket Server and wait for connection message. Hook up message handler so
//when a message comes through, deconstruct to get pid + message
wsServer.on("connection", function (socket) {
    socket.on("message", function (inMsg) {
        var msgParts = inMsg.toString().split("_");
        var message = msgParts[0];
        var pid = msgParts[1];
        switch (message) {
            // When a tile pair is matched: match_<pid>_<points>
            case "match":
                players[pid].score += parseInt(msgParts[2]);
                //Send score to both clients to update both.
                wsServer.clients.forEach(function each(inClient) {
                    inClient.send("update_" + pid + "_" + players[pid].score);
                });
                break;
            // When the player dead-ends or clears: done_<pid>
            case "done":
                players[pid].stillPlaying = false;
                var playersDone = 0;
                for (var player in players) {
                    if (players.hasOwnProperty(player)) {
                        if (!players[player].stillPlaying) {
                            playersDone++;
                        }
                    }
                }
                if (playersDone === 2) {
                    var winningPID_1;
                    var pids = Object.keys(players);
                    if (players[pids[0]].score > players[pids[1]].score) {
                        winningPID_1 = pids[0];
                    }
                    else {
                        winningPID_1 = pids[1];
                    }
                    // Broadcast the outcome to both players.
                    wsServer.clients.forEach(function each(inClient) {
                        inClient.send("gameOver_" + winningPID_1);
                    });
                }
                break;
        }
    });
    //Generate PID using current time.
    var pid = "pid" + new Date().getTime();
    //Add an object to players object to represent this player
    players[pid] = { score: 0, stillPlaying: true };
    //Inform user of PDI by sending "connected_<pid>" message
    socket.send("connected_" + pid);
    if (Object.keys(players).length === 2) {
        var shuffledLayout_1 = shuffle();
        wsServer.clients.forEach(function each(inClient) {
            inClient.send("state_" + JSON.stringify(shuffledLayout_1));
        });
    }
});
// ---------------------------------------- Game code. ----------------------------------------
// 0 = no tile, 1 = tile.
// Each layer is 15x9 (135 per layer, 675 total).  Tiles are 36x44.
// When board is shuffled, all 1's become 101-142 (matching the 42 tile type filenames).
// Tile 101 is wildcard.
var layout = [
    /* Layer 1. */
    [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
    /* Layer 2. */
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    /* Layer 3. */
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    /* Layer 4. */
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    /* Layer 5. */
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
]; /* End layout. */
function shuffle() {
    var cl = layout.slice(0);
    var numWildcards = 0;
    var numTileTypes = 42;
    for (var l = 0; l < cl.length; l++) {
        var layer = cl[l];
        for (var r = 0; r < layer.length; r++) {
            var row = layer[r];
            for (var c = 0; c < row.length; c++) {
                var tileVal = row[c];
                if (tileVal === 1) {
                    row[c] = Math.floor(Math.random() * numTileTypes) + 101;
                    if (row[c] === 101 && numWildcards === 3) {
                        row[c] = 102;
                    }
                    else {
                        numWildcards += numWildcards;
                    }
                }
            }
        }
    }
    return cl;
}
//# sourceMappingURL=server.js.map