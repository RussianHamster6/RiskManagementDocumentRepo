




let http = new XMLHttpRequest();
http.open("POST", urlToSend);
let vmInstance = this
http.onreadystatechange = function(){
    let response = JSON.parse(http.response)
    console.log(response)

    if(response.status != "ERROR"){
        console.log("ADD FAILED")
    }   
    else{
        console.log("ADD SUCCESS")
    }
}
http.onerror = function(){
    let response = JSON.parse(http.response)
    vmInstance.documentMessage = response.message
}
http.send(formData);