<template>
    <div>
        <div>
            <b-form-input v-model="searchString" placeholder="Search... (Search with empty to clear)" style="width: 25%; margin-left:25px"></b-form-input>
            <b-button class="float-left" style="margin-left:25px; margin-top:5px" @click="search">Search</b-button>
        </div>
        <b-button variant="success" class="float-right" style="margin-right: 25px; margin-bottom:10px" @click="addUser">+</b-button>
        <div>
            <b-table hover :items="accounts" :fields="fields" @row-clicked="rowClickHandler">
            </b-table>
        </div>
        <loginModal ref="loginModal" @update="getAccountData" :isAdmin="true"></loginModal>
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
            ogAccounts: [],
            fields: 
            [
                {
                    key: 'userName',
                    sortable: true
                },
                {
                    key: 'isAdmin',
                    sortable: true
                },
            ],
            userToView : new User("FAKE", "FAKE", "FAKE"),
            searchString: ""
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
                    let accountToAdd = new User(x.userName,x.passwordHash,x.isAdmin)
                    this.accounts.push(accountToAdd);
                    this.ogAccounts.push(accountToAdd);
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
        search(){
            let searchVal = this.searchString
            if(this.searchString == "" || this.searchString == null){
                this.accounts = this.ogAccounts
            }
            else{
                this.accounts = this.ogAccounts

                this.accounts = this.accounts.filter(account =>{
                    return account.userName.toLowerCase().includes(searchVal.toLowerCase())
                })
            }
        }
    },
    mounted: function (){
        this.getAccountData();
    }
}
</script>