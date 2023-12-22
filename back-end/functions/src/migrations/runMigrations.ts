import {DbClient} from "../DbClient"
import {adminField} from "./adminField"
import {runDenormalizedScore} from "./denormalizedScore"

export const runMigrations = async (client: DbClient) => {
  const denormalizedScore = await client.migrations.hasRun("denormalizedScore")
  if (!denormalizedScore) {
    const success = await runDenormalizedScore(client)
    if (success) {
      client.migrations.markAsRun("denormalizedScore")
    }
  }

  const adminMigrations = await client.migrations.hasRun("adminMigrations")
  console.log("adminMigrations", adminMigrations)
  if (!adminMigrations) {
    const success = await adminField(client)
    if (success) {
      await client.migrations.markAsRun("adminMigrations")
      console.log("adminMigrations marked as run")
    }
  }

  return true
}
