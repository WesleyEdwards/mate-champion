import { Package } from "../Bullet/Package";
import { MCImage } from "../Drawing/drawingUtils";
import { packageImage } from "../Drawing/ImageRepos";
import { updatePackageStatus } from "../GameState/GameStateFunctions";
import Player from "../Player/Player";
import { DrawObjProps } from "../helpers/types";
import { packageConst } from "../constants";
import { getLevelItem } from "../constructors";
import { FullLevelInfo } from "../models";
import { GameMode } from "../../hooks/useAuth";

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

      if (window.window.mateSettings.collisionBoxesVisible) {
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

  reset(info: FullLevelInfo) {
    this.packages = getLevelItem("package", info);
  }

  getReceivedPackages(player: Player, gameMode: GameMode): boolean {
    if (gameMode === "edit") return false;
    const matePackage = updatePackageStatus(player, this.packages);
    if (!matePackage) return false;
    this.packages.splice(this.packages.indexOf(matePackage), 1);
    return true;
  }
}
