// CONFIGURATION
var GAME_ENDED = false;
//PACMAN
var pacman = {
    x: 1,
    y: 1
}
// Dfined interval sides and maze array.
var rightInterval,
    leftInterval,
    topInterval,
    bottomInterval,
    maze;
//GHOSTS
var ghosts = [
    { x: 9, y: 10, direction: 3 }, 
    { x: 9, y: 10, direction: 3 },
    { x: 9, y: 10, direction: 3 },
    { x: 9, y: 10, direction: 3 }
];

var GameStatus = {
    StartGameDate: null,
    EndGameDate: null,
    Lives: 3,
    CoinsEaten: 0,
    BisliEaten: 0,
    GhostEaten: 0,
    Score: 0,
    MazeType: 0,
    Running: false
};

// Game -> Move pacman, Update score, check if end, check status and Freeze on the end.
var GameEngine = {
    Running: true,
    Pause: function(){
        GameEngine.Running = false;
        GameEngine.Freeze();
        $('*').off('keyup keydown keypress');

        if(GAME_ENDED)
        {
            

        }
    },
    Play: function(){
        GameEngine.Running = true;
        Ghost.Update();
        Ghost.Init();
        Pacman.Move();
        GameEngine.UpdateScore();
    },
    Timer: function(){

    },
    UpdateScore: function(){
         $('#score').html(GameStatus.Score);
    },
    CheckStatus: function(){
        //PACMAN SCORING COINS
        if(maze[pacman.y][pacman.x] == 10){
            maze[pacman.y][pacman.x] = 9;
            GameStatus.Score+=10;
            GameStatus.CoinsEaten++;
            Core.DrawMaze();
            GameEngine.UpdateScore();
        }
        //PACMAN SCORING CHERRIES
        if(maze[pacman.y][pacman.x] == 11){
            maze[pacman.y][pacman.x] = 9;
            GameStatus.Score+=50;
            GameStatus.BisliEaten++;
            Core.DrawMaze();
            GameEngine.UpdateScore();
        }

        if(!GAME_ENDED)
        {
            GameEngine.CheckEatComplete();
        }
        else
        {
            GameEngine.Pause();
        }
    },
    CheckEnd: function(ghost){
        if(GAME_ENDED)
        {
            return;
        }
        else
        {
            if((pacman.x == ghost.x) && (pacman.y == ghost.y)){
                GameEngine.Running = false;
                GameEngine.Pause();
                //console.log(i);
                GameStatus.Lives = GameStatus.Lives - 1;
                
                $('#lives').html(GameStatus.Lives);
                if(GameStatus.Lives == 0)
                {
                    GAME_ENDED = true;
                    $('#gameover').fadeIn();
                    GameStatus.EndGameDate = new Date();
                }
                else{
                    GameEngine.Pause();
                    pacman.x = 1;
                    pacman.y = 1;
                    
                    ghosts = [
                                { x: 9, y: 10, direction: 3 }, 
                                { x: 9, y: 10, direction: 3 },
                                { x: 9, y: 10, direction: 3 },
                                { x: 9, y: 10, direction: 3 }
                             ];

                    GameEngine.Running = false;

                    Ghost.Update();
                    Ghost.Init();

                    
                }
            }
        }
    },
    Freeze: function(){
        clearInterval(intervals.rightInterval);
        clearInterval(intervals.leftInterval);
        clearInterval(intervals.topInterval);
        clearInterval(intervals.bottomInterval);
    },
    CheckEatComplete: function(){
        if($('.bisli').length == 0 && $('.coin').length == 0)
        {
            setTimeout(function(){
                // END GAME HERE!
                $('#win_message').fadeIn();
                GAME_ENDED = true;
                GameEngine.Pause();
            }, 500);
        }
    },
    StartNewGame: function(){
        GameStatus = {
            StartGameDate: null,
            EndGameDate: null,
            Lives: 3,
            CoinsEaten: 0,
            BisliEaten: 0,
            GhostEaten: 0,
            Score: 0,
            MazeType: 0,
            Running: false
        };

        pacman.x = 1;
        pacman.y = 1;

        ghosts = [
            { x: 9, y: 10, direction: 3 }, 
            { x: 9, y: 10, direction: 3 },
            { x: 9, y: 10, direction: 3 },
            { x: 9, y: 10, direction: 3 }
        ];
    }
}


