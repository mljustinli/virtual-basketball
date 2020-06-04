var CONSTANTS = require("../client/js/clientConstants.js");
const { Collisions, Circle, Polygon, Point } = require("detect-collisions");
class Hoop {
  constructor(team) {
    this.pos = team.hoopPosition;
    this.size = CONSTANTS.HOOP_SIZE;
    this.team = team.name;
    this.collidable = new Polygon(this.pos.x, this.pos.y, [
      [0, 0],
      [0, this.size],
      [this.size, this.size],
      [this.size, 0],
    ]);
  }
}

module.exports = Hoop;
