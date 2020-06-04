var CONSTANTS = require("./clientConstants.js");
const { Collisions, Circle, Polygon, Point } = require('detect-collisions');
class Player {
  constructor(id, team, initials) {
    if(initials == undefined) {
      this.initials = id;
    } else {
      this.initials = initials;
    }
    this.team = team;
    this.id = id;
    this.pos = {x: this.team.startingPosition.x, y: this.team.startingPosition.y};
    this.rgb = this.team.rgb;
    this.size = CONSTANTS.PLAYER_SIZE;
    this.collidable = new Circle(this.pos.x, this.pos.y, this.size);
  }

  updateCollidable() {
    this.collidable.x = this.pos.x;
    this.collidable.y = this.pos.y;
  }

  reset() {
    this.pos = {x: this.team.startingPosition.x, y: this.team.startingPosition.y};
    this.updateCollidable();
  }

  updatePosition(dx, dy) {
    this.pos.x += dx;
    this.pos.y += dy;
    this.updateCollidable();
  }

  draw() {
    return {id: this.id, fillColor: this.rgb, size: this.size, pos: this.pos, initials: this.initials};
  }
}

module.exports = Player;
