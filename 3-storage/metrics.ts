// Write
import WriteStream from 'level-ws'
const ws = WriteStream(db);

ws.on('error', function (err) {
  console.log('Oh my!', err)
})
ws.on('close', function () {
  console.log('Stream closed')
})
ws.write({ key: 'occupation', value: 'Clown' })
ws.end()

// Read
const rs = db.createReadStream()
  .on('data', function (data) {
    console.log(data.key, '=', data.value)
  })
  .on('error', function (err) {
    console.log('Oh my!', err)
  })
  .on('close', function () {
    console.log('Stream closed')
  })
  .on('end', function () {
    console.log('Stream ended')
  })

import LevelDB = require('./leveldb')

export class MetricsHandler {
  private db: any 

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }
}

export class MetricsHandler {
    public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
      const stream = WriteStream(this.db)
      stream.on('error', callback)
      stream.on('close', callback)
      metrics.forEach((m: Metric) => {
        stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
      })
      stream.end()
    }
}

public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []
    
    stream.on('error', callback)
      .on('data', (data: any) => {
        const [_, k, timestamp] = data.key.split(":")
        const value = data.value
        if (key != k) {
          console.log(`LevelDB error: ${data} does not match key ${key}`)
        } else {
          met.push(new Metric(timestamp, value))
        }
      })
      .on('end', (err: Error) => {
        callback(null, met)
      })
  }
}
