;(function() {
	var Game = function () {
		var self = this;

		var gameCanvas = document.getElementById("screen");
		var panelCanvas = document.getElementById("control-panel");

		var boardMouser = new Mouser(gameCanvas, this.boardClickHandler, self);
		var panelMouser = new Mouser(panelCanvas, this.panelClickHandler, self);

		this.stateController = new StateController;

		this.score = {white: 2, black: 2};

		var SIZE = 600;
		gameCanvas.height = SIZE;
		gameCanvas.width = SIZE;

		panelCanvas.height = SIZE;
		panelCanvas.width = 240;
		this.panelWidth = 240;
		
		this.size = SIZE
		this.drawTools = gameCanvas.getContext('2d');
		this.drawToolsPanel = panelCanvas.getContext('2d');
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
			this.renderPanel();
		},

		updateScore: function(){
			this.score = {white: 0, black: 0};
			for (var i = 0; i < this.board.spaces.length; i++) {
				for (var j = 0; j < this.board.spaces[i].length; j ++) {
					if (this.board.spaces[i][j].contents) {
						if (this.board.spaces[i][j].contents.state === true) {
							this.score.white ++
						} else if (this.board.spaces[i][j].contents.state === false) {
							this.score.black ++
						}
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
			if (!spaceClicked.contents && 
				self.validMove(coordinatesClicked, turn)){
					spaceClicked.placePiece(turn);
					self.flipPieces(coordinatesClicked, turn);
					self.updateScore();
					self.stateController.changeTurns();
					self.draw();
			}
		},

		panelClickHandler: function(clickX, clickY, self) {
			console.log(clickX, clickY);
		},

		flipPieces: function(coordinates, state) {
			var piecesToFlip = this.searchForFlips(coordinates, state);
			if (piecesToFlip.length === 0) {
				return false;	
			}; 
			for (var i = 0; i < piecesToFlip.length; i ++) {
				piecesToFlip[i].flip();
			};
			return true;
		},

		validMove: function(coordinates, state) {
			var flipArray = this.searchForFlips(coordinates, state);
			return flipArray.length ? true : false;
		},

		searchForFlips: function(coordinates, state) {
			var moveArrays = this.findMoveArrays(coordinates,state); 
			var flipArray = [];
			for (var i = 0; i < moveArrays.length; i++) {
				var j = 0;
				var helperArray = [];
				while(moveArrays[i][j] &&
					moveArrays[i][j].state !== state) {
						helperArray.push(moveArrays[i][j]);
						j += 1;
				};
				if (moveArrays[i][j] && 
					moveArrays[i][j].state === state){
				 		flipArray = flipArray.concat(helperArray);
				}
			}
			return flipArray;
		},

		findMoveArrays: function(coordinates, state) {
			var moveArrays = [];
			moveArrays.push(this.findMoveArray(coordinates, state, 1, 0));
			moveArrays.push(this.findMoveArray(coordinates, state, -1, 0));
			moveArrays.push(this.findMoveArray(coordinates, state, 0, 1));
			moveArrays.push(this.findMoveArray(coordinates, state, 0, -1));
			moveArrays.push(this.findMoveArray(coordinates, state, 1, 1));
			moveArrays.push(this.findMoveArray(coordinates, state, 1, -1));
			moveArrays.push(this.findMoveArray(coordinates, state, -1, -1));
			moveArrays.push(this.findMoveArray(coordinates, state, -1, 1));
			return moveArrays;
		},

		findMoveArray: function(coordinates, state, dirX, dirY) {
			var moveArray = [];
			var i = dirX;
			var j = dirY;
			while(Math.abs(coordinates.x + i) < this.board.spaces[coordinates.x].length &&
				Math.abs(coordinates.y + j) < this.board.spaces[coordinates.y].length &&
				(coordinates.x + i) >= 0 &&
				(coordinates.y + j) >= 0) {
					moveArray.push(this.board.spaces[coordinates.x + i][coordinates.y + j].contents);
					i = i + dirX;
					j = j + dirY;
			}
			return moveArray;
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

		},

		renderPanel: function() {
			this.drawToolsPanel.fillStyle = "grey";
			this.drawToolsPanel.fillRect(0, 0, this.panelWidth, this.size)

			this.drawToolsPanel.fillStyle = this.stateController.turn ? "white" : "black";
			this.drawToolsPanel.beginPath();
			this.drawToolsPanel.arc(this.panelWidth / 2,
									this.size /2,
									50, 0, Math.PI * 2);
			this.drawToolsPanel.closePath();
			this.drawToolsPanel.fill();

			this.drawToolsPanel.fillStyle = "black";
			this.drawToolsPanel.font="40px Verdana";
			this.drawToolsPanel.fillText("White: " + this.score.white,30, 50);
			this.drawToolsPanel.fillText("Black: " + this.score.black,30, this.size - 20);
		},
	};

	var StateController = function(game) {
		this.game = game;
		this.turn = true;
	};

	StateController.prototype = {
		changeTurns: function(){
			this.turn = !this.turn;
		},
	};

	var Panel = function() {

	};

	Panel.prototype = {

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
					spaces[i].push(new Space(i, j, size));
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
			this.contents;
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