// Build the game map array.
var mazes = {
    // 0 = wall
    // 1 = left radius wall
    // 2 = right radius wall
    // 3 = right bottom radius
    // 4 = left bottom radius
    // 5 = up radius
    // 6 = right radius
    // 7 = bottom radius
    // 8 = left radius
    // 9 = empty
    // 10 = COIN
    // 11 = BISLI
    level1 : [
        [1, 0, 0, 0, 0, 0, 0, 0,0,0, 0, 0, 0,0, 0, 0, 0, 0, 0, 2 ], // Line 1 - ready
        [0, 10,10,10,10,10,0,10,0,10,10,10,0,10,10,10,10,10,10,0 ], // Line 2 - ready
        [0, 10,0, 10, 0,10,10,10,10,10,0,10,10,10,10,0,10,0,10,0 ], // Line 3 - ready
        [0, 10,0, 10, 0,10,10,10,10,10,0, 10,10,10,10,10,10,10,0, 0 ], // Line 4
        [0, 10,0, 11,8, 0, 0, 0, 6, 10,0, 10,8, 0, 0, 0, 6, 11,0, 0 ], // Line 5
        [0, 10,0, 10,10,10,10,10,10,10,0, 10,10,10,10,10,10,10,0, 0 ], // Line 6
        [0, 10,4, 0, 0, 0, 0, 0, 6, 10,0, 10,8, 0, 0, 0, 0, 0, 3, 0 ], // Line 7
        [0, 10,10,10,10,10,10,10,10,10,0, 10,10,10,10,10,10,10,10,0 ], // Line 8
        [0, 10,1, 0, 0, 0, 0, 0, 6, 10,0, 10,8, 0, 0, 0, 0, 0, 2, 0 ], // Line 9
        [0, 10,0, 10,10,10,10,10,10,10,0, 10,10,10,10,10,10,10,0, 0 ], // Line 10
        [0, 10,0, 11,8, 0, 0, 0, 6, 10,0, 10,8, 0, 0, 0, 6, 11,0, 0 ], // Line 11
        [0, 10,0, 10,10,10,10,10,10,10,0, 10,10,10,10,10,10,10,0, 0 ], // Line 12
        [0, 10,4, 0, 0, 0, 0, 0, 6, 10,7, 10,8, 0, 0, 0, 0, 0, 3, 0 ], // Line 13
        [0, 10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,0 ], // Line 14
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3 ]  // Line 15
    ], 
    level2: [
            [1, 0, 0, 0, 0, 0, 0, 0,0,0, 0, 0, 0,0, 0, 0, 0, 0, 0, 2 ], // Line 1 - ready
            [0, 9,10,10,10,10,0, 0, 10,10,10,10,0,0,10,10,10,10,10,0 ], // Line 2 - ready
            [0, 10,0, 10,0, 10,10,10,10,0, 0,10,10,10,10,0,10,0,10,0 ],// Line 3 - ready
            [0, 10,0,10, 0, 0, 0,10,0, 0,0,0,10,0,0,0,10,0,10,0], // Line 4 - ready
            [0, 10,0,10,10,10,10,10,10,0,0,10,10,10,10,10,10,0,10,0], // Line 5 - ready
            [0, 10,0,0, 0, 0, 10,0, 10,10,10,10,0,10,0,0,0,0,10,0], // Line 6 - ready
            [0, 10,10,10,10,10,10,0,0,0,0,0,0,10,10,10,10,10,10,0], // Line 7 - ready
            [0, 10,0,0,0,0,10,10,10,10,10,10,10,10,0,0,0,0,10,0], // Line 8 - ready
            [0, 10, 10,10,10,10,10,12,12,9,9,12,12,10,10,10,10,10,10,0], // Line 9  - ready
            [0,10,0,0,0,0,10,12,9,9,9,9,12,10,0,10,0,0,0,0], // Line 10 - ready
            [0, 10,10,10,10,10,10,12,9,11,9,9,12,10,10,10,10,10,10,0], // Line 11 - ready
            [0,10,0,0,0,0,10,12,12,12,12,12,12,10,0,10,0,0,10,0], // Line 12 - ready
            [0,10,0,10,10,10,10,10,10,10,10,10,10,10,0,10,10,0,10,0], // Line 13 - ready
            [0,10,0,10,0,0,0,0,10,0,0,0,0,0,0,0,10,0,10,0], // Line 14 - ready
            [0,10,0,10,10,10,10,0,10,10,10,10,0,10,10,10,10,0,10,0], // Line 15 - ready
            [0,10,0,0,0,0,10,0,0,0,0,10,0,10,0,0,0,0,10,0], // Line 16 - ready
            [0,10,0,10,10,10,10,0,10,10,10,10,0,10,10,10,10,0,10,0], // Line 17 - ready
            [0,10,0,10,0,0,0,0,10,0,0,0,0,0,0,0,10,0,10,0], // Line 18 - ready
            [0,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,0],
            [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 3]
        ],
    level3: [
        
    ]
};

