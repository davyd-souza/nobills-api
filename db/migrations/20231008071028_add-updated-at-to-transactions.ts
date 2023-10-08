import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.datetime('updated_at', { useTz: true })
  })

  await knex('transactions').update({ updated_at: knex.fn.now() })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('updated_at')
  })
}
