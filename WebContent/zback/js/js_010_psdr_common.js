/**
 * ars common java script file
 */

// jquery init function

$(function () {

	toastMessage();

	var errorMessage = $("#errorMessage").val();
	var successMessage = $("#successMessage").val();

	if (null != errorMessage && "" != errorMessage) {
		modalMessage(errorMessage, "Error", "error");
	}

	if (null != successMessage && "" != successMessage) {
		modalMessage(successMessage, "Success", "success");
	}

	// set title attribute automatically
	$(".psTitle" ).each(function () {
		var $t = $(this);

		if ($t.is(":input")) {
			$t.attr("title", $t.val());
		} else {
			$t.attr("title", $t.html().trim());
		}
	});
	// -- set title attribute automatically

	// number only for input type text of clas numberOnly

	$(document).on("input", ".numberOnly", function () {

		if (null == this.value) {
			this.value = "0";
		}

		this.value = this.value.replace(/[^\d\.\-]/g, '');
	});

	// -- number only for input type text of clas numberOnly

	// dateOfMonth

	$(document).on("input", ".dateOfMonth", function (e) {

		var t = $(this);

		if (null == this.value) {
			this.value = "";
		}

		this.value = this.value.replace(/[^\d\.\-]/g, '');

		if (null == this.value) {
			return;
		}

		var val = "" + this.value;

		if (1 > val.trim().length) {
			return;
		}

		var prevVal = t.attr("prevVal");

		var val = parseInt(val);

		if (31 < val) {
			if (null != prevVal && "" != prevVal) {
				val = prevVal;
			} else {
				val = 31;
			}
		}

		if (1 > val) {
			if (null != prevVal && "" != prevVal) {
				val = prevVal;
			} else {
				val = 1;
			}
		}

		this.value = val;

		t.attr("prevVal", val);

	});

	// -- dateOfMonth

});

// -- jquery init function

/** common functions **/

function toggleClassOn(f) {
	$f = $(f);

	$parent = $f.parent();

	$children = $parent.children();

	$children.each(function () {
		$(this).removeClass("on");
	});

	$f.addClass('on');
}

function objToJson(formData) {
	var data = formData;
	var obj = {};
	$.each(data, function (idx, ele) {
		obj[ele.name] = ele.value;
	});
	return obj;
}

//formDataToJsonObject
function formDataToJson($form) {
	return formDataToJsonObject($form);
}

function formDataToJsonObject($form) {

	var data = [];

	if ("string" == typeof $form || "String" == typeof $form) {
		// if the argument is a string , 
		data = $($form).serializeArray();
	} else if ($.isArray($form)) {
		// if the argument is an array , 
		data = $form;
	} else if ($form instanceof jQuery) {
		// if the argument is a jquery object
		data = $form.serializeArray();
	} else {
		// else 
		data = $form.serializeArray();
	}

	// convert form data to json object
	var obj = {};

	$.each(data, function (idx, elem) {

		var name;
		var nameList;
		var namePart;

		name = elem.name;

		if (null != name && "" != (name = name.trim())) {
			nameList = name.split(".");

			// filter invalid names
			var filterNameList = [];
			for (var i = 0, iLen = nameList.length; i < iLen; i++) {
				var namePart = nameList[i];

				if (null != namePart && "" != (namePart = namePart.trim())) {
					filterNameList.push(namePart);
				}
			}

			nameList = filterNameList;

			// build regular and normal json object
			var currObj = null;

			for (var i = 0, iLen = nameList.length; i < iLen; i++) {
				var namePart = nameList[i];

				currObj = null == currObj ? obj : currObj;

				if (i < iLen - 1) {
					if (null == currObj.namePart) {
						currObj.namePart = {};
					}
				} else if (i == iLen - 1) {
					currObj.namePart = elem.value;
				}
			}
		}

	});

	return obj;
}
// -- formDataToJsonObject

function toJsonString(jsonObj) {
	return JSON.stringify(jsonObj)
}

function clearToast() {
	toastMessage();
}

function toastClear() {
	toastMessage();
}

function toastMessage(msg, title) {
	if (!msg && !title) {
		$("#toast_panel").hide();

		return;
	} else {
		msg = (null == msg) ? "" : msg;
		title = (null == title) ? "" : title;

		$("#toast_message").html(msg);
		$("#toast_title").html(title);
		$("#toast_panel").show();
	}
}

// modalMessage
function modalMessage(msg, title, type, $focusElemOnHide) {
	msg = (null == msg) ? "" : msg;
	title = (null == title) ? "" : title;

	$("#modal_message_title").html(title);
	$("#modal_message_text").html(msg);

	var $modalWin = $("#modal_message_window");

	// modalWin shown listener
	$modalWin.on("shown.bs.modal", function () {
		$("#modal_message_window_closeBtn").focus();
	});
	// -- modalWin shown listener

	// modalWin hide listener
	$modalWin.on("hidden.bs.modal", function () {
		if (null != $focusElemOnHide) {
			$focusElemOnHide.focus();
		}
	});
	// -- modalWin hide listener

	$modalWin.modal("show");
}
// -- modalMessage

