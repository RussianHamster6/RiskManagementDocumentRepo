<template>
    <b-modal id="documentAddModal" ref="documentAddModal" title="Document Add" hide-footer>
        <b-form-input v-model="documentName" class="inputBox" @input="$v.documentName.$touch"></b-form-input>
        <div class="error" v-if="badFileExtention">Please include a file extention on your fileName</div>
        <div class="error" v-if="(!$v.documentName.required && $v.documentName.$dirty)">Field is required</div>
        <div class="error" v-if="(!$v.documentName.minLength && $v.documentName.$dirty)">Document name must have at least {{$v.documentName.$params.minLength.min}} letters.</div>

        <b-form-input v-model="expiryDate" class="inputBox" type="date"></b-form-input>
        <div class="error" v-if="!$v.expiryDate.requiredIf">The date you have input is not formatted correctly</div>
        <div class="error" v-if="(!$v.expiryDate.required && $v.expiryDate.$dirty)">Field is required</div>

        <b-form-file
        v-model="documentToSend"
        style="margin-top: 5px"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        ></b-form-file>
    
        <p v-text="documentMessage"></p>

        <b-button @click="submit" :disabled="!$v.documentToSend.$model || !$v.documentName.$model || !$v.expiryDate.$model">submit</b-button>
    </b-modal>
</template>

<script>
import Vue from 'vue';
import Vuelidate from 'vuelidate'
import {required, minLength, requiredIf} from 'vuelidate/lib/validators'
import Config from '../config/config.js'

Vue.use(Vuelidate)

export default {
    methods: {
        show() {
            this.$refs.documentAddModal.show();
        },
        hide(){
            this.$refs.documentAddModal.hide();
        },
        submit(){
            this.checkFileExtention();
            this.americifyDate(this.expiryDate);

            if(!this.badDate && !this.badFileExtention && !this.$v.$anyError){
                let config = new Config();
                let urlToSend = config.url + 'Documents/'

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

                    if(response.status != "ERROR"){
                        vmInstance.$emit('update');
                        vmInstance.hide();
                    }
                }
                http.onerror = function(){
                    let response = JSON.parse(http.response)
                    vmInstance.documentMessage = response.message
                }
                http.send(formData);
            }
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
    },
    data(){
        return{
            documentName: undefined,
            expiryDate: undefined,
            documentToSend: undefined,
            badDate: false,
            badFileExtention: false,
            documentMessage: ""
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