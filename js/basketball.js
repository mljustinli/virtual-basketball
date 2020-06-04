var CONSTANTS = require("../client/js/clientConstants.js");
const { Collisions, Circle, Polygon, Point } = require("detect-collisions");
class Basketball {
  constructor() {
    this.pos = CONSTANTS.BASKETBALL_STARTING_POSITION;
    this.size = CONSTANTS.BASKETBALL_SIZE;
    this.vector_x = 0;
    this.vector_y = 0;
    this.acceleration_factor = 0.9;
    // 0: None. 1: Team 1, 2: Team 2
    this.team = undefined;
    this.player = undefined;
    this.rgb = { r: 255, g: 111, b: 0 }; // 255, 111, 0
    this.locked_team = undefined;
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
    if (this.player == undefined) {
      this.pos.x = this.pos.x + this.vector_x;
      this.pos.y = this.pos.y + this.vector_y;
      this.vector_x = this.vector_x * this.acceleration_factor;
      this.vector_y = this.vector_y * this.acceleration_factor;
      this.updateCollidable();
    }
    // Case of traveling with the player
    else {
      this.pos.x = playerPositions[this.player].x;
      this.pos.y = playerPositions[this.player].y;
      this.updateCollidable();
    }
  }

  reset() {
    this.locked_team = undefined;
    this.team = 0;
    this.player = undefined;
    this.vector_x = 0;
    this.vector_y = 0;
    this.pos = CONSTANTS.BASKETBALL_STARTING_POSITION;
  }

  caught(player) {
    if (this.locked_team != undefined || this.locked_team == player.team) {
      this.locked_team = undefined;
      // Stop moving
      // associate ball with player
      this.player = player.id;
      this.team = player.team;
      this.vector_x = 0;
      this.vector_y = 0;
    }
  }

  draw() {
    return { id: -1, pos: this.pos, fillColor: this.rgb, size: this.size };
  }

  throw(MouseX, MouseY, Power) {
    this.player = undefined;
    // New - Old
    let deltaX = MouseX - this.pos.x;
    let deltaY = MouseY - this.pos.y;
    let magnitude = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    this.vector_x = Math.floor(deltaX / magnitude) * Power;
    this.vector_y = Math.floor(deltaY / magnitude) * Power;
  }
}

module.exports = Basketball;