function dialogMessage(msg, title, type) {
	modalMessage(msg, title, type);
}

function messageDialog(msg, title, type) {
	modalMessage(msg, title, type);
}

/** -- common functions **/

/** window functions **/

// window open 
function windowOpen(url, name, spec, title, isModal, closeWinOpened) {

	var winData = {
		url: url,
		name: name,
		spec: spec,
		title: title,
		isModal: isModal,
		closeWinOpened: closeWinOpened,
		"": ""
	};

	return winOpen(winData);
}
// window open

var windowsHash = {};

// winOpen
function winOpen(winData) {

	var url = winData.url;
	var name = winData.name;
	var spec = winData.spec;
	var title = winData.title;

	var isModal = winData.isModal;
	var closeWinOpened = winData.closeWinOpened;

	var targetAttr = winData.targetAttr;
	var onbeforunload = winData.onbeforunload;

	targetAttr = null == targetAttr ? "" : targetAttr;

	var win = null;

	var dbg = true;

	closeWinOpend = undefined == closeWinOpened ? true : closeWinOpened;

	if (closeWinOpened) {
		// close window opened 
		var winOpened = windowsHash[name];

		if (null == winOpened) {
			// do nothing.
		} else if (null != winOpened && winOpened.closed) {
			windowsHash[name] = null;

			delete windowsHash[name];
		} else if (null != winOpened && !winOpened.closed) {
			winOpened.close();

			dbg = dbg && debug("Closed the window pre existent. name = " + name);
		}
		// -- // close window opened 
	}

	if (true == isModal || "true" == isModal || "True" == isModal || "TRUE" == isModal) {
		dbg = dbg && debug("Modal window pop up. name = " + name);

		// MS EDGE browser does not support window.showModalDialog( .... )

		win = winOpenModal(winData);
	} else {
		var replace = true;
		win = window.open(url, name, spec); 

		if (null != win) {
			win.targetAttr = "" + targetAttr;

			// win.onbeforunload = onbeforunload ;

			if (null != onbeforunload) {
				$(win).on("beforeunload", function () {
					var dbg = true;

					dbg && debugMsg("beforeunload is calling now ...");

					onbeforunload();

					dbg && debugMsg("// beforeunload is calling now ...");
				});
			} else {
				// add default beforeunload listener
				$(win).on("beforeunload", function () {
					var dbg = true;

					dbg && debugMsg("default beforeunload is calling now ...");

					var parent = (null == window.opener) ? window.parent : window.opener;

					if (null != parent) {
						if ("function" == typeof parent.onPopupClose) {
							var popupWin = window.self;
							var targetAttr = "";
							parent.onPopupClose(popupWin, targetAttr);
						}
					}

					dbg && debugMsg("// default beforeunload is calling now ...");
				});
				// -- add default beforeunload listener
			}

			windowsHash[name] = win;
		}

		// -- set window size manually after parsing the spec
	}

	if (null == win) {
		var msg = "Cannot open a new window!";

		messageDialog(msg, "Error", "error");
	} else if (null != win) {
		try {
			win.focus();
		} catch (e) {}
	}

	return win;
}
// -- winOpen

