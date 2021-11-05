class User{
    constructor(name,passwordHash,isAdmin){
        this.userName = name;
        this.passwordHash = passwordHash;
        this.isAdmin = isAdmin;
    }
}

module.exports = User;