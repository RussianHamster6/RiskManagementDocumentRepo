<template>
    <b-modal id="registerModal" ref="registerModal" title="register" hide-footer>
            <b-form-input v-model="registerUserName" class="inputBox" placeholder="Enter your username" :state="!$v.registerUserName.$invalid"></b-form-input>
            <div class="error" v-if="!$v.registerUserName.required">Field is required</div>
            <div class="error" v-if="!$v.registerUserName.minLength">UserName must have at least {{$v.registerUserName.$params.minLength.min}} letters.</div>
            <b-form-input v-model="registerPassword" class="inputBox" type="password" placeholder="Enter your Password" :state="!$v.registerPassword.$invalid"></b-form-input>
            <div class="error" v-if="!$v.registerPassword.required">Field is required</div>
            <div class="error" v-if="!$v.registerPassword.minLength">Password must have at least {{$v.registerPassword.$params.minLength.min}} letters.</div>
            <b-form-input v-model="registerPasswordConfirm" class="inputBox" type="password" placeholder="Confirm your password" :state="!$v.registerPasswordConfirm.$invalid"></b-form-input>
            <div class="error" v-if="!$v.registerPassword.required">Field is required</div>
            <div class="error" v-if="!$v.registerPassword.minLength">Password must have at least {{$v.registerPassword.$params.minLength.min}} letters.</div>
            <div class="error" v-if="$v.registerPassword.sameAs">Passwords must match</div>
            <b-button class="button">Register!</b-button>
            <p v-text="registerText"></p>
    </b-modal>
</template>

<script>
import Vue from 'vue';
import Vuelidate from 'vuelidate'
import {required, minLength, sameAs} from 'vuelidate/lib/validators'

Vue.use(Vuelidate);

export default {
        methods: {
            show() {
                this.$refs.registerModal.show();
            }
        },
        data(){ return {
            registerUserName: '',
            registerPassword: '',
            registerPasswordConfirm: '',
            registerText: '',
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
