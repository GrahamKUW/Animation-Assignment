const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/sprites/robosprite.png");

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
  const msprite = new MSprite(
    ASSET_MANAGER.getAsset("./assets/sprites/robosprite.png"),
    new Transform(ctx.canvas.width / 2, ctx.canvas.height / 2, 0, 10, 10),
    32,
    32,
    false,
    false
  );

  const animations = [
    new Animation(msprite, 5, 0.5, 1, gameEngine),
    new Animation(msprite, 6, 0.5, 2, gameEngine),
    new Animation(msprite, 3, 0.5, 3, gameEngine),
    new Animation(msprite, 2, 0.5, 4, gameEngine),
    new Animation(msprite, 4, 0.5, 5, gameEngine),
    new Animation(msprite, 2, 0.5, 6, gameEngine),
    new Animation(msprite, 5, 0.5, 7, gameEngine),
    new Animation(msprite, 5, 0.5, 8, gameEngine),
    new Animation(msprite, 5, 0.5, 9, gameEngine),
    new Animation(msprite, 11, 0.5, 10, gameEngine),
    new Animation(msprite, 4, 0.5, 11, gameEngine),
    new Animation(msprite, 10, 0.5, 12, gameEngine),
    new Animation(msprite, 11, 0.5, 13, gameEngine),
  ];

  const animController = new AnimationController();

  for (let i = 0; i < animations.length; i++) {
    animController.add(animations[i]);
  }

  animController.switch(0);

  gameEngine.addEntity(animController);

  //gameEngine.addEntity(sprite);
  gameEngine.start();
});
