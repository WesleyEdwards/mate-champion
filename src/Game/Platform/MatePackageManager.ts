import { Package } from "../Bullet/Package";
import { END_POS } from "../constants";
import { makeImage, MCImage } from "../Drawing/drawingUtils";
import { packageImage } from "../Drawing/ImageRepos";
import { updatePackageStatus } from "../GameState/GameStateFunctions";
import { StaticObject } from "../models";
import Player from "../Player/Player";
import { generateRandomInt } from "../utils";

export class MatePackageManager {
  packages: Package[];
  context: CanvasRenderingContext2D;
  image: MCImage = packageImage;
  constructor(plats: StaticObject[], context: CanvasRenderingContext2D) {
    this.packages = this.createMatePackages(plats);
    this.context = context;
  }

  update(elapsedTime: number) {
    this.packages.forEach((p) => p.update(elapsedTime));
  }

  draw() {
    this.packages.forEach((p) => {
      this.context.drawImage(
        this.image.image,
        p.position.x,
        p.position.y,
        this.image.width,
        this.image.height
      );
    });
  }

  reset(plats: StaticObject[]) {
    this.packages = this.createMatePackages(plats);
  }

  getReceivedPackages(player: Player): boolean {
    const matePackage = updatePackageStatus(player, this.packages);
    if (!matePackage) return false;
    this.packages.splice(this.packages.indexOf(matePackage), 1);
    return true;
  }

  private createMatePackages(plats: StaticObject[]): Package[] {
    const placement = generateRandomInt(500, END_POS);
    const platsUnder = plats.filter(
      (p) =>
        p.vector.posX < placement && p.vector.posX + p.vector.width > placement
    );
    return new Array(3).fill(null).map(
      () =>
        new Package(
          placement,
          platsUnder.map((p) => p.vector.posY)
        )
    );
  }
}
