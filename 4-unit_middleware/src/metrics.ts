import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import { Stream } from 'stream'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  public db: any 
  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public save(key: number, metrics: Metric[], callback: (err: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
    callback(null)
  } 
  
  public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []
    if (key=="all"){
      stream.on('error', callback)
      .on('data', (data: any) => {
        for(let i in data) {
          key=i;
          let g=data[i].split(":")
          key=g[1]
          const [_, k, timestamp] = data.key.split(":")
          const value = data.value
          if (key != k) {
            console.log(`LevelDB error: ${data} does not match key ${key}`)
          } else {
            met.push(new Metric(timestamp, value))
          }
        }
      })
      .on('end', (err: Error) => {
        callback(null, met)
      })
      
    }
    else{
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

  public delete(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db, { type: 'del' })
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }
  static get(callback: (error: Error | null, result?: Metric[]) => void) {
    const result = [
      new Metric('2013-11-04 14:00 UTC', 12),
      new Metric('2013-11-04 14:30 UTC', 15)
    ]
    callback(null, result)
  }
}