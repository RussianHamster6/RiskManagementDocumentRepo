<template>
    <div>
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap@4.5.3/dist/css/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap-vue@2.21.2/dist/bootstrap-vue.css" />
        <b-button variant="success" class="float-right" style="margin-right: 25px; margin-bottom:10px" @click="add">+</b-button>
        <div>
            <b-table hover :items="documents" :fields="fields" @row-clicked="rowClickHandler">
            </b-table>
        </div>
        <DocumentViewModal ref="documentViewModal" :document="documentToView" @update="getDocumentData"></DocumentViewModal>
        <DocumentAddModal ref="documentAddModal" @update="getDocumentData"></DocumentAddModal>
    </div>
</template>

<script>
import Config from '../config/config.js'
import Document from '../../models/document.js'
import DocumentViewModal from '../documentViewModal/documentViewModal.vue'
import DocumentAddModal from '../documentAddModal/documentAddModal.vue'

export default{
    components: { DocumentViewModal, DocumentAddModal },
    setup() {
    },
    data() {
        return {
            documents : [],
            fields: 
            [
                {
                    key: 'documentName',
                    sortable: true
                },
                {
                    key: 'documentPath',
                    sortable: false
                },
                {
                    key: 'expiry',
                    sortable: true
                },
            ],
            documentToView : new Document("FAKE", "FAKE", "FAKE")
        }
    },
    methods:{
        add(){
            this.$refs.documentAddModal.show();
        },
        rowClickHandler(record){
            let config = new Config();
            let urlToSend = config.url + 'Documents/'+ record.documentName 

            new Promise((resolve) =>{
                let http = new XMLHttpRequest();

                http.open('GET',urlToSend,false);
                http.onreadystatechange = function(){
                    let response = JSON.parse(http.response)
                    resolve(response)
                }
                http.send();
            }).then(async (res) =>{
                this.documentToView = res
                this.$refs.documentViewModal.show();
            })
        },
        euroifyDate(dateIn){
            dateIn = new Date(dateIn)
            if(isNaN(dateIn.getDay())){
                this.badDate = true
            }
            else{
                return dateIn.toLocaleDateString("en-UK")
            }
        },
        aboutToExpireDate(curDate){
            //add a week to current date to display documents that are about to expire
            let dateWarning = curDate
            dateWarning.setDate(dateWarning.getDate() + 7);
            return dateWarning
        },
        getDocDate(splitDocDate){
            return new Date(splitDocDate[2],splitDocDate[1] - 1,splitDocDate[0])
        },
        getDocumentData(){
            let config = new Config();
            let urlToSend = config.url + 'Documents'
            this.documents = [];

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
                    //get the current date to display expired documents
                    let dateDanger = new Date();
                    //get the date that will display warnings for documents
                    let dateWarning = this.aboutToExpireDate(new Date())
                    let documentToAdd = new Document(x.documentName,x.documentPath,this.euroifyDate(x.expiry))
                    this.documents.push(documentToAdd);
                    
                    //split the date string to make a date object
                    let docDate = this.getDocDate(documentToAdd.expiry.split('/'))
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
    },
    mounted: function (){
        this.getDocumentData();
    }
}
</script>