function drawBasketballCourt() {
  background(230, 165, 46);
  fill(0);

  // draw border
  noFill();
  strokeWeight(5);
  stroke(255);
  rect(
    COURT_PADDING,
    COURT_PADDING,
    width - 2 * COURT_PADDING,
    height - 2 * COURT_PADDING
  );

  // draw line down the center
  line(COURT_PADDING, height / 2, width - COURT_PADDING, height / 2);

  // draw circle in the middle
  ellipse(width / 2, height / 2, CENTER_CIRCLE_RADIUS, CENTER_CIRCLE_RADIUS);

  // draw the half circles
  arc(
    width / 2,
    COURT_PADDING,
    FREE_THROW_ZONE_WIDTH,
    FREE_THROW_ZONE_WIDTH,
    0,
    PI
  );
  arc(
    width / 2,
    height - COURT_PADDING,
    FREE_THROW_ZONE_WIDTH,
    FREE_THROW_ZONE_WIDTH,
    PI,
    0
  );

  // rectangles at top and bottom
  rect(width / 2 - RECT_WIDTH / 2, COURT_PADDING, RECT_WIDTH, RECT_HEIGHT);
  rect(
    width / 2 - RECT_WIDTH / 2,
    height - COURT_PADDING - RECT_HEIGHT,
    RECT_WIDTH,
    RECT_HEIGHT
  );

  // draw the small half circles
  arc(width / 2, COURT_PADDING + RECT_HEIGHT, RECT_WIDTH, RECT_WIDTH, 0, PI);
  arc(
    width / 2,
    height - COURT_PADDING - RECT_HEIGHT,
    RECT_WIDTH,
    RECT_WIDTH,
    PI,
    0
  );
}
