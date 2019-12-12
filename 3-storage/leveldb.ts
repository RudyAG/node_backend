import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'

const db = levelup(encoding(
  leveldown("path"), 
  { valueEncoding: 'json' })
)
