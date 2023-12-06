async function swalRegister(){
    const resultUserName = await Swal.fire({
        text: '請輸入您想使用的帳號',
        input: 'text',
        inputPlaceholder: 'Enter your username',
        inputAttributes:{
            maxlength: '20',
            autocapitalize: "off",
            autocorrect: "off"
        },
        showCancelButton: true,
        inputValidator: (value) => {
            value = value.toLowerCase();
            if(!REGEX_USERNAME.test(value)) return REGEX_WARN_USERNAME;
            if(!RESERVED_WORD_USERNAME.test(value)) return REGEX_WARN_RESERVED_USERNAME;
        }
    });

    if(resultUserName.isDismissed) return;
    const username = resultUserName.value.toLowerCase();

    const resultPassword = await Swal.fire({
        title: username + ', 您好',
        text: '請輸入您想使用的密碼',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes:{
            maxlength: '50',
            autocapitalize: "off",
            autocorrect: "off"
        },
        inputValidator: (value) => {
            if(!REGEX_PASSWORD.test(value)) return REGEX_WARN_PASSWORD;
        },
        allowOutsideClick: false
    });

    if(resultPassword.isDismissed) return;
    const password = resultPassword.value;

    const resultRepeatpassword = await Swal.fire({
        title: '密碼確認',
        text: '請再次輸入您的密碼',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes:{
            maxlength: '50',
            autocapitalize: "off",
            autocorrect: "off"
        },
        cancelButtonText: '重新註冊',
        showCancelButton: true,
        inputValidator: (value) => {
            if(value !== password) return REGEX_WARN_DIFFERENT_PASSWORD;
        },
        allowOutsideClick: false
    });

    if(resultRepeatpassword.isDismissed) return;

    const { value: email } = await Swal.fire({
        title: '信箱驗證',
        text: '請輸入您的電子信箱',
        input: 'email',
        inputPlaceholder: 'Enter your email address',
        inputAttributes:{
            autocapitalize: "off",
            autocorrect: "off"
        },
        inputValidator: (value) => {
            if(!REGEX_EMAIL.test(value)) return REGEX_WARN_EMAIL;
        },
        allowOutsideClick: false
    });

    register(username, password, email.toLowerCase());
}
function register(username, password, email){
    let info = {username: username, password: password, email: email};
    const jsonInfo = JSON.stringify(info);
    axios.post(API_REGISTER, jsonInfo, {
        headers: {
        'Content-Type': 'application/json'
    }})
    .then(() => {
        Swal.fire({
            icon: 'success',
            title: '感謝註冊',
            text: '稍後請至您的信箱進行驗證，若需要重新寄送可點選以下按鈕',
            showCloseButton: true,
            showDenyButton: true,
            denyButtonText: '重寄驗證信',
            allowOutsideClick: false,
            preDeny: () => {
                alert('還不能按！')
                return new Promise((resolve, reject) => {
                    reject();
                    // 範例是2秒後自動關閉
                    // setTimeout(() => {
                    //     resolve();
                    //   }, 2000); // modal will close after 2 seconds
                     });
            }
        });
    })
}