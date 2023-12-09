// const API_DOMAIN = 'https://localhost:8443';
const API_DOMAIN = 'http://localhost:8080';
const API_LOGIN = API_DOMAIN + '/user/login';
const API_LOGOUT = API_DOMAIN + '/user/logout';
const API_MY_DRIVE = API_DOMAIN + '/drive/my-drive';
const API_MY_TRASH = API_DOMAIN + '/drive/my-trash';
const API_DRIVE_PREFIX = API_DOMAIN + '/drive/';
const API_PREVIEW_PREFIX = API_DOMAIN + '/drive/preview/';
const API_DOWNLOAD_PREFIX = API_DOMAIN + '/drive/download/';
const API_TRASH = API_DOMAIN + '/drive/trash';
const API_CONFLICT_TRASH = API_DOMAIN + '/drive/conflict/trash';
const API_DELETE = API_DOMAIN + '/drive/softDelete';
const API_CLEAN = API_DOMAIN + '/drive/clean';
const API_RECOVER = API_DOMAIN + '/drive/recover';
const API_SUPER_FOLDER = API_DOMAIN + '/drive/folder/super';
const API_SUB_FOLDER = API_DOMAIN + '/drive/folder/sub';
const API_RELOCATE = API_DOMAIN + '/drive/relocate';
const API_RENAME = API_DOMAIN + '/drive/rename';
const API_ACCESS_CONTROL_PREFIX = API_DOMAIN + '/drive/access-control/';
const API_ADD_FOLDER = API_DOMAIN + '/drive/folder';
const API_ADD_FILE = API_DOMAIN + '/drive/file';

const API_CHECK_USERNAME = API_DOMAIN + '/pub/valid/user';
const API_CHECK_EMAIL = API_DOMAIN + '/pub/valid/email';
const API_RESEND_REGISTER_MAIL = API_DOMAIN + '/support/sign-up/resend';
const API_REGISTER = API_DOMAIN + '/support/sign-up';
const API_CHANGE_PASSWORD = API_DOMAIN + '/user/setting/password';
const API_CHANGE_EMAIL = API_DOMAIN + '/user/setting/mail';
const API_FORGOT_PASSWORD = API_DOMAIN + '/support/password';

const API_PUBLBIC_DOWNLOAD_PREFIX = API_DOMAIN + '/pub/drive/download/';
const API_PUBLIC_DRIVE_PREFIX = API_DOMAIN + '/pub/drive/';
const API_PUBLIC_FILE_PREFIX = API_DOMAIN + '/pub/drive/preview/';
// const PUBLIC_FOLDER_SUFFIX = '/folder?share=';
const PUBLIC_FILE_SUFFIX = '/public-file?share=';

const REGEX_USERNAME = /^(?=.{3,20}$)(?=.*[a-z])(?![_.])[a-z0-9._]+(?<![_.])$/u
const REGEX_WARN_USERNAME = '不符合帳號規定(不得以_.為開頭或結尾，僅接受英數字與_.符號，且至少需有1英文字，不得有空格，且不得小於3字)';
const RESERVED_WORD_USERNAME = /^(?!(.*admin|.*fileme)).*$/iu
const REGEX_WARN_RESERVED_USERNAME = '帳號不得包括admin或fileme等字樣，請使用其他名稱';
const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~=?<>{}\[\]:;/.,-])[A-Za-z0-9!@#$%^&*()_+|~=?<>{}\[\]:;/.,-]{8,50}$/u
const REGEX_WARN_PASSWORD = '不符合密碼規定(包括大小寫英數字及特殊符號，且不得小於8字)';
const PASSWORD_ERROR = '密碼錯誤';
const SAME_PASSWORD_ERROR = '您輸入的兩次密碼相同，請重試';
const REGEX_WARN_DIFFERENT_PASSWORD = '兩次輸入的密碼不同，請再次輸入或重新註冊';
const REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const REGEX_WARN_EMAIL = '請輸入正確的電子信箱';
const REGEX_DATA_NAME = /^(?=.{1,32}$)(?![_.])[\p{L}\p{Nd}_.-]+(?<![_.])$/u
const REGEX_WARN_DATA_NAME = '不符合名稱規定(不得以_.為開頭或結尾，僅接受文字、數字與_.-符號，不得有空格，且不得大於30字)';

const ROOT_FOLDER_ID = 0;

const SWAL_DEFAULT = '系統錯誤';
const SWAL_EMPTY_LIST = '請先選擇檔案或資料夾';
const SWAL_NULL_DEST = '請選擇您要將資料移動到哪一個目錄';
const SWAL_RELOCATE_FORBIDDEN = '此為原本的目錄，若要移動請改選其他資料夾';

const ACCEPTED_MIME = 'image/jpeg, image/gif, image/png, application/zip, application/json, application/xml, text/html, application/javascript, text/css, application/sql, text/plain, application/pdf, text/plain, text/csv, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation';