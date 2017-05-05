/**
 * 公共独立的Http请求方法，所有网络请求皆通过此方法操作
 * 
 * @param httpUrl
 *            请求URL
 * @param httpParam
 *            请求参数：json对象，例：{"username": "demo","password": "demo","validCode": ["type":1,"level":0]}
 * @param httpType
 *            请求类型：post、get
 * @param async
 *            请求同步：true为异步，false为同步
 * @returns 请求返回信息
 */
function httpRequest(httpUrl, httpParam, httpType, async) {
	var reqResult = {
		"result": 1,
		"message": "没有请求服务器或接受到返回值"
	};
	$.ajax({
		url: httpUrl,
		type: httpType,
		async: async,
		data: httpParam,
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		dataType: 'json',
		success: function(msg) {
			if(msg.result == 99) {
				alert(msg.message);
				return false;
			}
			reqResult = msg;
			return msg;
		}
	});
	return reqResult;
}

// 分页当前页码
var page_curr = 1;
// 每页记录条数
var count_curr = 10;
// 记录总条数
var total_count = 0;
// limit
var limit = 10;

function callBackPagination(dataBack) {
	var totalCount = dataBack.data.total;
	var showCount = 5;
	var limit = 10;
	createTable(1, limit, totalCount, dataBack);
}

function callBackPaginationInit(dataBack) {
	var totalCount = dataBack.data.total,
		showCount = 5,
		limit = 10;
	createTable(1, limit, totalCount, dataBack);
	$('#callBackPager').extendPagination({
		totalCount: totalCount,
		showCount: showCount,
		limit: limit,
		callback: function(curr, limit, totalCount, dataBack) {
			createTable(curr, limit, totalCount, dataBack);
		}
	});
}

/**
 * 用户退出登录
 */
function logout() {
	if(confirm("您确定要退出吗?")) {
		var param = null;
		var type = "get";
		var reqResult = httpRequest(login_logout_url, param, type, false);
		if(reqResult.result == 0) {
			window.location.href = '/org_plat/pages/system/login.html';
		} else {
			/**
			 * 此处应为弹出公共提示信息窗口 提示错误信息
			 */
			alert(reqResult.message);
		}
	}
}
//获取多个参数值
function getSomeParamValue(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return decodeURIComponent(r[2]);
	return null;
}
//获取参数值
function getParamValue() {
	var thisURL = document.URL;
	if(thisURL.indexOf("?") != -1) {
		getval = thisURL.split('?')[1];
		showval = getval.split("=")[1];
	}
	return showval;
}
// 省级联动 省
function prov_init() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getAllProvince_url, null, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var provSelect = $('.prov');
		var html = "<option selected='selected' value=''>请选择</option>";
		if(datal.id != "") {
			for(var i = 0; i < datal.length; i++) {
				html += "<option value= '" + datal[i].id + "'>" + datal[i].provinceName + "</option>";
			}
			$(".prov").empty().append(html);
		}

	} else {

		$(".prov").val('');
	}

	$(".dist").empty();
	$(".city").empty();
}
// 省级联动 市
$('.prov').on('change', function() {
		var prov = $(this).val();
		prov_city(prov);
	})
	//动态加载js
function artJs() {
	var oHead = $("body").remove("script[role='reload']");
	$("<scri" + "pt>" + "</scr" + "ipt>").attr({
		role: 'reload',
		src: '/org_plat/js/plugins/fileinput.js'
	}).appendTo(oHead);
	$("<scri" + "pt>" + "</scr" + "ipt>").attr({
		role: 'reload',
		src: '/org_plat/js/plugins/fileinput_locale_zh.js'
	}).appendTo(oHead);
}

function prov_city(prov) {
	var param = {
		'provinceId': prov
	}
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getCityByProvinceId_url, param, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var citySelect = $('.city');
		var html = "<option selected='selected' value=''>请选择</option>";
		if(prov != "") {

			if(datal.id != "") {
				for(var i = 0; i < datal.length; i++) {
					html += "<option value= '" + datal[i].id + "'>" + datal[i].cityName + "</option>";
				}
				citySelect.empty().append(html);
			}
		}
	} else {
		$(".city").empty();

	}
	$(".dist").empty();
}
// 省级联动 区
$('.city').on('change', function() {
	var town = $(this).val();
	city_town(town);
})

function city_town(town) {
	var param = {
		'cityId': town
	}
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getDistrictByCityId_url, param, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var distSelect = $('.dist');
		var html = "<option selected='selected' value=''>请选择</option>";
		if(datal.id != "") {
			for(var i = 0; i < datal.length; i++) {

				html += "<option value= '" + datal[i].id + "'>" + datal[i].districtName + "</option>";
			}
		}
		distSelect.empty().append(html);

	} else {
		$('.dist').empty();
	}
}
// 机构等级初始化信息
function init_org_info_level_data(GradeId) {
	$(GradeId).empty();
	var thisURL = document.URL;
	var otype = "GET"
	var osync = false;
	var param = null;
	var reqResult = httpRequest(init_addInformation_info_level_data, param, otype, osync);
	if(thisURL.indexOf("?") != -1) {
		var strNature = "";
	} else {
		var strNature = "<option value='please'>全部</option>";
	}
	for(var i = 0; i < reqResult.data.length; i++) {
		strNature += "<option value='" + reqResult.data[i].orgLevelId + "'>" + reqResult.data[i].orgLevelName + "</option>";
	}
	$(GradeId).append(strNature);
}
// 后退
function storeManagementBack() {
	history.go(-1);
	return false;
}

// 空字符格式
function nullformat(str) {
	return str == null ? "" : str;
}

// load无刷新
function loadpage(ourl) {
	if(ourl != "") {
		$("#contentWrapper").load(ourl);
		var u = window.location.href;
		var end = u.indexOf("#");
		var rurl = u.substring(0, end);
		//设置新的锚点
		window.location.href = rurl + "#" + ourl;
		return false;
	}
}
//load页面跳转
var init_param_Id // load页面跳转参数
var branchId
var deptId
	// load无刷新
function loadpageLi(ourl, oId) {
	if(ourl != "") {
		$("#contentWrapper").load(ourl);
		init_param_Id = oId;
		var u = window.location.href;
		var end = u.indexOf("#");
		var rurl = u.substring(0, end);
		//设置新的锚点
		window.location.href = rurl + "#" + ourl + '?id=' + init_param_Id;
		return false;
	}
}

// load无刷新传两个id（科室跳转员工）
function loadpageTid(ourl, obranchId, odeptId) {
	if(ourl != "") {
		$("#contentWrapper").load(ourl);
		branchId = obranchId;
		deptId = odeptId;
		return false;
	}
}

//获取全部门店下拉框
function brands() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getOrganizationBranchOpenByOrgId, null, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var html = "<option selected='selected' value=''>---请选择---</option>";
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].branchId + "'>" + datal[i].branchName + "</option>";
		}
		$(".brands").empty().append(html);
	} else {
		$(".brands").val('');
	}
}
//全部科室下拉框
function departPs() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getOrgDeptAll, null, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var html = "<option selected='selected' value='-1'>全部</option>";
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].orgDeptId + "'>" + datal[i].departName + "</option>";
		}
		$(".departPs").empty().append(html);
	} else {
		$(".departPs").val('');
	}
}

//科室负责人
function getOrgUserByBranchId(branchId, deptName, num) {
	var otype = "get";
	var osync = false;
	var param = {
		"branchId": branchId
	};
	var reqResult = httpRequest(dept_getOrgUserByBranchId_url, param, otype, osync);
	if(reqResult.result == 0) {
		if(num == 0) {
			var str = "<option value='0'>全部</option>";
		} else {
			var str = "<option value='0'>无</option>";
		}
		if(reqResult.data != '') {
			var datal = reqResult.data;
			for(var i = 0; i < datal.length; i++) {
				str += "<option value= '" + datal[i].id + "'>" + datal[i].name + "</option>";
			}
		}
		$(deptName).empty().append(str);
	}
}

