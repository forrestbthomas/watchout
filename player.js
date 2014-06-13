var Player = function(gameOptions){
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z'
  this.fill = '#ff6600';
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;
  this.gameOptions = gameOptions;
};

Player.prototype.render = function(to){
  //revist this.el
  this.el = to.append('svg:path')
              .attr('d', this.path)
              .attr('fill', this.fill);
  this.transform = {
    x: this.gameOptions.width * 0.5,
    y: this.gameOptions.height * 0.5
  };
  this.setupDragging();
  return this;
};

Player.prototype.getX = function(){
  return this.x;
};

Player.prototype.setX = function(x){
  var minX = this.gameOptions.padding;
  var maxX = this.gameOptions.width - this.gameOptions.padding;
  x = x <= minX ? minX : x;
  x = x >= maxX ? maxX : x;
  return this.x;
};

Player.prototype.getY = function(){
  return this.y;
};

Player.prototype.setY = function(y){
  var minY = this.gameOptions.padding;
  var maxY = this.gameOptions.width - this.gameOptions.padding;
  y = y <= minY ? minY : y;
  y = y >= maxY ? maxY : y;
  return this.y;
};

Player.prototype.transform = function(opts){
  this.angle = opts.angle || this.angle;
  var newX = opts.x || this.x;
  var newY = opts.y || this.y;
  this.setX(newX);
  this.setY(newY);
  var inputVal = 'rotate(' + this.angle + ',' + this.getX() +
    ',' + this.getY() + ',translate(' + this.getX() +
    ',' + this.getY() + ')';
  this.el.attr('transform', inputVal);
};

Player.prototype.moveAbsolute = function(x,y){
  this.transform({x:x,y:y});
};

Player.prototype.moveRelative = function(dx,dy){
  var newX = this.getX() + dx;
  var newY = this.getY() + dy;
  var newAngle = 360 * (Math.atan2(dy,dx)/(Math.PI*2));
  this.transform({x:newX,y:newY,angle:newAngle});
};

Player.prototype.setupDragging = function(){
  var dragMove = function(){
    this.moveRelative(d3.event.dx, d3.event.dy);
  };

  var drag = d3.behavior.drag().on('drag', dragMove());
  this.el.call(drag);
};

