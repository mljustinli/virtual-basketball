// class Basketball {
//   constructor() {
//     this.x = Math.floor(WIDTH/2);
//     this.y = Math.floor(HEIGHT/2);
//     this.size = 20;
//     this.vector_x = 0;
//     this.vector_y = 0;
//     // 0: None. 1: Team 1, 2: Team 2
//     this.team = 0;
//     this.player = None;
//   }
//
//   update(playerPositions) {
//     // Update position
//     // Case after being thrown before being picked up
//     if(this.player == None) {
//       this.x = this.x + this.vector_x;
//       this.y = this.y + this.vector_y;
//     }
//     // Case of traveling with the player
//     else {
//       this.x = playerPositions[this.player].x;
//       this.y = playerPositions[this.player].y;
//     }
//   }
//
//   reset() {
//     this.team = 0;
//     this.player = Nones;
//     this.vector_x = 0;
//     this.vector_y = 0;
//   }
//
//   onScore(team) {
//     if(team == 1){
//       this.x = TEAM_1_X;
//       this.y = TEAM_1_Y;
//       reset();
//     }
//     else(team == 2){
//       this.x = TEAM_2_X;
//       this.y = TEAM_2_Y;
//       reset();
//     }
//   }
//
//   caught(player) {
//     // Stop moving
//     // associate ball with player
//     this.player = player.id
//     this.team = player.team;
//     this.vector_x = 0;
//     this.vector_y = 0;
//   }
//
//   draw(playerPositions) {
//     update(playerPositions);
//     fill(this.rgb.r, this.rgb.g, this.rgb.b);
//     circle(this.x, this.y, this.size);
//   }
//
//   throw(MouseX, MouseY, Power) {
//     this.player = None;
//     // New - Old
//     let deltaX = MouseX - this.x;
//     let deltaY = MouseY - this.y;
//     let magnitude = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
//     this.vector_x = Math.floor(deltaX / magnitude) * Power;
//     this.vector_y = Math.floor(deltaY / magnitude) * Power;
//   }
//
//   this.rgb = {
//     r: 255,
//     g: 127,
//     b: 0,
//   }
//
// }