// winOpenModal
function winOpenModal(winData) {

	var url = winData.url;
	var title = winData.title;
	var spec = winData.spec;
	var modalFooterHide = winData.modalFooterHide;

	modalFooterHide = null == modalFooterHide ? true : modalFooterHide;

	var targetAttr = winData.targetAttr;
	var onbeforunload = winData.onbeforunload;

	targetAttr = null == targetAttr ? "" : targetAttr;

	var winSize = getWindowSizeFromSpec(spec);
	var winSizeMargin = 0;

	var $modalWin = $("#modal-iframe-dialog");

	$modalWin = $modalWin.clone();

	$("body").append($modalWin);

	$modalWin.find("#modal-win-title").html(title);

	var useIframe = true;

	if (useIframe) {
		var $iframe = $modalWin.find(".modal-iframe");

		if (null != winSize) {
			if (null != winSize.width) {
				$iframe.width(winSize.width + winSizeMargin);
			}

			if (null != winSize.height) {
				$iframe.height(winSize.height + winSizeMargin);
			}
		} else {
			$iframe.width(700);
			$iframe.height(700);
		}

		$iframe.attr("src", url);
	} else {
		$modalWin.find(".modal-body").html("");

		$modalWin.find(".modal-body").load(url);
	}

	$modalWin.find('.modal-content').resizable({});

	$modalWin.find('.modal-dialog').draggable();

	$modalWin.onbeforunload = onbeforunload;

	// modalWin show listener
	$modalWin.on("show.bs.modal", function () {

		var $iframe = $modalWin.find(".modal-iframe");

		if (1 > $iframe.length) {
			$iframe = $modalWin.find("iframe");
		}

		if (1 > $iframe.length) {
			modalMessage("Error: cannot find an iframe to open!", "Error", "error");
		} else {
			var window = $iframe.prop('contentWindow');

			if (null == window) {
				modalMessage("Error: cannot find a contentWindow of the iframe to open!", "Error", "error");
			} else {
				window.targetAttr = targetAttr;
				window.onbeforunload = onbeforunload;
			}
		}

	});
	// -- modalWin show listener

	// modalWin hidden listener
	$modalWin.on("hidden.bs.modal",
		function () {
			if (1 > $iframe.length) {
				$iframe = $modalWin.find("iframe");
			}

			if (1 > $iframe.length) {
				modalMessage("Error: cannot find an iframe to close!", "Error", "error");
			} else {
				var window = $iframe.prop('contentWindow');

				if (null == window) {
					modalMessage("Error: cannot find a contentWindow of the iframe to close!", "Error", "error");
				} else {
					if (!window.closed) {

						if (null != window.onbeforunload) {
							window.onbeforunload();
						} else if (null != onbeforunload) {
							onbeforunload();
						}

						window.close();

						$modalWin.remove();
					}
				}
			}
		}
	);
	// -- modalWin hidden listener

	if (true == modalFooterHide || "true" == modalFooterHide) {
		$modalWin.find('.modal-footer').hide();
	}

	$modalWin.modal("show");

	return $modalWin;
}
// -- winOpenModal

// winClose
function winClose() {

	var $modalWin = null;

	if (null != parent) {
		var $modalWinList = $(parent.document).find(".modal");

		$modalWinList.each(
			function () {
				if ($(this).is(":visible")) {
					$modalWin = $(this);
				}
			}
		);
	}

	if (null != $modalWin) {
		$modalWin.find(".close").click();
	} else {
		window.close();
	}

}
// -- winClose

/** -- window functions **/

/** ajax common functions **/

// ajaxCall function 

// showAjaxLoader
function showAjaxLoader(ajaxLoader) {

	if (null == ajaxLoader) {
		ajaxLoader = {};
	}

	var size = ajaxLoader.size;
	var $location = ajaxLoader.$location;

	if (undefined == size || null == size || "" == size) {
		size = "";
	} else {
		size = "-" + size;
	}

	var $loader = $("#ajax-loader" + size).clone();

	$("body").append($loader);

	if (undefined == $location || null == $location) {
		if (null == window || null == window.event) {
			$location = $("body");
		} else {
			$location = $(window.event.srcElement || window.event.target);
		}
	}

	var align = ajaxLoader.align;

	align = null == align ? "center" : align;

	var my = "center center";
	var at = "center center";
	var offset = "0 0";

	if ("center" == align) {
		my = "center center";
		at = "center center";
		offset = "0 0";
	} else if ("left" == align) {
		my = "right center";
		at = "left center";
		offset = "0 0";
	} else if ("right" == align) {
		my = "left center";
		at = "right center";
		offset = "0 0";
	}

	$loader.show();

	$loader.css({
		position: "absolute",
		zIndex: 1000000,
		left: 0,
		top: 0
	});

	$loader.position({ of: $location,
		"my": my,
		"at": at,
		"offset": offset
	});

	ajaxLoader.$loader = $loader;

	return $loader;
}
// -- showAjaxLoader

// hideAjaxLoader
function hideAjaxLoader(ajaxLoader) {

	if (null == ajaxLoader) {
		modalMessage("Error: The ajaxLoder is null!", "Error", "error");

		return;
	} else if (null == ajaxLoader.$loader) {
		modalMessage("Error: The ajaxLoder.$loader is null!", "Error", "error");

		return;
	}

	var $loader = ajaxLoader.$loader;
	var hideInterval = ajaxLoader.hideInterval;

	if (undefined == hideInterval || null == hideInterval) {
		hideInterval = 1500;
	}

	setTimeout(
		function () {
			$loader.hide();

			$("body").remove($loader);

		}, hideInterval
	);

}
// -- hideAjaxLoader

