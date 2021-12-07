## Introduction

Vue imitates the drag function of the native mobile terminal to realize the plug-in, integrates and encapsulates Vue instructions, and realizes the function similar to the drag application of mobile phone .

vue仿原生移动端拖拽功能实现插件，集成封装vue指令,实现类似手机拖拽应用的功能。

1. demo feature:

![](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/drag-demo.gif)

2. actual combat feature:

![](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/drag.gif)

## Install

You can install it via npm or yarn :

您可以通过npm或yarn进行安装 ：

```html
npm install @xccjh/vue-mobile-drag

yarn add @xccjh/vue-mobile-drag
```

## Usage

### step 1

```js 
// app entry main.js or other sub module to register directives
// 在应用入口main.js或其他子模块注册指令
import VueMobileDrag from '@xccjh/vue-mobile-drag';

Vue.use(VueMobileDrag)
```

### step 2

attach dom to use v-mobile-drag directives，set getFabricDragOpts to get config object .

在dom标签使用v-mobile-drag指令，配置getFabricDragOpts函数，返回配置对象。
```vue
<template>
<div>
  <div ref='target' class='target'></div>
  <div v-mobile-drag="getDragOpts" class='drag' v-for='(item,index) in list' :key='index'>{{item}}</div> <!-- 👈 v-mobile-drag -->
</div>
</template>
<script>
export default {

setup() {
    const list = [1,2,3];
    const target = ref();
  /**
   * 模拟手机原生拖拽功能
   * @param cb
   */
  const getDragOpts = (cb) => { // 👈 v-mobile-drag指令入参是个函数
    if (!target.value) {
      setTimeout(() => {
         getDragOpts(cb);
       },200);
    } else {
      cb({  // 👈 cb回调用传入配置，支持异步配置 ，如果想用refs响应式，可以使用vue-reactive-refs
        tarEle: target.value,
        // posArr: [0, 0, document.body.clientWidth || window.screen.width, document.body.clientHeight || window.screen.height],
        async onEnd(ele, target, event) {
            console.log('松开了目标')
        },
        async onInEnd(ele, target, event) {
            ele.innerHTML = '在目标内松开';
            ele.style.cssText += 'display: none;';
        },
        async onOutEnd(ele, target, event) {
            ele.innerHTML = '在目标外松开';
         },
        async onStart(ele, target, event) {
          ele.innerHTML = '接触到元素';
        },
        async onMove(ele, target, event) {
           console.log('元素在移动');
        },
        async onMoveIn(ele, target, event) {
           ele.innerHTML = '元素在目标范围内'
          // ele.style.cssText = 'opacity: 1;';
        },
        async onMoveOut(ele, target, event) {
           ele.innerHTML = '元素在目标范围外'
          // ele.style.cssText = 'opacity: 1;';
        },
        async onLongPress(ele, target, event) {
           ele.innerHTML = '触发长按元素';
        },
      });
    }
  };
    return {
        list,
        getFabricDragOpts,
    }
}
}
</script>
```
## other

```js
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
```

## License

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.

此内容在[MIT]下发布(http://opensource.org/licenses/MIT)许可证。
