;(function() {
	var Game = function () {
		var canvas = document.getElementById("screen");
		canvas.height = 600;
		canvas.width = 600;
		this.drawTools = canvas.getContext('2d');
		this.board = new Board();
		this.draw();


	};

	Game.prototype = {
		reset: function () {

		},

		draw: function() {
			console.log(this.drawTools);
			for (var i = 0; i < 8; i ++) {
				for (var j = 0; j < 8; j ++){
					this.board.spaces[i][j].draw(this.drawTools);
				}
			}
		}
	};

	var Board = function() {
		this.spaces= this.makeBlankSpaces();
		this.setStart();
	};

	Board.prototype = {
		makeBlankSpaces: function() {
			var spaces = [];
			for (var i = 0; i < 8; i ++) {
				spaces.push([]);
				for (var j = 0; j < 8; j ++){
					spaces[i].push(new Space(i, j, null));
				}
			}
			return spaces;
		},

		setStart: function() {
			this.spaces[3][3].placePiece(true);
			this.spaces[4][3].placePiece(false);
			this.spaces[3][4].placePiece(true);
			this.spaces[4][4].placePiece(false);
		}
	};

	var Space = function(x, y, contents) {
		this.x = x;
		this.y = y;
		this.contents = contents;	
	};

	Space.prototype = {
		placePiece: function(state) {
			this.contents = new Piece(state);
		},

		removePiece: function() {
			var holder = this.contents;
			this.contents = null;
			return holder;
		}
	};

	var Piece = function(state) {
		this.state = state;
	};

	Piece.prototype = {
		flip: function(){
			this.state = !this.state;
		}
	};

	window.addEventListener("load", function(){
		myGame = new Game();
	});

})();


