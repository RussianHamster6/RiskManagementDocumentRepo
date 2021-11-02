<template>
    <div>
        <b-container id="loginBox" align-v="center">
            <div class="form-group" :class="{ 'form-group--error': $v.loginUserName.$error }">
            
            <b-form-input v-model="loginUserName" @input="$v.loginUserName.$touch" class="inputBox" placeholder="Enter your username" :state="$v.loginUserName.$dirty? !$v.loginUserName.$error:null"></b-form-input>
            <div class="error" v-if="!$v.loginUserName.required && $v.loginUserName.$dirty">Field is required</div>
            <div class="error" v-if="!$v.loginUserName.minLength && $v.loginUserName.$dirty">UserName must have at least {{$v.loginUserName.$params.minLength.min}} letters.</div>
            
            <b-form-input v-model="loginPassword" @input="$v.loginPassword.$touch" class="inputBox" type="password" placeholder="Enter your password" :state="$v.loginPassword.$dirty? !$v.loginPassword.$error:null"></b-form-input>
            <div class="error" v-if="!$v.loginPassword.required && $v.loginPassword.$dirty">Field is required</div>
            
            <b-button class="button">login</b-button>
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

Vue.use(Vuelidate);

export default{
  components: { loginModal },
    setup() {
    },
    data(){
        return {
            loginUserName: null,
            loginPassword: null
        };
    },
    methods: {
        register(){
            this.$refs.loginModal.show();
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