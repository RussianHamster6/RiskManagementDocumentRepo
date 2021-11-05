<template>
    <b-modal id="accountsUpdateDeleteModal" ref="accountsUpdateDeleteModal" title="Update/Delete User" hide-footer>
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap@4.5.3/dist/css/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap-vue@2.21.2/dist/bootstrap-vue.css" />
        <b-form-input v-model="$v.accountUserName.$model" @input="$v.accountUserName.$touch" class="inputBox" placeholder="Enter your username" :state="$v.accountUserName.$dirty? !$v.accountUserName.$error:null"></b-form-input>
        <div class="error" v-if="!$v.accountUserName.required && $v.accountUserName.$dirty">Field is required</div>
        <div class="error" v-if="!$v.accountUserName.minLength && $v.accountUserName.$dirty">UserName must have at least {{$v.accountUserName.$params.minLength.min}} letters.</div>
        
        <b-form-input v-model="accountPassword" @input="$v.accountPassword.$touch" class="inputBox" type="password" placeholder="Enter your Password" :state="$v.accountPassword.$dirty? !$v.accountPassword.$error:null"></b-form-input>
        <div class="error" v-if="!$v.accountPassword.required && $v.accountPassword.$dirty">Field is required</div>
        <div class="error" v-if="!$v.accountPassword.minLength && $v.accountPassword.$dirty">Password must have at least {{$v.accountPassword.$params.minLength.min}} letters.</div>
        
        <b-form-input v-model="accountPasswordConfirm" @input="$v.accountPasswordConfirm.$touch" class="inputBox" type="password" placeholder="Confirm your password" :state="$v.accountPasswordConfirm.$dirty? !$v.accountPasswordConfirm.$error:null"></b-form-input>
        <div class="error" v-if="!$v.accountPasswordConfirm.required && $v.accountPasswordConfirm.$dirty">Field is required</div>
        <div class="error" v-if="!$v.accountPasswordConfirm.minLength && $v.accountPasswordConfirm.$dirty">Password must have at least {{$v.accountPasswordConfirm.$params.minLength.min}} letters.</div>
        <div class="error" v-if="!$v.accountPasswordConfirm.sameAs && $v.accountPasswordConfirm.$dirty">Passwords must match</div>

        <p v-text="accountText"></p>
        
        <b-button :disabled="$v.accountPasswordConfirm.$error || $v.accountPassword.$error || $v.accountUserName.$error || !$v.accountPassword.$dirty" class="button" v-on:click="submit" variant="success">Update</b-button>
        <b-button class="button float-right" @click="promptDeleteConfirmation = true" variant="warning">Delete</b-button>
        <b-button class="button float-right" v-if="promptDeleteConfirmation" @click="deleteUser" variant="danger">Confirm Delete?</b-button>
    </b-modal>
</template>

<script>
import Vue from 'vue';
import Vuelidate from 'vuelidate'
import {required, minLength, sameAs} from 'vuelidate/lib/validators'
import md5 from 'md5'
const Config = require('../config/config.js')

Vue.use(Vuelidate);

export default {
        methods: {
            show() {
                this.$refs.accountsUpdateDeleteModal.show();
            },
            hide(){
                this.$refs.accountsUpdateDeleteModal.hide();
            },
            submit(){
                let config = new Config();
                let urlToSend = config.url + 'Accounts/update/' + this.ogUserName
                //hash password
                let hashedPass = md5(this.accountPassword)
                let userNametoSend = this.accountUserName
                let dataToSend = JSON.stringify({
                    userName: userNametoSend,
                    passwordHash: hashedPass,
                    passwordSalt: "updated"
                })

                new Promise((resolve) =>{
                    let http = new XMLHttpRequest();

                    http.open('POST',urlToSend,false);
                    http.setRequestHeader('Content-Type','application/json');
                    http.onreadystatechange = function(){
                        let response = JSON.parse(http.response)
                        if(response.status == "OK"){
                            resolve({status: "OK", message:"Account successfully updated! Please try to log in"})
                        }
                        else{
                            resolve(response.message)
                        }
                    }
                    http.onerror = function(){
                        let response = JSON.parse(http.response)
                        if(response.status == "ERROR")
                        {
                            resolve(response.message)
                        }
                        else{
                            resolve("Something went very wrong, this shouldn't happen")
                        }
                    }
                    http.send(dataToSend);
                }).then((res) =>{
                    if(res.status == "OK"){
                        this.$emit('update');
                        this.hide();
                    }
                    else{this.registerText = res}
                }); 
            },
            deleteUser(){
                let config = new Config();
                let urlToSend = config.url + 'Accounts/'+ this.ogUserName

                let http = new XMLHttpRequest();
                http.open("DELETE", urlToSend);
                let vmInstance = this
                http.onreadystatechange = function(){
                    let response = JSON.parse(http.response)
                    this.accountText = http.response.message

                    if(response.status != "ERROR"){
                        vmInstance.$emit('update');
                        vmInstance.hide();
                    }
                }
                http.onerror = function(){
                    this.documentMessage = http.response.message
                }
                http.send();
            }
        },
        watch: {
            user: function (newVal){
                console.log("entered watch")
                this.accountUserName = newVal.userName
                this.ogUserName = newVal.userName
                this.accountPassword = ""
                this.accountPasswordConfirm = ""
                this.promptDeleteConfirmation = false
        }
    },
        data(){ return {
            accountUserName: null,
            ogUserName: null,
            accountPassword: null,
            accountPasswordConfirm: null,
            accountText: null,
            passwordSame: true,
            promptDeleteConfirmation: false
            }
        },
        props: ['user'],
        validations:{
            accountUserName:{
                required,
                minLength: minLength(4)
            },
            accountPassword:{
                required,
                minLength: minLength(8)
            },
            accountPasswordConfirm:{
                required,
                minLength: minLength(8),
                sameAs: sameAs(function(){
                    return this.accountPassword;
                })
            },
        }
    }
</script>