// ajaxCall
function ajaxCall(ajaxData) {

	var url = ajaxData.url;
	var type = ajaxData.type;
	var data = ajaxData.data;
	var dataType = ajaxData.dataType;

	type = (null == type) ? "POST" : type;
	data = (null == data) ? {} : data;

	// set data type automatically
	if (null == dataType) {
		var urlUpper = url.toUpperCase();

		if (urlUpper.endsWith(".JSON") || urlUpper.includes(".JSON?")) {
			dataType = "json";
		} else {
			dataType = "html";
		}
	}

	dataType = (null == dataType) ? "json" : dataType;

	var beforeSend = ajaxData.beforeSend;
	var xhr = ajaxData.xhr;
	var error = ajaxData.error;
	var success = ajaxData.success;
	var complete = ajaxData.complete;

	if (null == ajaxData.ajaxLoader) {
		ajaxData.ajaxLoader = {}
	}

	// set default listeners

	if (null == beforeSend) {
		// default befor send listener
		beforeSend = function () {
			$ajaxLoader = showAjaxLoader(ajaxData.ajaxLoader);
		};
		// -- default befor send listener
	}

	if (null == xhr) {
		// default xhr listener
		xhr = function () {
			var xhrTemp = new window.XMLHttpRequest();

			var debug = false;

			xhrTemp.addEventListener("progress", function (evt) {
				debug = debug && debug("lengthComputable = " + evt.lengthComputable);
				if (evt.lengthComputable) {
					var percentComplete = evt.loaded / evt.total;
					debug = debug && debug("progress = " + percentComplete + " %");
				}
			}, false);

			return xhrTemp;
		};
		// -- default xhr listener 
	}

	if (null == error) {
		// default error function 
		error = function (jqXHR, exception) {

			var errorMessage = null;

			if (0 == jqXHR.status) {
				errorMessage = 'Not connect.\n Verify Network.';
			} else if (404 == jqXHR.status) {
				errorMessage = 'Requested page not found. [404]';
			} else if (500 == jqXHR.status) {
				errorMessage = 'Internal Server Error [500].';
			} else if ('parsererror' == exception) {
				errorMessage = 'Requested JSON parse failed.';
			} else if ('timeout' == exception) {
				errorMessage = 'Time out error.';
			} else if ('abort' == exception) {
				errorMessage = 'Ajax request aborted.';
			} else {
				errorMessage = 'Uncaught Error.\n' + jqXHR.responseText;
			}

			var title = "Error";

			modalMessage(errorMessage, title);
		};
		// -- default error function 
	}

	if (null == success) {
		// default success function
		success = function (data) {};
		// -- default success function
	}

	if (null == complete) {
		// default complete function
		complete = function () {
			hideAjaxLoader(ajaxData.ajaxLoader);
		};
		// -- default complete function 
	}

	var successImpl = function (data) {
		try {
			success(data);
		} catch (e) {
			try {
				modalMessage("ajax call error: " + e, "Error", "error");
			} catch (ee) {

			}
		}
	};

	$.ajax(
		url, {
			type: type,
			async: true,
			cache: false,
			scriptCharset: "utf-8",
			dataType: "" + dataType,

			data: data,

			beforeSend: beforeSend,
			xhr: xhr,
			error: error,
			success: successImpl,
			complete: complete,
			"": ""
		}
	);

};
// -- ajaxCall