// Core -> Init, Show the maze, Show pacman, show ghosts, and define block size
var Core = {
    // init maze level
    init: function(){
        maze = mazes.level2;
        GameStatus.MazeType = "level2";
        GameStatus.StartGameDate = new Date();
        pacman.x = 1;
        pacman.y = 1;
        Ghost.Init();


        // LEFT MOBILE BUTTON
        $(document).on('click', '#btn_left', function(){
            $("#btn_left").focus();
            var e = jQuery.Event("keydown");
            e.keyCode = 37;                     
            $("#btn_left").trigger(e);       
        });

        // RIGHT MOBILE BUTTON
        $(document).on('click', '#btn_right', function(){
            $("#btn_right").focus();
            var e = jQuery.Event("keydown");
            e.keyCode = 39;                     
            $("#btn_right").trigger(e);       
        });


        // UP
        $(document).on('click', '#btn_up', function(){
            $("#btn_up").focus();
            var e = jQuery.Event("keydown");
            e.keyCode = 38;                     
            $("#btn_up").trigger(e);       
        });

        // DOWN
        $(document).on('click', '#btn_down', function(){
            $("#btn_down").focus();
            var e = jQuery.Event("keydown");
            e.keyCode = 40;                     
            $("#btn_down").trigger(e);       
        });
    },
    // Draw the maze grid
    DrawMaze: function(){
        var output = '';
        for(var i=0; i<maze.length; i++){
            output += "\n<div class='row'>\n"
            for(var j=0; j<maze[i].length; j++){
                //BRICKS
                if(maze[i][j] == 0)
                    output += "<div class='brick'></div>";
                else if(maze[i][j] == 1)
                    output += "<div class='brick lefttop'></div>";
                else if(maze[i][j] == 2)
                    output += "<div class='brick righttop'></div>";
                else if(maze[i][j] == 3)
                    output += "<div class='brick rightbottom'></div>";
                else if(maze[i][j] == 4)
                    output += "<div class='brick leftbottom'></div>";
                else if(maze[i][j] == 5)
                    output += "<div class='brick top'></div>";
                else if(maze[i][j] == 6)
                    output += "<div class='brick right'></div>";
                else if(maze[i][j] == 7)
                    output += "<div class='brick bottom'></div>";
                else if(maze[i][j] == 8)
                    output += "<div class='brick left'></div>";
                //DYNAMIC CONTENT
                else if(maze[i][j] == 9)
                    output += "<div class='empty'></div>";    
                else if(maze[i][j] == 10)
                    output += "<div class='coin'></div>";
                else if(maze[i][j] == 11)
                    output += "<div class='bisli'></div>";
                else if(maze[i][j] == 12)
                    output += "<div class='cage'></div>";
            }
            output += "\n</div>"
        }
        $('#maze').html(output);
    },
    //define block size
    BlockParams: { width: 30, height: 30 }    
};


