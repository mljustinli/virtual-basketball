var CONSTANTS = require("../client/js/clientConstants.js");
const { Collisions, Circle, Polygon, Point } = require("detect-collisions");
class Player {
  constructor(id, initials, team) {
    if (initials == undefined) {
      this.initials = id;
    } else {
      this.initials = initials;
    }
    this.setTeam(team);
    this.id = id;
<<<<<<< HEAD
    this.pos = {
      x: team.startingPosition.x,
      y: team.startingPosition.y,
    };
    this.rgb = team.rgb;
=======
>>>>>>> master
    this.size = CONSTANTS.PLAYER_SIZE;
    this.angle = 0;
    this.throwPower = 0;
    this.collidable = new Circle(this.pos.x, this.pos.y, this.size);
  }

  updateCollidable() {
    this.collidable.x = this.pos.x;
    this.collidable.y = this.pos.y;
  }

  reset() {
    this.pos = {
      x: this.team.startingPosition.x,
      y: this.team.startingPosition.y,
    };
    this.updateCollidable();
  }

  updatePosition(dx, dy) {
    this.pos.x += dx;
    this.pos.y += dy;
    this.updateCollidable();
  }

  updateAngle(angle) {
    this.angle = angle;
  }

  setTeam(team) {
    this.team = team;
    this.pos = {
      x: this.team.startingPosition.x,
      y: this.team.startingPosition.y,
    };
    this.rgb = this.team.rgb;
  }

  draw() {
    return {
      id: this.id,
      fillColor: this.rgb,
      size: this.size,
      pos: this.pos,
      angle: this.angle,
      throwPower: this.throwPower,
      initials: this.initials,
    };
  }
}

module.exports = Player;
