;(function() {
	var Game = function () {
		var self = this;

		var gameCanvas = document.getElementById("screen");
		var panelCanvas = document.getElementById("control-panel");

		var boardMouser = new Mouser(gameCanvas, this.boardClickHandler, self);
		var panelMouser = new Mouser(panelCanvas, this.panelClickHandler, self);

		this.stateController = new StateController;

		var SIZE = 600;
		gameCanvas.height = SIZE;
		gameCanvas.width = SIZE;
		this.size = SIZE

		this.drawTools = gameCanvas.getContext('2d');
		this.board = new Board(this.size);
		this.draw();
	};

	Game.prototype = {

		draw: function() {
			for (var i = 0; i < 8; i ++) {
				for (var j = 0; j < 8; j ++){
					this.renderSpace(this.board.spaces[i][j]);
					if (this.board.spaces[i][j].contents){
						this.renderPiece(this.board.spaces[i][j].contents);
					}
				}
			}
		},

		computeCoordinatesClicked: function(pixelDistanceX, pixelDistanceY) {
			var xCoordinate = Math.floor(pixelDistanceX / this.size * 8); 
			var yCoordinate = Math.floor(pixelDistanceY / this.size * 8);
			return {x: xCoordinate, y: yCoordinate};
		},

		boardClickHandler: function(clickX, clickY, self) {
			var coordinatesClicked = self.computeCoordinatesClicked(clickX, clickY);
			var spaceClicked = self.board.spaces[coordinatesClicked.x][coordinatesClicked.y];
			var turn = self.stateController.turn;
			spaceClicked.placePiece(turn);
			self.findMoveVectors(coordinatesClicked, turn);
			self.draw();
			self.stateController.changeTurns();
		},

		panelClickHandler: function(clickX, clickY, self) {
			console.log(clickX, clickY);
		},

		doMoveResults: function(space, state) {
			
		},

		findMoveVectors: function(coordinates, state) {
			if(coordinates.x + 1 > this.board.spaces.length) {
				return;
			}
			var current = this.board.spaces[coordinates.x][coordinates.y].contents;
			var neighbor = this.board.spaces[coordinates.x + 1][coordinates.y].contents;
			if (current.state !== neighbor.state){
				neighbor.flip();
				this.findMoveVectors({x: coordinates.x + 1,y:coordinates.y});
			}
		},

		renderSpace: function(space) {
			this.drawTools.fillStyle = "green";
			this.drawTools.fillRect(space.x * this.size / 8,
								space.y * this.size / 8,
								this.size / 8,
								this.size / 8);

			this.drawTools.strokeStyle = "grey"
			this.drawTools.rect(space.x * this.size / 8,
								space.y * this.size / 8,
								this.size / 8,
								this.size / 8);
			this.drawTools.stroke();
		},

		renderPiece: function(piece) {
			this.drawTools.fillStyle = piece.state ? "white" : "black";
			this.drawTools.beginPath();
			this.drawTools.arc(piece.location.x * this.size / 8 + this.size/16,
								piece.location.y * this.size / 8 + this.size/16,
								piece.size, 0, Math.PI * 2);
			this.drawTools.closePath();
			this.drawTools.fill();

		}
	};

	var StateController = function() {
		this.turn = true;
	};

	StateController.prototype = {
		changeTurns: function(){
			this.turn = !this.turn;
		}
	};

	var Board = function(size) {
		this.spaces= this.makeBlankSpaces(size);
		this.setStart();
	};

	Board.prototype = {
		makeBlankSpaces: function(size) {
			var spaces = [];
			for (var i = 0; i < 8; i ++) {
				spaces.push([]);
				for (var j = 0; j < 8; j ++){
					spaces[i].push(new Space(i, j, size, null));
				}
			}
			return spaces;
		},

		setStart: function() {
			this.spaces[3][3].placePiece(false);
			this.spaces[4][3].placePiece(true);
			this.spaces[3][4].placePiece(true);
			this.spaces[4][4].placePiece(false);
		}
	};

	var Space = function(x, y, gameSize, contents) {
		this.x = x;
		this.y = y;
		this.center = {
			x: x * gameSize / 8 + gameSize / 16,
			y: y * gameSize / 8 + gameSize / 16,
		};
		this.size = gameSize / 8;
		this.contents = contents;	
	};

	Space.prototype = {
		placePiece: function(state) {
			this.contents = new Piece(state, this);
		},

		removePiece: function() {
			var holder = this.contents;
			this.contents.space = undefined;
			this.contents = null;
			return holder;
		}
	};

	var Piece = function(state, space) {
		this.size = space.size / 2.2;
		this.location = {
			x: space.x,
			y: space.y
		},
		this.center = {
			x: space.center.x,
			y: space.center.y
		},
		this.state = state;
	};

	Piece.prototype = {
		flip: function(){
			this.state = !this.state;
		}
	};

	var Mouser = function (canvas, clickHandler, context) 	{
		canvas.addEventListener("click", function (e){
			clickHandler(e.layerX, e.layerY, context);
		});
	}

	window.addEventListener("load", function(){
		myGame = new Game();
	});

})();

