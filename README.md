## Introduction

Vue imitates the drag function of the native mobile terminal to realize the plug-in, integrates and encapsulates Vue instructions, and realizes the function similar to the drag application of mobile phone .
vue仿原生移动端拖拽功能实现插件，集成封装vue指令,实现类似手机拖拽应用的功能。

1. demo feature:

![]('https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/drag-demo.gif')

2. actual combat feature:
![]('https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/drag.gif')

## Install

You can install it via npm or yarn :
您可以通过npm或Thread进行安装 ：

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

## step 2
attach dom to use v-mobile-drag directives，set getFabricDragOpts to get config object .
在dom标签使用v-mobile-drag指令，配置getFabricDragOpts函数，返回配置对象。
```vue
<template>
<div>
  <div ref='target' class='target'></div>
  <div v-mobile-drag="getDragOpts" class='drag' v-for='(item,index) in list' :key='index'>{{item}}</div>
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
  const getDragOpts = (cb) => {
    if (!target.value) {
      setTimeout(() => {
         getDragOpts(cb);
       },200);
    } else {
      cb({
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

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
此内容在[MIT]下发布(http://opensource.org/licenses/MIT)许可证。
