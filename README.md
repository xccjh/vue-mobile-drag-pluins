## vue仿原生移动端拖拽功能实现插件

集成封装vue指令,实现类似手机拖拽应用的功能

## Install

You can install it via npm or yarn:

```html
npm install @xccjh/vue-mobile-drag
yarn add @xccjh/vue-mobile-drag
```

## Usage
### step 1
```js 
// main.js or other entry to register directives
import Directives from '@xccjh/vue-mobile-drag';

Vue.use(Directives)
```

## step 2
attach dom to use v-mobile-drag directives，set getFabricDragOpts to get config
```vue
<template>
<div>
  <div ref='target' class='target'></div>
  <div v-mobile-drag="getFabricDragOpts" class='drag' v-for='(item,index) in list' :key='index'></div>
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
  const getFabricDragOpts = (cb) => {
    if (!target.value) {
      setTimeout(() => {
         getFabricDragOpts(cb);
       },200);
    } else {
      cb({
        tarEle: target.value,
        // posArr: [0, 0, document.body.clientWidth || window.screen.width, document.body.clientHeight || window.screen.height],
        async onEnd(ele, event) {
            // ele.innerHTML = '移入目标区域';
            // ele.style.cssText += 'display: none;';
        },
        async onStart(ele, event) {
          // ele.innerHTML = '接触到元素';
        },
        async onMove(ele, event) {
          // ele.innerHTML = '元素在移动';
        },
        async onMoveIn(ele, target, event) {
           console.log('元素进入目标范围');
          // ele.style.cssText = 'opacity: 1;';
        },
        async onLongPress(ele, event) {
           console.log('触发长按元素');
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
