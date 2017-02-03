$(document).ready(function () {
    $("#main_area").hide().delay(200).fadeIn('slow');

    $.validator.setDefaults({
        errorClass: 'help-block',
        highlight: function (element) {
            $(element)
                .closest('.form-group')
                .addClass('has-error')
        },
        unhighlight: function (element) {
            $(element)
                .closest('.form-group')
                .removeClass('has-error')
        },
    });

    $.validator.addMethod('UserNameLength',function (value,element) {
        return value.length>=3;
    },'名稱少於3個字');

    $.validator.addMethod('StrongPassword',function (value,element) {
       return value.length>=6;
    },'密碼少於6個字');

    $("#register_form").validate({
        rules: {
            userName: {
                required: true,
                UserNameLength: true,
                lettersonly: true
            },
            password: {
                required: true,
                StrongPassword: true
            },
            password_again: {
                required: true,
                equalTo: '#password'
            },
            password_hint: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true
            },
            cellphone: {
                required: true
            },
            vendor: {
                required: true
            },
            select_category: {
                required: true
            },
            market: {
                required: true
            },
            address: {
                required: true
            },
            zip: {
                required: true
            },
            vendor_phone: {
                required: true
            },
            introduction: {
                required: true
            },
            image: {
                required: true
            }
        },
        messages: {
            userName: {
                required: '請輸入使用者名稱'
            },
            password: {
                required: '請輸入密碼'
            },
            password_again: {
                required: '請再次輸入密碼',
                equalTo: '密碼錯誤'
            },
            password_hint: {
                required: "請輸入密碼提示"
            },
            email: {
                required:'請輸入電子郵件',
                email: '格式錯誤'
            },
            phone: {
                required: '請輸入電話號碼'
            },
            cellphone: {
                required: '請輸入手機號碼'
            },
            vendor: {
                required: '請輸入店家名稱'
            },
            select_category: {
                required: '請選擇店家種類'
            },
            market: {
                required: '請選擇所在夜市名稱'
            },
            address: {
                required: '請輸入地址'
            },
            zip: {
                required: '請輸入郵遞區號'
            },
            vendor_phone: {
                required: '請輸入商家電話'
            },
            introduction: {
                required: "請輸入商家介紹"
            },
            image: {
                required: "請上傳圖片"
            }
        }
    });

    $(':file').on('fileselect', function(event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }

    });
});

$(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});
