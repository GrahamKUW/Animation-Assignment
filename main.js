const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/sprites/robosprite.png");
ASSET_MANAGER.queueDownload("./assets/sprites/buttonEmpty.png");

ASSET_MANAGER.downloadAll(() => {
  const canvas = document.getElementById("gameWorld");
  const ctx = canvas.getContext("2d");

  gameEngine.init(ctx);

  /*const sprite = new SSprite(
    ASSET_MANAGER.getAsset("./assets/sprites/robosprite.png"),
    new Transform(ctx.canvas.width / 2, ctx.canvas.height / 2, 0, 1, 1),
    false,
    true
  );*/
  const animationMSprite = new MSprite(
    ASSET_MANAGER.getAsset("./assets/sprites/robosprite.png"),
    new Transform(ctx.canvas.width / 2, ctx.canvas.height / 2, 0, 10, 10),
    32,
    32,
    false,
    false,
  );

  const buttonSprites = [];
  const buttonAmount = 5;
  for (let i = 0; i < buttonAmount; i++) {
    const buttonMSprite = new MSprite(
      ASSET_MANAGER.getAsset("./assets/sprites/buttonEmpty.png"),
      new Transform(80, 450 + 70 * i, 0, 5, 5),
      28,
      10,
      false,
      false,
    );

    buttonSprites.push(buttonMSprite);
  }

  const animations = [
    new Animation(animationMSprite, 5, 0.5, 1, gameEngine),
    new Animation(animationMSprite, 6, 0.5, 2, gameEngine),
    new Animation(animationMSprite, 3, 0.5, 3, gameEngine),
    new Animation(animationMSprite, 2, 0.5, 4, gameEngine),
    new Animation(animationMSprite, 4, 0.5, 5, gameEngine),
    new Animation(animationMSprite, 2, 0.5, 6, gameEngine),
    new Animation(animationMSprite, 5, 0.5, 7, gameEngine),
    new Animation(animationMSprite, 5, 0.5, 8, gameEngine),
    new Animation(animationMSprite, 5, 0.5, 9, gameEngine),
    new Animation(animationMSprite, 11, 0.5, 10, gameEngine),
    new Animation(animationMSprite, 4, 0.5, 11, gameEngine),
    new Animation(animationMSprite, 10, 0.5, 12, gameEngine),
    new Animation(animationMSprite, 11, 0.5, 13, gameEngine),
  ];

  const animController = new AnimationController();

  for (let i = 0; i < animations.length; i++) {
    animController.add(animations[i]);
  }

  animController.switch(0);

  gameEngine.addEntity(animController);

  const idleButton = new Button(buttonSprites[0], gameEngine, "Idle", () => {
    animController.switch(0);
  });

  const walkButton = new Button(buttonSprites[1], gameEngine, "Walk", () => {
    animController.switch(1);
  });

  const attackButton = new Button(
    buttonSprites[2],
    gameEngine,
    "Attack",
    () => {
      animController.switch(6);
    },
  );

  const hitButton = new Button(buttonSprites[3], gameEngine, "Item", () => {
    animController.switch(11);
  });

  const deathButton = new Button(buttonSprites[4], gameEngine, "Death", () => {
    animController.switch(12);
  });

  gameEngine.addEntity(idleButton);
  gameEngine.addEntity(walkButton);
  gameEngine.addEntity(attackButton);
  gameEngine.addEntity(hitButton);
  gameEngine.addEntity(deathButton);

  //gameEngine.addEntity(sprite);
  gameEngine.start();
});
