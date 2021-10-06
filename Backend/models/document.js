class Document{
    constructor(id,name,path,expiry){
        this.id = id;
        this.documentName = name;
        this.documentPath = path;
        this.expiry = expiry
    }
}

module.exports = Document