//负责人下拉框
function departMs() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getOrgUserAll, null, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var html = "<option selected='selected' value='-1'>全部</option>";
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].userId + "'>" + datal[i].userName + "</option>";
		}
		$(".departMs").empty().append(html);
	} else {
		$(".departMs").val('');
	}
}
//获取机构
function getorgId(orgId) {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getOrganizationByIdUrl, null, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value='-1'>---请选择---</option>";
		var datal = reqResult.data.org_basic;
		html = "<option value= '" + datal.orgId + "'>" + datal.orgShortName + "</option>";
		$(orgId).empty().append(html);
	} else {
		$(orgId).empty();
	}
}
//orgid机构select id值， branchid门店select id值(根据机构id获取门店信息)
function getBranch(orgid, branchid, deptid) {
	var orgidVal = $(orgid).val();
	var otype = "get";
	var osync = false;
	var param = {
		"orgid": orgidVal
	};
	var reqResult = httpRequest(getOrganizationBranchOpenByOrgId, param, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value=''>---请选择---</option>";
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].branchId + "'>" + datal[i].branchName + "</option>";
		}
		$(branchid).empty().append(html);
	} else {
		$(deptid).empty();
		$(branchid).empty();
	}

}
//branchid门店select id值,deptid科室select id值(根据门店id获取科室信息)
function getDept(branchid, deptid) {
	var branchidVal = $(branchid).val();
	var otype = "get";
	var osync = false;
	var param = {
		"branid": branchidVal
	};
	var reqResult = httpRequest(getOrgDeptByBranidUrl, param, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value='please'>---请选择---</option>";
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].orgDeptId + "'>" + datal[i].departName + "</option>";
		}
		$(deptid).empty().append(html);
	}
}
//初始化套餐类型信息
function suiteTypeId() {
	var otype = "GET"
	var osync = false;
	var param = null;
	var reqResult = httpRequest(dict_suite_type_view_all, param, otype, osync);
	var strNature = "";
	if(reqResult.result == 0 && reqResult.data != null) {
		strNature += "<option selected='selected' value=''>---请选择---</option>";
		for(var i = 0; i < reqResult.data.length; i++) {
			strNature += "<option value='" + reqResult.data[i].examTypeId + "'>" + reqResult.data[i].examTypeName + "</option>";
		}
		$('.suiteTypeId').empty().append(strNature);
	} else {
		$('.suiteTypeId').val('');
	}

}
//收费项获取科室下拉框
function feeItemDept() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getOrgDeptAll, null, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var html = "<option selected='selected' value=''>---请选择---</option>";
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].orgDeptId + "'>" + datal[i].departName + "</option>";
		}
		$(".feeItemDept").empty().append(html);
	} else {
		$(".feeItemDept").val('');
	}
}
//检查项获取项目类型下拉框
function getExamItemType() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getAllOrgExamItemTypeUrl, null, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value='-1'>---请选择---</option>";
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].examItemTypeId + "'>" + datal[i].examItemTypeName + "</option>";
		}
		$(".getEitemId").empty().append(html);
	} else {
		$(".getEitemId").empty();
	}
}

//科室类型检查
function departmentType() {
	var otype = "get";
	var osync = false;
	var param = {
		'page': 1,
		'rows': 100
	};
	var reqResult = httpRequest(departmentType_selectDeptTypeList_url, param, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value='-1'>---请选择---</option>";
		var datal = reqResult.data.list;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].dictDeptTypeId + "'>" + datal[i].dictDeptTypeName + "</option>";
		}
		$(".dictDeptTypeId").empty().append(html);
	} else {
		$(".dictDeptTypeId").empty();
	}
}
//col-md-offset-3 col-sm-offset-3 col-xs-offset-3
function SuperiorDepartment(branchId, deptId, num) {
	var otype = "get";
	var osync = false;
	var param = {
		"branchId": branchId
	};
	var reqResult = httpRequest(departmentType_getDeptNameByOrgId_url, param, otype, osync);
	if(reqResult.result == 0) {
		var str = "";
		if(num == 0) {
			var str = "<option value='0'>全部</option>";
		} else {
			var str = "<option value='0'>无</option>";
		}
		if(reqResult.data != '') {
			var datal = reqResult.data;
			for(var i = 0; i < datal.length; i++) {
				str += "<option value= '" + datal[i].deptId + "'>" + datal[i].deptName + "</option>";
			}
		}
		$(deptId).empty().append(str);
	}
}

//门店下拉列表
function getBranchName(getBranchName, num) {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getBranchNameByOrgId, null, otype, osync);
	if(reqResult.result == 0) {
		var branchStr = "";
		if(num == 0) {
			var branchStr = "<option value=''>全部</option>";
		} else {
			var branchStr = "<option value=''>无</option>";
		}
		if(reqResult.data != '') {
			var datal = reqResult.data;
			for(var i = 0; i < datal.length; i++) {
				branchStr += "<option value= '" + datal[i].branchId + "'>" + datal[i].branchName + "</option>";
			}
		}
		$(getBranchName).empty().append(branchStr);
	}
}
//用户设置门店下拉列表
function userMagBranch() {
	var otype = "get";
	var osync = false;
	var param = {
		"type": 1,
		"userId": init_param_Id
	}
	var reqResult = httpRequest(getNameListByUserIdUrl, param, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var html = "<option selected='selected' value='please'>---请选择---</option>";
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].branchId + "'>" + datal[i].branchName + "</option>";
		}
		$(".userManagerObjNameSelect").empty().append(html);
	} else {
		$(".userManagerObjNameSelect").val('');
	}
}
//用户设置科室下拉列表
function userMagDept() {
	var otype = "get";
	var osync = false;
	var param = {
		"type": 2,
		"userId": init_param_Id
	}
	var reqResult = httpRequest(getNameListByUserIdUrl, param, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data;
		var html = "<option selected='selected' value='please'>---请选择---</option>";
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].orgDeptId + "'>" + datal[i].departName + "</option>";
		}
		$(".userManagerObjNameSelect").empty().append(html);
	} else {
		$(".userManagerObjNameSelect").val('');
	}
}
//套餐列表
function suitListInfo(suitListInfo, num) {
	var otype = "get";
	var osync = false;
	var param = {
		'page': 1,
		'rows': 100
	};
	var reqResult = httpRequest(packAgeSearchOul, null, otype, osync);
	if(reqResult.result == 0) {
		var datal = reqResult.data.list;
		if(num == 0) {
			var html = "<option value=''>全部</option>";
		} else {
			var html = "<option value=''>无</option>";
		}
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].examSuiteId + "'>" + datal[i].examSuiteName + "</option>";
		}
		$(suitListInfo).empty().append(html);

	} else {

		$(suitListInfo).val('');
	}
}
//时间转换
function getLocalTime(timeStamp) {
	var date = new Date(parseInt(timeStamp));
	var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	return date.getFullYear() + "-" + month + "-" + currentDate;
}
//首页内容展示根据机构获取所有套餐
function getSuiteByOrg(suiteid,imgStr) {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getAllSuiteByOrgUrl, null, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value=''>---请选择---</option>";
		var imgStr='';
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].suiteId + "' examSuiteName='"+datal[i].suiteName+"'>" + datal[i].suiteName + "</option>";
		}
		$(suiteid).empty().append(html);
	} else {
		$(suiteid).empty();
	}
}
//首页内容展示根据机构获取所有门店
function getBranchByOrg(branchid) {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(getAllBranchByOrgUrl, null, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value='-1'>---请选择---</option>";
		var datal = reqResult.data.list;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].branchId + "' note= '" + datal[i].note + "' storeImgURL= '" + datal[i].imgURL + "' storeImgId= '" + datal[i].imgId + "' storeName= '" + datal[i].branchName + "'>" + datal[i].branchName + "</option>";
		}
		$(branchid).empty().append(html);
	} else {
		$(branchid).empty();
	}
}
//获取门店或者套餐图片的列表信息
function branchSuitPicture(id, type) {
	var otype = "get";
	var osync = false;
	var param = {
		'id': id,
		'type': type
	};
	var reqResult = httpRequest(pictureShow_getImgById_url, param, otype, osync);
	if(reqResult.result == 0) {
		var html = "";
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<li class='liCss'><img class='imgCss width-img' src='" + oplatIp + datal[i].imgLocation + "' id='" + datal[i].imgId + "'><h4>" + datal[i].imgName + "</h4></li>";
		}
		if(type == 1) {
			$(".branchPicture").empty().append(html);
		} else if(type == 2) {
			$(".SuitPicture").empty().append(html);
		}
	} else {
		$(".picture").empty();
	}
}
//获取所有检查项
function getExamItemName() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(signWord_getExamItemName_url, null, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value=''>全部</option>";
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].id + "'>" + datal[i].name + "</option>";
		}
		$('.ItemName').empty().append(html);
	} else {
		$('.ItemName').empty();
	}
}
//结论词类型
function conclusionType() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(conclusionWordType_getConclusionType_url, null, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value=''>全部</option>";
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].id + "'>" + datal[i].name + "</option>";
		}
		$(".conclusionType").empty().append(html);
	} else {
		$(".conclusionType").empty();
	}
}
//结论词科室类型
function conclusionDeptType() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(conclusionWordType_getConclusionDeptType_url, null, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value=''>全部</option>";
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].id + "'>" + datal[i].name + "</option>";
		}
		$(".conclusionDeptType").empty().append(html);
	} else {
		$(".conclusionDeptType").empty();
	}
}
//结论词分组
function conclusionGroup() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(conclusionWordType_getConclusionGroup_url, null, otype, osync);
	if(reqResult.result == 0) {
		var html = "<option selected='selected' value=''>全部</option>";
		var datal = reqResult.data;
		for(var i = 0; i < datal.length; i++) {
			html += "<option value= '" + datal[i].id + "'>" + datal[i].name + "</option>";
		}
		$(".conclusionGroup").empty().append(html);
	} else {
		$(".conclusionGroup").empty();
	}
}
//结论词结果
function conclusionResult() {
	var otype = "get";
	var osync = false;
	var reqResult = httpRequest(conclusionWordType_getConclusionResultClass_url, null, otype, osync);
	if(reqResult.result == 0) {
		if(reqResult.data != '') {
			var html = "<option selected='selected' value=''>全部</option>";
			var datal = reqResult.data;
			for(var i = 0; i < datal.length; i++) {
				html += "<option value= '" + datal[i].id + "'>" + datal[i].name + "</option>";
			}
			$(".conclusionResult").empty().append(html);
		}
	} else {
		$(".conclusionResult").empty();
	}
}
//ajax.js
var oplatIp = 'http://192.168.1.200';
var login_logout_url = oplatIp + '/br-order-org-plat-controller/logout';
var footer_getUserPermission_url = oplatIp + '/br-order-org-plat-controller/userManage/getUserPermission';
var userPower_getPermissionList_url = oplatIp + '/br-order-org-plat-controller/permissionManager/getPermissionList';
var userPower_addBrOperation_url = oplatIp + '/br-order-org-plat-controller/permissionManager/addBrOperationByPermissionId';
var userPower_getBrOperation_url = oplatIp + '/br-order-org-plat-controller/permissionManager/getBrOperationById';
var userPower_getBrPermission_url = oplatIp + '/br-order-org-plat-controller/permissionManager/getBrPermissionById';
var userPower_getBrOperationList_url = oplatIp + '/br-order-org-plat-controller/permissionManager/getBrOperationListById';
var userPower_updateBrOperation_url = oplatIp + '/br-order-org-plat-controller/permissionManager/updateBrOperation';
var userPower_insertPermission_url = oplatIp + '/br-order-org-plat-controller/permissionManager/insertPermission';
var userAdmin_getCountByUserName_url = oplatIp + '/br-order-org-plat-controller/userManage/getCountByUserName';
var userAdmin_insertBrUser_url = oplatIp + '/br-order-org-plat-controller/userManage/insertBrUser';
var userAdmin_deleteBrUser_url = oplatIp + '/br-order-org-plat-controller/userManage/deleteBrUser';
var userAdmin_getBrUser_url = oplatIp + '/br-order-org-plat-controller/userManage/getBrUserById';
var userAdmin_updateBrUser_url = oplatIp + '/br-order-org-plat-controller/userManage/updateBrUser';
var userAdmin_resetPassWord_url = oplatIp + '/br-order-org-plat-controller/userManage/resetPassWord';
var userRole_getRoles_url = oplatIp + '/br-order-org-plat-controller/userManage/getRolesByUserId';
var userRole_insertUserRole_url = oplatIp + '/br-order-org-plat-controller/userManage/insertUserRole';
var edit_password_url = oplatIp + '/br-order-org-plat-controller/userManage/editPassWord';
var personalInformation_getEmpInfo_url = oplatIp + '/br-order-org-plat-controller/emp/getEmpInfo';
var personalInformation_updateEmp_url = oplatIp + '/br-order-org-plat-controller/emp/updateEmp';
var userRole_updateUserRole_url = oplatIp + '/br-order-org-plat-controller/userManage/updateUserRole';

