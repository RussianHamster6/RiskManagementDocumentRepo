class User{
    constructor(id,name,passwordHash,salt){
        this.id = id;
        this.userName = name;
        this.passwordHash = passwordHash;
        this.passwordSalt = salt;
    }
}

module.exports = User;