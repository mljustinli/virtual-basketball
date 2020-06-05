var CONSTANTS = require("../client/js/clientConstants.js");
const { Collisions, Circle, Polygon, Point } = require("detect-collisions");
class Player {
  constructor(id, team, initials) {
    if (initials == undefined) {
      this.initials = id;
    } else {
      this.initials = initials;
    }
    console.log("team is: " + team);
    this.setTeam(team);
    this.id = id;
    this.size = CONSTANTS.PLAYER_SIZE;
    this.angle = 0;
    this.throwPower = 0;
    this.reset();
  }

  updateCollidable() {
    this.collidable.x = this.pos.x;
    this.collidable.y = this.pos.y;
  }

  reset() {
    this.pos = {
      x: this.team.startingPosition.x + Math.random() * 200 - 100,
      y: this.team.startingPosition.y,
    };
    this.collidable = new Circle(this.pos.x, this.pos.y, this.size);
    this.updateCollidable();
  }

  updatePosition(dx, dy) {
    if (this.pos.x + dx + this.size / 2 > CONSTANTS.WIDTH - CONSTANTS.COURT_PADDING) {
      dx = -Math.abs(dx);
    }
    if (this.pos.x + dx - this.size / 2 < CONSTANTS.COURT_PADDING) {
      dx = Math.abs(dx);
    }

    if (this.pos.y + dy + this.size / 2 > CONSTANTS.HEIGHT - CONSTANTS.COURT_PADDING) {
      dy  = -Math.abs(dy);
    }
    if (this.pos.y + dy - this.size / 2 < CONSTANTS.COURT_PADDING) {
      dy = Math.abs(dy);
    }
    this.pos.x += dx;
    this.pos.y += dy;
    this.updateCollidable();
  }

  updateAngle(angle) {
    this.angle = angle;
  }

  setTeam(team) {
    this.team = team;
    // this.pos = {
    //   x: this.team.startingPosition.x,
    //   y: this.team.startingPosition.y,
    // };
    this.reset();
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