var intervals = {
    rightInterval: function(){
        if(maze[pacman.y][pacman.x+1]==9 || maze[pacman.y][pacman.x+1]==10 || maze[pacman.y][pacman.x+1]==11)
            {
                pacman.x++;
                GameEngine.CheckStatus();
            }
            else
            {
                clearInterval(rightInterval);
            }
            Pacman.Move();},
    leftInterval: function(){
        if(maze[pacman.y][pacman.x-1]==9 || maze[pacman.y][pacman.x-1]==10 || maze[pacman.y][pacman.x-1]==11)
            {
                pacman.x--;
                GameEngine.CheckStatus();
                
            }
            else
            {
                clearInterval(leftInterval);
            }
            Pacman.Move();},
    topInterval: function(){ 
        if(maze[pacman.y+1][pacman.x]==9 || maze[pacman.y+1][pacman.x]==10 || maze[pacman.y+1][pacman.x]==11)
            {
                pacman.y++;
                GameEngine.CheckStatus();
            }
            else
            {
                clearInterval(topInterval);
            }
             Pacman.Move();
    },
    bottomInterval: function(){
        if(maze[pacman.y-1][pacman.x]==9 || maze[pacman.y-1][pacman.x]==10 || maze[pacman.y-1][pacman.x]==11)
            {
                pacman.y--;
                //$('#pacman').css({top: (pacman.y * block.height) + 'px' });
                GameEngine.CheckStatus();
            }
            else
            {
                clearInterval(bottomInterval);
            }
             Pacman.Move();
    }
};


// Movement on key down
document.onkeydown = function(e){
    clearInterval(rightInterval);
    clearInterval(leftInterval);
    clearInterval(topInterval);
    clearInterval(bottomInterval);

    // PLAY OR PAUSE
    if(e.keyCode == 32)
    {
        if(GameEngine.Running)
        {
            GameEngine.Pause();
        }
        else
        {
            GameEngine.Play();
        }
    }

    if(e.keyCode == 37) // left
    {
        $('#pacman').removeClass('right');
        $('#pacman').removeClass('up');
        $('#pacman').removeClass('down');
        $('#pacman').addClass('left');

        leftInterval = setInterval(function(){ intervals.leftInterval() }, 200);
    }
    else if(e.keyCode == 39) // right 
    {
        $('#pacman').removeClass('left');
        $('#pacman').removeClass('up');
        $('#pacman').removeClass('down');
        $('#pacman').addClass('right');

        rightInterval = setInterval(function(){ intervals.rightInterval() }, 200);
    }
    else if(e.keyCode == 40) // down
    {
        $('#pacman').removeClass('left');
        $('#pacman').removeClass('down');
        $('#pacman').removeClass('right');
        $('#pacman').addClass('up');
        
     
        topInterval = setInterval(function(){ intervals.topInterval() }, 200); 
        
    }
    else if(e.keyCode == 38) // up 
    {
        $('#pacman').removeClass('left');
        $('#pacman').removeClass('up');
        $('#pacman').removeClass('right');
        $('#pacman').addClass('down');
        

        bottomInterval = setInterval(function(){ intervals.bottomInterval() }, 200); 
    }
}

// Pacman Manager
var Pacman = {
    Move: function(){
        $('#pacman').css({ left:  (pacman.x * Core.BlockParams.width + 'px')});
        $('#pacman').css({ top:   (pacman.y * Core.BlockParams.height + 'px')});
    },
    
};

