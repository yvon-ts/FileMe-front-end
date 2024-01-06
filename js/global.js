function login(username, password){
    showLoadingSpinner();
    axios.post(API_LOGIN,{
        'username': username,
        'password': password
    }).then(response => {
        localStorage.setItem('username', response.data.data.username);
        localStorage.setItem('token', response.data.data.token);
        window.location.replace('dashboard');
    }).catch(error => {
        if(error.response.data.code === 10010){
            Swal.fire({
                icon: 'error',
                text: error.response.data.msg,
                footer: '<a id="forgotPassword" href="#">忘記密碼？</a>',
                didOpen: () => {
                    $('#forgotPassword').click(() => {
                        swalForgotPassword();
                    })
                }
            })
        }
    }).finally(() => {
        hideLoadingSpinner();
    });
}
function logout(){
    axios.post(API_LOGOUT, {}, {
        headers: {
            'token': localStorage.getItem('token')
        }
    }).then(() => {
        localStorage.clear();
        window.location.replace('login');
    })
}
function logoutSimple(){
    localStorage.clear();
    window.location.replace('login');
}
function showLoadingSpinner(){
    $('.login-button').prop('disabled', true);
    $('.loader-white').css({'display':'block'});
    $('.login-text').css({'display':'none'});
}

function hideLoadingSpinner(){
    $('.login-button').prop('disabled', false);
    $('.loader-white').css({'display':'none'});
    $('.login-text').css({'display':'block'});
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