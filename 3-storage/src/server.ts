import express = require('express')
import { MetricsHandler } from './metrics'
import bodyparser = require('body-parser')

const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.get('/metrics/:id', (req: any, res: any) => {
  dbMet.get(req.params.id, (err: Error | null, result?: any) => {
    if (err) throw err
    res.json(result)
  })
})

app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})

app.set('port', 1337);
app.listen(
  app.get('port'), 
  () => console.log(`server listening on ${app.get('port')}`)
);
