<template>
    <div>
        <br>
        <document-repo v-if="this.loadDocuments"/>
    </div>
</template>

<script>
import Vue from 'vue';
import VueCookies from 'vue-cookies'
import DocumentRepo from '../components/documentRepo/documentRepo.vue';

Vue.use(VueCookies)

export default {
  components: { DocumentRepo},
    name:"Documents",
    data(){ return{
        documentList: {},
        loadDocuments: false
    }

    },
    created: function (){
        if(this.$cookies.get('user')){
            this.loadDocuments = true
        }
        else{
            this.$router.push('unauthorized')
        }
    }
}
</script>