// Ghost Manager
var Ghost = {
    Update: function(){
        for(var i = 0; i < ghosts.length; i++)
        {
            $('.ghost')[i].style.left = ghosts[i].x * Core.BlockParams.width +"px";
            $('.ghost')[i].style.top = ghosts[i].y * Core.BlockParams.height +"px";
        }
    },
    Init: function(){
        if(GameStatus.Lives > 0)
        {
            GameEngine.Running = true;
        }

        for(var i = 0; i < ghosts.length; i++)
        {
            Ghost.Move(ghosts[i]); // Start by move up
        }
    },
    Move: function(ghost)
    {
        if(!GameEngine.Running)
            return;

        setTimeout(function(){
            var availableLeft   = (maze[ghost.y][ghost.x-1] != 0 && maze[ghost.y][ghost.x-1] != 12) ? true : false;
            var availableRight  = (maze[ghost.y][ghost.x+1] != 0 && maze[ghost.y][ghost.x+1] != 12) ? true : false;
            var availableUp     = (maze[ghost.y-1][ghost.x] != 0 && maze[ghost.y-1][ghost.x] != 12) ? true : false;
            var availableDown   = (maze[ghost.y+1][ghost.x] != 0 && maze[ghost.y+1][ghost.x] != 12) ? true : false;

            var directionOptions = Ghost.GetDirectionOptions(ghost);
            var tempDirection;
            var currentDirection = ghost.direction;
            
            if(Ghost.CheckGhostLocation(ghost))
            {
                if(maze[ghost.y-2][ghost.x] != 12)
                {
                    ghost.direction = [3];
                    
                }
            }

            if(availableLeft && ghost.direction == 1){
                ghost.x--;
            }

            else if(availableRight && ghost.direction == 2){
                ghost.x++;
            }
            else if(availableUp && ghost.direction == 3){
                ghost.y--;
            }
            else if(availableDown && ghost.direction == 4){
                ghost.y++;
            }
            else
            {
                ghost.direction = Ghost.randomDirection(directionOptions);
            }

            Ghost.Update();
            GameEngine.CheckEnd(ghost);
            if(!GAME_ENDED)
                Ghost.Move(ghost); 
        }, 200);
    },
    randomDirection: function(directionOptions){
        /*var random = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        return random;*/
        return directionOptions[Math.floor(Math.random() * directionOptions.length)];
    },
    GetDirectionOptions: function(ghost){
        var directionsOptions = [];
        
        var availableLeft   = (maze[ghost.y][ghost.x-1] != 0 && maze[ghost.y][ghost.x-1] != 12) ? true : false;
        var availableRight  = (maze[ghost.y][ghost.x+1] != 0 && maze[ghost.y][ghost.x+1] != 12) ? true : false;
        var availableUp     = (maze[ghost.y-1][ghost.x] != 0 && maze[ghost.y-1][ghost.x] != 12) ? true : false;
        var availableDown   = (maze[ghost.y+1][ghost.x] != 0 && maze[ghost.y+1][ghost.x] != 12) ? true : false;
        
        
        /*console.log('=============================');
        console.log(availableLeft);
        console.log(availableRight);
        console.log(availableUp);
        console.log(availableDown);
        console.log('=============================');*/
        
        if(availableLeft)
            directionsOptions.push(1);
        if(availableRight)
            directionsOptions.push(2);
        if(availableUp)
            directionsOptions.push(3);
        if(availableDown)
            directionsOptions.push(4);
        
        return directionsOptions;
    },
    CheckGhostLocation: function(ghost){
        var cageCoordinates = [[8, 9], [8, 12], [13 ,9], [13, 12]];
        return Ghost.InsideCage([ghost.x, ghost.y], cageCoordinates);
    },
    InsideCage: function(point, vs) {
        var x = point[0], y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }    
};
// On ready functions
$(document).ready(function(){
    Core.init();
    Core.DrawMaze();
    Pacman.Move();
    GameEngine.UpdateScore();

    $('#lives').html(GameStatus.Lives);
});