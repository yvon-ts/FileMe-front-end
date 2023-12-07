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
function logoutSimple(){
    localStorage.clear();
    window.location.replace('login.html');
}
function swalSuccess(){
    Swal.fire({
        icon: 'success',
        text: '操作成功'
    })
}
function swalFrontEndError(){
    Swal.fire({
        icon: 'error',
        text: SWAL_DEFAULT
    })
}
function swalBackEndError(errorCode){
    Swal.fire({
        icon: 'error',
        text: SWAL_DEFAULT + ' (錯誤代碼: ' + errorCode + ')'
    })
}
function swal(icon, title, wording){
    Swal.fire({
        icon: icon,
        title: title,
        text: wording
    })
}
let relocateTarget = [];
let relocateTargetFolders = [];
let relocateOrigin = '';
let relocateDestId = '';
// let downloadFileId = '';
// let accessControlId = '';
let globalTargetId = '';