var CONSTANTS = require("../client/js/clientConstants.js");
const { Collisions, Circle, Polygon, Point } = require("detect-collisions");
class Basketball {
  constructor() {
    this.pos = CONSTANTS.BASKETBALL_STARTING_POSITION;
    this.size = CONSTANTS.BASKETBALL_SIZE;
    this.vector_x = 0;
    this.vector_y = 0;
    this.acceleration_factor = 0.999;
    // 0: none, 1: team 1, 2: team 2
    this.team = 0;
    this.player = null;
    this.rgb = { r: 255, g: 111, b: 0 }; // 255, 111, 0
    // this.locked_team = null;
    this.collidable = new Circle(this.pos.x, this.pos.y, this.size);
  }

  updateCollidable() {
    this.collidable.x = this.pos.x;
    this.collidable.y = this.pos.y;
  }

  updatePosition(dx, dy) {
    this.pos.x += dx;
    this.pos.y += dy;
    this.updateCollidable();
  }

  update(playerPositions) {
    // Update position
    // Case after being thrown before being picked up
    if (this.player == null) {
      this.pos.x = this.pos.x + this.vector_x;
      this.pos.y = this.pos.y + this.vector_y;
      this.vector_x = this.vector_x * this.acceleration_factor;
      this.vector_y = this.vector_y * this.acceleration_factor;
      this.updateCollidable();
    }
    // Case of traveling with the player
    else {
      if (playerPositions[this.player.id]) {
        this.pos.x = playerPositions[this.player.id].x;
        this.pos.y = playerPositions[this.player.id].y;
        this.updateCollidable();
      }
    }
  }

  reset() {
    // this.locked_team = null;
    this.team = 0;
    this.player = null;
    this.vector_x = 0;
    this.vector_y = 0;
    this.pos = CONSTANTS.BASKETBALL_STARTING_POSITION;
  }

  caught(player) {
    // if (this.locked_team != null || this.locked_team == player.team) {
    //   console.log("changing player");
    //   this.locked_team = null;
    //   // Stop moving
    //   // associate ball with player
    //   this.player = player.id;
    //   this.team = player.team;
    //   this.vector_x = 0;
    //   this.vector_y = 0;
    // }

    if (this.player == null) {
      this.player = player;
      this.team = player.team.id;
      this.vector_x = 0;
      this.vector_y = 0;
    }
  }

  draw() {
    return {
      id: -1,
      playerID: this.player ? this.player.id : null,
      pos: this.pos,
      fillColor: this.rgb,
      size: this.size,
      angle: this.player ? this.player.angle : null,
    };
  }

  throw(angle, Power) {
    this.player = null;
    // New - Old
    this.vector_x = Math.cos(angle) * Power;
    this.vector_y = Math.sin(angle) * Power;
  }
}

module.exports = Basketball;
