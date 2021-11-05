<template>
    <b-modal id="registerModal" ref="registerModal" title="Register" hide-footer>
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap@4.5.3/dist/css/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap-vue@2.21.2/dist/bootstrap-vue.css" />
        <b-form-input v-model="$v.registerUserName.$model" @input="$v.registerUserName.$touch" class="inputBox" placeholder="Enter your username" :state="$v.registerUserName.$dirty? !$v.registerUserName.$error:null"></b-form-input>
        <div class="error" v-if="!$v.registerUserName.required && $v.registerUserName.$dirty">Field is required</div>
        <div class="error" v-if="!$v.registerUserName.minLength && $v.registerUserName.$dirty">UserName must have at least {{$v.registerUserName.$params.minLength.min}} letters.</div>
        
        <b-form-input v-model="registerPassword" @input="$v.registerPassword.$touch" class="inputBox" type="password" placeholder="Enter your Password" :state="$v.registerPassword.$dirty? !$v.registerPassword.$error:null"></b-form-input>
        <div class="error" v-if="!$v.registerPassword.required && $v.registerPassword.$dirty">Field is required</div>
        <div class="error" v-if="!$v.registerPassword.minLength && $v.registerPassword.$dirty">Password must have at least {{$v.registerPassword.$params.minLength.min}} letters.</div>
        
        <b-form-input v-model="registerPasswordConfirm" @input="$v.registerPasswordConfirm.$touch" class="inputBox" type="password" placeholder="Confirm your password" :state="$v.registerPasswordConfirm.$dirty? !$v.registerPasswordConfirm.$error:null"></b-form-input>
        <div class="error" v-if="!$v.registerPasswordConfirm.required && $v.registerPasswordConfirm.$dirty">Field is required</div>
        <div class="error" v-if="!$v.registerPasswordConfirm.minLength && $v.registerPasswordConfirm.$dirty">Password must have at least {{$v.registerPasswordConfirm.$params.minLength.min}} letters.</div>
        <div class="error" v-if="!$v.registerPasswordConfirm.sameAs && $v.registerPasswordConfirm.$dirty">Passwords must match</div>

        <p v-text="registerText"></p>
        
        <b-button :disabled="$v.registerPasswordConfirm.$error || $v.registerPassword.$error || $v.registerUserName.$error || !$v.registerPassword.$dirty" class="button" v-on:click="submit">Register!</b-button>
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
                this.$refs.registerModal.show();
            },
            submit(){
                let config = new Config();
                let urlToSend = config.url + 'Accounts'
                //hash password
                let hashedPass = md5(this.registerPassword)
                let userNametoSend = this.registerUserName
                let dataToSend = JSON.stringify({
                    userName: userNametoSend,
                    passwordHash: hashedPass,
                    passwordSalt: "registered"
                })

                new Promise((resolve) =>{
                    let http = new XMLHttpRequest();

                    http.open('POST',urlToSend,false);
                    http.setRequestHeader('Content-Type','application/json');
                    http.onreadystatechange = function(){
                        let response = JSON.parse(http.response)
                        if(response.status == "OK"){
                            resolve("Account successfully registered! Please try to log in")
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
                    this.registerText = res
                    this.$emit('update');
                });
            }
        },
        data(){ return {
            registerUserName: null,
            registerPassword: null,
            registerPasswordConfirm: null,
            registerText: null,
            passwordSame: true,
            }
        },
        validations:{
            registerUserName:{
                required,
                minLength: minLength(4)
            },
            registerPassword:{
                required,
                minLength: minLength(8)
            },
            registerPasswordConfirm:{
                required,
                minLength: minLength(8),
                sameAs: sameAs(function(){
                    return this.registerPassword;
                })
            },
        }
    }
</script>
