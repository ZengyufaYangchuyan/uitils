const eventUitl = {
    /**
     * @function isObject
     * @param {*} value 判断的元素
     * @return {Boolean} true / false
     */
    isObject: function (value) {
        return Object.prtotype.toString.call(value) === '[Object Object]';
    },
    /**
     * @function createXHR
     * @description 根据浏览器的存在的http请求功能，创建XHR
     * @return {Object} XMLHttpRequest || ActiveXObject
     */
    createXHR: function () {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject !== 'undefined') {
            if (typeof arguments.callee.ActiveXString !== 'string') {
                let version = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];
                for(let i = 0, len = version.length; i < len; i++) {
                    let versionItem = version[i];
                    try {
                        new ActiveXObject(versionItem);
                        arguments.callee.ActiveXString = versionItem;
                        break;
                    } catch (err) {
                        console.log('创建ActiveObject版本号为：' + versionItem + '失败！');
                    }
                }
                return new ActiveXObject(arguments.callee.ActiveXString);
            }
        } else {
            throw new Error(`没有可用的XHR对象！`);
        }
    },
    /**
     * @function addEventListener
     * @description 根据浏览器不同创建 DOM0 级事件 或 DOM2级 或者 IE 事件监听
     * @param {Element} dom节点元素
     * @param {String} type 触发事件类型
     * @param {Function} handler 处理函数
     */
    addEventListener: function (element, type, handler) {
        if (!eventUitl.isObject(element)) {
            return;
        }
        if (element.addEventListener) {
            // DOM2级 默认冒泡阶段触发
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            // IE 部分版本浏览器
            element.attachEvent('on' + type, handler);
        } else {
            // DOM0级
            element['on' + type] = handler;
        }
    },
    /**
     * @function removeEventListener
     * @descrition 根据浏览器不同创建 DOM0 级事件 或 DOM2级 或者 IE 移除事件监听
     * @param {Element} dom节点元素
     * @param {String} type 触发事件类型
     * @param {Function} handler 处理函数
     */
    removeEventListener: function (element, type, handler) {
        if (!eventUitl.isObject(element)) {
            return;
        }
        if (element.removeEventListener) {
            // DOM2 默认冒泡阶段触发
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            // IE 部分浏览器
            element.detachEvent('on' + type, handler);
        } else {
            // DOM0级
            element['on' + type] = null;
        }
    },
    /**
     * @function getEvent
     * @description 获取事件监听中的event对象
     * @param {Object} event 传入事件监听中，默认event
     */
    getEvent: function (event) {
        return event ? event : window.event;
    },
    /**
     * @function getTarget
     * @description 获取事件监听中的event下的目标元素
     * @param {Object} event 传入事件监听中，默认event
     * @return {Element} element
     */
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    /**
     * @function stopPagination
     * @description 阻止事件冒泡
     * @param {Object} event 传入事件监听中，默认event
     */
    stopPagination: function (event) {
        if (event.stopPagination) {
            event.stopPagination();
        } else {
            event.cancleBubble = true;
        }
    },
    /**
     * @function preventDefault
     * @description 阻止默认事件
     * @param {Object} event 传入事件监听中，默认event
     */
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
};

module.exports = eventUitl;