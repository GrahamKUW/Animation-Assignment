const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/sprites/robosprite.png");

ASSET_MANAGER.downloadAll(() => {
  const canvas = document.getElementById("gameWorld");
  const ctx = canvas.getContext("2d");

  gameEngine.init(ctx);

  const msprite = new MSprite(
    ASSET_MANAGER.getAsset("./assets/sprites/robosprite.png"),
    new Transform(ctx.canvas.width / 2, ctx.canvas.height / 2, 0, 10, 10),
    32,
    32,
    false,
    true
  );

  gameEngine.addEntity(new Animation(msprite, 5, 0.5, 1, gameEngine));
  gameEngine.start();
});
