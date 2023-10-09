// DEPENDENCY
import { describe, expect, it, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 3000,
        type: 'income',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 3000,
        type: 'income',
      })

    const cookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 3000,
      }),
    ])
  })

  it('should be able to list a specific transation', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 3000,
        type: 'income',
      })

    const cookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const specificTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(specificTransactionResponse.body).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 3000,
      }),
    )
  })

  it('should be able to list transactions summary', async () => {
    const createIncomeTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Income transaction',
        amount: 3000,
        type: 'income',
      })

    const cookie = createIncomeTransactionResponse.get('Set-Cookie')

    await request(app.server).post('/transactions').set('Cookie', cookie).send({
      title: 'Outcome transaction',
      amount: 1000,
      type: 'outcome',
    })

    const summaryTransactionsResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie)
      .expect(200)

    expect(summaryTransactionsResponse.body.summary).toEqual({
      amount: 2000,
    })
  })

  it('should be able to delete a transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 3000,
        type: 'income',
      })

    const cookie = createTransactionResponse.get('Set-Cookie')

    const listAllTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    const transactionId = listAllTransactionsResponse.body.transactions[0].id

    await request(app.server)
      .delete(`/transactions/${transactionId}`)
      .set('Cookie', cookie)
      .expect(204)
  })
})
