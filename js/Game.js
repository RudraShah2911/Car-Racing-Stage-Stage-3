class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(400,200);
    car1.addImage("car1",car1_img);
    car2 = createSprite(650,200);
    car2.addImage("car2",car2_img);
    car3 = createSprite(900,200);
    car3.addImage("car3",car3_img);
    car4 = createSprite(1125,200);
    car4.addImage("car4",car4_img);
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();

    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
     var x = 200
     var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
       x = x + 220 
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        console.log(y)
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          ellipse(x,y,60,60)
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
          textSize(15);
          text(allPlayers[plr].name ,x,y-80)
        }
       
        
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    if(player.distance > 300){
      gameState = 2;
      player.rank = player.rank + 1
      Player.updateCarsAtEnd(player.rank)
      player.update();
    }
   
    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank)
  }

  displayRanks(){
    background(endingBG)
    camera.position.x = 0
    camera.position.y = 0
    Player.getPlayerInfo()
    imageMode(CENTER)
    textSize(20) 
    image(first,-200,-100,100,100)
    image(second,-200,0,100,100)
    image(third,-200,100,100,100)
    for (var plr in allPlayers){
      if (allPlayers[plr].rank === 1){
      text(allPlayers[plr].name, -100, -100)
    }
    else if (allPlayers[plr].rank === 2 ){
      text(allPlayers[plr].name,-100,0)
    }
    else if (allPlayers[plr].rank === 3 ){
      text(allPlayers[plr].name,-100,100)
    }
    else if (allPlayers[plr].rank === 4 ){
      text("4th :" + allPlayers[plr].name,0,60)
    }
  }
 }
}
