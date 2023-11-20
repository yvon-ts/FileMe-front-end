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
            break;
        }
        // EMPTY_FOLDER
        case 13010: {
            clearDriveData();
            $('#folder').append('<div><span>請使用「新增」建立資料</span></div>'); // TODO: 不符合垃圾桶中文描述
            break;
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
            break;
        }
            
        default:{
            Swal.fire({
                icon: 'error',
                text: DEFAULT_RESPONSE + ' (錯誤代碼: ' + errorCode + ')'
            })
            break;
        }
    }
 }