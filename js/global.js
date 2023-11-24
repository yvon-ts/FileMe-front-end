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
function swalEmptyList(){
    Swal.fire({
        icon: 'warning',
        text: '請先選擇檔案或資料夾'
    })
}
function swalTrash(){
    Swal.fire({
        icon: 'warning',
        text: '請先還原檔案或資料夾'
    })
}

let relocateOrigin = [];

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
        "移動至選定資料夾": function() {
          relocate();
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
}