//个人信息
var personalInforUrl = oplatIp + '/br-order-org-plat-controller/userManage/personalInfor'; //展示个人信息

var storeManagement_searchOrgBranch_url = oplatIp + '/br-order-org-plat-controller/orgBranch/searchOrgBranch'; // 门店信息列表查询展示
var storeManagement_addOrganizationBranch_url = oplatIp + '/br-order-org-plat-controller/orgBranch/addOrganizationBranch';
var storeManagement_deleteOrgBranch_url = oplatIp + '/br-order-org-plat-controller/orgBranch/deleteOrgBranch';
var storeManagement_getOrgBranchById_url = oplatIp + '/br-order-org-plat-controller/orgBranch/getOrgBranchById'; // 查看门店信息
var storeManagement_updateOrgBranch_url = oplatIp + '/br-order-org-plat-controller/orgBranch/updateOrgBranch'; // 保存门店信息

// 体检项体征词相关接口
var item_getOrgExamItemValueByPage_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/getOrgExamItemValueByPage'; // 查
var item_insertOrgExamItemValue_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/insertOrgExamItemValue'; // 增
var item_getOrgExamItemValueById_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/getOrgExamItemValueById'; // 看
var item_updateOrgExamItemValue_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/updateOrgExamItemValue'; // 改
var item_deleteOrgExamItemValue_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/deleteOrgExamItemValue'; // 删
var item_list_url = oplatIp + '/br-order-org-plat-controller/orgExamItem/getAllOrgExamItem'; // 体检项目列表

var getAllProvince_url = oplatIp + '/br-order-org-plat-controller/dictArea/getAllProvince'; // 省
var getCityByProvinceId_url = oplatIp + '/br-order-org-plat-controller/dictArea/getCityByProvinceId'; // 市
var getDistrictByCityId_url = oplatIp + '/br-order-org-plat-controller/dictArea/getDistrictByCityId'; // 区

//ajaxaddr.js
//科室页面departments.shtml
var addOrgDeptUrl = oplatIp + '/br-order-org-plat-controller/OrgDept/addOrgDept'; //添加
var deleteOrgDeptUrl = oplatIp + '/br-order-org-plat-controller/OrgDept/deleteOrgDept'; //删除
var updateOrgDeptUrl = oplatIp + '/br-order-org-plat-controller/OrgDept/updateOrgDept'; //编辑
var getOrgDeptByBranidUrl = oplatIp + '/br-order-org-plat-controller/OrgDept/getOrgDeptByBranid'; //根据门店id获取可用科室
var getOrgDeptByIdUrl = oplatIp + '/br-order-org-plat-controller/OrgDept/getOrgDeptById'; //回显
var getOrgDeptByOrgidUrl = oplatIp + '/br-order-org-plat-controller/OrgDept/getOrgDeptByOrgid';
var getOrgDeptListUrl = oplatIp + '/br-order-org-plat-controller/OrgDept/getOrgDeptList'; //获取列表
var getOrgDeptAll = oplatIp + '/br-order-org-plat-controller/OrgDept/getOrgDeptAll'; //获取科室下拉框
var getOrgUserAll = oplatIp + '/br-order-org-plat-controller/organizationUser/getOrgUserAll'; //获取负责人下拉框
var getOrganizationBranchOpenByOrgId = oplatIp + '/br-order-org-plat-controller/orgBranch/getOrganizationBranchOpenByOrgId'; //通过机构获取门店下拉框
var departmentType_selectDeptTypeList_url = oplatIp + '/br-order-org-plat-controller/dictDeptTypeManage/selectDeptTypeList'; //科室类型
var departmentType_getDeptNameByOrgId_url = oplatIp + '/br-order-org-plat-controller/OrgDept/getDeptNameByBranchId'; //col-md-offset-3 col-sm-offset-3 col-xs-offset-3

//机构员工页面organzitionUser.shtml
var getAvailableOrgsUrl = oplatIp + '/br-order-org-plat-controller/organization/getAvailableOrgs'; //获取机构下拉框内容--机构员工页面
var getOrganizationBranchAllUrl = oplatIp + '/br-order-org-plat-controller/orgBranch/getOrganizationBranchAll'; //获取门店下拉框内容--机构员工页面

var getOrgUserAllUrl = oplatIp + '/br-order-org-plat-controller/organizationUser/getOrgUserAll'; //获取全部机构员工信息
var addOrgUserUrl = oplatIp + '/br-order-org-plat-controller/organizationUser/addOrgUser'; //添加机构员工信息  
var updateOrgUserUrl = oplatIp + '/br-order-org-plat-controller/organizationUser/updateOrgUser'; //编辑机构员工信息
var deleteOrgUserUrl = oplatIp + '/br-order-org-plat-controller/organizationUser/deleteOrgUser'; //删除机构员工信息
var getOrgUserByFidUrl = oplatIp + '/br-order-org-plat-controller/organizationUser/getOrgUserByFid'; //根据id获取机构员工信息列表
var getOrgUserByIdUrl = oplatIp + '/br-order-org-plat-controller/organizationUser/getOrgUserById'; //根据id获取机构员工信息对象   回显列表信息
var getOrgUserListUrl = oplatIp + '/br-order-org-plat-controller/organizationUser/getOrgUserList'; //分页查询机构员工信息   获取全部列表信息
var getOrgDeptAll = oplatIp + '/br-order-org-plat-controller/OrgDept/getOrgDeptAll'; //获取全部科室名称信息

//体检项查询医生姓名
var getUserByItemIdUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/getUserByItemId'; //回显
var saveUserUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/saveUser'; //编辑保存

//科室查询收费项信息
var getItemByDeptidUrl = oplatIp + '/br-order-org-plat-controller/OrgDept/getItemByDeptid'; //回显

//医生查询体检项信息
var getOrgExamItemByUserIdUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/getOrgExamItemByUserId'; //回显
//获取所有门店下拉列表
var getBranchNameByOrgId = oplatIp + '/br-order-org-plat-controller/orgBranch/getBranchNameByOrgId'; //门店下拉列表

