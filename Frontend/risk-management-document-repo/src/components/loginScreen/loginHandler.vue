<template>
    <div>
        <b-container id="loginBox" align-v="center">
            <b-form-input v-model="text" class="inputBox" placeholder="Enter your username"></b-form-input>
            <b-form-input class="inputBox" type="password" placeholder="Enter your password"></b-form-input>
            <b-button class="button">login</b-button>
            <b-button class="button" v-b-modal.registerModal>register</b-button>
        </b-container>

        <b-modal id="registerModal" title="register" hide-footer>
            <b-form-input v-model="text" class="inputBox" placeholder="Enter your username"></b-form-input>
            <b-form-input v-model="text" class="inputBox" type="password" placeholder="Enter your Password"></b-form-input>
            <b-form-input v-model="text" class="inputBox" type="password" placeholder="Confirm your password"></b-form-input>
            <b-button class="button">Register!</b-button>
            <p v-text="registerText"></p>
        </b-modal>
    </div>
</template>

<script>

export default{
    setup() {
    },
    data(){
        return {
            text: '',
            registerText: '',
        };
    },
    methods: {
        register(){
            this.$emit('register')
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

</style>