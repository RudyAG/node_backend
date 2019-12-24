import 'chai'
import { expect } from 'chai'

import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"



const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('Metrics', function () {
  before(function () {
      LevelDB.clear(dbPath)
      dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.db.close()
  })
  
  describe('#get', function () {
    it('should get empty array on non existing group', function () {
      dbMet.get("0", function (err: Error | null, result?: Metric[]) {        
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })
  })


describe('#save', function () {
  it('should save data', function () {
    const result = [
      new Metric('2019-12-24 14:00 UTC', 12),
      new Metric('2013-11-04 14:30 UTC', 15)
    ]
    dbMet.save(777, result, (err: Error | null) => {        
      console.log("err"+err)
      expect(err).to.be.null
    })
  })
})



describe('#delete', function () {
  it('should delete data', function () {  
    const result = [
      new Metric('2019-12-24 14:00 UTC', 12),
      new Metric('2019-12-25 14:30 UTC', 15)
    ]
    dbMet.delete(777, result, (err: Error | null) => {
      if (err) throw err
      expect(err).to.be.null
    })
  })
})
})

