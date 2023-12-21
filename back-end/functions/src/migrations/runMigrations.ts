import {DbClient} from "../DbClient"
import {runDenormalizedScore} from "./denormalizedScore"

export const runMigrations = async (client: DbClient) => {
  const denormalizedScore = await client.migrations.hasRun("denormalizedScore")
  if (!denormalizedScore) {
    const success = await runDenormalizedScore(client)
    if (success) {
        client.migrations.markAsRun("denormalizedScore")
    }

  }
  return true
}
