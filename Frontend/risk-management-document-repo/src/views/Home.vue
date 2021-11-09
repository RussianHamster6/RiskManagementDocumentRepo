<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <login-handler></login-handler>
  </div>
</template>

<script>
import loginHandler from '../components/loginScreen/loginHandler.vue'
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  components: { loginHandler },
  name: 'Home'
}
</script>
