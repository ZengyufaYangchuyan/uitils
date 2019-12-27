/**
 * @function loadImg
 * @description 加载图片数组
 * @param {Object} config
 * @param {string} config.mode 设置获取模式 dataset: 在下载完后，所属img元素将展示该图片 download: 存加载模式，此模式下只负责加载图片
 * @param {string} config.datasetSrcKey 在dataset中src资源名字
 * @param {string} config.downloadMode 下载图片模式 all:一次性下载， one:逐一下载
 */
function loadImg(config) {
    this.config = config || {
        mode: 'dataset',
        downloadMode: 'all',
        downloadArr: []
    };
    this.downloadData = this.getDownloadFixDataArr();
    this.hasDownLoadNum = 0;
    this.startDownloadImg(
        this.downloadData,
        this.getModeHandle()
    )
}
/**
 * @function getMode
 * @description 获取模式 
 */
loadImg.prototype.getMode = function () {
    let mode = this.config.mode || 'datase';
    return mode;
}
/**
 * @function getSrcKey
 * @description 获取img标签dataset中src资源地址key
 */
loadImg.prototype.getSrcKey = function () {
    let configSrcKey = this.config.datasetSrcKey || '';
    let srcKey = configSrcKey ? configSrcKey.toLocaleLowerCase() : 'src';
    return srcKey;
}
/**
 * @function getDownloadMode
 * @description 获取下载的模式： all:一次性下载， one:逐一下载
 */
loadImg.prototype.getDownloadMode = function () {
    let downloadMode = this.config.downloadMode || 'dataset';
    return downloadMode;
}
/**
 * @function getDownloadArr
 * @description 获取模式mode为download时需要下载数据数组
 */
loadImg.prototype.getDownloadArr = function () {
    let downloadArr = this.config.downloadArr || [];
    return downloadArr;
}
loadImg.prototype.getHasDownloadNum = function () {
    let hasDownLoadNum = this.hasDownLoadNum;
    return hasDownLoadNum
}
/**
 * @function getDownloadDataLength
 * @description 获取下载数据的总长度
 * @returns Number
 */
loadImg.prototype.getDownloadDataLength = function () {
    let length = Number(this.downloadData.length);
    return length;
}
/**
 * @function getUpdateFn
 * @description 获取更新函数
 * @returns function
 */
loadImg.prototype.getUpdateFn = function () {
    let update = this.config.update || ((img, hasDownloadNum, length) => {
        console.log(img, hasDownloadNum, length);
    })
    return update;
}
/**
 * @function getAllDownloadFn
 * @description 获取所有下载完成回调
 * @returns function
 */
loadImg.prototype.getAllDownloadFn = function () {
    let allDownloadFn = this.config.success || (() => {
        console.log('所有文件下载完毕!');
    })
    return allDownloadFn;
}
/**
 * @function getDownloadFixDataArr
 * @description 获取整改后的数据
 * @returns {Array} fixDataArr @example [{src: '', target: img}]
 */
loadImg.prototype.getDownloadFixDataArr = function () {
    let mode = this.getMode();
    let fixDataArr = [];
    if (mode === 'dataset') {
        let imgArr = document.getElementsByTagName('img') || [];
        let srcKey = this.getSrcKey();
        for (let i = 0 ; i < imgArr.length; i++) {
            let item = imgArr[i]
            let dataset = item.dataset || {};
            let src = dataset[`${srcKey}`];
            if (Object.toString(dataset) !== '{}' && src && typeof src === 'string') {
                fixDataArr.push({
                    target: item,
                    src
                });
            }
        }
    } else if (mode === 'download') {
        let imgArr = this.getDownloadArr();
        imgArr.forEach((item, index) => {
            let src;
            if (typeof item === 'object') {
                src = item.src;
            } else if (typeof item === 'string') {
                src = item;
            }
            fixDataArr.push({
                target: document.createElement('img'),
                src
            })
        })
    }
    return fixDataArr;
}
/**
 * @function getModeHandle
 * @description 根据下载模式返回对应处理方式
 */
loadImg.prototype.getModeHandle = function () {
    let mode = this.getDownloadMode();
    let handle = {
        one: this.one,
        all: this.all
    }
    return handle[`${mode}`];
}
/**
 * @function startDownloadImg
 * @description 开始下载的图片
 */
loadImg.prototype.startDownloadImg = function (imgArr, handle) {
   handle && handle(imgArr, this);
}
/**
 * @function one
 * @description 下载图片：逐一下载
 */
loadImg.prototype.one = function (imgArr, that) {
    let hasDownLoadNum = that.getHasDownloadNum();
    let item = imgArr[`${hasDownLoadNum}`];
    that.downloadImg(item, () => {
        let length = that.getDownloadDataLength();
        if (hasDownLoadNum !== length - 1) {
            that.one(imgArr, that);
        }
    })
}
/**
 * @function all
 * @description 下载图片：一次性
 */
loadImg.prototype.all = function (imgArr, that) {
    imgArr.forEach((item, index) => {
        that.downloadImg(item);
    })
}
/**
 * @function downloadImg
 * @description 下载图片
 * @param {function} callback 下载完成时回调
 */
loadImg.prototype.downloadImg = function (item, callback) {
    let that = this;
    let img = item.target;
    let src = item.src;
    let finishHandle = item.finishHandle;
    img.onload = function () {
        that.updateDownloadStatus(img);
        callback && callback(img);
        finishHandle && finishHandle(img);
        img.onload = null;
    };
    img.src = src;
}
/**
 * @function updateDownloadStatus
 * @description 更新下载图片状态
 * @param {img} img 图片元素
 */
loadImg.prototype.updateDownloadStatus = function (img) {
    this.hasDownLoadNum += 1;
    let length = this.getDownloadDataLength();
    let updateFn = this.getUpdateFn();
    updateFn && updateFn(img, this.hasDownLoadNum, length);
    if (this.hasDownLoadNum === length) {
        let allDownloadFn = this.getAllDownloadFn();
        allDownloadFn && allDownloadFn();
    }
}