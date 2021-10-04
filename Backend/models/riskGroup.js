let RiskGroup = class{
    constructor(id,name){
        this.id = id;
        this.riskGroupName = name;
        this.listDocumentId = [];
    }

    setListDocumentID(docIDList){
        if(Array.isArray(docIDList)){
            this.listDocumentId = docIDList
        }
    }
    addListDocumentId(docIDToAdd){
        if(Number.isInteger(docIDToAdd)){
            this.listDocumentId.push(docIDToAdd);
        }
    }
    deleteFromListDocumentID(docIDToDelete){
        let indexToDelete = this.listDocumentId.findIndex(docIDToDelete)
        if (indexToDelete != null){
            this.listDocumentId.splice(indexToDelete,1)
        }
    }
    wipeListDocumentId(){
        this.listDocumentId = []
    }
}