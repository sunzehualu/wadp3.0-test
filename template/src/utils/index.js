import { Message } from "element-ui";

const baseURL = process.env.VUE_APP_BASE_API

/**
 *防抖函数
 * @param {Function} func 回调防范
 * @param {number} wait 时间间隔
 * @param {boolean} immediate
 * @returns {*}返回函数
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 增加级别字段
 */
export function addLevel(data) {
  for (let i in data) {
    const lev = data[i].ancestors.split(",").length;
    data[i].level = lev;
    data[i].id = data[i].classDictCode ? data[i].classDictCode : "";
    data[i].label = data[i].classDictName ? data[i].classDictName : "";
  }
}

/**
 * 检查节点是否具有该类
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {String} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * 给节点添加类
 * Add class to element
 * @param {HTMLElement} ele
 * @param {String} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * 删除该类
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {String} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * 创建一个map并返回一个函数，检查是否存在key在map里面
 * @param {String} str 需要检测的值
 * @returns true || false
 */
export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => map[val.toLowerCase()] : (val) => map[val];
}

export const exportDefault = "export default ";

/**
 * 首字母大小
 * @param {String} str 字母
 */ 
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

/**
 * 判断是否是数字
 * @param {Number} str 数字
 */ 
export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}
/**
 * 从数组中删除指定对象
 *  @param {Array} _arr:数组
 *  @param _obj:需删除的对象
 */
export function removeArray(_arr, _obj) {
  let length = _arr.length;
  for (let i = 0; i < length; i++) {
    if (equalObj(_arr[i], _obj)) {
      if (i === 0) {
        _arr.shift(); //删除并返回数组的第一个元素
        return _arr;
      } else if (i === length - 1) {
        _arr.pop(); //删除并返回数组的最后一个元素
        return _arr;
      } else {
        _arr.splice(i, 1); //删除下标为i的元素
        return _arr;
      }
    }
  }
}
/**
 * 判断两个对象是否相等
 * @param {*} x 对象1
 * @param {*} y 对象2
 * @returns {Boolean} true || false
 */
export function equalObj(x, y) {
  // If both x and y are null or undefined and exactly the same
  if (x === y) {
    return true;
  }

  // If they are not strictly equal, they both need to be Objects
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }

  //They must have the exact same prototype chain,the closest we can do is
  //test the constructor.
  if (x.constructor !== y.constructor) {
    return false;
  }

  for (var p in x) {
    //Inherited properties were tested using x.constructor === y.constructor
    if (x.hasOwnProperty(p)) {
      // Allows comparing x[ p ] and y[ p ] when set to undefined
      if (!y.hasOwnProperty(p)) {
        return false;
      }

      // If they have the same strict value or identity then they are equal
      if (x[p] === y[p]) {
        continue;
      }

      // Numbers, Strings, Functions, Booleans must be strictly equal
      if (typeof x[p] !== "object") {
        return false;
      }

      // Objects and Arrays must be tested recursively
      if (!Object.equals(x[p], y[p])) {
        return false;
      }
    }
  }

  for (p in y) {
    // allows x[ p ] to be set to undefined
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}
/**
 * 寻找字典中的label
 * @param {String} value 值
 * @param {Array} list 数组
 * @returns label
 */
export function findLabel(value, list) {
  if ((value || value === 0 || value === false) && list.length > 0) {
    let val = list.filter((item) => {
      return item.dictValue == value;
    });
    return val && val[0] ? val[0].dictLabel : "";
  }
}

/** 
 * 处理下载流
 */
export function download(content, fileName) {
  //判断是否导出二进制流
  let code = content.type == "application/json" ? "" : 200;
  if (code !== 200) {
    return Message({
      showClose: true,
      message: "下载文件异常",
      type: "error",
      duration: 1500,
    });
  }
  //创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
  const blob = new Blob([content]); 
  //URL.createObjectURL(object)表示生成一个File对象或Blob对象
  const url = window.URL.createObjectURL(blob);
  //设置一个隐藏的a标签，href为输出流，设置download
  let dom = document.createElement("a"); 
  dom.style.display = "none";
  dom.href = url;
  //指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
  dom.setAttribute("download", fileName); 
  document.body.appendChild(dom);
  dom.click();
}
/** 
 * 对象数组转map
 */
Array.prototype.toMap = function (key) {
  let map = new Map()
  this.forEach(v => map.set(v[key], v))
  return map
}

/**
 * 日期格式化(时间戳转字符串)
 * @param {Date} time 日期 Thu Mar 07 2024 16:27:34 GMT+0800 (中国标准时间)
 * @param {String} pattern 格式化样式
 * @returns {String} 日期字符串 2024-03-07 16:27:34
 */ 
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

/**
 * 表单重置
 * @param {String} refName 重置表单名称
 */ 
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

/**
 * 在params内添加日期范围
 * @param {Object} params 
 * @param {Array} dateRange 时间范围
 * @param {String} propName 时间范围自定义字段名
 */ 
export function addDateRange(params, dateRange, propName) {
	var search = params;
	search.params = {};
	if (null != dateRange && '' != dateRange) {
		if (typeof (propName) === "undefined") {
			search.params["beginTime"] = dateRange[0];
			search.params["endTime"] = dateRange[1];
		} else {
			search.params["begin" + propName] = dateRange[0];
			search.params["end" + propName] = dateRange[1];
		}
	}
	return search;
}
/**
 * 回显数据字典
 * @param {Array} datas 字典数据Options
 * @param {String} value 字典值
 * @param {String} 字典名称
 */
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue == ('' + value)) {
      actions.push(datas[key].dictLabel);
      return true;
    } else if (datas[key].value == ('' + value)) {
      actions.push(datas[key].label);
      return true;
    } else if (datas[key].classDictCode == ('' + value)) {
      actions.push(datas[key].classDictName);
      return true;
    }
  })
  return actions.join('');
}
/**
 * 通用下载方法
 * @param {string} fileName 文件名称
 */ 
export function downloadByName(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

/**
 *  转换字符串，undefined,null等转化为""
 */ 
export function praseStrEmpty(str) {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
	let config = {
		id: id || 'id',
		parentId: parentId || 'parentId',
		childrenList: children || 'children'
	};

	var childrenListMap = {};
	var nodeIds = {};
	var tree = [];

	for (let d of data) {
		let parentId = d[config.parentId];
		if (childrenListMap[parentId] == null) {
			childrenListMap[parentId] = [];
		}
		nodeIds[d[config.id]] = d;
		childrenListMap[parentId].push(d);
	}

	for (let d of data) {
		let parentId = d[config.parentId];
		if (nodeIds[parentId] == null) {
			tree.push(d);
		}
	}

	for (let t of tree) {
		adaptToChildrenList(t);
	}

	function adaptToChildrenList(o) {
		if (childrenListMap[o[config.id]] !== null) {
			o[config.childrenList] = childrenListMap[o[config.id]];
		}
		if (o[config.childrenList]) {
			for (let c of o[config.childrenList]) {
				adaptToChildrenList(c);
			}
		}
	}
	return tree;
}
// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  var actions = [];
  var currentSeparator = undefined === separator ? "," : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => {
    Object.keys(datas).some((key) => {
      if (datas[key].dictValue == ('' + temp[val])) {
        actions.push(datas[key].dictLabel + currentSeparator);
      }
    })
  })
  return actions.join('').substring(0, actions.join('').length - 1);
}