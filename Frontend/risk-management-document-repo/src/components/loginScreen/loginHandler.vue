<template>
    <div>
        <b-container id="loginBox" align-v="center">
            <div class="error" v-if="loginErrorText" v-text="loginErrorText"></div>
            <div class="form-group" :class="{ 'form-group--error': $v.loginUserName.$error }">
            
            <b-form-input v-model="loginUserName" @input="$v.loginUserName.$touch" class="inputBox" placeholder="Enter your username" :state="$v.loginUserName.$dirty? !$v.loginUserName.$error:null"></b-form-input>
            <div class="error" v-if="!$v.loginUserName.required && $v.loginUserName.$dirty">Field is required</div>
            <div class="error" v-if="!$v.loginUserName.minLength && $v.loginUserName.$dirty">UserName must have at least {{$v.loginUserName.$params.minLength.min}} letters.</div>
            
            <b-form-input v-model="loginPassword" @input="$v.loginPassword.$touch" class="inputBox" type="password" placeholder="Enter your password" :state="$v.loginPassword.$dirty? !$v.loginPassword.$error:null"></b-form-input>
            <div class="error" v-if="!$v.loginPassword.required && $v.loginPassword.$dirty">Field is required</div>
            
            <b-button class="button" @click="login">login</b-button>
            <b-button class="button" @click="register">register</b-button>
            </div>
        </b-container>

        <loginModal ref="loginModal"></loginModal>
    </div>
</template>

<script>
import Vue from 'vue';
import Vuelidate from 'vuelidate'
import {required, minLength} from 'vuelidate/lib/validators'
import loginModal from '../loginModal/loginModal.vue';
import md5 from 'md5'
import VueCookies from 'vue-cookies'
const Config = require('../config/config.js')

Vue.use(Vuelidate);
Vue.use(VueCookies);

export default{
  components: { loginModal },
    setup() {
    },
    data(){
        return {
            loginUserName: null,
            loginPassword: null,
            loginErrorText: null
        };
    },
    methods: {
        register(){
            this.$refs.loginModal.show();
        },
        login(){
            if(this.loginUserName && this.loginPassword){
                let config = new Config();
                let urlToSend = config.url + 'Accounts/login'
                //hash password
                let hashedPass = md5(this.loginPassword)
                let userNametoSend = this.loginUserName
                let dataToSend = JSON.stringify({
                    userName: userNametoSend,
                    passwordHash: hashedPass
                })
                let user

                new Promise((resolve) =>{
                    let http = new XMLHttpRequest();

                    http.open('POST',urlToSend,false);
                    http.setRequestHeader('Content-Type','application/json');
                    http.onreadystatechange = function(){
                        let response = JSON.parse(http.response)
                        if(response.status == "OK" && response.loginStatus){
                            user = response.user
                            resolve(true)
                        }
                        else{
                            resolve(false)
                        }
                    }
                    http.onerror = function(){
                        let response = JSON.parse(http.response)
                        if(response.status == "ERROR")
                        {
                            resolve(false)
                        }
                        else{
                            resolve(false)
                        }
                    }
                    http.send(dataToSend);
                }).then(async (res) =>{
                    if(res){
                        //cookie will be null after the hour has passed. 
                        this.$cookies.set('user',user,"1h")
                        console.log(this.$cookies.get('user'))
                        this.$router.push('documents')
                    }
                    else{
                        this.loginErrorText = "Username/Password was incorrect please try again"
                    }
                });
            }
            else{
                this.$v.loginUserName.$touch()
                this.$v.loginPassword.$touch()
            }
        }
    },
    validations: {
        loginUserName: {
            required,
            minLength: minLength(4)
        },
        loginPassword: {
            required
        }
    }
}
</script>

<style>
#loginBox {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5%;
  border:3px solid black;
  border-radius: 25px
}

.button{
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
}

.inputBox{
    margin-top: 25px
}

.error{
    color: #ff0033;
}

</style>