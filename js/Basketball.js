var CONSTANTS = require("../client/js/clientConstants.js");
const { Collisions, Circle, Polygon, Point } = require("detect-collisions");
class Basketball {
  constructor() {
    this.pos = CONSTANTS.BASKETBALL_STARTING_POSITION;
    this.size = CONSTANTS.BASKETBALL_SIZE;
    this.vector_x = 0;
    this.vector_y = 0;
    this.acceleration_factor = 0.98;
    // 0: none, 1:, 2: team 2
    this.team = 0;
    this.player = null;
    this.rgb = { r: 255, g: 111, b: 0 }; // 255, 111, 0
    // this.locked_team = null;
    this.collidable = new Circle(this.pos.x, this.pos.y, this.size);
    this.dribble_factor = 1;
    this.isDribbling = false;
    this.isFalling = true;
    this.dribbleCountdown = CONSTANTS.TRAVELLING_TIME;
    this.distToHoopWhenThrown = {};
    this.distToHoopWhenThrown["Red"] = 0;
    this.distToHoopWhenThrown["Blue"] = 0;
    this.lastScored = null;
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
      let dx = this.vector_x;
      let dy = this.vector_y;
      if (this.pos.x + dx + this.size / 2 > CONSTANTS.WIDTH - CONSTANTS.COURT_PADDING) {
        console.log("flip");
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
      this.pos.x = this.pos.x + dx;
      this.pos.y = this.pos.y + dy;
      this.vector_x = dx * this.acceleration_factor;
      this.vector_y = dy * this.acceleration_factor;
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
    // update size if dribbling
    if (this.isDribbling) {
      if(this.isFalling) {
        this.fall(this.dribble_factor);
      }
      else {
        this.isDribbling = !this.rise(
          this.dribble_factor, CONSTANTS.BASKETBALL_SIZE);
      }
    }
    else if (this.dribbleCountdown > 0) {
      this.dribbleCountdown--;
      console.log(this.dribbleCountdown);
    }
  }

  reset() {
    // this.locked_team = null;
    this.team = 0;
    this.player = null;
    this.pos = CONSTANTS.BASKETBALL_STARTING_POSITION;
    this.vector_x = 0;
    this.vector_y = 0;

  }

  dribbleReset() {
    this.isDribbling = false;
    this.size = CONSTANTS.BASKETBALL_SIZE;
    this.dribbleCountdown = CONSTANTS.TRAVELLING_TIME;
  }

  ballReset(){
  this.player=null;
    this.vector_x = 0;
    this.vector_y = 0;
    this.pos.x = 240;
    this.pos.y= 320;
    this.lastScored = null;
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

    console.log("last scored was: " + this.lastScored);
    if (this.lastScored == null || !(this.lastScored === player.team.name)) {
      this.dribbleReset();
      this.player = player;
      this.team = player.team.id;
      this.vector_x = 0;
      this.vector_y = 0;
      this.lastScored = null;
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
      travelling: ((this.dribbleCountdown>0) ? false : true),
    };
  }

  throw(angle, Power) {
    this.dribbleReset();
    this.player = null;
    // New - Old
    this.vector_x = Math.cos(angle) * Power;
    this.vector_y = Math.sin(angle) * Power;
    this.distToHoopWhenThrown["Red"] = Math.sqrt(
      Math.pow(this.pos.x - CONSTANTS.TEAM_1.hoopPosition.x, 2)
      + Math.pow(this.pos.y - CONSTANTS.TEAM_1.hoopPosition.y, 2)
    )
    this.distToHoopWhenThrown["Blue"] = Math.sqrt(
      Math.pow(this.pos.x - CONSTANTS.TEAM_2.hoopPosition.x, 2)
      + Math.pow(this.pos.y - CONSTANTS.TEAM_2.hoopPosition.y, 2)
    )

  }

  dribble() {
    this.size = CONSTANTS.BASKETBALL_SIZE;
    this.isDribbling = true;
    // dribbling only resets if travelling hasn't happened
    if(this.dribbleCountdown>0){
      this.dribbleCountdown = CONSTANTS.TRAVELLING_TIME;
    }
  }

  fall(power) {
    let hit_floor = false;
    let new_size = this.size - power;
    // hit bottom of court
    if (new_size < CONSTANTS.BALL_FLOOR_SIZE) {
      hit_floor = true;
      this.isFalling = false;
      new_size = CONSTANTS.BALL_FLOOR_SIZE;
    }
    this.size = new_size;
    return hit_floor;
  }

  //size of ball represents height (sort of)
  rise(power, height) {
    let reached_height = false;
    let new_size = this.size + power;
    // end dribble at top of dribble
    if (new_size > height) {
      reached_height = true;
      this.isFalling = true;
      new_size = height;
    }
    this.size = new_size;
    return reached_height;
  }
}

module.exports = Basketball;
