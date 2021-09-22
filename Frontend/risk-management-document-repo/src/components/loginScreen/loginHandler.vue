<template>
    <b-container id="loginBox" align-v="center">
        <b-form-input class="inputBox" v-model="text" placeholder="enter your username"></b-form-input>
        <b-form-input class="inputBox" type="password" placeholder="enter your password" ></b-form-input>
        <b-button class="button">login</b-button>
        <b-button class="button">register</b-button>
    </b-container>
</template>

<script>
export default{
    setup() {
    },
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