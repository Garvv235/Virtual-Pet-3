var dog, happyDog,dogImg, database, foodS, foodStock
var gameState,readState;
var bedroom, garden, washroom;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload()
{
 dogImg = loadImage("sprites/Dog.png");
 happyDog = loadImage("sprites/happydog.png");
 bedroom = loadImage("virtual+pet+images/Bed Room.png");
 garden = loadImage("virtual+pet+images/Garden.png");
 washroom = loadImage("virtual+pet+images/Wash Room.png");
}

function setup() {
	database = firebase.database();
  
  createCanvas(500, 500);

  foodObj = new Food();
  
  dog = createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  foodStockRef = database.ref('Food');
  foodStockRef.on("value",readStock);

}


function draw() {  
  background(46, 139, 87);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(dogImg);
  }

  drawSprites();
  fill(255,255,254);
  stroke("white");
  text("Food left :"+foodS,170,200);
  textSize(13);
  text("Note : Press Up Arrow key to feed milk to John",130,300);


}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  }
  function feedDog(){
    dog.addImage(happyDog);
  
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }
  
  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }

  function update(state){
    database.ref('/').update({
      gameState:state
    })
  }