// mapJsonObjToForm 
function mapJsonObjToForm($trClone, item, i, dbg) {

	if (undefined == dbg) {
		dbg = false;
	}

	if (undefined == i) {
		i = 0;
	}

	var $tdList = $trClone.find("*[jsonProp]");

	var jsonProp;
	var propValue;
	var tag;

	var locale = item["locale"];

	if (null == locale || "" == locale) {
		locale = "ru";
	}

	// td.each
	$tdList.each(
		function () {
			var t = $(this);

			jsonProp = t.attr("jsonProp");
			jsonProp = (null == jsonProp) ? "" : jsonProp.trim();

			if ("" == jsonProp) {
				debugMsg("Warn: jsonProp property value is null.");
			} else if ("checkbox" == jsonProp) {
				t.prop("checked", false);
				t.prop("disabled", false);
			} else if ("rnum" == jsonProp || "rno" == jsonProp || "no" == jsonProp) {
				tag = "" + (i + 1);
				tag = tag.format();

				t.html(tag);
			} else if ("item.id" == jsonProp) {
				t.val(item.id);

				t.attr("jsonObject", JSON.stringify(item));

				t.prop("checked", false);
				t.prop("disabled", false);
			} else {
				// if jsonProp starts with "item." , remove "item." header 
				if (0 == jsonProp.indexOf("item.")) {
					jsonProp = jsonProp.substr(5).trim();
				}
				// -- if jsonProp starts with "item." , remove "item." header

				propValue = ("" == jsonProp) ? "" : item[jsonProp];

				if (null == propValue) {
					// iterate json properties
					var itemClone = item;
					var propClone = jsonProp.split(".");
					var propTemp;

					for (var propCloneIdx = 0, propCloneLen = propClone.length; propCloneIdx < propCloneLen; propCloneIdx++) {
						propTemp = propClone[propCloneIdx];
						itemClone = itemClone[propTemp];

						if (propCloneIdx == (propCloneLen - 1)) {
							// on the end of iteration
						} else if (null == itemClone) {
							propCloneIdx = propCloneLen;
							break;
						} else if ("string" == typeof itemClone || "String" == typeof itemClone) {
							propCloneIdx = propCloneLen;

							itemClone = null;
							break;
						}
					}
					// -- iterate json properties

					propValue = itemClone;
				}

				if (null == propValue) {
					propValue = null;
				} else if (true == propValue) {
					// do nothing.
				} else if ("object" == (typeof propValue)) {
					var localeValue = propValue[locale];

					// set locale value as the one which is not empty
					if (null == localeValue) {
						localeValue = propValue["ru"];

						if (null == localeValue) {
							localeValue = propValue["kg"];

							if (null == localeValue) {
								localeValue = propValue["en"];
							}
						}
					}
					// -- set locale value as the one which is not empty

					if (null != localeValue && ("string" == typeof localeValue || "String" == typeof localeValue)) {
						propValue = localeValue;
					} else {
						propValue = JSON.stringfy(propValue);
					}
				}

				// format rnum with comma if json prop is "rum"
				tag = ("rnum" == jsonProp) ? ("" + propValue).format() : propValue;

				tag = (null == tag) ? "" : tag;

				dbg = dbg && debugMsg("[" + i + "] " + jsonProp + " = " + tag);

				if (t.is(":input")) {
					// when the element is a form element
					t.prop("disabled", (t.attr("prevDisabled") ? true : false));

					var typeAttr = t.attr("type");
					if ("checkbox" == typeAttr || "radio" == typeAttr) {
						// when the form element is check box of radio button
						t.prop("checked", (true == tag || "1" == tag || "Y" == tag.toUpperCase() || "TRUE" == tag.toUpperCase()))
					}

					t.val(tag);

					if (t.is("select")) {
						// if this is a select form
						t.attr("title", t.find("option:selected").text());
					} else {
						// set html tooltip
						if (t.prop("jsonTitle") || t.attr("jsonTitle")) {
							t.attr("title", tag);
						}
					}

					t.trigger("change");
				} else {
					// when the element is text element

					var jsonFormat = t.attr("jsonFormat");

					if ("number" == jsonFormat) {
						tag = ("" + tag).formatNumber();
					}

					// set html tooltip
					if (t.prop("jsonTitle") || t.attr("jsonTitle")) {
						t.attr("title", tag);
					}

					t.html(tag);
				}
			}
		}
	);
	// -- td.each

	dbg = dbg && debugMsg("html[" + i + "] = " + $trClone.html());
}
// -- mapJsonObjToForm

// get template row
function getTemplateRow($tbody) {
	// searched tr templates which have "templateRow" attribute from tbody children
	var $trTemplate = $tbody.children("[templateRow]");

	if (1 > $trTemplate.length) {
		var childs = $tbody.children();

		if (1 > childs.length) {
			valid = false;
			errorMessage = "Error: cannot find a json template element!";
		} else if (0 < childs.length) {
			// make a tr template by cloning the first child element.
			$trTemplate = childs.eq(0).clone();

			// set tr template "templateRow" attribute as true.
			$trTemplate.attr("templateRow", true);
			$trTemplate.attr("liveItem", "");
			$trTemplate.find(".itemSelector , .item-selector").prop("checked", false);

			// clear all jsonObject attribute 
			$trTemplate.find("[jsonObject]").attr("jsonObject", "");

			// remove children of the tbody.
			$tbody.children().each(
				function () {
					if (null == $(this).attr("liveItem") || "" == $(this).attr("liveItem")) {
						$(this).remove();
					}
				}
			);

			// make the tr template hidden . 
			$trTemplate.hide();

			$tbody.append($trTemplate);
			// -- make a tr template by cloning the first child element.
		}
	} else {
		$trTemplate = $trTemplate.eq(0);
	}

	// remove validation state css class
	$trTemplate.removeClass("warning has-warning danger has-error success has-success");

	return $trTemplate;
}
// -- get template row

