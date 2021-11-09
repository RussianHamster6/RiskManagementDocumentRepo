<template>
    <b-modal id="documentViewModal" ref="documentViewModal" title="Document View" hide-footer>
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap@4.5.3/dist/css/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap-vue@2.21.2/dist/bootstrap-vue.css" />
        <b-button class="button float-right" @click="promptDeleteConfirmation = true" variant="warning">Delete</b-button>
        <b-button class="button float-right" v-if="promptDeleteConfirmation" @click="deleteDoc" variant="danger">Confirm Delete?</b-button>
        <b-form-input v-model="documentName" class="inputBox" @input="$v.documentName.$touch"></b-form-input>
        <div class="error" v-if="badFileExtention">Please include a file extention on your fileName</div>
        <div class="error" v-if="!$v.documentName.required && $v.documentName.$dirty">Field is required</div>
        <div class="error" v-if="!$v.documentName.minLength && $v.documentName.$dirty">Document Name must have at least {{$v.documentName.$params.minLength.min}} letters.</div>

        <b-form-input v-model="documentPath" :disabled="true" class="inputBox"></b-form-input>

        <b-form-input v-model="expiryDate" class="inputBox" type="date"></b-form-input>
        <div class="error" v-if="!$v.expiryDate.requiredIf">The date you have input is not formatted correctly</div>
        <div class="error" v-if="!$v.expiryDate.required && $v.expiryDate.$dirty">Field is required</div>

        <b-form-file
        v-model="documentToSend"
        style="margin-top: 5px"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        ></b-form-file>

        <p v-text="documentMessage"></p>

        <b-button class="button" @click="download" :disabled="$v.documentName.$dirty" variant="success">Download</b-button>
        <b-button class="button float-right" @click="update(this)" :disabled="!$v.documentToSend.$model">Update</b-button>
    </b-modal>
</template>
<script>
import Vue from 'vue';
import Vuelidate from 'vuelidate'
import {required, minLength, requiredIf} from 'vuelidate/lib/validators'
import Config from '../config/config.js'

Vue.use(Vuelidate);
export default {
    methods: {
        show() {
            this.$refs.documentViewModal.show();
        },
        hide(){
            this.$refs.documentViewModal.hide();
        },
        americifyDate(dateIn){
            dateIn = new Date(dateIn)
            if(isNaN(dateIn.getDay())){
                this.badDate = true
            }
            else{
                return dateIn.toLocaleDateString("en-US")
            }
        },
        checkFileExtention(){
            let file = this.documentName
            let splitFile = file.split('.')
            if(splitFile.length == 2){
                this.badFileExtention = false
            }
            else{
                this.badFileExtention = true
            }
        },
        formatDateForDatePicker(dateStringIn){
            let splitDate = dateStringIn.split('/');
            if(splitDate[0].length == 1){
                splitDate[0] = '0' + splitDate[0]
            }
            if(splitDate[1].length == 1){
                splitDate[1] = '0' + splitDate[1]
            }
            let date = splitDate[2] + '-' + splitDate[0] + '-' +splitDate[1]
            return date
        },
        saveBlob(blob, fileName) {
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = fileName;
            a.dispatchEvent(new MouseEvent('click'));
        },
        download(){
            let config = new Config();
            let docName = this.documentName
            let urlToSend = config.url + 'Documents/download/'+ docName
            
            let xhr = new XMLHttpRequest();
            xhr.open('GET', urlToSend)
            xhr.responseType = 'blob';
            xhr.onload =function (e) {
                var blob = e.currentTarget.response;
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = docName;
                a.dispatchEvent(new MouseEvent('click'));
            }
            xhr.send()
        },
        update(){
            this.checkFileExtention();
            this.americifyDate(this.expiryDate);
            console.log("entered update")

            if(!this.badDate && !this.badFileExtention && !this.$v.$anyError){
                let config = new Config();
                let urlToSend = config.url + 'Documents/update/'+ this.ogDocName

                let splitDocName = this.documentName.split('.')

                let formData = new FormData();
                formData.append("documentName", splitDocName[0]);
                formData.append("document",this.documentToSend);
                formData.append("fileExtention", splitDocName[1]);
                formData.append("expiryDate", this.americifyDate(this.expiryDate))
                
                let http = new XMLHttpRequest();
                http.open("POST", urlToSend);
                let vmInstance = this
                http.onreadystatechange = function(){
                    let response = JSON.parse(http.response)
                    vmInstance.documentMessage = response.message
                    vmInstance.$emit('update');
                    vmInstance.hide();
                }
                http.onerror = function(){
                    let response = JSON.parse(http.response)
                    vmInstance.documentMessage = response.message
                }
                http.send(formData);
            }
        },
        deleteDoc(){
            let config = new Config();
            let urlToSend = config.url + 'Documents/'+ this.ogDocName

            let http = new XMLHttpRequest();
            http.open("DELETE", urlToSend);
            let vmInstance = this
            http.onreadystatechange = function(){
                console.log(http.response)
                this.documentMessage = http.response.message

                vmInstance.$emit('update');
                vmInstance.hide();
            }
            http.onerror = function(){
                this.documentMessage = http.response.message
            }
            http.send();
        },
    },

    props: ['document'],
    data(){
        return{
            documentName: undefined,
            documentPath: undefined,
            expiryDate: undefined,
            documentToSend: undefined,
            ogDocName: undefined,
            badDate: false,
            badFileExtention: false,
            promptDeleteConfirmation: false,
            documentMessage: ""
        }
    },
    watch: {
        document: function (newVal){
            this.documentName = newVal.documentName
            this.documentPath = newVal.documentPath
            this.expiryDate = this.formatDateForDatePicker(newVal.expiry)
            this.ogDocName = newVal.documentName,
            this.promptDeleteConfirmation = false
        }
    },
    validations:{
        documentName:{
            required,
            minLength: minLength(8)
        },
        expiryDate:{
            required,
            requiredIf: requiredIf(function() {
                return this.badDate
            })
        },
        documentToSend:{
            required
        }
    }
}
</script>

<style>
.button{
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
}

.inputBox{
    margin-bottom: 15px;
    margin-top: 5px;
}

.error{
    color: #ff0033;
}
</style>
