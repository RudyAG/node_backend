import { LevelDB } from "./leveldb"
const bcrypt = require('bcrypt');
const saltRounds = 10;

export class User {
    public username: string
    public email: string
    public password: string = ""

  
    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
        this.username = username
        this.email = email
        if (!passwordHashed) {
            console.log("password not Hashed")
            passwordHashed=true
            this.setPassword(password)
            console.log("construc"+this.password)
        } else this.password = password
    }
    
    static fromDb(username: string, value: any): User {
        console.log(value)
        const [password, email] = value.split(":")
        return new User(username, email, password)
    }
    
    public setPassword(toSet: string): void {
        // Hash and set password
        var salt = bcrypt.genSaltSync(saltRounds);
        this.password = bcrypt.hashSync(toSet, salt);
    }
    
    public getPassword(): string {
        return this.password
    }
    
    public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
        console.log("pas" + this.password +"toV"+toValidate)
        return bcrypt.compareSync(toValidate, this.password)   
    }
}
//User CRUD
export class UserHandler {
    public db: any
   //Get User 
    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            if (err) callback(err)
            else if (data === undefined) callback(null, data)
            callback(null, User.fromDb(username, data))
        })
    }
    //Create User 
    public save(user: User, callback: (err: Error | null) => void) {
        this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
          callback(err)
        })
      }
    
    //Delete User 
    public delete(username: string, callback: (err: Error | null) => void) {
        // TODO
        this.db.del(`user:${username}`, (err: Error | null) => {
            callback(err)
        })
    }
    
    constructor(path: string) {
        this.db = LevelDB.open(path)
    }
}
    