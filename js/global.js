function filterErrorCode(errorCode){
    return errorCode.toString().charAt(0);
}
function globalExceptionHandler(error){
    let errorCode = error.response.data.code;
    switch(filterErrorCode(errorCode)){
        case '1': {
            Swal.fire({
                icon: 'error',
                text: error.response.data.msg + ' (錯誤代碼: ' + errorCode + ')'
            });
            if(errorCode === 11411) logout();
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