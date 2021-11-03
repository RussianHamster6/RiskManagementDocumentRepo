<template>
    <div>
        <b-table hover :items="documents">
        </b-table>
    </div>
</template>

<script>
import Config from '../config/config.js'
import Document from '../../models/document.js'

export default{
    setup() {
    },
    data() {
        return {
            documents : []
        }
    },
    beforeCreate: function (){
        let config = new Config();
        let urlToSend = config.url + 'Documents'

        new Promise((resolve) =>{
            let http = new XMLHttpRequest();

            http.open('GET',urlToSend,false);
            http.onreadystatechange = function(){
                let response = JSON.parse(http.response)
                resolve(response)
            }
            http.send();
        }).then(async (res) =>{
            res.forEach(x => {
                let documentToAdd = new Document(x.documentName,x.documentPath,x.expiry)
                this.documents.push(documentToAdd);

                //get the current date to display expired documents
                let dateDanger = new Date();
                //add a week to current date to display documents that are about to expire
                let dateWarning = new Date();
                dateWarning.setDate(dateDanger.getDate() + 7);
                //split the date string to make a date object
                let splitDocDate = documentToAdd.expiry.split('/')
                let docDate = new Date(splitDocDate[2],splitDocDate[1] - 1,splitDocDate[0])
                //display expired documents
                if(dateDanger > docDate){
                    this.documents[this.documents.length - 1]._rowVariant = 'danger'
                }
                else if(dateWarning > docDate){
                    this.documents[this.documents.length - 1]._rowVariant = 'warning'
                }
                else{
                    this.documents[this.documents.length - 1]._rowVariant = 'success'
                }
            });
        })
    }
}
</script>