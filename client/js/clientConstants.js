const WIDTH = 480;
const HEIGHT = 640;
const COURT_PADDING = 40;
const FREE_THROW_ZONE_WIDTH = WIDTH - 2 * COURT_PADDING - 40;
const RECT_WIDTH = 90;
const RECT_HEIGHT = 110;
const CENTER_CIRCLE_RADIUS = RECT_WIDTH;
const HOOP_SIZE = 1;
const PLAYER_SIZE = 20;
const PLAYER_SPEED = 2;
const PLAYER_FAST_SPEED = 4;
const MAX_STAMINA = 60;
const BASKETBALL_STARTING_POSITION = { x: 240, y: 320 };
const BASKETBALL_SIZE = 20;
const ANGLE_INDICATOR_LENGTH = 20;
const ANGLE_INDICATOR_ARROW_LENGTH = 8;
const MAX_THROW_POWER = 60;
const TEAM_1 = {
  // red team
  id: 1,
  rgb: { r: 181, g: 21, b: 18 }, // 181, 21, 18
  name: "Red",
  startingPosition: { x: WIDTH / 2, y: HEIGHT / 4 },
  hoopPosition: { x: 240, y: 45 },
};
const TEAM_2 = {
  // blue team
  id: 2,
  rgb: { r: 30, g: 96, b: 189 }, // fill(30, 96, 189);
  name: "Blue",
  startingPosition: { x: WIDTH / 2, y: (3 / 4.0) * HEIGHT },
  hoopPosition: { x: 240, y: 595},
};

function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
}

define("WIDTH", WIDTH);
define("HEIGHT", HEIGHT);
define("COURT_PADDING", COURT_PADDING);
define("FREE_THROW_ZONE_WIDTH", FREE_THROW_ZONE_WIDTH);
define("RECT_WIDTH", RECT_WIDTH);
define("RECT_HEIGHT", RECT_HEIGHT);
define("CENTER_CIRCLE_RADIUS", CENTER_CIRCLE_RADIUS);
define("HOOP_SIZE", HOOP_SIZE);
define("PLAYER_SIZE", PLAYER_SIZE);
define("PLAYER_SPEED", PLAYER_SPEED);
define("PLAYER_FAST_SPEED", PLAYER_FAST_SPEED);
define("MAX_STAMINA", MAX_STAMINA);
define("BASKETBALL_STARTING_POSITION", BASKETBALL_STARTING_POSITION);
define("BASKETBALL_SIZE", BASKETBALL_SIZE);
define("TEAM_1", TEAM_1);
define("TEAM_2", TEAM_2);
