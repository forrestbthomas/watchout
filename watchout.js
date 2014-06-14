// start slingin' some d3 here.
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var enemyOptions = {
  rotation: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height]),
};
// debugger
var gameBoard = d3.select('.container').append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);
  // In order to render the enemy objects both the
  // svg:rect and the enemy objects need to be appended
  // to the same root (i.e. svg:svg)
gameBoard.append ('svg:rect')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('fill', 'white');




var updateScore = function(){
  d3.select('.current span').text(gameStats.score.toString());
  d3.select('.collisions span').text(gameStats.collisions.toString());
};

var updateBestScore = function(){
  gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
  d3.select('.high span').text(gameStats.bestScore.toString());
};

var players = [];
players.push(new Player(gameOptions).render(gameBoard));

var createEnemies = function(){
  return _.range(0,gameOptions.nEnemies).map(function(i){
    return {id:i, x:Math.random()*100,y:Math.random()*100};
  });
};

var render = function(enemyList){

  var enemies = gameBoard.selectAll('image.enemy').data(enemyList, function(d){
    return d.id;
  });

  enemies.enter()
    .append('svg:image')
      .attr('class', 'enemy')
      .attr('x', function(enemy){ return axes.x(enemy.x);})
      .attr('y', function(enemy){ return axes.y(enemy.y);})
      .attr('xlink:href', 'static/logo.svg')
      .attr('width', '20px')
      .attr('height', '20px');

  enemies.exit()
    .remove();

  var checkCollision = function(enemy, collidedCallback){
    _.each(players, function(player){
      var radiusSum = parseFloat(enemy.attr('r')) + player.r;
      var xDiff = parseFloat(enemy.attr('x')) - player.x;
      var yDiff = parseFloat(enemy.attr('y')) - player.y;

      var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff,2));
      // TODO why are there no params???
      if( separation < radiusSum ){
        collidedCallback();
      }
    });

  };

  var onCollision = function(enemy, collidedCallback){
    updateBestScore();
    gameStats.collisions += 1;
    gameStats.score = 0;
    updateScore();
  };

  var tweenWithCollisionDetection = function(endData){
    var enemy = d3.select(this);
    var startPos = {
      x: parseFloat(enemy.attr('x')),
      y: parseFloat(enemy.attr('y'))
    };
    var endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };
    return function(t){
      checkCollision(enemy, onCollision);
      var enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };
      enemy.attr('x', enemyNextPos.x)
        .attr('y', enemyNextPos.y);
    };
  };


  enemies.transition()
    .duration(500)
    .attr('r', 10)  //TODO rotation
    .duration(2000)
    .tween('custom', tweenWithCollisionDetection);
};




var play = function(){
  var gameTurn = function(){
    var enemies = createEnemies();
    render(enemies);
  };
  var increaseScore = function(){
    gameStats.score += 1;
    updateScore();
    enemyOptions.rotation += 15;
  };

  gameTurn();

  setInterval(gameTurn, 2000);
  setInterval(increaseScore, 50);

};

play();
