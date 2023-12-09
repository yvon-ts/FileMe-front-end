// ----------------- Register ----------------- //
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
    Swal.showLoading();
    await axios.get(API_CHECK_USERNAME, {
        params: {
            username:  username
        }
    });

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
        allowOutsideClick: false,
        allowEnterKey: false
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
        inputValidator: (value) => {
            if(value !== password) return REGEX_WARN_DIFFERENT_PASSWORD;
        },
        allowOutsideClick: false,
        allowEnterKey: false
    });

    if(resultRepeatpassword.isDismissed) return;

    const resultEmail = await Swal.fire({
        title: '信箱驗證',
        text: '請輸入您的電子信箱',
        input: 'email',
        inputPlaceholder: 'Enter your email address',
        inputAttributes:{
            maxlength: '64',
            autocapitalize: "off",
            autocorrect: "off"
        },
        inputValidator: (value) => {
            if(!REGEX_EMAIL.test(value)) return REGEX_WARN_EMAIL;
        },
        allowOutsideClick: false,
        allowEnterKey: false
    });

    const email = resultEmail.value.toLowerCase();

    await axios.get(API_CHECK_EMAIL, {
        params: {
            email: email
        }
    });

    register(username, password, email);
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
            text: '稍後請至您的信箱進行驗證，若需要重新寄送可於30秒後點選以下按鈕',
            showCloseButton: true,
            showDenyButton: true,
            denyButtonText: '重寄驗證信',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.getDenyButton().disabled = true;
                setTimeout(() => {
                    Swal.getDenyButton().disabled = false;
                }, 10000); // 30000 milliseconds = 30 seconds
            },
            preDeny: () => {
                let info = {email: email};
                const jsonInfo = JSON.stringify(info);
                axios.post(API_RESEND_REGISTER_MAIL, jsonInfo, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(() => swalSuccess())
                
            }
        });
    })
}
// ----------------- Change password ----------------- //
async function swalChangePassword(){
    const result = await Swal.fire({
        icon: 'warning',
        text: '請問是否要變更密碼？',
        showCancelButton: true,
        confirmButtonText: '是',
        denyButtonText: '否'
      });
      if(result.isDismissed) return;
    
      const resultOldPassword = await Swal.fire({
        text: '請輸入您目前的密碼',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes:{
            maxlength: '50',
            autocapitalize: "off",
            autocorrect: "off"
        },
        inputValidator: (value) => {
            if(!REGEX_PASSWORD.test(value)) return PASSWORD_ERROR;
        },
        allowOutsideClick: true,
        allowEnterKey: false
    });
    if(resultOldPassword.isDismissed) return;
    const oldPassword = resultOldPassword.value;

    const {value: newPassword} = await Swal.fire({
        text: '請輸入新密碼',
        input: 'password',
        inputPlaceholder: 'Enter new password',
        inputAttributes:{
            maxlength: '50',
            autocapitalize: "off",
            autocorrect: "off"
        },
        inputValidator: (value) => {
            if(!REGEX_PASSWORD.test(value)) return REGEX_WARN_PASSWORD;
        },
        allowOutsideClick: false,
        allowEnterKey: false
    });

    if(oldPassword === newPassword) {
        swal('error', '操作失敗', SAME_PASSWORD_ERROR);
        return;
    }

    let info = {oldPassword: oldPassword, newPassword: newPassword};
    const jsonInfo = JSON.stringify(info);
    axios.post(API_CHANGE_PASSWORD, jsonInfo, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then(() => {
        Swal.fire({
            icon: 'success',
            text: '操作成功，請重新登入',
        }).then(() => {
            logoutSimple();
        })
    });
}
// ----------------- Change email ----------------- //
async function swalChangeEmail(){
    const result = await Swal.fire({
        icon: 'warning',
        text: '請問是否要變更信箱？',
        showCancelButton: true,
        confirmButtonText: '是',
        denyButtonText: '否'
      });
      if(result.isDismissed) return;

    const {value: email} = await Swal.fire({
        text: '請輸入新信箱',
        input: 'email',
        inputPlaceholder: 'Enter new email address',
        inputAttributes:{
            maxlength: '64',
            autocapitalize: "off",
            autocorrect: "off"
        },
        inputValidator: (value) => {
            if(!REGEX_EMAIL.test(value)) return REGEX_WARN_EMAIL;
        },
        allowOutsideClick: false,
        allowEnterKey: false
    });

    let info = {email: email};
    const jsonInfo = JSON.stringify(info);
    axios.post(API_CHANGE_EMAIL, jsonInfo, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then(() => {
        Swal.fire({
            icon: 'warning',
            text: '稍後請至您的信箱進行驗證，並重新登入',
        }).then(() => {
            logoutSimple();
        })
    });
}
// ----------------- Forgot password ----------------- //
async function swalForgotPassword(){
    const { value: email } = await Swal.fire({
        title: '忘記密碼',
        text: '請輸入您註冊時提供的的電子信箱',
        input: 'email',
        inputPlaceholder: 'Enter your email address',
        inputAttributes:{
            maxlength: '64',
            autocapitalize: "off",
            autocorrect: "off"
        },
        inputValidator: (value) => {
            if(!REGEX_EMAIL.test(value)) return REGEX_WARN_EMAIL;
        },
        allowOutsideClick: false,
        allowEnterKey: false
    })
    if(email){
        Swal.fire({
            icon: 'warning',
            text: '密碼重置連結已寄送至您的信箱',
        })
    }

    const info = {email: email};
    const jsonInfo = JSON.stringify(info);

    axios.post(API_FORGOT_PASSWORD, jsonInfo, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}