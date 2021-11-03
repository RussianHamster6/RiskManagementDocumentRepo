import Vue from 'vue'
import App from './App.vue'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

Vue.config.productionTip = false

// Import Bootstrap an BootstrapVue CSS files
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
