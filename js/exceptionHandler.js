axios.interceptors.response.use(
    response => {
        // Any status code within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    error => {
        globalExceptionHandler(error);
    }
);

function globalExceptionHandler(error){
    specialExceptionHandler(error);
 }
 function specialExceptionHandler(error){
    let errorCode = error.response.data.code;
    switch(errorCode){
        // EXPIRED_TOKEN
        case 11411: {
            Swal.fire({
                icon: 'error',
                text: error.response.data.msg + ' (錯誤代碼: ' + errorCode + ')',
                didClose: () => logout()
            });
            throw error;
        }
        // EMPTY_FOLDER
        case 13010: {
            clearDriveData();
            $('#folder').append('<div><span>請使用「新增」建立資料</span></div>');
            throw error;
        }
        // NO_SUCH_DATA
        case 13020: {
            Swal.fire({
                icon: 'info',
                text:  '沒有更多資料了 (錯誤代碼: ' + errorCode + ')'
            });
            throw error;
        }
        default:{
            generalExceptionHandler(errorCode);
        }
    }
 }
 function filterErrorCode(errorCode){
    return errorCode.toString().charAt(0);
}
 function generalExceptionHandler(errorCode){
    // let errorCode = error.response.data.code;
    switch(filterErrorCode(errorCode)){
        case '1': {
            Swal.fire({
                icon: 'error',
                text: error.response.data.msg + ' (錯誤代碼: ' + errorCode + ')'
            });
            throw error;
        }
            
        default:{
            swalBackEndError();
            throw error;
        }
    }
 }
function handleEmptyFolder(){
    clearDriveData();
    $('#folder').append('<div><span>請使用「新增」建立資料</span></div>');
 }
 function handleEmptyTrashcan(){
    clearDriveData();
    $('#folder').append('<div><span>您的垃圾桶是空的</span></div>');
 }