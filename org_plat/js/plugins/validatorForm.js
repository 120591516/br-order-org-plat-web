var utils_msg_atLeast = '长度至少';
var utils_msg_bit = '位';
var utils_msg_end = '之间';
var utils_msg_format = '格式不正确';
var utils_msg_integer = '只能为整数';
var utils_msg_lengthMustBe = '长度必须';
var utils_msg_lettersNumbers = '只能包含字母、数字';
var utils_msg_notNull = '不能为空！';
var utils_msg_positiveInteger = '只能为正整数';
var utils_msg_positiveInteger_0 = '只能为正整数和0';
var utils_msg_up = '大于';
var utils_msg_down = '小于';
var utils_msg_start = '必须在';
var utils_msg_confirm = '两次输入的值不相同';
var utils_msg_repeat = '两次输入的值相同';
/**
 * 去除字符串两端空格
 * @returns
 */
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

/**
 * 字符串真实长度
 * @returns
 */
String.prototype.getBytes = function () {
    var cArr = this.match(/[^\x00-\xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
};

/**
 * 日期格式化:new Date().format('yyyy-MM-dd hh:mm:ss')
 * @param format
 * @returns
 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }

    return format;
};

/**
 * 关闭窗口
 */
function closeWindow() {
    top.window.opener = null;
    top.window.open('', '_self');
    top.window.close();
}

/**
 * 批量去空格
 * @param formId
 */
function formInputTrim(formId) {
    var formNode = document.getElementById(formId);
    var length = formNode.length;
    for (var i = 0; i < length; i++) {
        var node = formNode.elements[i];
        if (node.type == "text" && node.disabled == false) {// || node.type == "hidden" || node.type == "password"
            node.value = node.value.trim();
        }
    }
}

/**
 * 显示输入框验证提示
 * @param inputNode
 */
function showInputColor(inputNode, type) {
    var controlGroupDiv = inputNode.parent().parent();
    if (type == "has-error") {
        controlGroupDiv.addClass("has-error");
        controlGroupDiv.children(".control-label").each(function (i) {
            $(this).attr("for", "inputError");
        });
    } else if (type == "has-success") {
        controlGroupDiv.addClass("has-success");
        controlGroupDiv.children(".control-label").each(function (i) {
            $(this).attr("for", "inputSuccess");
        });
    } else if (type == "has-warning") {
        controlGroupDiv.addClass("has-warning");
        controlGroupDiv.children(".control-label").each(function (i) {
            $(this).attr("for", "inputWarning");
        });
    }
}

/**
 * 隐藏输入框提示
 * @param inputNode
 */
function hiddenInputColor(inputNode) {
    var controlGroupDiv = inputNode.parent().parent();
    controlGroupDiv.removeClass("has-error");
    controlGroupDiv.removeClass("has-success");
    controlGroupDiv.removeClass("has-warning");
    controlGroupDiv.children(".control-label").each(function (i) {
        $(this).attr("for", "");
    });
}

//提示按钮
var messageDiv = $('#messageButtonId');
/**
 * 输入框数据验证
 * @param nodeId
 * @returns {Boolean}
 */
function inputDataVali(inputNode, nodeType) {
    var vType = inputNode.attr("vType");
    var type = inputNode.attr("type");
    var vMethod = inputNode.attr("vMethod");
    var vUrl = inputNode.attr("vUrl");
    var vValueId = inputNode.attr("vValueId");
    var vRepeat = inputNode.attr("vRepeat");
    if (null != vType && (type == "text" || type == "password")) {// || inputNode.type == "hidden"
        var value = inputNode.val();
        value = $.trim(value);
        inputNode.val(value);

        var minLength = inputNode.attr("vMin");
        var maxLength = inputNode.attr("vMax");//inputNode.getAttribute("vMax");
        //确认密码
        var vConfirm = inputNode.attr("vConfirm");
        var resultArr = {"result": false, "message": ""};

        //1.验证长度
        if (vType.indexOf("number") >= 0) {
            resultArr = utils_valiFunc.numberMinMax(value, minLength, maxLength);
        } else {
            resultArr = utils_valiFunc.minMax(value, minLength, maxLength);
        }

        var result = resultArr["result"];// true or false
        var message = resultArr["message"];

        if (result != true) {
            hiddenInputColor(inputNode);
            showInputColor(inputNode, "has-error");
            displayError(inputNode, message, result)
//			if(nodeType == "input"){
//				messageDiv.attr("data-noty-options", '{"text":"' + message + '","layout":"bottom","type":"information","closeButton":"true"}');
//				messageDiv.click();
//			}
            return false;
        } else if (vType == "length") {//如果只验证长度
            hiddenInputColor(inputNode);
            showInputColor(inputNode, "has-success");
            displayError(inputNode, message, result)
            return true;

        } else if (value.length == 0) {
            hiddenInputColor(inputNode);
            showInputColor(inputNode, "has-success");
            displayError(inputNode, message, result)
        }

        //2.验证格式
        if (value.length != 0) {
            if (vType == "email") {//邮箱
                resultArr = utils_valiFunc.email(value);

            } else if (vType == "number") {//整数
                resultArr = utils_valiFunc.number(value);

            } else if (vType == "numberZ") {//正整数floatZ
                resultArr = utils_valiFunc.numberZ(value);
            } else if (vType == "numberZ0") {//正整数floatZ
                resultArr = utils_valiFunc.numberZ0(value);
            } else if (vType == "floatZ") {//正浮点数：金额
                resultArr = utils_valiFunc.floatZ(value);

            } else if (vType == "chinaLetterNumber") {//中文字母数字
                resultArr = utils_valiFunc.chinaLetterNumber(value);

            } else if (vType == "chineseName") {//中文2-4
                resultArr = utils_valiFunc.chineseName(value);
            } else if (vType == "string") {//普通验证
                resultArr = utils_valiFunc.stature(value);

            } else if (vType == "letterNumber") {//字母数字
                resultArr = utils_valiFunc.letterNumber(value);

            } else if (vType == "tell") {//电话,如02788888888,注意没有横杠(-)
                resultArr = utils_valiFunc.tell(value);

            } else if (vType == "phone") {//手机
                resultArr = utils_valiFunc.phone(value);

            } else if (vType == "postboy") {//邮编
                resultArr = utils_valiFunc.postboy(value);

            } else if (vType == "idCard") {//身份证号15-18位
                resultArr = utils_valiFunc.idCard(value);

            } else if (vType == "qq") {//QQ
                resultArr = utils_valiFunc.qq(value);

            } else if (vType == "url") {//网址
                resultArr = utils_valiFunc.url(value);

            } else if (vType == "stature") {//身高
                resultArr = utils_valiFunc.stature(value);

            } else if (vType == "ip") {//IP
                resultArr = utils_valiFunc.ip(value);

            } else if (vType == "avoirdupoi") {//体重
                resultArr = utils_valiFunc.avoirdupoi(value);

            }
            if (vMethod == "ajaxFunc") {
                str = "?valueName=" + value + "&valueId=" + vValueId;
                resultArr = utils_valiFunc.ajaxFunc(inputNode, vUrl, str, "GET");
            }
            result = resultArr["result"];// true or false
            message = resultArr["message"];

            if (result != true) {
                hiddenInputColor(inputNode);
                showInputColor(inputNode, "has-error");
                displayError(inputNode, message, result);
//				if(nodeType == "input"){
//					messageDiv.attr("data-noty-options", '{"text":"' + message + '","layout":"bottom","type":"alert","closeButton":"true"}');
//					messageDiv.click();
//				}
                return false;
            } else {
                displayError(inputNode, message, result)
                hiddenInputColor(inputNode);
                showInputColor(inputNode, "has-success");
            }
            //密码相同的判断
            if (vConfirm != null) {
                var preVal = $("#" + vConfirm).val();
                resultArr = confirm(preVal, value);
                result = resultArr["result"];// true or false
                message = resultArr["message"];

                if (result != true) {
                    hiddenInputColor(inputNode);
                    showInputColor(inputNode, "has-error");
                    displayError(inputNode, message, result);
//				if(nodeType == "input"){
//					messageDiv.attr("data-noty-options", '{"text":"' + message + '","layout":"bottom","type":"alert","closeButton":"true"}');
//					messageDiv.click();
//				}
                    return false;
                } else {
                    displayError(inputNode, message, result)
                    hiddenInputColor(inputNode);
                    showInputColor(inputNode, "has-success");
                }
            }
            //输入的值是否一致
            if (vRepeat != null) {
                var $repeat = $("." + vRepeat);
                if(value != ""){
                    $repeat.each(function(){
                        if(this != $(inputNode)[0]){
                                resultArr = confirmRepeat($(this).val(), value);
                                result = resultArr["result"];// true or false
                                message = resultArr["message"];
                                if (result != true) {
                                    hiddenInputColor(inputNode);
                                    showInputColor(inputNode, "has-error");
                                    displayError(inputNode, message, result);
                                    return false;
                                } else {
                                    displayError(inputNode, message, result)
                                    hiddenInputColor(inputNode);
                                    showInputColor(inputNode, "has-success");
                                }
                        }
                    })
                }
            }
        }
    }
    return true;
}
/**
 * 输入框警告验证
 */
function inputNodeWarn(inputNode,nodeType) {
    var vType = inputNode.attr("vType");
    var type = inputNode.attr("type");
    var vMessage = inputNode.attr("vMessage");
    if (null != vType && (type == "text" || type == "password")) {// || inputNode.type == "hidden"
        var value = inputNode.val();
        value = $.trim(value);
        inputNode.val(value);

        var minLength = inputNode.attr("vMin");
        var maxLength = inputNode.attr("maxlength");//inputNode.getAttribute("vMax");
        var resultArr = {"result": false, "message": ""};
        if(vMessage != null){
            resultArr.message = vMessage;
        }
        var result = resultArr["result"];// true or false
        var message = resultArr["message"];
        if (result != true) {
            hiddenInputColor(inputNode);
            showInputColor(inputNode, "has-warning");
            displayWaring(inputNode, message, result)
            return false;
        } else if (vType == "length") {//如果只验证长度
            hiddenInputColor(inputNode);
            showInputColor(inputNode, "has-success");
            displayWaring(inputNode, message, result)
            return true;
        } else if (value.length == 0) {
            hiddenInputColor(inputNode);
            showInputColor(inputNode, "has-success");
            displayWaring(inputNode, message, result)
        }

    }
}
/**
 *
 * 错误信息显示
 */
function displayError(inputNode, message, result) {
    var messageNode = inputNode.parent().next(".help-block");
    if (result != true) {
        messageNode.empty();
        messageNode.text(message);
    } else {
        messageNode.empty();
    }
}
/**
 * 警告信息显示
 */
function displayWaring(inputNode,message,result){
    var messageNode = inputNode.parent().next(".help-block");
    if (result != true) {
        messageNode.empty();
        messageNode.text(message);
    } else {
        messageNode.empty();
    }
}
/**
 * 失去焦点时验证
 * @param inputNode
 * @returns {Boolean}
 */
function onblurVali(inputNode) {
    inputNode = $(inputNode);
    inputDataVali(inputNode, "input");
}
/**
 *
 */
function onfocusVali(inputNode){
    inputNode = $(inputNode);
    inputNodeWarn(inputNode,"input");
}
/**
 * 整个form一次验证
 * @param formNode
 * @returns {Number}
 */
function formVali(formNode) {
    var length = formNode.length;
    var errorCount = 0;
    for (var i = 0; i < length; i++) {
        var node = formNode.elements[i];
        node = $(node);
        var result = inputDataVali(node, "form");
        if (result == false) {
            errorCount += 1;
        }
    }
    return errorCount;
}
//相同密码验证
function confirm(preVal, value) {
    if (preVal == value) {
        return {"result": true, "message": ""};
    } else {
        return {"result": false, "message": utils_msg_confirm};
    }
}
//相同验证
function confirmRepeat(preVal, value) {
    if (preVal != value) {
        return {"result": true, "message": ""};
    } else {
        return {"result": false, "message": utils_msg_repeat};
    }
}
var utils_valiFunc = {
    /**
     * 验证长短
     * @param str
     * @param minLength
     * @param maxLength
     * @returns
     */
    "minMax": function (str, minLength, maxLength) {
        var objectLength = str.length;//.getBytes();//length;
        if (objectLength == 0 && minLength == 0) {
            return {"result": true, "message": ""};
        }
        if (objectLength == 0) {
            return {"result": false, "message": utils_msg_notNull};
        }
        if (null != minLength && null != maxLength && minLength == maxLength && objectLength < minLength) {
            return {"result": false, "message": utils_msg_atLeast + minLength + utils_msg_bit};
        }
        if ((null != minLength && objectLength < minLength) || (null != maxLength && objectLength > maxLength)) {
            return {"result": false, "message": utils_msg_lengthMustBe + minLength+"-"+ maxLength+ utils_msg_bit};
        } else {
            return {"result": true, "message": ""};
        }
    },
    /**
     * 验证长短
     * @param numberValue
     * @param minLength
     * @param maxLength
     * @returns
     */
    "numberMinMax": function (numberValue, minLength, maxLength) {
        if(numberValue == "" || typeof(numberValue) == "undefined"){
            return {"result": false, "message": utils_msg_notNull};
        }
        var objectLength = parseInt(numberValue);
        var minLength = isNaN(parseInt(minLength)) ? 0 : parseInt(minLength);
        var maxLength = isNaN(parseInt(maxLength)) ? null : parseInt(maxLength);
        if (objectLength == 0) {
            return {"result": true, "message": ""};
        }
        if (isNaN(objectLength)) {
            return {"result": false, "message": utils_msg_format};
        }
        if (null != minLength && null != maxLength && minLength == maxLength && objectLength < minLength) {
            return {"result": false, "message": utils_msg_lengthMustBe + minLength + utils_msg_bit};
        }
        if ((null != minLength && objectLength < minLength) || (null != maxLength && objectLength > maxLength)) {
            if (maxLength == null) {
                return {"result": false, "message": utils_msg_atLeast + utils_msg_up + minLength};
            }
            return {"result": false, "message": utils_msg_start + minLength + "-" + maxLength + utils_msg_end};
        } else {
            return {"result": true, "message": ""};
        }
    },
    /**
     * 整数
     * @param str
     * @returns
     */
    "number": function (str) {
        var result = str.match(/^(-|\+)?\d+$/);
        if (result == null) {
            return {"result": false, "message": utils_msg_integer};
        } else {
            return {"result": true, "message": ""};
        }
    },

    /**
     * 正整数
     * @param str
     * @returns
     */
    "numberZ": function (str) {
        var result = str.match(/^[0-9]*[1-9][0-9]*$/);
        if (result == null) {
            return {"result": false, "message": utils_msg_positiveInteger};
        } else {
            return {"result": true, "message": ""};
        }
    },
    /**
     * 正整数和0
     * @param str
     * @returns
     */
    "numberZ0": function (str) {
        var result = str.match(/^([1-9]\d*|[0]{1,1})$/);
        if (result == null) {
            return {"result": false, "message": utils_msg_positiveInteger_0};
        } else {
            return {"result": true, "message": ""};
        }
    },
    /**
     * 正浮点数，可验证>=0 && <=99999999.99 的数字
     * @param str
     * @returns
     */
    "floatZ": function (str) {
        var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if (exp.test(num)) {
            return {"result": true, "message": ""};
        } else {
            return {"result": false, "message": utils_msg_positiveInteger};
        }
    },

    /**
     * 中文_字母_数字
     * @param str
     * @returns
     * */
    "chinaLetterNumber": function (str) {
        var pattern = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/i;
        if (pattern.test(str)) {
            return {"result": true, "message": ""};
        } else {
            return {"result": false, "message": "只能包含中文、字母、数字！"};
        }
    },
    /**
     *
     * 中文名字
     * @param str
     * @return
     */
    "chineseName": function (str) {
        console.log(str);
        var pattern = /^[\u4E00-\u9FA5]{2,4}$/;
        if (pattern.test(str)) {
            return {"result": true, "message": ""};
        } else {
            return {"result": false, "message": "只能为中文，且为2-4个汉字！"};
        }

    },
    /**
     * 字母_数字
     * @param str
     * @returns
     */
    "letterNumber": function (str) {
        var letterNumber = /^[A-Za-z0-9]+$/;
        if (letterNumber.test(str)) {
            return {"result": true, "message": ""};
        } else {
            showMessage = "";
            return {"result": false, "message": utils_msg_lettersNumbers};
        }
    },

    /**
     * 验证邮箱
     * @param str
     * @returns
     */
    "email": function (str) {
        var email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;//正则/\b[^\s\@]+\@(?:[a-z\d-]+\.)+(?:com|net|org|info|cn|jp|gov|aero)\b/;
        if (email.test(str)) {
            return {"result": true, "message": ""};
        } else {
            return {"result": false, "message": utils_msg_format};
        }
    },

    /**
     * 匹配固定电话或小灵通，例如：031185907468或02185907468格式
     * @param str
     * @returns
     */
    "tell": function (str) {
        var partten = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
        if (partten.test(str)) {
            return {"result": true, "message": ""};
        } else {
            return {"result": false, "message": utils_msg_format};
        }
    },

    /**
     * 手机
     * @param str
     * @returns
     */
    "phone": function (str) {
        var partten = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/; ///^1[3,5]\d{9}$/;
        if (partten.test(str)) {
            return {"result": true, "message": ""};
        } else {
            return {"result": false, "message": utils_msg_format};
        }
    },

    /**
     * 邮编
     * @param str
     * @returns
     */
    "postboy": function (str) {
        var partten = /^[a-zA-Z0-9 ]{3,12}$/;
        if (partten.test(str)) {
            return {"result": true, "message": ""};
        } else {
            return {"result": false, "message": utils_msg_format};
        }
    },

    /**
     * 身份证号15-18位
     * @param str
     * @returns
     */
    "idCard": function (str) {
        var result = str.match(/\d{15}|\d{18}/);
        if (result == null) {
            return {"result": false, "message": utils_msg_format};
        } else {
            return {"result": true, "message": ""};
        }
    },

    /**
     * qq
     * @param str
     * @returns
     */
    "qq": function (str) {
        var result = str.match(/^(-|\+)?\d+$/);
        if (result == null) {
            return {"result": false, "message": utils_msg_format};
        } else {
            return {"result": true, "message": ""};
        }
    },

    /**
     * URL 网址
     * @param str
     * @returns
     */
    "url": function (str) {
        var result = str.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/);
        if (result == null) {
            return {"result": false, "message": utils_msg_format};
        } else {
            return {"result": true, "message": ""};
        }
    },

    /**
     *    IP 地址
     * @param str
     * @returns
     */
    "ip": function (str) {
        var val = /([0-9]{1,3}\.{1}){3}[0-9]{1,3}/;
        var vald = val.exec(str);
        if (vald == null) {
            return {"result": false, "message": utils_msg_format};
        }
        if (vald != '') {
            if (vald[0] != str) {
                return {"result": false, "message": utils_msg_format};
            }
        }
        return {"result": true, "message": ""};
    },

    /**
     * 身高
     * @param str
     * @returns
     */
    "stature": function (str) {
        var result = str.match(/^(-|\+)?\d+$/);
        if (result == null) {
            return {"result": false, "message": utils_msg_format};
        } else {
            if (parseInt(str) < 25 || parseInt(str) > 250) {
                return {"result": false, "message": utils_msg_start + 25 + "-" + 250 + "cm" + utils_msg_end};
            }
            return {"result": true, "message": ""};
        }
    },

    /**
     * 体重
     * @param str
     * @returns
     */
    "avoirdupoi": function (str) {
        var result = str.match(/^(-|\+)?\d+$/);
        if (result == null) {
            return {"result": false, "message": utils_msg_format};
        } else {
            if (parseInt(str) < 2 || parseInt(str) > 500) {
                return {"result": false, "message": "应该在" + 2 + "-" + 500 + "kg" + utils_msg_end};
            }
            return {"result": true, "message": ""};
        }
    },

    /**
     * 判断文件上传类型
     * @param valuePath
     * @returns
     */
    "valiFile": function (valuePath) {
        var imageGeShi = valuePath.substr(valuePath.lastIndexOf(".") + 1);
        var geShi = ["jpg", "jpeg", "png"];
        var imageResult = false;
        for (var i in geShi) {
            if (imageGeShi == geShi[i]) {
                imageResult = true;
            }
        }
        if (imageResult == false) {
            return {"result": false, "message": utils_msg_format};
        } else {
            return {"result": true, "message": ""};
        }
    },
    /**
     * ajax后台数据
     * @param url
     * @param params
     * @param method
     */
    "ajaxFunc": function (inputNode, url, params, method) {
        var ajaxReturnValue = false;
        var returnValue = "";
        $.ajax({
            type: method,
            url: url + params,
            async: false,
            success: function (data) {
                returnValue = data;
                if (returnValue.status == 200) {
                    ajaxReturnValue = false;
                } else {
                    ajaxReturnValue = true;
                }
            }
        })
        if (ajaxReturnValue) {
            return {"result": true, "message": ""};
        } else {
            return {"result": false, "message": returnValue.msg};
        }

    }
};
var utils_cookie = {
    /**
     * 写cookies
     * @param name
     * @param value
     * @param day    保存天数
     */
    "add": function (name, value, day) {
        var exp = new Date();
        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },

    /**
     * 取cookies
     * @param name
     * @returns
     */
    "get": function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        }
        return null;
    },

    /**
     * 删除cookie
     * @param name
     */
    "delete": function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = utils_getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },

    /**
     * 是否支持Cookie
     * @returns {Boolean}
     */
    "enable": function () {
        var result = false;
        if (navigator.cookiesEnabled) {
            return true;
        }
        document.cookie = "testcookie=yes;";
        var cookieSet = document.cookie;
        if (cookieSet.indexOf("testcookie=yes") > -1) {
            result = true;
        }
        document.cookie = "";
        return result;
    }
};
/**
 * 上传图片时预览本地图片
 * @param file 图片文件
 * @param preview 预览源id
 * @param imghead 图片目标id
 */
function previewImage(file, imghead) {
    var MAXWIDTH = 100;
    var MAXHEIGHT = 100;
//	  var div = document.getElementById(preview);
    if (file.files && file.files[0]) {
//	      div.innerHTML ='<img id='+imghead+'>';
        var img = document.getElementById(imghead);
        img.onload = function () {
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width = rect.width;
            img.height = rect.height;
            img.style.marginTop = rect.top + 'px';
            imgSrc = img.src;
        }
        var reader = new FileReader();
        reader.onload = function (evt) {
            img.src = evt.target.result;
        }
        reader.readAsDataURL(file.files[0]);
    } else { //兼容IE
        var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
//	    div.innerHTML ='<img id='+imghead+'>';
        var img = document.getElementById(imghead);
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
        div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>";
    }

}
function clacImgZoomParam(maxWidth, maxHeight, width, height) {
    var param = {top: 0, left: 0, width: width, height: height};
    if (width > maxWidth || height > maxHeight) {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if (rateWidth > rateHeight) {
            param.width = maxWidth;
            param.height = Math.round(height / rateWidth);
        } else {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}