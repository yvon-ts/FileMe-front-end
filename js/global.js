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
function swalBackEndError(){
    Swal.fire({
        icon: 'error',
        text: SWAL_DEFAULT + ' (錯誤代碼: ' + errorCode + ')'
    })
}
function swalWarning(wording){
    Swal.fire({
        icon: 'warning',
        text: wording
    })
}
let relocateTarget = [];
let relocateTargetFolders = [];
let relocateOrigin = '';
let relocateDestId = '';

function renderDialogRelocate() {
    $('#dialog').removeClass('hidden');
    $( "#dialog" ).dialog({
      resizable: false,
      height: "auto",
      width: 900,
      modal: true,
      close: () => {
        $('#sub-folder').empty();
        $('.super-folder').remove();
        $('#dialog').addClass('hidden');
      },
      buttons: {
        '移動到這裡': function() {
            if(relocateDestId.length === 0){
                swalWarning(SWAL_NULL_DEST);
                return;
            }
            if(relocateDestId === relocateOrigin){
                swalWarning(SWAL_RELOCATE_FORBIDDEN);
                return;
            }
            relocate(true);
            $(this).dialog('close');
        },
        '取消': function() {
            clearFocused();
            $( this ).dialog( "close" );
        }
      }
    });
}