// ajax refresh list by json
function ajaxRefreshListByJson(ajaxData, dbg) {

	if (undefined == dbg) {
		dbg = false;
	}

	var $tbody = ajaxData.$tbody;
	var $currentPage = ajaxData.$currentPage;
	var $maxPaginationSize = ajaxData.$maxPaginationSize;
	var $listCount = ajaxData.$listCount;

	var initListPagerFun = ajaxData.initOwnerListPagerFun;

	if (null == initListPagerFun) {
		initListPagerFun = ajaxData.initListPagerFun;
	}

	// success listener

	var success = function (data) {

		var valid = true;
		var errorMessage = null;

		if (1 > data.result) {
			// when some errors occurred
			if (data.errCode && data.errCode.codeMsg) {
				errorMessage = data.errCode.codeMsg;
			}
			// -- when some errors occured 
		} else if (0 < data.result) {
			// when some data has been received successfully ,

			if (null == data.list) {
				debugMsg("Error: The data.list is empty!");
			} else if (null != data.list) {
				// when the elements are not empty 

				var $trTemplate = getTemplateRow($tbody);

				// remove all children except the first one which is a template.
				$tbody.children().not(":first").remove();

				var $tr = $trTemplate.clone();

				var item;

				var $trClone;
				var tag;
				var jsonProp;

				var list = data.list;

				for (var i = 0, iLen = list.length; i < iLen; i++) {
					item = list[i];

					$trClone = $tr.clone();

					$trClone.attr("cloneData", true);

					$tbody.append($trClone);

					$trClone.show();

					mapJsonObjToForm($trClone, item, i, dbg);
				}

				// list record count
				if (null != $listCount) {
					var totalRows = null == item ? 0 : (null == item.pageInfo ? 0 : item.pageInfo.totalRows);

					var recordDesc = ("" + totalRows).format();
					$listCount.html(recordDesc + " records");
				}

				// list pager
				if (null != $currentPage) {
					var page = null == item ? 1 : (null == item.pageInfo ? 0 : item.pageInfo.page);

					$currentPage.val(page);
				}

				if (null != $maxPaginationSize) {
					var maxPaginationSize = null == item ? 10 : (null == item.pageInfo ? 10 : item.pageInfo.maxPaginationSize);

					$maxPaginationSize.val(maxPaginationSize);
				}

				if (null != initListPagerFun) {
					initListPagerFun();
				}
				// -- list pager

				// -- when the elements are not empty
			}

			// -- when some data has been received successfully , 
		}

		if (null != errorMessage && "" != errorMessage) {
			modalMessage(errorMessage, "Error");
		}
	};

	// -- success listener 

	ajaxData.success = success;

	if (null != $listCount) {
		$listCount.html("Retrieving owner list by json type now ...");
	}

	ajaxCall(ajaxData);
}
// -- ajax refresh list by json

// find an nearest element
function findNearElem($fromElem, toSelector) {
	return findNearestElement($fromElem, toSelector);
}
// -- find an nearest element

// findNearestElement
function findNearestElement($fromElem, toSelector, parentIndex) {
	var dbg = false;

	parentIndex = undefined == parentIndex ? 0 : parentIndex;

	// find an element at children
	var $srch = $fromElem.find(toSelector);

	dbg = dbg && debugMsg("find elem size = " + $srch.length);

	if (1 > $srch.length) {
		// find at closest
		$srch = $fromElem.closest(toSelector);
	}

	if (1 > $srch.length) {
		// find an element at siblings
		var idx = 0;

		$fromElem.siblings().each(
			function () {
				if (1 > $srch.length) {
					$srch = $(this).find(toSelector);

					dbg = dbg && debugMsg("sibling[" + idx + "] elem size = " + $srch.length);

					idx++;
				}
			}
		);
		// -- find an element at siblings

		// if not found at siblings
		if (1 > $srch.length) {
			// find at parent
			var parent = $fromElem.parent();
			if (null != parent && 0 < parent.length) {
				$srch = findNearestElement(parent, toSelector, parentIndex + 1);

				dbg = dbg && debugMsg("parent[" + parentIndex + "] elem size = " + $srch.length);
			}
		}
		// -- if not found at siblings
	}

	return $srch;
}
// -- find an nearest element

// convertJsonToSpringParam
function convertJsonToSpringParam(jsonObject, prevResult, prevKey) {

	if (undefined == prevResult || null == prevResult) {
		prevResult = {};
	}

	if (undefined == prevKey || null == prevKey) {
		prevKey = "";
	}

	$.each(jsonObject, function (key, value) {
		var prop = "" == prevKey ? key : prevKey + "." + key;

		if (null == key || "" == key || null == value || "" == value) {
			// do nothing
		} else if (Array.isArray(value)) {
			var elem;
			var index = 0;
			for (var i = 0, iLen = value.length; i < iLen; i++) {
				elem = value[i];

				if (null != elem) {
					convertJsonToSpringParam(elem, prevResult, prop + "[" + index + "]");

					index++;
				}
			}
		} else if ("object" == typeof value) {
			convertJsonToSpringParam(value, prevResult, prop);
		} else if ("string" == typeof value || "String" == typeof value) {
			prevResult[prop] = value;
		} else {
			prevResult[prop] = value;
		}
	});

	return prevResult;
}
// -- convertJsonToSpringParam

/** -- ajax common functions **/

/** pop up functions **/

