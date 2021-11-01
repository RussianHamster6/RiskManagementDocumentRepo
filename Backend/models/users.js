class User{
    constructor(name,passwordHash,salt){
        this.userName = name;
        this.passwordHash = passwordHash;
        this.passwordSalt = salt;
    }
}

module.exports = User;