//数据字典
var checkItemType_getAllOrgExamItemType_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/getAllOrgExamItemType'; //检查项列表
var checkItemType_insertOrgExamItemType_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/insertOrgExamItemType'; //添加检查项
var checkItemType_getOrgExamItemTypeById_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/getOrgExamItemTypeById'; //查看检查项
var checkItemType_updateOrgExamItemType_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/updateOrgExamItemType'; //保存检查项类型
var checkItemType_deleteOrgExamItemType_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/deleteOrgExamItemType'; //删除检查项

var packageType_getOrgExamSuiteTypeList_url = oplatIp + '/br-order-org-plat-controller/examSuiteType/getExamSuiteTypeList'; //套餐类型列表信息
var packageType_addOrgExamSuiteType_url = oplatIp + '/br-order-org-plat-controller/examSuiteType/insertDictExamSuiteType'; // 添加套餐类型
var packageType_deleteExamSuiteType_url = oplatIp + '/br-order-org-plat-controller/examSuiteType/deleteExamSuiteType'; // 删除套餐类型
var packageType_getExamSuiteTypeById_url = oplatIp + '/br-order-org-plat-controller/examSuiteType/getExamSuiteTypeById'; // 查看套餐类型
var packageType_updateExamSuiteType_url = oplatIp + '/br-order-org-plat-controller/examSuiteType/updateExamSuiteType'; // 编辑套餐类型

//用户设置
var getOrgUserManagerByPageUrl = oplatIp + '/br-order-org-plat-controller/orgUserManager/getOrgUserManagerByPage'; //分页获取管理员信息
var insertOrgUserManagerUrl = oplatIp + '/br-order-org-plat-controller/orgUserManager/insertOrgUserManager'; //新增管理用户信息
var updateOrgUserManagerUrl = oplatIp + '/br-order-org-plat-controller/orgUserManager/updateOrgUserManager'; //修改管理用户信息
var deleteOrgUserManagerUrl = oplatIp + '/br-order-org-plat-controller/orgUserManager/deleteOrgUserManager'; //删除管理用户信息
var getOrgUserManagerUrl = oplatIp + '/br-order-org-plat-controller/orgUserManager/getOrgUserManager'; //根据管理用户id查询用户对象
var getNameListByUserIdUrl = oplatIp + '/br-order-org-plat-controller/orgUserManager/getNameListByUserId'; //添加门店或科室
var getOrgUserManagerByUserIdUrl = oplatIp + '/br-order-org-plat-controller/orgUserManager/getOrgUserManagerByUserId'; //根据医生查询用户设置列表信息

//订单
var getCustomerOrderByPageUrl = oplatIp + '/br-order-org-plat-controller/customerOrder/getCustomerOrderByPage'; //展示订单列表
var updateStartExamStatusUrl = oplatIp + '/br-order-org-plat-controller/customerOrder/updateStartExamStatus'; //开始体检
var updateEndExamStatusUrl = oplatIp + '/br-order-org-plat-controller/customerOrder/updateEndExamStatus'; //体检完成
var getCustomerOrderUrl = oplatIp + '/br-order-org-plat-controller/customerOrder/getCustomerOrder'; //查看列表
var orderListInfo_export_url = oplatIp + '/br-order-org-plat-controller/customerOrder/export'; //订单导出

//ajaxoul.js
var init_mec_dele = oplatIp + '/br-order-org-plat-controller/organization/deleteOrganization'; //体检中心-删除
var init_addInformation_judgeParam = oplatIp + '/br-order-org-plat-controller/organization/getOrganizationById'; //基本信息-初始化判断为编辑状态
var init_addInformation_info_level_data = oplatIp + '/br-order-org-plat-controller/organizationLevel/getOrganizationLevelAll'; //基本信息-等级
var init_addInformation_info_province_data = oplatIp + '/br-order-org-plat-controller/dictArea/getAllProvince'; //基本信息-级联-省
var init_addInformation_info_city_data = oplatIp + '/br-order-org-plat-controller/dictArea/getCityByProvinceId'; //基本信息-级联-市
var init_addInformation_info_district_data = oplatIp + '/br-order-org-plat-controller/dictArea/getDistrictByCityId'; //基本信息-级联-区
var init_addInformation_SubmitInform_add = oplatIp + '/br-order-org-plat-controller/organization/insertOrganization'; //基本信息-提交-添加
var init_addInformation_SubmitInform_edit = oplatIp + '/br-order-org-plat-controller/organization/updateOrganization'; //基本信息-提交-编辑

var init_addContact_judgeParam = oplatIp + '/br-order-org-plat-controller/orgConn/getOrgConnByOrgId'; //联系人信息-编辑状态初始化
var init_addContact_postTJ_add = oplatIp + '/br-order-org-plat-controller/orgConn/insertOrganizationConn'; //联系人信息-提交-添加
var init_addContact_delete = oplatIp + '/br-order-org-plat-controller/orgConn/deleteOrgConn'; //联系人信息-删除
var init_addContact_edit_show = oplatIp + '/br-order-org-plat-controller/orgConn/getOrgConnByOrgConnId'; //联系人信息-编辑-显示
var init_addContact_edit = oplatIp + '/br-order-org-plat-controller/orgConn/updateOrgConn'; //联系人信息-编辑

var init_addExam_judgeParam = oplatIp + '/br-order-org-plat-controller/orgIncome/getOrgIncomeByOrgId'; //体检信息-编辑状态初始化
var init_addExam_postTJ_add = oplatIp + '/br-order-org-plat-controller/orgIncome/insertOrgIncome'; //体检信息-提交-添加
var init_addExam_delete = oplatIp + '/br-order-org-plat-controller/orgIncome/deleteOrgIncome'; //体检信息-删除
var init_addExam_edit_show = oplatIp + '/br-order-org-plat-controller/orgIncome/getOrgIncomeByIncomeId'; //体检信息-编辑-显示
var init_addExam_edit = oplatIp + '/br-order-org-plat-controller/orgIncome/updateOrgIncome'; //体检信息-编辑

var init_addsoftware_judgeParam = oplatIp + '/br-order-org-plat-controller/orgSoft/getOrgSoftByOrgId'; //软件信息-编辑状态初始化
var init_addsoftware_postTJ_add = oplatIp + '/br-order-org-plat-controller/orgSoft/insertOrgSoft'; //软件信息-提交-添加
var init_addsoftware_delete = oplatIp + '/br-order-org-plat-controller/orgSoft/deleteOrgSoft'; //软件信息-删除
var init_addsoftware_edit_show = oplatIp + '/br-order-org-plat-controller/orgSoft/getOrgSoftBySoftId'; //软件信息-编辑-显示
var init_addsoftware_edit = oplatIp + '/br-order-org-plat-controller/orgSoft/updateOrgSoft'; //软件信息-编辑

var init_addInvest_judgeParam = oplatIp + '/br-order-org-plat-controller/orgInvest/getOrgInvestByOrgId'; //投资信息-编辑状态初始化
var init_addInvest_postTJ_add = oplatIp + '/br-order-org-plat-controller/orgInvest/insertOrgInvest'; //投资信息-提交-添加
var init_addInvest_delete = oplatIp + '/br-order-org-plat-controller/orgInvest/deleteOrgInvest'; //投资信息-删除
var init_addInvest_edit_show = oplatIp + '/br-order-org-plat-controller/orgInvest/getOrgInvestByInvestId'; //投资信息-编辑-显示
var init_addInvest_edit = oplatIp + '/br-order-org-plat-controller/orgInvest/updateOrgInvest'; //投资信息-编辑

var init_addVist_judgeParam = oplatIp + '/br-order-org-plat-controller/orgVisit/getOrgVisitByOrgId'; //拜访信息-编辑状态初始化
var init_addVist_postTJ_add = oplatIp + '/br-order-org-plat-controller/orgVisit/insertOrgVisit'; //拜访信息-提交-添加
var init_addVist_delete = oplatIp + '/br-order-org-plat-controller/orgVisit/deleteOrgVisit'; //拜访信息-删除
var init_addVist_edit_show = oplatIp + '/br-order-org-plat-controller/orgVisit/getOrgVisitByVisitId'; //拜访信息-编辑-显示
var init_addVist_edit = oplatIp + '/br-order-org-plat-controller/orgVisit/updateOrgVisit'; //拜访信息-编辑

var init_addCooperation_show = oplatIp + '/br-order-org-plat-controller/orgCooperation/getOrgCooperationByOrgId'; //合作意向信息
var init_addCooperation_edit = oplatIp + '/br-order-org-plat-controller/orgCooperation/updateOrgCooperation'; //合作意向修改
var init_addWarp_show = oplatIp + '/br-order-org-plat-controller/orgWeb/getOrgWebByOrgId'; //公共账号信息
var init_addCooperation_save = oplatIp + '/br-order-org-plat-controller/orgWeb/updateOrgWeb'; //公共账号保存信息
var init_checkorginform_show = oplatIp + '/br-order-org-plat-controller/organization/getOrgAllInfoById'; //查看所有信息

