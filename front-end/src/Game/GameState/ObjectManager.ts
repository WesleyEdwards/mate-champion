// import { Coordinates, Keys, FullLevelInfo } from "../models";
// import Player from "../Player/Player";
// import { Pot } from "../Pot";
// import { MAX_CANVAS_HEIGHT, playerConst } from "../constants";
// import { MatePackageManager } from "../Platform/MatePackageManager";
// import { OpponentManager } from "../Opponent/OpponentManager";
// import { PlatformManager } from "../Platform/PlatformManager";
// import { Canvas, DrawObjProps, UpdateStatus } from "../helpers/types";
// import { GameMode } from "../../hooks/useAuth";
// import { getLevelInfo } from "../constructors";

// // export class ObjectManager {
// //   player: Player = new Player();
// //   opponentManager: OpponentManager = new OpponentManager();
// //   bulletManager: BulletManager = new BulletManager();
// //   matePackManager: MatePackageManager = new MatePackageManager();
// //   platformManager: PlatformManager = new PlatformManager();
// //   pot: Pot = new Pot();
// //   levels: FullLevelInfo[];
// //   gameMode: GameMode;

// //   constructor(levels: FullLevelInfo[], gameMode: GameMode) {
// //     this.levels = levels;
// //     this.gameMode = gameMode;
// //   }

// //   reset(level: number) {
// //     const levelInfo = getLevelInfo(level, this.levels);
// //     this.platformManager.reset(levelInfo);
// //     this.matePackManager.reset(levelInfo);
// //     this.player.reset();
// //     this.opponentManager.reset(levelInfo);
// //     this.pot.reset(levelInfo.endPosition);
// //     this.bulletManager.reset();
// //   }

// //   updateAll(keys: Keys, elapsedTime: number, ammo: number): UpdateStatus {
// //     this.player.update(keys, elapsedTime);
// //     if (this.gameMode !== "edit") {
// //       this.opponentManager.update(elapsedTime);
// //     }
// //     this.bulletManager.update(elapsedTime, this.player.position);

// //     this.calcPersonColl();

// //     return {
// //       statsInfo: {
// //         killedOpp: this.getKilledOpponents(),
// //         shot: this.calcBullets(ammo),
// //         packagesReceived: this.matePackManager.getReceivedPackages(
// //           this.player,
// //           this.gameMode
// //         ),
// //       },
// //       levelInfo: {
// //         isCaught: this.playerDies,
// //         nextLevel: this.nextLevel,
// //       },
// //     };
// //   }

// //   private calcBullets(ammo: number): boolean {
// //     if (this.player.shooting && ammo > 0) {
// //       this.bulletManager.addBullet(this.player.vector);
// //       return true;
// //     }
// //     return false;
// //   }

// //   private getKilledOpponents(): number {
// //     if (this.gameMode === "edit") return 0;
// //     const { opponents, bullets } = updateLiveStatus(
// //       this.player,
// //       this.opponentManager.opponents,
// //       this.bulletManager.bullets
// //     );
// //     this.opponentManager.markAsDying(opponents);
// //     this.bulletManager.removeBullets(bullets);
// //     return opponents.grog.length;
// //   }

// //   private get playerDies() {
// //     if (
// //       this.player.vector.position.y + this.player.vector.height >
// //       MAX_CANVAS_HEIGHT
// //     ) {
// //       return true;
// //     }
// //     return this.opponentManager.touchingPlayer(this.player.position);
// //   }

// //   get nextLevel() {
// //     if (this.gameMode === "edit") return false;
// //     return this.player.position.x > this.pot.vector.posX;
// //   }

// //   drawObjects(cxt: Canvas, camOffset: Coordinates) {
// //     const drawProps: DrawObjProps = { cxt, camOffset };
// //     this.platformManager.draw(drawProps);
// //     this.pot.draw(drawProps);
// //     this.bulletManager.draw(drawProps);
// //     this.opponentManager.draw(drawProps);
// //     this.matePackManager.draw(drawProps);
// //     this.player.draw(drawProps);
// //   }

// //   get playerStopped(): boolean {
// //     return this.player.vector.velocity.x === 0;
// //   }

// //   calcPersonColl() {
// //     if (this.player.position.y + playerConst.radius >= MAX_CANVAS_HEIGHT) {
// //       this.player.setOnPlatform(MAX_CANVAS_HEIGHT - playerConst.radius);
// //     }
// //     this.platformManager.platforms.forEach((platform) => {
// //       this.opponentManager.opponents.grog.forEach((opp) =>
// //         calcPlatOppCollision(platform, opp)
// //       );
// //       calcPlatPlayerCollision(platform, this.player);
// //     });
// //   }
// // }
