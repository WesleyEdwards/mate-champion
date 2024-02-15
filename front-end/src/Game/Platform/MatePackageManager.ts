import { Package } from "../Bullet/Package";
import { MCImage } from "../Drawing/drawingUtils";
import { packageImage } from "../Drawing/ImageRepos";
import { updatePackageStatus } from "../GameState/GameStateFunctions";
import Player from "../Player/Player";
import { DrawObjProps } from "../helpers/types";
import { devSettings } from "../devSettings";
import { packageConst } from "../constants";
import { getLevelItem } from "../constructors";
import { LevelInfo } from "../models";

export class MatePackageManager {
  packages: Package[] = [];
  image: MCImage = packageImage;

  draw({ cxt, camOffset }: DrawObjProps) {
    this.packages.forEach((p) => {
      cxt.save();
      cxt.translate(p.position.x - camOffset.x, p.position.y + camOffset.y);
      cxt.drawImage(
        this.image.image,
        -packageConst.width / 2,
        -packageConst.height / 2,
        this.image.width,
        this.image.height
      );

      if (devSettings.redOutline) {
        cxt.strokeStyle = "red";
        cxt.lineWidth = 2;
        cxt.strokeRect(
          -packageConst.width / 2,
          -packageConst.height / 2,
          this.image.width,
          this.image.height
        );
        cxt.beginPath();
        cxt.arc(0, 0, 1, 0, 2 * Math.PI);
        cxt.stroke();
      }
      cxt.restore();
    });
  }

  reset(level: number, levels: LevelInfo[]) {
    this.packages = getLevelItem(level, "package", levels);
  }

  getReceivedPackages(player: Player): boolean {
    const matePackage = updatePackageStatus(player, this.packages);
    if (!matePackage) return false;
    this.packages.splice(this.packages.indexOf(matePackage), 1);
    return true;
  }
}
