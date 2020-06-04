var CONSTANTS = require("../client/js/clientConstants.js");
var io = require("socket.io");

var Basketball = require("./Basketball");
var Hoop = require("./Hoop");
var Player = require("./Player");
const { Collisions, Circle, Polygon, Point } = require("detect-collisions");

class Game {
  constructor(gameID) {
    this.system = new Collisions();
    this.ball = new Basketball();
    this.hoops = [];
    this.hoops.push(new Hoop(CONSTANTS.TEAM_1));
    this.hoops.push(new Hoop(CONSTANTS.TEAM_2));
    this.lastTeam = CONSTANTS.TEAM_2;
    this.players = {};
    this.score = { "Team 1": 0, "Team 2": 0 };
  }
  getPlayersArray() {
    return this.players;
  }
  getPlayers() {
    return Object.keys(this.players);
  }

  updatePlayer(playerID, dx, dy) {
    this.players[playerID].updatePosition(dx, dy);
  }

  updatePlayerAngle(playerID, angle) {
    this.players[playerID].updateAngle(angle);
  }

  updatePlayerInitials(playerID, initials) {
    this.players[playerID].initials = initials;
  }

  connect(playerID, initials) {
    // Add player to this instance
    this.players[playerID] = new Player(playerID, this.getTeam(), initials);
  }

  getTeam() {
    if (this.lastTeam == CONSTANTS.TEAM_2) {
      this.lastTeam = CONSTANTS.TEAM_1;
      return CONSTANTS.TEAM_1;
    } else {
      this.lastTeam = CONSTANTS.TEAM_2;
      return CONSTANTS.TEAM_2;
    }
  }

  disconnect(playerID) {
    delete this.players[playerID];
  }

  eventChecker() {
    this.system.update();
    // Collisions
    // Player vs. Player
    for (let key1 of this.getPlayers()) {
      for (let key2 of this.getPlayers()) {
        if (key1 == key2) {
          continue;
        } else {
          let player1 = this.players[key1];
          let player2 = this.players[key2];
          if (player1.collidable.collides(player2.collidable)) {
            // Player should be blocked from moving
          }
        }
      }
    }

    // Player vs. Ball
    for (let key of this.getPlayers()) {
      let player = this.players[key];
      if (
        this.ball.collidable.collides(player.collidable) &&
        (!this.ball.player || this.ball.player.id != player.id)
      ) {
        this.ball.caught(player);
      }
    }

    // Ball vs. Hoop
    for (let hoop of this.hoops) {
      if (hoop.collidable.collides(this.ball.collidable)) {
        this.ball.reset();
        this.score[hoop.team] += 1;
        for (let player of this.players) {
          player.reset();
        }
      }
    }
  }

  update() {
    this.ball.update(this.playerPositions());
    this.eventChecker();
  }

  draw() {
    let objs = [];
    objs.push(this.ball.draw());
    for (let player of this.getPlayers()) {
      objs.push(this.players[player].draw());
    }
    return objs;
  }

  // Close out this instance
  close() {}

  playerPositions() {
    let positions = {};
    // let key;
    // for (key of this.getPlayers()) {
    //   positions[key] = this.players.pos;
    // }
    // return positions;
    for (let key in this.players) {
      positions[key] = this.players[key].pos;
    }
    return positions;
  }
}

module.exports = Game;