var user_actor_delete = oplatIp + '/br-order-org-plat-controller/roleManage/deleteBrRole'; //角色列表-删除
var user_actor_postTJ = oplatIp + '/br-order-org-plat-controller/roleManage/addBrRole'; //角色列表-添加
var user_actor_edit_show = oplatIp + '/br-order-org-plat-controller/roleManage/getRoleOne'; //角色列表-编辑-显示
var user_actor_edit = oplatIp + '/br-order-org-plat-controller/roleManage/updateBrRole'; //角色列表-编辑

var actorPower_getBrpermissionIdList_url = oplatIp + '/br-order-org-plat-controller/permissionManager/getBrOperationListByIdAndOpen'; //角色分配权限
var actorPower_getBrroleIdList_url = oplatIp + '/br-order-org-plat-controller/roleManage/getPermissionAndOperationByIdAndOpen'; //角色分配权限-页面加载
var savePermissionUrl = oplatIp + '/br-order-org-plat-controller/roleManage/savePermission'; //角色分配权限--选中提交
var getPermissionAndOperationByIdAndOpenUrl = oplatIp + '/br-order-org-plat-controller/roleManage/getPermissionAndOperationByIdAndOpen'; //根据角色获取权限树
var getBrOperationListByIdUrl = oplatIp + '/br-order-org-plat-controller/permissionManager/getBrOperationListById'; //根据权限id获取操作列表
var insertPermissionUrl = oplatIp + '/br-order-org-plat-controller/permissionManager/insertPermission'; //新增权限
var updatePermissionByUrl = oplatIp + '/br-order-org-plat-controller/permissionManager/updatePermissionById'; //更新权限
var addBrOperationByPermissionId = oplatIp + '/br-order-org-plat-controller/permissionManager/addBrOperationByPermissionId'; //根据权限id添加操作
var updateBrOperationUrl = oplatIp + '/br-order-org-plat-controller/permissionManager/updateBrOperation'; //更新操作数据
var getBrOperationByIdUrl = oplatIp + '/br-order-org-plat-controller/permissionManager/getBrOperationById'; //根据操作id回显数据

var deletePermissionByIdUrl = oplatIp + '/br-order-org-plat-controller/permissionManager/deletePermissionOrOperation';
var getBrPermissionByIdUrl = oplatIp + '/br-order-org-plat-controller/permissionManager/getBrPermissionById';
var getPermissionListUrl = oplatIp + '/br-order-org-plat-controller/permissionManager/getPermissionList';

var mec_check_edit = oplatIp + '/br-order-org-plat-controller/organization/reviewOrganization'; //体检中心-修改审核信息

var uploadImagesUrl = oplatIp + '/br-order-org-plat-controller/uploadImg/uploadImg'; //注册页面上传图片路径
var orgRegister = oplatIp + '/br-order-org-plat-controller/registerOrg/insertOrgInfo'; //注册页面
var RegisterTextUserName = oplatIp + '/br-order-org-plat-controller/registerOrg/getCountByUserName'; //校验登录名是否重复

var packAgeSearchOul = oplatIp + '/br-order-org-plat-controller/orgExamSuite/getOrgExamSuite'; //套餐列表
var userPagination_init = oplatIp + '/br-order-org-plat-controller/userManage/getUserByPage?page=1'; //用户页面分页初始化
var userPagination = oplatIp + '/br-order-org-plat-controller/userManage/getUserByPage'; //用户页面分页
var getUserByPageUrl = oplatIp + '/br-order-org-plat-controller/userManage/getUserByPage'; //用户页面分页
var userActorPagination_init = oplatIp + '/br-order-org-plat-controller/roleManage/list?page=1&rows=10'; //角色页面分页初始化
var userActorPagination = oplatIp + '/br-order-org-plat-controller/roleManage/list'; //角色页面分页

var org_exam_item_user_save = oplatIp + '/br-order-org-plat-controller/orgExamItemUser/saveOrgExamItemUser'; //医生绑定检查项id
var org_exam_item_user_view = oplatIp + '/br-order-org-plat-controller/orgExamItemUser/getOrgExamItemUser' //获取医生绑定检查项id
var org_exam_item_user_del = oplatIp + '/br-order-org-plat-controller/orgExamItemUser/deleteOrgExamItemUser' //获取医生绑定检查项id

var packAge_Dele = oplatIp + '/br-order-org-plat-controller/orgExamSuite/delectOrgExamSuite'; //删除套餐
var packAge_Add = oplatIp + '/br-order-org-plat-controller/orgExamSuite/addOrgExamSuite'; //添加套餐
var packAge_show = oplatIp + '/br-order-org-plat-controller/orgExamSuite/getOrgExamSuiteById'; //套餐内容显示
var packAge_edit = oplatIp + '/br-order-org-plat-controller/orgExamSuite/updateOrgExamSuite'; //套餐内容编辑
var dict_hid_view = oplatIp + '/br-order-org-plat-controller/highIncidenceDisease/getHighIncidenceDiseaseList' //查看高发疾病表
var dict_hid_view_all = oplatIp + '/br-order-org-plat-controller/highIncidenceDisease/getHighIncidenceDiseases' //查看高发疾病不分页
var dict_suite_type_view = oplatIp + '/br-order-org-plat-controller/examSuiteType/getExamSuiteTypeList' //查看套餐类型字典表	
var dict_suite_type_view_all = oplatIp + '/br-order-org-plat-controller/examSuiteType/getExamSuiteTypes' //查看套餐类型字典表	不分页

var get_invalid_branch_url = oplatIp + '/br-order-org-plat-controller/orgBranch/getOrganizationBranch'; //获取可用门店
var packAge_SelectPackage = oplatIp + '/br-order-org-plat-controller/orgBranchSuite/insertOrgBranchSuite'; //门店选择套餐
var packAge_DelePackage = oplatIp + '/br-order-org-plat-controller/orgBranchSuite/delectOrgBranchSuiteById'; //门店选择套餐删除
var StorePack_init_show = oplatIp + '/br-order-org-plat-controller/orgBranchSuite/getOrgBranchSuiteList'; //门店套餐管理页面——列表
var storePack_select_suites = oplatIp + '/br-order-org-plat-controller/orgBranchSuite/getSelectSuiteByBranchId'; //门店已选择的套餐
var branch_rest_by_branchId = oplatIp + '/br-order-org-plat-controller/orgRest/getOrganizationRestById'; //门店休息日列表
var branch_rest_add = oplatIp + '/br-order-org-plat-controller/orgRest/insertOrganizationRest'; //门店休息日添加
var branch_rest_del = oplatIp + '/br-order-org-plat-controller/orgRest/deleteOrganizationRestById'; //门店休息日删除
var branch_rest_update = oplatIp + '/br-order-org-plat-controller/orgRest/updateOrganizationRest'; //门店休息日更新

var organizationInfoUrl = oplatIp + '/br-order-org-plat-controller/organization/getOrganizationById'; //体检机构信息和联系人信息

var getOrganizationByIdUrl = oplatIp + '/br-order-org-plat-controller/organization/getOrganizationById'; //根据机构id查询机构和联系人信息
var getBrUserByIdUrl = oplatIp + '/br-order-org-plat-controller/userManage/getBrUserById'; //根据id获取用户信息
var updateBrUserUrl = oplatIp + '/br-order-org-plat-controller/userManage/updateBrUser'; //修改用户信息
var insertBrUserUrl = oplatIp + '/br-order-org-plat-controller/userManage/insertBrUser'; //新增用户信息
var deleteBrUserUrl = oplatIp + '/br-order-org-plat-controller/userManage/deleteBrUser'; //删除用户信息

var getOrgExamFeeItemByPageUrl = oplatIp + '/br-order-org-plat-controller/OrgExamFeeItem/getOrgExamFeeItemByPage'; //分页获取收费项目列表
var getOrgExamFeeItemByIdUrl = oplatIp + '/br-order-org-plat-controller/OrgExamFeeItem/getOrgExamFeeItemById'; //根据id获取收费项信息
var updateOrgExamFeeItemUrl = oplatIp + '/br-order-org-plat-controller/OrgExamFeeItem/updateOrgExamFeeItem'; //更新收费项信息
var insertOrgExamFeeItemUrl = oplatIp + '/br-order-org-plat-controller/OrgExamFeeItem/insertOrgExamFeeItem'; //新增收费项信息
var deleteOrgExamFeeItemByIdUrl = oplatIp + '/br-order-org-plat-controller/OrgExamFeeItem/deleteOrgExamFeeItemById'; //删除收费项信息
var getAllOrganizationDeptUrl = oplatIp + '/br-order-org-plat-controller/OrganizationDept/getAllOrganizationDept'; //获取所有科室列表
var insertOrgExamFeeItemDetailUrl = oplatIp + '/br-order-org-plat-controller/orgExamFeeItemDetail/insertOrgExamFeeItemDetail'; //将收费项与多条检查项建立关联
var insertOrgExamFeeItemSuiteUrl = oplatIp + '/br-order-org-plat-controller/orgExamFeeItemSuite/batchInsertOrgExamFeeItemSuite'; //将套餐与收费项建立关联
var dept_getOrgUserByBranchId_url = oplatIp + '/br-order-org-plat-controller/organizationUser/getOrgUserByBranchId'; //科室负责人

var getOrgExamItemByPageUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/getOrgExamItemByPage'; //分页获取体检项列表
var getOrgExamItemByIdUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/getOrgExamItemById'; //根据id获取体检项信息
var updateOrgExamItemUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/updateOrgExamItem'; //更新体检项信息
var insertOrgExamItemUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/insertOrgExamItem'; //新增体检项信息
var deleteOrgExamItemUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/deleteOrgExamItem'; //删除体检项
var getAllOrgExamItemTypeUrl = oplatIp + '/br-order-org-plat-controller/orgExamItemType/getAllOrgExamItemType'; //获取所有体检项目类型
var getOrgExamFeeItemBySIdUrl = oplatIp + '/br-order-org-plat-controller/OrgExamFeeItem/getOrgExamFeeItemBySId'; //根据套餐id获得该套餐的收费项信息
var getOrgExamItemByFeeItemUrl = oplatIp + '/br-order-org-plat-controller/orgExamFeeItemDetail/getOrgExamFeeItemDetailByPage'; //根据收费项id获得该收费项下的检查项信息
var getAllOrgExamItemByFeeItemUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/getAllOrgExamItemByFeeItem'; //获取所有体检项并根据收费项id所属体检项打钩
var getOrgExamFeeItemBySuitIdUrl = oplatIp + '/br-order-org-plat-controller/orgExamSuite/getOrgExamFeeItemBySuitId'; //获取所有收费项并根据套餐id所属收费项打钩
var getOrgExamItemValueByIdUrl = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/getOrgExamItemValueById'; //根据体检项信息查询对应体征词
var org_exam_feeItem_detail_delete = oplatIp + '/br-order-org-plat-controller/orgExamFeeItemDetail/deleteOrgExamFeeItemDetail' //收费项删除绑定的检查项	

//阀值设置
var liminal_value_branch = oplatIp + '/br-order-org-plat-controller/liminalValue/getOrganizationBranchLimitPeople'; //门店阀值列表
var liminal_value_branch_setting = oplatIp + '/br-order-org-plat-controller/liminalValue/updateOrgBranchLimitPeople'; //门店阀值修改
var liminal_value_suite = oplatIp + '/br-order-org-plat-controller/liminalValue/getOrgExamSuiteLimitPeople'; //套餐阀值列表
var liminal_value_suite_setting = oplatIp + '/br-order-org-plat-controller/liminalValue/updateOrgExamSuiteLimitPeople' //套餐阀值修改

//消费记录
var recordsOfConsumption_getCustomerOrderPayInfoByPage_url = oplatIp + '/br-order-org-plat-controller/payInfo/getPayInfoByPage'; //消费记录
var recordsOfConsumption_getCustomerOrderPayInfo_url = oplatIp + '/br-order-org-plat-controller/payInfo/getPayInfo'; //查看消费记录信息
var recordsOfConsumption_export_url = oplatIp + '/br-order-org-plat-controller/payInfo/export'; //支付导出

//首页内容展示页面
var getAllSuiteByOrgUrl = oplatIp + '/br-order-org-plat-controller/orgExamSuite/getSuiteList'; //根据机构获取所有套餐
var getAllBranchByOrgUrl = oplatIp + '/br-order-org-plat-controller/firstData/getOrgbanchListByOrg'; //根据机构获取所有门店

var getOrganizationListUrl = oplatIp + '/br-order-org-plat-controller/firstData/getOrganizationList'; //首页展示查询机构名称
var showFirstDataUrl = oplatIp + '/br-order-org-plat-controller/firstData/showFirstData'; //分页展示数据
var deleteShowFirstDataUrl = oplatIp + '/br-order-org-plat-controller/firstData/deleteShowFirstData'; //删除
var saveShowFirstDataurl = oplatIp + '/br-order-org-plat-controller/firstData/saveShowFirstData'; //编辑保存图片

//首页 图片展示
var pictureShow_getImgById_url = oplatIp + '/br-order-org-plat-controller/firstImgData/getImgById'; //获取所有图片
var pictureShow_getImgIndex_url = oplatIp + '/br-order-org-plat-controller/firstImgData/getImgIndex'; //获取门店图片位置
var pictureShow_addFirstImgData_url = oplatIp + '/br-order-org-plat-controller/firstImgData/addFirstImgData'; //新增图片接口
var pictureShow_showFirstImgDataList_url = oplatIp + '/br-order-org-plat-controller/firstImgData/showFirstImgDataList'; //获取图片列表信息
var pictureShow_getFirstImgDataById_url = oplatIp + '/br-order-org-plat-controller/firstImgData/getFirstImgDataById'; //查看图片详细信息
var pictureShow_deleteFirstImgData_url = oplatIp + '/br-order-org-plat-controller/firstImgData/deleteFirstImgData'; //删除图片信息
var pictureShow_updateFirstImgData_url = oplatIp + '/br-order-org-plat-controller/firstImgData/updateFirstImgData'; //保存修改图片信息

//年龄分组
var ageGroup_addDictAgeGroup_url = oplatIp + '/br-order-org-plat-controller/dictagegroup/addDictAgeGroup'; //职业分组-添加
var ageGroup_deleteDictagegroup_url = oplatIp + '/br-order-org-plat-controller/dictagegroup/deleteDictagegroup'; //职业分组-删除
var ageGroup_getAllDictagegroup_url = oplatIp + '/br-order-org-plat-controller/dictagegroup/getAllDictagegroup'; //职业分组-查看
var ageGroup_getDictAgeGroupById_url = oplatIp + '/br-order-org-plat-controller/dictagegroup/getDictAgeGroupById'; //职业分组-回显
var ageGroup_updateDictagegroup_url = oplatIp + '/br-order-org-plat-controller/dictagegroup/updateDictagegroup'; //职业分组-编辑

//年龄单位
var ageunit_getAllDictageunit_url = oplatIp + '/br-order-org-plat-controller/dictAgeUnitManage/getAllDictageunit'; //年龄单位-获取全都列表内容显示
var ageunit_addDictAgeUnit_url = oplatIp + '/br-order-org-plat-controller/dictAgeUnitManage/addDictAgeUnit'; //年龄单位-添加
var ageunit_deleteDictageunit_url = oplatIp + '/br-order-org-plat-controller/dictAgeUnitManage/deleteDictageunit'; //年龄单位-删除
var ageunit_updateDictageunit_url = oplatIp + '/br-order-org-plat-controller/dictAgeUnitManage/updateDictageunit'; //年龄单位-修改
var ageunit_getDictAgeUnitById_url = oplatIp + '/br-order-org-plat-controller/dictAgeUnitManage/getDictAgeUnitById'; //年龄单位-回显

//地区
var areaMaintenance_getAreaByPage_url = oplatIp + '/br-order-org-plat-controller/dictArea/getAreaByPage'; //字典维护下的地区展示所有地区信息

//民族
var dictNation_getAllNation_url = oplatIp + '/br-order-org-plat-controller/dictNationManage/getAllNation'; //字典维护   民族信息全部显示
var dictNation_addNation_url = oplatIp + '/br-order-org-plat-controller/dictNationManage/addNation'; //字典维护   民族信息添加
var dictNation_deleteDictNation_url = oplatIp + '/br-order-org-plat-controller/dictNationManage/deleteDictNation'; //字典维护   民族信息删除
var dictNation_getNationById_url = oplatIp + '/br-order-org-plat-controller/dictNationManage/getNationById'; //字典维护   民族信息回显
var dictNation_updateNation_url = oplatIp + '/br-order-org-plat-controller/dictNationManage/updateNation'; //字典维护   民族信息编辑

//国家
var countryMaintenance_countryManage_getList_url = oplatIp + '/br-order-org-plat-controller/countryManage/getList'; //字典维护下面   国家列表全部信息显示
var countryMaintenance_addCountry_url = oplatIp + '/br-order-org-plat-controller/countryManage/addCountry'; //添加国家信息
var countryMaintenance_deleteCountry_url = oplatIp + '/br-order-org-plat-controller/countryManage/deleteCountry'; //删除国家信息
var countryMaintenance_getCountryById_url = oplatIp + '/br-order-org-plat-controller/countryManage/getCountryById'; //编辑回显国家详细信息
var countryMaintenance_updateCountry_url = oplatIp + '/br-order-org-plat-controller/countryManage/updateCountry'; //保存编辑国家信息的内容
var countryMaintenance_checkCountryName_url = oplatIp + '/br-order-org-plat-controller/countryManage/checkCountryName'; //验证国家名称是否存在
var countryMaintenance_checkCountryCode_url = oplatIp + '/br-order-org-plat-controller/countryManage/checkCountryCode'; //验证国家代码是否存在
var countryMaintenance_checkCountryInputCode_url = oplatIp + '/br-order-org-plat-controller/countryManage/checkCountryInputCode'; //验证国家输入码是否存在
var countryMaintenance_checkCountryLineOrder_url = oplatIp + '/br-order-org-plat-controller/countryManage/checkCountryLineOrder'; //验证国家行序是否存在

