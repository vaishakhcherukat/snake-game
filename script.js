$(document).ready(function(){

	var canvas 		= $("#canvas")[0];
	var cwidth 		= $("#canvas").width();
	var cheight 	= $("#canvas").height();
	var ctx 		= canvas.getContext("2d");
	var colwidth 	= 10;
	var direction;
	var score;
	var food;
	var score;
	var snake;

	//build the snake
	function buildSnake(){
		var length = 5;
		snake = [];
		for(var i = length-1; i>=0; i--){
			snake.push({x: i, y:10});
		}
	}
	
	//add food once the snake eats it
	function addFood(){
		food = {
			x: Math.round(Math.random()*(cwidth-colwidth)/colwidth), 
			y: Math.round(Math.random()*(cheight-colwidth)/colwidth), 
		};
	}

	//init the game
	function initGame(){
		direction = 'right';
		score = 0;
		buildSnake();
		addFood();
		if(typeof game != "undefined") clearInterval(game);
		game = setInterval(paint, 100);
	}

	initGame();
	
	//make the snake eat food
	function paint(){
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, cwidth, cheight);
		// PS : to make snake move, pop the last cell and appent it before first cell
		var snakeHeadx = snake[0].x;
		var snakeHeady = snake[0].y;
		if(direction == "right" ) snakeHeadx++;
		else if(direction == "left") snakeHeadx--;
		else if(direction == "up") snakeHeady--;
		else if(direction == "down") snakeHeady++;
		
		//check for collision to snakes body or the walls
		if(snakeHeadx == -1 || snakeHeadx == cwidth/colwidth || snakeHeady == -1 || snakeHeady == cheight/colwidth || collisionCheck(snakeHeadx, snakeHeady, snake)){
			initGame();
			return;
		}
		
		//logic for snake eating food.
		if(snakeHeadx == food.x && snakeHeady == food.y){
			var tail = {x: snakeHeadx, y: snakeHeady};
			score++;
			addFood();
		}else{
			var tail = snake.pop(); //pops out the last cell
			tail.x = snakeHeadx; tail.y = snakeHeady;
		}
		
		//shift the last cell to the first so that snake moves forward.
		snake.unshift(tail);
		
		//paint the snake and food
		for(var i = 0; i < snake.length; i++){
			paintCell(snake[i].x, snake[i].y, "blue");
		}
		paintCell(food.x, food.y, "red");

		//display the score
		ctx.fillText("Score: " + score, 5, cheight-5);
	}
	
	//paint cells
	function paintCell(x, y, color){
		ctx.fillStyle 	= color;
		ctx.fillRect(x*colwidth, y*colwidth, colwidth, colwidth);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*colwidth, y*colwidth, colwidth, colwidth);
	}
	
	//check for collision
	function collisionCheck(x, y, cells){
		//check if the array provided is inside the canvas or not
		for(var i = 0; i < cells.length; i++){
			if(cells[i].x == x && cells[i].y == y)
			return true;
		}
		return false;
	}
	
	//Keyboard controls
	$(document).keydown(function(event){
		var key = event.which;
		if(key == "37" && direction != "right") direction = "left";
		else if(key == "38" && direction != "down") direction = "up";
		else if(key == "39" && direction != "left") direction = "right";
		else if(key == "40" && direction != "up") direction = "down";
	})
})