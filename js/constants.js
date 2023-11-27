// const API_DOMAIN = 'https://localhost:8443';
const API_DOMAIN = 'http://localhost:8080';
const API_LOGIN = API_DOMAIN + '/user/login';
const API_MY_DRIVE = API_DOMAIN + '/drive/my-drive';
const API_MY_TRASH = API_DOMAIN + '/drive/my-trash';
const API_DRIVE_PREFIX = API_DOMAIN + '/drive/';
const API_TRASH = API_DOMAIN + '/drive/trash';
const API_RECOVER = API_DOMAIN + '/drive/recover';
const API_SUPER_FOLDER = API_DOMAIN + '/drive/folder/super';
const API_SUB_FOLDER = API_DOMAIN + '/drive/folder/sub';
const API_RELOCATE = API_DOMAIN + '/drive/relocate';
const API_RENAME = API_DOMAIN + '/drive/rename';
// const API_PREVIEW_PREFIX = API_DOMAIN + '/';

const REGEX_DATA_NAME = /^(?=.{1,32}$)(?![_.])[\p{L}\p{Nd}_.-]+(?<![_.])$/u
const REGEX_WARN_DATA_NAME = '不符合名稱規定(不得以_.為開頭或結尾，僅接受文字、數字與_.-符號，且不得大於30字)';
const ROOT_FOLDER_ID = 0;

const SWAL_DEFAULT = '系統錯誤';
const SWAL_EMPTY_LIST = '請先選擇檔案或資料夾';
const SWAL_NULL_DEST = '請選擇您要將資料移動到哪一個目錄';
const SWAL_RELOCATE_FORBIDDEN = '此為原本的目錄，若要移動請改選其他資料夾';