//血型
var bloodType_getAllBloodType_url = oplatIp + '/br-order-org-plat-controller/bloodTypeManage/getAllBloodType'; //字典维护下的血型 展示所有血型信息
var bloodType_addBloodType_url = oplatIp + '/br-order-org-plat-controller/bloodTypeManage/addBloodType'; //添加血型信息
var bloodType_deleteBloodType_url = oplatIp + '/br-order-org-plat-controller/bloodTypeManage/deleteBloodType'; //删除血型信息
var bloodType_getBloodTypeById_url = oplatIp + '/br-order-org-plat-controller/bloodTypeManage/getBloodTypeById'; //编辑回显血型详细信息
var bloodType_updateBloodType_url = oplatIp + '/br-order-org-plat-controller/bloodTypeManage/updateBloodType'; //保存编辑血型信息内容

//性别
var sex_getDictSexList_url = oplatIp + '/br-order-org-plat-controller/dictsex/getDictsexList'; //字典表性别-显示
var sex_addDictSexLIST_url = oplatIp + '/br-order-org-plat-controller/dictsex/addDictsex'; //字典表性别列表-添加
var sex_getDictSexById_url = oplatIp + '/br-order-org-plat-controller/dictsex/getDictsexById'; //字典表性别列表-查看
var sex_updateDictSex_url = oplatIp + '/br-order-org-plat-controller/dictsex/updateDictsex'; //字典表性别列表-修改
var sex_deleteDictSex_url = oplatIp + '/br-order-org-plat-controller/dictsex/deleteDictsex'; //字典表性别列表-删除

//婚姻状况
var maritalStatus_addMarriage_url = oplatIp + '/br-order-org-plat-controller/marriageManage/addMarriage'; //婚姻状况-添加
var maritalStatus_deleteMarriage_url = oplatIp + '/br-order-org-plat-controller/marriageManage/deleteMarriage'; //婚姻状况-删除
var maritalStatus_getMarriageById_url = oplatIp + '/br-order-org-plat-controller/marriageManage/getMarriageById'; //婚姻状况-回显
var maritalStatus_getMarriageList_url = oplatIp + '/br-order-org-plat-controller/marriageManage/getMarriageList'; //婚姻状况-查看
var maritalStatus_updateMarriage_url = oplatIp + '/br-order-org-plat-controller/marriageManage/updateMarriage'; //婚姻状况-编辑

//人际关系
var interpersonalRelation_getDictrelationshipList_url = oplatIp + '/br-order-org-plat-controller/dictrelationship/getDictrelationshipList'; //字典维护人际关系全部信息
var interpersonalRelation_addDictrelationship_url = oplatIp + '/br-order-org-plat-controller/dictrelationship/addDictrelationship'; //添加人际关系
var interpersonalRelation_deleteDictrelationship_url = oplatIp + '/br-order-org-plat-controller/dictrelationship/deleteDictrelationship'; //删除人际关系
var interpersonalRelation_getDictrelationshipById_url = oplatIp + '/br-order-org-plat-controller/dictrelationship/getDictrelationshipById'; //查看人际关系详细信息
var interpersonalRelation_updateDictrelationship_url = oplatIp + '/br-order-org-plat-controller/dictrelationship/updateDictrelationship'; //保存人际关系修改

//教育程度
var education_addEducation_url = oplatIp + '/br-order-org-plat-controller/educationManage/addEducation'; //教育程度-添加
var education_deleteEducation_url = oplatIp + '/br-order-org-plat-controller/educationManage/deleteEducation'; //教育程度-删除
var education_getEducationById_url = oplatIp + '/br-order-org-plat-controller/educationManage/getEducationById'; //教育程度-回显
var education_getEducationList_url = oplatIp + '/br-order-org-plat-controller/educationManage/getEducationList'; //教育程度-查看
var education_updateEducation_url = oplatIp + '/br-order-org-plat-controller/educationManage/updateEducation'; //教育程度-编辑

//职业类别
var jobClass_addJobClass_url = oplatIp + '/br-order-org-plat-controller/jobclassManage/addJobClass'; //职业类别-添加
var jobClass_deleteJobClass_url = oplatIp + '/br-order-org-plat-controller/jobclassManage/deleteJobClass'; //职业类别-删除
var jobClass_getJobClassById_url = oplatIp + '/br-order-org-plat-controller/jobclassManage/getJobClassById'; //职业类别-回显
var jobClass_getJobClassList_url = oplatIp + '/br-order-org-plat-controller/jobclassManage/getJobClassList'; //职业类别-查看
var jobClass_updateJobClass_url = oplatIp + '/br-order-org-plat-controller/jobclassManage/updateJobClass'; //职业类别-编辑

//发票类型
var receiptType_getDictreceipttypeList_url = oplatIp + '/br-order-org-plat-controller/dictreceipttype/getDictreceipttypeList'; //发票类型页面-查看
var receiptType_addDictreceipttype_url = oplatIp + '/br-order-org-plat-controller/dictreceipttype/addDictreceipttype'; //发票类型页面-添加
var receiptType_getDictreceipttypeById_url = oplatIp + '/br-order-org-plat-controller/dictreceipttype/getDictreceipttypeById'; //发票类型页面-回显
var receiptType_updateDictreceipttype_url = oplatIp + '/br-order-org-plat-controller/dictreceipttype/updateDictreceipttype'; //发票类型页面-编辑
var receiptType_deleteDictreceipttype_url = oplatIp + '/br-order-org-plat-controller/dictreceipttype/deleteDictreceipttype'; //发票类型页面-删除

//支付方式
var payWay_getDictpaywayList_url = oplatIp + '/br-order-org-plat-controller/dictpayway/getDictpaywayList'; //支付方式-查看所有
var payWay_addDictpayway_url = oplatIp + '/br-order-org-plat-controller/dictpayway/addDictpayway'; //支付方式-添加页面信息
var payWay_deleteDictpayway_url = oplatIp + '/br-order-org-plat-controller/dictpayway/deleteDictpayway'; //支付方式-删除
var payWay_getDictpaywayById_url = oplatIp + '/br-order-org-plat-controller/dictpayway/getDictpaywayById'; //支付方式-回显
var payWay_updateDictpayway_url = oplatIp + '/br-order-org-plat-controller/dictpayway/updateDictpayway'; //支付方式-编辑

//业务字典
//检查项类型
var checkItemType_getAllOrgExamItemType_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/getAllOrgExamItemType'; //检查项列表
var checkItemType_insertOrgExamItemType_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/insertOrgExamItemType'; //添加检查项
var checkItemType_getOrgExamItemTypeById_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/getOrgExamItemTypeById'; //查看检查项
var checkItemType_updateOrgExamItemType_url = oplatIp + '/br-order-org-plat-controller/orgExamItemType/updateOrgExamItemType'; //保存检查项类型
var checkItemType_deleteOrgExamItemType_url = oplatIp + 'oplatIporgExamItemType/deleteOrgExamItemType'; //删除检查项

//体检机构等级
var examinationOrganizationLevel_getAllOrgLevel_url = oplatIp + '/br-order-org-plat-controller/orgLevel/getAllOrgLevel'; //字典维护  体检机构等级
var examinationOrganizationLevel_insertOrgLevel_url = oplatIp + '/br-order-org-plat-controller/orgLevel/insertOrgLevel'; //添加机构等级
var examinationOrganizationLevel_deleteOrgLevel_url = oplatIp + '/br-order-org-plat-controller/orgLevel/deleteOrgLevel'; //删除机构等级
var examinationOrganizationLevel_geOrgLevelById_url = oplatIp + '/br-order-org-plat-controller/orgLevel/geOrgLevelById'; //查看机构等级
var examinationOrganizationLevel_updateOrgLevel_url = oplatIp + '/br-order-org-plat-controller/orgLevel/updateOrgLevel '; //更新机构等级

//套餐类型
var packageType_getOrgExamSuiteTypeList_url = oplatIp + '/br-order-org-plat-controller/orgExamSuiteType/getOrgExamSuiteTypeList'; //套餐类型列表信息
var packageType_addOrgExamSuiteType_url = oplatIp + '/br-order-org-plat-controller/orgExamSuiteType/addOrgExamSuiteType'; // 添加套餐类型
var packageType_deleteExamSuiteType_url = oplatIp + '/br-order-org-plat-controller/orgExamSuiteType/deleteExamSuiteType'; // 删除套餐类型
var packageType_getExamSuiteTypeById_url = oplatIp + '/br-order-org-plat-controller/orgExamSuiteType/getExamSuiteTypeById'; // 查看套餐类型
var packageType_updateExamSuiteType_url = oplatIp + '/br-order-org-plat-controller/orgExamSuiteType/updateExamSuiteType'; // 编辑套餐类型

