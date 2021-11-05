<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/documents">Documents</router-link> |
      <router-link to="/accounts">Accounts</router-link>
      <b-button style="float: right" @click="signOut">Sign Out</b-button>
    </div>
    <router-view/>
  </div>
  <!--TODO: Add logout button-->
</template>

<script>
import Vue from 'vue'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

export default {
  methods:{
    signOut(){
      if(this.$cookies.get('user')){
          this.$cookies.remove('user')
          this.$router.push('/')
        }
        else{
            this.$router.push('unauthorized')
        }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
