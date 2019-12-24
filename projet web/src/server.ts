import express = require('express')
import { MetricsHandler } from './metrics'
import { UserHandler, User } from './users'
import path = require('path')
import bodyparser = require('body-parser')
import morgan = require('morgan')

import session = require('express-session')
import levelSession = require('level-session-store')

const app = express()
const LevelStore = levelSession(session)

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))


app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.use(express.static(path.join(__dirname, '/../public')))
app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');


app.get('/hello/:name', (req: any, res: any) => {
  res.render('hello.ejs', {name: req.params.name})
})

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.get('/metrics/:id', (req: any, res: any) => {
  console.log("get oki")
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

app.delete('/metrics/:id', (req: any, res: any) => {
  dbMet.delete(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})


const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/signout', (req: any, res: any) => {
  res.render('signout')
})

authRouter.post('/signup', (req: any, res: any) => {
  const NewUser: User = new User(req.body.username,req.body.email,req.body.password,true)
  console.log("server :" + NewUser.getPassword())
  dbUser.save(NewUser,(err: Error | null) => {
    if (err) throw err
    res.status(200).send()
    res.redirect('/login')
  })
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

authRouter.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    console.log(result)
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

authRouter.post('/signup', (req: any, res: any) => {
  const NewUser: User = new User(req.body.username,req.body.email,req.body.password,true)
  console.log("server :" + NewUser.getPassword())
  dbUser.save(NewUser,(err: Error | null) => {
    if (err) throw err
    res.status(200).send()
    res.redirect('/login')
  })
})



app.use(authRouter)


const userRouter = express.Router()

userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
     res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})

app.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.use('/user', userRouter)

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})

app.set('port', 8080);
app.listen(
  app.get('port'), 
  () => console.log(`server listening on ${app.get('port')}`)
);