<template>
    <div>
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap@4.5.3/dist/css/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap-vue@2.21.2/dist/bootstrap-vue.css" />
        <br>
        <accounts-repo/>
    </div>
</template>

<script>
import Vue from 'vue';
import VueCookies from 'vue-cookies'

import accountsRepo from '../components/accountsRepo/accountsRepo.vue'

Vue.use(VueCookies)

export default {
    components: {accountsRepo },
    methods: {
    },
    created: function() {
        if(this.$cookies.get('user')){
            this.loadDocuments = true
        }
        else{
            this.$router.push('unauthorized')
        }
    }
}
</script>