// existOnPopupSelectFunctionOnParent
function existOnPopupSelectFunctionOnParent(parent) {

	var errorMessage = null;

	// parent is window.opener or window.parent if the window.opener is null.
	// var parent = ( null == window.opener ) ? window.parent : window.opener ;

	if (null == parent) {
		errorMessage = "cannot find the parent window! It skipped returing the selected value.";
	} else if (null == parent.onPopupSelect) {
		errorMessage = "Error : There is not the 'onPopupSelect( ... ) javascript function in the parent window.";
	} else if ("function" != (typeof parent.onPopupSelect)) {
		errorMessage = "The opPopupSelect in the parent window is not a javascript function.";
	}

	if (null != errorMessage) {
		modalMessage(errorMessage, "Error", "error");
	}

	return (null == errorMessage);

}
//-- existOnPopupSelectFunctionOnParent

/** -- pop up functions **/

/** common functions **/

//change select options commmon
function changeSelectOptionsCommon(ajaxData) {

	// comboBox, regionId , moveFocus

	// success listener

	var success = function (data) {

		var errorMessage = null;

		if (data.result < 1) {
			// when some errors occurred

			if (data.errCode && data.errCode.codeMsg) {
				errorMessage = data.errCode.codeMsg;
			}

			// -- when some errors occured 
		} else if (data.result > 0) {
			// when some data has been received successfully , 
			var list = data.list;

			var listLen = null == list ? 0 : list.length;

			var $select = ajaxData.$select;

			if (ajaxData.removeAllOptions) {
				$select.find('option').remove();
			} else {
				$select.find('option').not(':first').remove();
			}

			$select.val("");

			if (1 > listLen) {
				errorMessage = "";
			} else if (0 < listLen) {
				var item;
				var $option;

				var name;
				for (var i = 0, iLen = list.length; i < iLen; i++) {
					item = list[i];

					// set name 
					name = item.name;

					if (null == name) {
						name = "";
					} else if ("string" == typeof name || "String" == typeof name) {
						// do nothing
					} else {
						if (null != name.ru) {
							name = name.ru;
						} else if (null != name.kg) {
							name = name.kg;
						} else {
							name = name.en;
						}
					}

					name = null == name ? "" : name;
					// -- set label

					$option = $('<option value="' + item.id + '" > ' + name + ' </option>');

					$select.append($option);
				}

				if (ajaxData.moveFocus && (0 < list.length)) {
					$select.focus();
				}
			}

			// -- when some data has been received successfully , 
		}

		if (null != errorMessage && "" != errorMessage) {
			modalMessage(errorMessage, "Error");
		}
	};

	// -- success listener 

	ajaxData.success = success;

	ajaxCall(ajaxData);
}
// -- change select options commmon

// onChangeCodeSelectCascade
function onChangeCodeSelectCascade(cascadeFormInfo) {

	var selectId = cascadeFormInfo.selectId;

	if (null != selectId && "" != selectId) {
		// check where if the jquery id starts with #

		if (!selectId.startsWith("#")) {
			selectId = "#" + selectId;
		}
	}

	var selOptValue = "";

	selOptValue = $(selectId + " option:selected").val();

	selOptValue = (null == selOptValue) ? "" : "" + selOptValue.trim();

	// remove option elements of child select elements

	var childSelectIdList = cascadeFormInfo.childSelectIdList;

	for (var i = 0, iLen = childSelectIdList.length; i < iLen; i++) {

		var selectChildId = childSelectIdList[i];

		if (null != selectChildId && "" != selectChildId) {

			// check where if the jquery id starts with #
			if (!selectChildId.startsWith("#")) {
				selectChildId = "#" + selectChildId;
			}

			var selectChild = $(selectChildId);

			var idx = 0;

			selectChild.children().each(
				function () {
					var t = $(this);
					if (0 < idx) {
						t.remove();
					}
					idx++;
				}
			);

			selectChild.prop('disabled', true);
		}
	}

	// -- remove option elements of userLroInfoId select element 


	if (null == selOptValue || "" == selOptValue) {
		// remove all lro combobox items and make it disabled 

		selectChild.prop('disabled', true);

		return;
	} else if (null != selOptValue && "" != selOptValue) {

		// success listener

		var success = function (data) {

			var errorMessage = null;

			var selectChildId = "" + cascadeFormInfo.childSelectIdList[0];

			// check where if the jquery id starts with #
			if (null != selectChildId && "" != selectChildId) {
				if (!selectChildId.startsWith("#")) {
					selectChildId = "#" + selectChildId;
				}
			}

			var selectChild = $(selectChildId);

			if (data.result < 1) {
				// when some errors occurred

				if (data.errCode && data.errCode.codeMsg) {
					errorMessage = data.errCode.codeMsg;
				}

				selectChild.prop('disabled', true);

				// -- when some errors occured 
			} else if (data.result > 0) {
				// when some data has been received successfully , 
				var list = data.list;

				var listLen = null == list ? 0 : list.length;

				if (1 > listLen) {
					errorMessage = "";

					selectChild.prop('disabled', true);
				} else if (0 < listLen) {
					errorMessage = null;

					var item;

					var tag;
					var option;

					var name;

					for (var i = 0, iLen = list.length; i < iLen; i++) {
						item = list[i];

						name = item.name;

						if (null == name) {
							name = item.code;
						}

						if ("string" == typeof name || "String" == typeof name) {
							// do nothing
						} else {
							name = name.ru;
						}

						tag = '<option value="' + item.id + '" > ' + name + ' </option>'

						option = $(tag);

						selectChild.append(option);
					}

					selectChild.prop('disabled', false);

					if (null != cascadeFormInfo.ajaxData && cascadeFormInfo.ajaxData.moveFocus) {
						selectChild.focus();
					}
				}

				// -- when some data has been received successfully , 
			}

			if (null != errorMessage && "" != errorMessage) {
				modalMessage(errorMessage, "Error");
			}
		};

		// -- success listener 

		var ajaxData = cascadeFormInfo.ajaxData;

		ajaxData.success = success;

		ajaxCall(ajaxData);
	}

}
// -- onChangeCodeSelectCascade