//检查项
var getOrgExamItemByPageUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/getOrgExamItemByPage'; //分页获取体检项列表
var getOrgExamItemByIdUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/getOrgExamItemById'; //根据id获取体检项信息回显
var updateOrgExamItemUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/updateOrgExamItem'; //更新体检项信息
var insertOrgExamItemUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/insertOrgExamItem'; //新增体检项信息
var deleteOrgExamItemUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/deleteOrgExamItem'; //删除体检项
var getUserUrl = oplatIp + '/br-order-org-plat-controller/orgExamItem/getUserByItemId'; //根据体检项查询医生信息
var org_exam_item_user_save = oplatIp + '/br-order-org-plat-controller/orgExamItemUser/saveOrgExamItemUser'; //医生绑定检查项id
var org_exam_item_user_view = oplatIp + '/br-order-org-plat-controller/orgExamItemUser/getOrgExamItemUser' //获取医生绑定检查项id
var org_exam_item_user_del = oplatIp + '/br-order-org-plat-controller/orgExamItemUser/deleteOrgExamItemUser' //获取医生绑定检查项id

//结论词类型
var conclusionWordType_getConclusionTypeList_url = oplatIp + '/br-order-org-plat-controller/dictConclusionType/getConclusionTypeList'; //结论词类型
var conclusionWordType_addConclusionType_url = oplatIp + '/br-order-org-plat-controller/dictConclusionType/addConclusionType'; //添加结论词类型
var conclusionWordType_deleteConclusionType_url = oplatIp + '/br-order-org-plat-controller/dictConclusionType/deleteConclusionType'; //删除结论词类型
var conclusionWordType_getConclusionTypeById_url = oplatIp + '/br-order-org-plat-controller/dictConclusionType/getConclusionTypeById'; //查看结论词类型
var conclusionWordType_updateConclusionType_url = oplatIp + '/br-order-org-plat-controller/dictConclusionType/updateConclusionType'; //保存结论词类型

//结论词科室类型
var conclusionWordType_getConclusionDeptTypeList_url = oplatIp + '/br-order-org-plat-controller/dictConclusionDeptType/getConclusionDeptTypeList'; //结论词科室类型
var conclusionWordType_addConclusionDeptType_url = oplatIp + '/br-order-org-plat-controller/dictConclusionDeptType/addConclusionDeptType'; //添加结论词科室类型
var conclusionWordType_deleteConclusionDeptType_url = oplatIp + '/br-order-org-plat-controller/dictConclusionDeptType/deleteConclusionDeptType'; //删除结论词科室类型
var conclusionWordType_getConclusionDeptTypeById_url = oplatIp + '/br-order-org-plat-controller/dictConclusionDeptType/getConclusionDeptTypeById'; //查看结论词科室类型
var conclusionWordType_updateConclusionDeptType_url = oplatIp + '/br-order-org-plat-controller/dictConclusionDeptType/updateConclusionDeptType'; //保存结论词科室类型

//结论词分组
var conclusionWordType_getConclusionGroupList_url = oplatIp + '/br-order-org-plat-controller/dictConclusionGroup/getConclusionGroupList'; //结论词结果
var conclusionWordType_addConclusionGroup_url = oplatIp + '/br-order-org-plat-controller/dictConclusionGroup/addConclusionGroup'; //添加结论词结果
var conclusionWordType_deleteConclusionGroup_url = oplatIp + '/br-order-org-plat-controller/dictConclusionGroup/deleteConclusionGroup'; //删除结论词结果
var conclusionWordType_getConclusionGroupById_url = oplatIp + '/br-order-org-plat-controller/dictConclusionGroup/getConclusionGroupById'; //查看结论词结果
var conclusionWordType_updateConclusionGroup_url = oplatIp + '/br-order-org-plat-controller/dictConclusionGroup/updateConclusionGroup'; //保存结论词结果

//结论词结果分类
var conclusionWordType_getConclusionResultClassList_url = oplatIp + '/br-order-org-plat-controller/dictConclusionResultClass/getConclusionResultClassList'; //结论词分组
var conclusionWordType_addConclusionResultClass_url = oplatIp + '/br-order-org-plat-controller/dictConclusionResultClass/addConclusionResultClass'; //添加结论词分组
var conclusionWordType_deleteConclusionResultClass_url = oplatIp + '/br-order-org-plat-controller/dictConclusionResultClass/deleteConclusionResultClass'; //删除结论词分组
var conclusionWordType_getConclusionResultClassById_url = oplatIp + '/br-order-org-plat-controller/dictConclusionResultClass/getConclusionResultClassById'; //查看结论词分组
var conclusionWordType_updateConclusionResultClass_url = oplatIp + '/br-order-org-plat-controller/dictConclusionResultClass/updateConclusionResultClass'; //保存结论词分组

//结论词
var conclusionWordType_getConclusionList_url = oplatIp + '/br-order-org-plat-controller/dictConclusion/getConclusionList'; //结论词
var conclusionWordType_addConclusion_url = oplatIp + '/br-order-org-plat-controller/dictConclusion/addConclusion'; //添加结论词
var conclusionWordType_deleteConclusion_url = oplatIp + '/br-order-org-plat-controller/dictConclusion/deleteConclusion'; //删除结论词
var conclusionWordType_getConclusionById_url = oplatIp + '/br-order-org-plat-controller/dictConclusion/getConclusionById'; //查看结论词
var conclusionWordType_updateConclusion_url = oplatIp + '/br-order-org-plat-controller/dictConclusion/updateConclusion'; //保存结论词

//体征词
var signWord_getConclusionType_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/getOrgExamItemValueByPage'; //体征词列表信息
var signWord_insertOrgExamItemValue_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/insertOrgExamItemValue'; //添加体征词信息
var signWord_deleteOrgExamItemValue_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/deleteOrgExamItemValue'; //删除体征词信息
var signWord_getOrgExamItemValueById_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/getOrgExamItemValueById'; //获取体征词信息
var signWord_updateOrgExamItemValue_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/updateOrgExamItemValue'; //保存修改后的体征词信息

//高发疾病
var highIncidenceOfDisease_getHighIncidenceDiseaseList_url = oplatIp + '/br-order-org-plat-controller/highIncidenceDisease/getHighIncidenceDiseaseList'; // 高发疾病列表信息
var highIncidenceOfDisease_addhighIncidenceDisease_url = oplatIp + '/br-order-org-plat-controller/highIncidenceDisease/addhighIncidenceDisease'; // 添加高发疾病信息
var highIncidenceOfDisease_deleteHighIncidenceDisease_url = oplatIp + '/br-order-org-plat-controller/highIncidenceDisease/deleteHighIncidenceDisease'; // 删除高发疾病信息
var highIncidenceOfDisease_gethighIncidenceDiseaseById_url = oplatIp + '/br-order-org-plat-controller/highIncidenceDisease/gethighIncidenceDiseaseById'; // 查看高发疾病信息
var highIncidenceOfDisease_updateHighIncidenceDisease_url = oplatIp + '/br-order-org-plat-controller/highIncidenceDisease/updateHighIncidenceDisease'; // 更新高发疾病信息

//所有检查项
signWord_getExamItemName_url = oplatIp + '/br-order-org-plat-controller/orgExamItemValue/getExamItemName'; //获取所有检查项

//结论词
var conclusionWordType_getConclusionType_url = oplatIp + '/br-order-org-plat-controller/dictConclusionType/getConclusionType'; //结论词科室类型全部信息
var conclusionWordType_getConclusionDeptType_url = oplatIp + '/br-order-org-plat-controller/dictConclusionDeptType/getConclusionDeptType'; //结论词科室类型全部信息
var conclusionWordType_getConclusionGroup_url = oplatIp + '/br-order-org-plat-controller/dictConclusionGroup/getConclusionGroup'; //结论词分组全部信息
var conclusionWordType_getConclusionResultClass_url = oplatIp + '/br-order-org-plat-controller/dictConclusionResultClass/getConclusionResultClass'; //结论词结果全部信息

//科室类型
var departmentType_selectDeptTypeList_url = oplatIp + '/br-order-org-plat-controller/dictDeptTypeManage/selectDeptTypeList'; //字典维护 科室信息列表
var departmentType_addDeptType_url = oplatIp + '/br-order-org-plat-controller/dictDeptTypeManage/addDeptType'; //添加科室
var departmentType_getDeptTypeById_url = oplatIp + '/br-order-org-plat-controller/dictDeptTypeManage/getDeptTypeById'; //查看科室
var departmentType_deleteDeptType_url = oplatIp + '/br-order-org-plat-controller/dictDeptTypeManage/deleteDeptType'; //删除科室
var departmentType_updateDeptType_url = oplatIp + '/br-order-org-plat-controller/dictDeptTypeManage/updateDeptType'; //保存科室