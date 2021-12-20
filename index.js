/* eslint-disable */
/* 参数情况
  dragEle：需要拖动的元素（可以为元素本身，也可以为需拖动元素（组）的选择器 "#drag" or ".drag"， 可以是一组的元素）
  tarEle：目标位置元素
  posArr：定位数组（需要将元素拖至的固定区域,顺序为top,left,width,height）注：tarEle与posArr设置一个即可，两个同时设置则以tarEle为主
  longPressEffectProhibit:是否禁用默认长按放大效果
  endNail: 结束拖拽是否还原拖拽元素位置
  onLongPress: 长按触发执行函数，参数为拖动的元素,目标元素和event
  onStart：拖动开始时执行函数，参数为即将拖动的元素,目标元素和event
  onMove：拖动时执行函数，参数为拖动的元素,目标元素和event
  onMoveIn：拖动过程中拖动元素在目标内执行函数，参数为被拖动的元素,目标元素和event
  onMoveOut: 拖动过程中拖动元素在目标外执行函数，参数为被拖动的元素,目标元素和event
  onInEnd: 拖动结束时如果拖动元素在目标内执行函数，参数为被拖动的元素,目标元素和event
  onOutEnd: 拖动结束时如果拖动元素在目标外执行函数，参数为被拖动的元素,目标元素和event
  onEnd：拖动结束时执行函数，参数为被拖动的元素,目标元素和event
*/

;(function () {
  const eventArr = ['touchstart', 'touchmove', 'touchend'];
  const nail = () => {};
  function mobileDrag(opts) {
    this.timer = '';
    this.isLongTouch = false; // 加个标志位，防止settimeout因为事件循环和实际时间有偏差
    this.opts = opts || {};
    this.opts.onStart = this.opts.onStart || nail;
    this.opts.onLongPress = this.opts.onLongPress || nail;
    this.opts.onMove = this.opts.onMove || nail;
    this.opts.onMoveOut = this.opts.onMoveOut || nail;
    this.opts.onMoveIn = this.opts.onMoveIn || nail;
    this.opts.onInEnd = this.opts.onInEnd || nail;
    this.opts.onOutEnd = this.opts.onOutEnd || nail;
    this.opts.onEnd = this.opts.onEnd || nail;
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
      // 处理长按事件
      if (!this.opts.longPressEffectProhibit) {
        tar.style.cssText = 'transform: scale(1.1);';
      }
      this.opts.onLongPress(tar, this.tarEle, e);
    }, 700);
    // if (e.changedTouches.length === 1) {
    // e.stopPropagation();
    //执行定义在拖动开始时须执行的函数， 参数为即将拖动的元素
    // 处理点击事件
    this.opts.onStart(tar, this.tarEle, e);
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
    //重置标志位
    this.isLongTouch = false;
    //检测最终位置
    this.checkPos('end', e.currentTarget, e);
    this.opts.onEnd(e.currentTarget, this.tarEle, e);
  };

  mobileDrag.prototype.setMove = function (e, type) {
    const x = this.moveX || 0;
    const y = this.moveY || 0;
    if (type === 'reset') {
      if(!this.opts.endNail) {
        e.style.cssText = '';
      }
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
      this.moveY = aH - this.dragT - this.dragH;
    }
  };

  mobileDrag.prototype.checkPos = function (type, e, event) {
    //判断拖动元素是否到达目标位置，判断方式更具情况而定，此处判断的依据是：touch事件位置判断，即结束时touch的位置是否在目标区域位置
    if (this.nowX > this.tarL && this.nowX < this.tarL + this.tarW && this.nowY > this.tarT && this.nowY < this.tarT + this.tarH) {
      // if (this.tarEle) {
      // this.tarEle.style.cssText = 'opacity: 1';
      // }
      //进入目标区域
      if (type === 'move' && !!this.opts.tarEle) {
        //在移动过程中，进入目标区域
        this.opts.onMoveIn(e, this.tarEle, event);
      } else if (type === 'end') {
        //在拖动结束时进入目标区域
        this.opts.onInEnd(e, this.tarEle, event);
      }
    } else {
      // if (this.tarEle) {
      // this.tarEle.style.cssText = 'opacity: .5';
      // }
      if (type === 'move' && !!this.opts.tarEle) {
        this.opts.onMoveOut(e, this.tarEle, event);
      } else if (type === 'end') {
        this.opts.onOutEnd(e, this.tarEle, event);
      }
    }
    if (type === 'end') {
      this.resetFun(e);
    }
  }
  ;

  mobileDrag.prototype.resetFun = function (e) {
    this.moveX = this.moveY = 0;
    this.startX = this.startY = 0;
    this.nowY = this.top;
    this.nowX = this.left;
    this.setMove(e, 'reset');
  };

  mobileDrag.prototype.removeEvent = function (e) {
    for (let i = eventArr.length - 1; i >= 0; i--) {
      e.removeEventListener(eventArr[i], this[eventArr[i]].bind(this));
    }
  };

  var mobileDragDirectives = {//点击事件

    async beforeMount(el, binding) {
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

    beforeUnmount: function (el, binding) {
      // @ts-ignore
      el.instance && el.instance.removeEvent(el);
    },

    unbind: function (el, binding) {
      // @ts-ignore
      el.instance && el.instance.removeEvent(el);
    },

  };

  var directives = {
    mobileDrag: mobileDragDirectives,
  };

  var mobileDragPlugin = {
    install(_Vue) {
      Object.keys(directives).forEach(k => {
        _Vue.directive(k, directives[k]);
      });
    },
  };

  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = mobileDragPlugin;
  } else {
    window.mobileDragPlugin = mobileDragPlugin;
  }

})
();
