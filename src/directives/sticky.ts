/**
 * v-sticky
 * 元素吸顶指令，用在 dom 元素上，当滑动到顶部时吸顶
 * 使用：给想要固定头部的 table 加上 v-sticky , 参数 top: 指定距离顶部的高度， parent: 指定滚动容器，如果滚动容器是 documnet 则不传
 * <el-table v-sticky="{ top: 0, parent: '#table_box' }"></el-table>
 */
import type { Directive, DirectiveBinding, VNode } from "vue";

/**
 * 这里有三个全局对象。用于存放监听事件。方便组件销毁后移除监听事件
 */
const fixFunObj = <any>{}; // 用于存放滚动容器的监听scroll事件
const setWidthFunObj = <any>{}; // 用于存放页面resize后重新计算head宽度事件
// const autoMoveFunObj = {}; // 用户存放如果是DOM元素内局部滚动时，document滚动时，fix布局的表头也需要跟着document一起向上滚动

const sticky: Directive = {
  // 当被绑定的元素插入到 DOM 中时
  mounted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    const { value } = binding;

    setHeadWidth(el);

    // 获取当前 虚拟node 的ID。作为存放各种监听事件的key
    // @ts-ignore
    const uid = vnode.ctx.uid;
    // console.log("ctx uid", uid, fixFunObj);
    // const _uid = vnode.appContext?.app._uid;
    // console.log("app _uid", _uid);

    // 当window resize时 重新计算设置表头宽度，并将监听函数存入 监听函数对象中，方便移除监听事件
    window.addEventListener(
      "resize",
      (setWidthFunObj[uid] = () => {
        setHeadWidth(el);
      })
    );

    // 获取当前滚动的已定位父级（一般需要给父级设置 position: relative），如果容器是document 则可默认不传入parent参数
    const scrollParent = document.querySelector(value.parent) || document;
    // 给滚动容器加scroll监听事件。并将监听函数存入 监听函数对象中，方便移除监听事件
    scrollParent.addEventListener(
      "scroll",
      (fixFunObj[uid] = () => {
        fixHead(scrollParent, el, value.top);
      })
    );
  },
  updated(el: HTMLElement) {
    // 处理页面首次加载后，表格头首次滑动到顶部时出现的宽度变化问题
    setHeadWidth(el);
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    // 获取当前 虚拟node 的ID。作为存放各种监听事件的key
    // @ts-ignore
    const uid = vnode.ctx.uid;
    // console.log("ctx uid", uid);
    window.removeEventListener("resize", setWidthFunObj[uid]);
    // 获取当前滚动的容器是什么。如果容器是document 则可默认不传入parent参数
    const scrollParent = document.querySelector(binding.value.parent) || document;
    scrollParent.removeEventListener("scroll", fixFunObj[uid]);
    // el.removeEventListener("click", el.__handleClick__);
    delete fixFunObj[uid];
    // fixFunObj[uid] = undefined;
  },
};

function fixHead(parent: HTMLElement, el: HTMLElement, top: number) {
  /**
   * myTop 当前元素上边框外边缘到滚动窗口可视区域顶部的距离
   * fixtop 当前元素需要设置的绝对定位的高度
   */
  let myTop, fixtop;
  // 表头 DOM 节点
  const dom = el.querySelector(".el-table__header-wrapper") as HTMLElement;
  // el 上边框外边缘到滚动窗口可视区域顶部的距离 = el 上边框外边缘距离最近的已定位父级上边框内边缘的距离 -父元素的滚动距离
  myTop = el.offsetTop - parent.scrollTop;
  // 绝对定位的高度 = 滚动父窗口相对视口的高度 + 传入的吸顶高度
  fixtop = top + parent.getBoundingClientRect().top;
  // 如果表头滚动到父容器顶部了，fixed 定位
  if (myTop <= 0) {
    dom && addClass(dom, fixtop);
  } else {
    dom && removeClass(dom);
  }
  // console.log(parent.getBoundingClientRect().top);
  // console.log(el.offsetTop);
  // console.log(parent, el, top);
}

// 给固定头添加 class 用于识别并添加样式
function addClass(dom: HTMLElement, fixtop: number) {
  const oldClassName = dom.className;
  if (!oldClassName.includes("fixed")) {
    dom.setAttribute("class", oldClassName + " fixed");
    dom.style.position = "fixed";
    dom.style.zIndex = "2001";
    dom.style.top = fixtop + "px";
    // dom.style.width = "1200px";
  }
}

// 给固定头移动 class 并取消样式
function removeClass(dom: HTMLElement) {
  const oldClassName = dom.className;
  const index = oldClassName.indexOf(" fixed");
  if (index !== -1) {
    const newClassName = oldClassName.slice(0, index);
    dom.setAttribute("class", newClassName);
    dom.style.position = "static";
    dom.style.zIndex = "0";
    dom.style.top = "0";
  }
}

// 设置头部固定时，头部宽度设置为表格 body 的宽度，避免头部太长遮住竖向滚动条
function setHeadWidth(table: HTMLElement) {
  // 获取到当前表格 body 的宽度
  let tableBody = table.querySelector(".el-table__body-wrapper");
  if (tableBody) {
    const tableBodyWidth = getComputedStyle(tableBody).width;
    const head = table.querySelector(".el-table__header-wrapper") as HTMLElement;
    head.style.width = tableBodyWidth;
  }
}

export default sticky;
