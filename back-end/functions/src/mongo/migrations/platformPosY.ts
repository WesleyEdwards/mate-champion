import {MigrationFun} from "../mongoMigrations"
import {LevelMap} from "../../levelMap/levelMapQueries"

export const platformPosY: MigrationFun = async (db) => {
  const levelCollection = db.collection("levelMap")

  const levels = await levelCollection.find().toArray()

  for (const level of levels) {
    const updatedPlatform = (level as unknown as LevelMap).platforms.map(
      (platform) => {
        const {position, ...rest} = platform

        const newPosition = [position[0], position[1] + 154]

        return {
          position: newPosition,
          ...rest
        }
      }
    )

    await levelCollection.updateOne(
      {_id: level._id},
      {
        $set: {
          platforms: updatedPlatform
        }
      }
    )
  }
}
