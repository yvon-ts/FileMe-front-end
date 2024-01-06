axios.interceptors.response.use(
    response => {
        // Any status code within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    error => {
        // globalExceptionHandler(error);
        let errorCode = error.response.data.code;
        // console.log(error.response.data.code)
        // console.log(errorCode)
    switch(errorCode){
        // LOGIN_ERROR
        case 10010:{
            throw error;
        }
        // PREVIEW_NOT_ALLOWED
        case 11310:{
            Swal.fire({
                icon: 'info',
                text: error.response.data.msg + ' (錯誤代碼: ' + errorCode + ')'
            });
            throw error;
        }
        // EXPIRED_TOKEN
        case 11411: {
            Swal.fire({
                icon: 'error',
                text: error.response.data.msg + ' (錯誤代碼: ' + errorCode + ')',
                didClose: () => logoutSimple()
            });
            throw error;
        }
        // RECOVERY_LOGIC_CONFLICT
        case 20020:{
            Swal.fire({
                icon: 'error',
                title: '已有同名檔案或目錄',
                text: '請先移動或刪除該資料，才能還原'
            })
            throw error;
        };
        // 409
        case 23010: {
            throw error;
        }
        // EMPTY_FOLDER
        // case 13010: {
        //     clearDriveData();
        //     $('#folder').append('<div><span>請使用「新增」建立資料</span></div>');
        //     throw error;
        // }
        // NO_SUCH_DATA
        // case 13020: {
        //     Swal.fire({
        //         icon: 'info',
        //         text:  '沒有更多資料了 (錯誤代碼: ' + errorCode + ')'
        //     });
        //     throw error;
        // }
        default:{
            let initial = errorCode.toString().charAt(0);
            switch(initial){
                case '1': {
                    Swal.fire({
                        icon: 'error',
                        text: error.response.data.msg + ' (錯誤代碼: ' + errorCode + ')'
                    });
                    throw error;
                }
                default:{
                    swalBackEndError(errorCode);
                    throw error;
                }
            }
        }
    }
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
        // case 13010: {
        //     clearDriveData();
        //     $('#folder').append('<div><span>請使用「新增」建立資料</span></div>');
        //     throw error;
        // }
        // NO_SUCH_DATA
        // case 13020: {
        //     Swal.fire({
        //         icon: 'info',
        //         text:  '沒有更多資料了 (錯誤代碼: ' + errorCode + ')'
        //     });
        //     throw error;
        // }
        default:{
            generalExceptionHandler(errorCode);
        }
    }
 }
//  function filterErrorCode(errorCode){
//     return errorCode.toString().charAt(0);
// }
//  function generalExceptionHandler(errorCode){
//     // let errorCode = error.response.data.code;
//     switch(filterErrorCode(errorCode)){
//         case '1': {
//             Swal.fire({
//                 icon: 'error',
//                 text: error.response.data.msg + ' (錯誤代碼: ' + errorCode + ')'
//             });
//             throw error;
//         }
            
//         default:{
//             swalBackEndError();
//             throw error;
//         }
//     }
//  }
function handlePublicEmptyFolder(){
    clearDriveData();
    $('#folder').append('<div class="reminder"><span>該資料夾是空的</span></div>');
    hideLoadingMask();
 }
function handleEmptyFolder(){
    clearDriveData();
    $('#folder').append('<div class="reminder"><span>請使用「新增」建立資料</span></div>');
    hideLoadingMask();
 }
 function handleEmptyTrashcan(){
    clearDriveData();
    $('#folder').append('<div class="reminder"><span>您的垃圾桶是空的</span></div>');
    hideLoadingMask();
 }
 function handleNoResult(){
    clearDriveData();
    $('#folder').append('<div class="reminder"><span>查無資料</span></div>');
    hideLoadingMask();
 }