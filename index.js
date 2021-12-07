/* eslint-disable */
/* 参数情况
  dragEle：需要拖动的元素（可以为元素本身，也可以为需拖动元素（组）的选择器 "#drag" or ".drag"， 可以是一组的元素）
  tarEle：目标位置元素
  posArr：定位数组（需要将元素拖至的固定区域,顺序为top,left,width,height）注：tarEle与posArr设置一个即可，两个同时设置则以tarEle为主
  onLongPress: 长按触发执行函数，参数为即将拖动的元素
  onStart：拖动开始时执行函数，参数为即将拖动的元素
  onMove：拖动时执行函数，参数为拖动的元素
  onMoveIn：拖动过程中拖动元素到达目标位置执行函数，目如果目标位置为标位置元素（一个元素时）
  onEnd：拖动结束时拖动元素到达目标位置执行函数，参数为被拖动的元素
*/
; (function() {

  const eventArr = ['touchstart', 'touchmove', 'touchend'];

  function mobileDrag(opts) {
    this.timer = '';
    this.isLongTouch = false; // 加个标志位，防止settimeout因为事件循环和实际时间有偏差
    this.opts = opts || {};
    this.opts.onStart = this.opts.onStart || function () {
    };
    this.opts.onLongPress = this.opts.onLongPress || function () {
    };
    this.opts.onMove = this.opts.onMove || function () {
    };
    this.opts.onMoveIn = this.opts.onMoveIn || function () {
    };
    this.opts.onEnd = this.opts.onEnd || function () {
    };
    this.init();
  }

  mobileDrag.prototype = {
    $: function (e) {
      return document.querySelectorAll(e);
      //选择器使用选择所有匹配元素
    },
  };

  mobileDrag.prototype.init = function () {
    //需拖动的元素
    this.dragEle = typeof this.opts.dragEle === 'string' ? this.$(this.opts.dragEle) : this.opts.dragEle;
    const len = this.dragEle.length;
    if (!!len) {
      for (let i = len - 1; i >= 0; i--) {
        this.addEvent(this.dragEle[i]);
      }
      // this.dragEle.forEach(function(v,i) {
      // 	alert('listener')
      // 	this.addEvent(v);
      // }, this);
    } else {
      this.addEvent(this.dragEle);
    }
    if (!!this.opts.tarEle) {
      //目标位置的元素
      this.tarEle = typeof this.opts.tarEle === 'string' ? this.$(this.opts.tarEle)[0] : this.opts.tarEle;
      const info = this.tarEle.getBoundingClientRect();
      this.tarT = info.top;
      this.tarL = info.left;
      this.tarW = this.tarEle.offsetWidth || this.tarEle.clientWidth;
      this.tarH = this.tarEle.offsetHeight || this.tarEle.clientHeight;
    } else {
      this.tarT = this.opts.posArr[0];
      this.tarL = this.opts.posArr[1];
      this.tarW = this.opts.posArr[2];
      this.tarH = this.opts.posArr[3];
    }
  };

  mobileDrag.prototype.addEvent = function (e) {
    for (let i = eventArr.length - 1; i >= 0; i--) {
      e.addEventListener(eventArr[i], this[eventArr[i]].bind(this), false);
    }
    // eventArr.forEach(function(v, i) {
    // 	e.addEventListener(v, this[v].bind(this), false);
    // }, this);
  };

  mobileDrag.prototype.touchstart = function (e) {
    const tar = e.currentTarget;
    this.timer = setTimeout(() => {
      this.isLongTouch = true;
      // 处理长按事件...
      tar.style.cssText = 'transform: scale(1.1);';
      this.opts.onLongPress();
    }, 700);
    // if (e.changedTouches.length === 1) {
    // e.stopPropagation();
    //执行定义在拖动开始时须执行的函数， 参数为即将拖动的元素
    this.opts.onStart(tar, e);
    //初始化拖动元素的位置信息；
    const info = tar.getBoundingClientRect();
    this.dragT = info.top;
    this.dragL = info.left;
    this.dragW = tar.offsetWidth || tar.clientWidth;
    this.dragH = tar.offsetHeight || tar.clientHeight;
    //定义开始移动位置
    this.startX = e.pageX || e.touches[0].pageX;
    this.startY = e.pageY || e.touches[0].pageY;
    //重置移动参数
    this.moveX = this.moveY = 0;
    // } else {
    //   alert(e.changedTouches.length);
    // }
  };

  mobileDrag.prototype.touchmove = function (e) {
    // if (e.changedTouches.length === 1) {
    clearTimeout(this.timer);
    if (this.isLongTouch) {
      e.preventDefault();
      const tar = e.currentTarget;
      this.opts.onMove(tar, e);
      this.nowX = e.pageX || e.touches[0].pageX;
      this.nowY = e.pageY || e.touches[0].pageY;

      //计算目标元素需移动的距离
      this.moveX = this.nowX - this.startX;
      this.moveY = this.nowY - this.startY;

      //检测是否越界，并调整
      this.checkOver(this.moveX, this.moveY);

      //进行拖动元素移动操作
      this.setMove(tar);

      //检测是否落入目标位置
      this.checkPos('move', tar, e);
    }
    // }
  };

  mobileDrag.prototype.touchend = function (e) {
    clearTimeout(this.timer);
    if (!this.isLongTouch) {
      // 处理点击事件...
    } else {
      this.isLongTouch = false; // 重置标志位
    }
    //目标区域的视觉变化
    if (this.tarEle) {
      // this.tarEle.style.cssText = 'opacity: .5;';
    }
    //检测最终位置
    this.checkPos('end', e.currentTarget, e);
  };

  mobileDrag.prototype.setMove = function (e) {
    const x = this.moveX || 0;
    const y = this.moveY || 0;
    if (type === 'reset') {
      e.style.cssText = '';
      return;
    }
    e.style.cssText += 'position: fixed;-webkit-transform: translate(' + x + 'px,' + y + 'px);-moz-transform: translate(' + x + 'px,' + y + 'px);-o-transform: translate(' + x + 'px,' + y + 'px);-ms-transform: translate(' + x + 'px,' + y + 'px);';
  };

  mobileDrag.prototype.checkOver = function (moveX, moveY) {
    //检测元素是否越界
    const aW = document.body.clientWidth || window.screen.width;
    const aH = document.body.clientHeight || window.screen.height;
    const x = this.dragL + moveX;
    const y = this.dragT + moveY;
    const w = this.dragL + this.dragW + moveX;
    const h = this.dragT + this.dragH + moveY;

    if (x < 0) {
      this.moveX = -this.dragL;
    } else if (w > aW) {
      this.moveX = aW - this.dragL - this.dragW;
    }
    if (y < 0) {
      this.moveY = -this.dragT;
    } else if (h > aH) {
      console.log(2);
      this.moveY = aH - this.dragT - this.dragH;
    }
  };

  mobileDrag.prototype.checkPos = function (type, e, event) {
    //判断拖动元素是否到达目标位置，判断方式更具情况而定，此处判断的依据是：touch事件位置判断，即结束时touch的位置是否在目标区域位置
    if (this.nowX > this.tarL && this.nowX < this.tarL + this.tarW && this.nowY > this.tarT && this.nowY < this.tarT + this.tarH) {
      if (this.tarEle) {
        // this.tarEle.style.cssText = 'opacity: 1';
      }
      //进入目标区域
      if (type === 'move' && !!this.opts.tarEle) {
        //在移动过程中，进入目标区域
        this.opts.onMoveIn(this.tarEle, e, event);
      } else if (type === 'end') {
        //在拖动结束时进入目标区域
        this.opts.onEnd(e, event);
      }
    } else {
      if (this.tarEle) {
        // this.tarEle.style.cssText = 'opacity: .5';
      }
    }
    if (type === 'end') {
      this.resetFun(e);
    }
  };

  mobileDrag.prototype.resetFun = function (e) {
    this.moveX = this.moveY = 0;
    this.startX = this.startY = 0;
    this.nowY = this.top;
    this.nowX = this.left;
    // e.innerHTML = 'drag' + e.dataset.num;
    this.setMove(e, 'reset');
  };

  mobileDrag.prototype.removeEvent = function (e) {
    for (let i = eventArr.length - 1; i >= 0; i--) {
      e.removeEventListener(eventArr[i], this[eventArr[i]].bind(this));
    }
  };

  var mobileDragDirectives = {//点击事件
    async inserted(el, binding) {
      if (typeof binding.value == 'function') {
        binding.value((opts) => {
          // @ts-ignore
          el.instance = new mobileDrag({
            dragEle: el,
            ...opts,
          });
        });
      } else {
        throw new Error('v-mobile-drag directives params must to be function and return option object');
      }
    },
    unbind: function (el, binding) {
      // @ts-ignore
      el.instance && el.instance.removeEvent();
    },
  };

  var directives = {
    mobileDragDirectives,
  };

  var mobileDragPlugin = {
    install(_Vue) {
      Object.keys(directives).forEach(k => {
        _Vue.directive(k, directives[k]);
      });
    },
  };

  // export
  if(typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = mobileDragPlugin;
  } else {
    window.mobileDragPlugin = mobileDragPlugin;
  }

})();
