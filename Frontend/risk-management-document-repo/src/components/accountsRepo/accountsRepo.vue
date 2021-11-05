<template>
    <div>
        <b-button variant="success" class="float-right" style="margin-right: 25px; margin-bottom:10px" @click="addUser">+</b-button>
        <div>
            <b-table hover :items="accounts" :fields="fields" @row-clicked="rowClickHandler">
            </b-table>
        </div>
        <loginModal ref="loginModal" @update="getAccountData"></loginModal>
        <accountsUpdateDeleteModal ref="accountsUpdateDeleteModal" :user="userToView" @update="getAccountData"></accountsUpdateDeleteModal>
    </div>
</template>

<script>
import User from '../../models/users.js'
import Config from '../config/config.js'
import loginModal from '../loginModal/loginModal.vue';
import accountsUpdateDeleteModal from '../accountsUpdateDeleteModal/accountsUpdateDeleteModal.vue'

export default {
    components: {loginModal,accountsUpdateDeleteModal},
    data(){
        return{
            accounts : [],
            fields: 
            [
                {
                    key: 'userName',
                    sortable: true
                }
            ],
            userToView : new User("FAKE", "FAKE", "FAKE")
        }
    },
    methods: {
        getAccountData(){
            let config = new Config();
            let urlToSend = config.url + 'Accounts'
            this.accounts = [];
            new Promise((resolve) =>{
                let http = new XMLHttpRequest();

                http.open('GET',urlToSend,false);
                http.onreadystatechange = function(){
                    let response = JSON.parse(http.response)
                    resolve(response)
                }
                http.send();
            }).then(async (res) =>{
                res.forEach(x => {
                    let accountToAdd = new User(x.userName,x.passwordHash,x.passwordSalt)
                    this.accounts.push(accountToAdd);
                });
            })
        },
        rowClickHandler(record){
            this.userToView = record
            this.$refs.accountsUpdateDeleteModal.show();
        },
        addUser(){
            this.$refs.loginModal.show();
        },
    },
    mounted: function (){
        this.getAccountData();
    }
}
</script>