/** -- common functions **/

/** common listeners **/

// form listener
$(document).on("submit", "form",
	function (e) {

		debug( "form submit ....." )

		valid = true ;
		
		var ajaxLoader = {
			"size": "lg",
			$location: $("body"),
			hideInterval: 1000
		};

		if ("function" == typeof getFormSubmitAjaxLoader) {
			$location = getFormSubmitAjaxLoader();
		} else {
			debug( "getFurmSubmitAjaxLoader function does not exist." )
		}

		showAjaxLoader(ajaxLoader);

		if( "function" == typeof validateSubmitForm ) {
			valid = validateSubmitForm() ; 
		} else {
			debug( "validateSubmitForm function does not exist." )
		}

		return valid ;
	}
);
// -- form listener

// logoutButton listener
$("#logoutButton").click(
	function () {
		var funName = "#logoutButton click";

		debug(funName);

		$("#logoutForm").submit();

		debug("// " + funName)
	}
);
// logoutButton listener

/** -- common listeners **/

/** validation */

function isValidEmail( email ) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function isValidUserId( userId ) {
	var regex = /^[0-9a-zA-Z]+$/;
	return regex.test(userId) && userId.length > 5 ; 
}

// validateLoginForm
function validateLoginForm() {
	valid = true ;

	$("#user_id").removeClass( "border-danger" ) 

	$("#user_id_error").html("")
	$("#user_pass_error").html("")

	var user_id = $("#user_id").val().trim();
	var user_pass = $("#user_pass").val().trim();

	if ( $("#user_id").length && 1 > user_id.length ) {
		valid = false ; 

		$("#user_id_error").html( "아이디 또는 이메일 주소를 입력하세요." )
		$("#user_id").addClass( "border-danger" ) 
	} else if ( 1 > user_pass.length ) {
		valid = false ; 

		$("#user_pass_error").html( "암호를 입력하세요!")
		$("#user_pass").addClass( "border-danger" ) 
	} else if ( 6 > user_pass.length ) {
		valid = false ; 

		$("#user_pass_error").html( "암호는 6자리 이상입니다.")
		$("#user_pass").addClass( "border-danger" ) 
	}

	if( valid ) {
		var user_id = $("#user_id").val()
		if( "" != user_id ) {
			Cookies.set( "user_id" , user_id );
		}
	}

	return valid;
}
// -- validateLoginForm

/** -- validation */

$(function () {
	// page link
	$( ".page-no" ).click( 
		function () {
			var page = $( this ).html().toInt() - 1 ;
			page = page < 0 ? 0 : page ;
			$( "form input[name=page]" ).val( page );
			$( "form" ).submit();
		}
	);

	$( ".page-first" ).click( 
		function () {
			var page = $( "form input[name=page]" ).val().toInt() ;
			page = Math.floor( page/10 );
			page = page*10 - 1;
			page = page < 0 ? 0 : page ;
			$( "form input[name=page]" ).val( page );
			$( "form" ).submit();
		}
	);

	$( ".page-last" ).click( 
		function () {
			var page = $( "form input[name=page]" ).val().toInt() ;

			var pageLast = $( "#pageLast" ).val();

			page = Math.floor( page/10 );
			page = page + 1;
			page = page*10;

			if( "" != pageLast ) {
				pageLast = pageLast.toInt() - 1;
				if( pageLast < page ) {
					page = pageLast ;
				}
			}
			
			page = page < 0 ? 0 : page ;
			$( "form input[name=page]" ).val( page );
			$( "form" ).submit();
		}
	);
	// -- page -link

	$( "#srch_btn" ).click( 
		function() { 
			$( "form input[name=page]" ).attr( "name", "" )
		}
	);
	
} 
);

// -- ars common java script file