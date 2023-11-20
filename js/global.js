function login(username, password){
    axios.post(API_LOGIN,{
        'username': username,
        'password': password
    }).then(response => {
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("token", response.data.data.token);
        window.location.replace('prototype.html');
    }).catch(error => console.log(error));
// }).catch(error => globalExceptionHandler(error));
}
function logout(){
    // 要再補打後端api?
    localStorage.clear();
    window.location.replace('login.html');
}