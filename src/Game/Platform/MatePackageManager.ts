import { Package } from "../Bullet/Package";
import { MCImage } from "../Drawing/drawingUtils";
import { packageImage } from "../Drawing/ImageRepos";
import { updatePackageStatus } from "../GameState/GameStateFunctions";
import Player from "../Player/Player";
import { Canvas } from "../helpers/types";
import { createMatePackages } from "../constructors";
import { devSettings } from "../devSettings";

export class MatePackageManager {
  packages: Package[];
  image: MCImage = packageImage;
  constructor() {
    this.packages = createMatePackages(1);
  }

  // update(elapsedTime: number) {
  //   this.packages.forEach((p) => p.update(elapsedTime));
  // }

  draw(cxt: Canvas) {
    this.packages.forEach((p) => {
      cxt.drawImage(
        this.image.image,
        p.position.x,
        p.position.y - this.image.height,
        this.image.width,
        this.image.height
      );

      if (devSettings.redOutline) {
        cxt.strokeStyle = "red";
        cxt.lineWidth = 2;
        cxt.strokeRect(
          p.position.x,
          p.position.y - this.image.height,
          this.image.width,
          this.image.height
        );
      }
    });
  }

  reset(level: number) {
    this.packages = createMatePackages(level);
  }

  getReceivedPackages(player: Player): boolean {
    const matePackage = updatePackageStatus(player, this.packages);
    if (!matePackage) return false;
    this.packages.splice(this.packages.indexOf(matePackage), 1);
    return true;
  }
}
