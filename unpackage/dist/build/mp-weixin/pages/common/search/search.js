(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/common/search/search"],{"278d":function(t,e,i){"use strict";i.r(e);var n=i("3ab5"),o=i("aed3");for(var s in o)"default"!==s&&function(t){i.d(e,t,(function(){return o[t]}))}(s);i("bbda");var u,c=i("f0c5"),r=Object(c["a"])(o["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],u);e["default"]=r.exports},"3ab5":function(t,e,i){"use strict";i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return n}));var n={tuiIcon:function(){return Promise.all([i.e("common/vendor"),i.e("components/thorui/tui-icon/tui-icon")]).then(i.bind(null,"acf0"))},tuiTag:function(){return i.e("components/thorui/tui-tag/tui-tag").then(i.bind(null,"9d73"))},tuiActionsheet:function(){return i.e("components/thorui/tui-actionsheet/tui-actionsheet").then(i.bind(null,"d5ef"))}},o=function(){var t=this,e=t.$createElement;t._self._c},s=[]},"50f2":function(t,e,i){"use strict";(function(t){i("c514");n(i("66fd"));var e=n(i("278d"));function n(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=i,t(e.default)}).call(this,i("543d")["createPage"])},aed3:function(t,e,i){"use strict";i.r(e);var n=i("f8d3"),o=i.n(n);for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);e["default"]=o.a},bbda:function(t,e,i){"use strict";var n=i("e25d"),o=i.n(n);o.a},e25d:function(t,e,i){},f8d3:function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=o(i("0d3e"));function o(t){return t&&t.__esModule?t:{default:t}}var s={data:function(){return{removeIndex:"",history:[],hot:[],key:"",showActionSheet:!1,tips:"确认清空搜索历史吗？",searchResult:[],searchList:[],productNames:[]}},onLoad:function(e){this.history=t.getStorageSync("hotKeys")||[],this.key=e.key,console.log("history",this.history)},computed:{productList:function(){return this.$store.state.goodsList}},methods:{onDelete:function(e){this.history.splice(e,1),t.setStorage({key:"hotKeys",data:this.history}),this.removeIndex=""},onSelect:function(t){this.key=t,this.onInput(this.key)},onDetail:function(e){var i=this;setTimeout((function(){i.history.includes(i.key)||(i.history.push(i.key),t.setStorage({key:"hotKeys",data:i.history}))}),500),t.navigateTo({url:"/pages/index/productDetail/productDetail?spu_id="+e.spu_id+"&sku_id="+e.id})},cleanKey:function(){this.key=""},showIcon:function(t){this.removeIndex=t},closeActionSheet:function(){this.showActionSheet=!1},openActionSheet:function(){this.showActionSheet=!0},itemClick:function(e){0===e.index&&(this.showActionSheet=!1,this.history=[],t.setStorage({key:"hotKeys",data:this.history}))},onInput:function(t){if(t){var e=[];this.searchResult=this.productList.filter((function(e){return e.title.includes(t)})),this.searchResult.forEach((function(i){e.push({key:i.title,spu_id:i.spu_id,id:i.id,showKey:n.default.replaceAll(i.title,t,'<label style="color:#E41F19">'.concat(t,"</label>"))})})),this.searchList=e,0===this.searchResult.length&&this.tui.toast("没有相关商品")}else this.searchList=[]},inputKey:function(t){console.log("input",t),this.key=n.default.trim(t.detail.value),this.onInput(this.key)},onSearch:function(){var e=this;this.key?(setTimeout((function(){e.history.includes(e.key)||(e.history.push(e.key),t.setStorage({key:"hotKeys",data:e.history}),e.key="")}),500),0===this.searchResult.length?this.tui.toast("没有相关商品"):(this.$store.commit("setSearchResult",this.searchResult),t.navigateTo({url:"/pages/index/productList/productList?searchKey="+this.key}))):this.tui.toast("请输入关键词")}}};e.default=s}).call(this,i("543d")["default"])}},[["50f2","common/runtime","common/vendor"]]]);