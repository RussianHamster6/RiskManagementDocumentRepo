<template>
    <div>
        <b-table hover :items="documents">
        </b-table>
    </div>
</template>

<script>
export default{
    setup() {
    },
    data() {
        return {
            documents : [
                {
                    docName: "placeholder",
                    docExpire: "13-06-01T13:00:00Z",
                    docPath: "C:\\A-Fake-Path"
                }
            ]
        }
    }
}
</script>

<style>


</style>