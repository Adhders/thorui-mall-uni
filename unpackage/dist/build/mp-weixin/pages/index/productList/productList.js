(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/productList/productList"],{"1d4f":function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return s})),n.d(e,"a",(function(){return i}));var i={tuiIcon:function(){return Promise.all([n.e("common/vendor"),n.e("components/thorui/tui-icon/tui-icon")]).then(n.bind(null,"acf0"))},tuiWaterfall:function(){return Promise.all([n.e("common/vendor"),n.e("components/thorui/tui-waterfall/tui-waterfall")]).then(n.bind(null,"2c89"))},tuiNoData:function(){return n.e("components/thorui/tui-no-data/tui-no-data").then(n.bind(null,"5478"))},tuiDrawer:function(){return n.e("components/thorui/tui-drawer/tui-drawer").then(n.bind(null,"e7d9"))},tuiCollapse:function(){return n.e("components/thorui/tui-collapse/tui-collapse").then(n.bind(null,"3b55"))},tuiLoadmore:function(){return n.e("components/thorui/tui-loadmore/tui-loadmore").then(n.bind(null,"5f80"))},tuiNomore:function(){return n.e("components/thorui/tui-nomore/tui-nomore").then(n.bind(null,"3a24"))}},r=function(){var t=this,e=t.$createElement,n=(t._self._c,t.displayList.length>0?t.px(t.dropScreenH+18):null),i=t.__map(t.dataList,(function(e,n){var i=t.__get_orig(e),r=n<=2?t.__map(e.values.slice(0,3),(function(e,i){var r=t.__get_orig(e),s=t.selectedIndex[n].includes(i);return{$orig:r,g0:s}})):null,s=n<=2?t.__map(e.values.slice(3),(function(e,i){var r=t.__get_orig(e),s=t.selectedIndex[n].includes(i+3);return{$orig:r,g1:s}})):null,o=n<=2?null:t.__map(e.values,(function(e,i){var r=t.__get_orig(e),s=t.selectedIndex[n].includes(i);return{$orig:r,g2:s}}));return{$orig:i,l0:r,l1:s,l2:o}}));t.$mp.data=Object.assign({},{$root:{m0:n,l3:i}})},s=[]},"2ab0":function(t,e,n){},3096:function(t,e,n){"use strict";n.r(e);var i=n("45f0"),r=n.n(i);for(var s in i)"default"!==s&&function(t){n.d(e,t,(function(){return i[t]}))}(s);e["default"]=r.a},"45f0":function(t,e,n){"use strict";(function(t){function i(t){return u(t)||o(t)||s(t)||r()}function r(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function s(t,e){if(t){if("string"===typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(t,e):void 0}}function o(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function u(t){if(Array.isArray(t))return a(t)}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var c=function(){n.e("components/views/t-goods-item/t-goods-item").then(function(){return resolve(n("0707"))}.bind(null,n)).catch(n.oe)},l={components:{tGoodsItem:c},data:function(){return{min:"",max:"",entity:"",searchKey:"",width:200,height:64,inputTop:0,arrowTop:0,dropScreenH:0,attrIndex:-1,scrollTop:0,tabIndex:0,isList:!1,drawer:!1,drawerH:0,selectedName:"综合",selectH:0,dropdownList:[{name:"综合",selected:!0},{name:"价格升序",selected:!1},{name:"价格降序",selected:!1}],displayList:[],currentList:[],selectedIndex:[],selectedCondition:[],dataList:[],pageIndex:1,loadding:!1,pullUpOn:!0}},onLoad:function(e){var n=this;if(e.searchKey)this.searchKey=e.searchKey,this.currentList=this.$store.state.searchResult;else if(e.groupList){var i=JSON.parse(e.groupList);this.currentList=this.productList.filter((function(t){return t.selectedClassifyList.filter((function(t){return i.indexOf(t)>-1})).length>0}))}else e.similarKey?this.currentList=this.productList.filter((function(t){return n.similar(t.title,e.similarKey,2)})):this.currentList=this.productList;this.$nextTick((function(){var t=[];n.goodsGroup.forEach((function(e){t.push(e.name)})),n.dataList.push({name:"全部分类",current:0,values:t});var e={};n.productList.forEach((function(t){t.selectedGoodsAttrList.forEach((function(t){e[t.name]?e[t.name].add(t.value):e[t.name]=new Set([t.value])}))}));var i=Object.keys(e).map((function(t){return{name:t,values:Array.from(e[t])}})).sort((function(t,e){return e.values.length-t.values.length}));i.forEach((function(t){n.dataList.push({name:t.name,current:-1,values:t.values})})),n.selectedCondition=new Array(n.dataList.length).fill(""),n.selectedIndex=n.dataList.map((function(){return[]}))}));var r={};r=wx.getMenuButtonBoundingClientRect(),t.getSystemInfo({success:function(e){n.width=r.left||e.windowWidth,n.height=r.top?r.top+r.height+8:e.statusBarHeight+44,n.inputTop=r.top?r.top+(r.height-30)/2:e.statusBarHeight+7,n.arrowTop=r.top?r.top+(r.height-32)/2:e.statusBarHeight+6,n.dropScreenH=750*n.height/e.windowWidth+84,n.drawerH=e.windowHeight-t.upx2px(100)-n.height}})},computed:{productList:function(){return this.$store.state.goodsList},goodsGroup:function(){return this.$store.state.goodsGroup}},watch:{currentList:function(t){0===t.length&&this.tui.toast("暂无匹配商品，更改选项试试吧"),this.displayList=t}},methods:{px:function(e){return t.upx2px(e)+"px"},change:function(t){var e=t.index,n=this.dataList[e];n.current=n.current==e?-1:e},reset:function(){var t=this.dataList.length;this.min="",this.max="",this.selectedIndex=this.dataList.map((function(){return[]})),this.selectedCondition=new Array(t).fill("")},onDelete:function(){this.searchKey="",this.isList=!1,this.currentList=this.productList},onChangePrice:function(){this.filter()},filter:function(){var t=this,e=this.productList;this.min&&(e=e.filter((function(e){return e.price>=t.min}))),this.max&&(e=e.filter((function(e){return e.price<=t.max})));var n=this.selectedCondition[0]?this.selectedCondition[0].split("，"):[];n.length>0&&(e=e.filter((function(t){var e=t.selectedClassifyList.filter((function(t){return n.includes(t)}));return e.length>0})));var r=[];this.selectedCondition.slice(1).forEach((function(t){t&&r.push.apply(r,i(t.split("，")))})),r.length>0&&(e=e.filter((function(t){var e=[];t.selectedGoodsAttrList.forEach((function(t){e.push(t.value)}));var n=e.filter((function(t){return r.includes(t)}));return n.length>0}))),this.currentList=e},onSelect:function(t,e){var n=this,i=this.selectedIndex[t].indexOf(e);-1!==i?this.selectedIndex[t].splice(i,1):this.selectedIndex[t].push(e);var r="",s=this.dataList[t].values;this.selectedIndex[t].forEach((function(t){r=r+s[t]+"，"})),r=r.slice(0,r.length-1),this.selectedCondition[t]=r,this.$forceUpdate(),this.$nextTick((function(){n.filter()}))},showDropdownList:function(){this.selectH=246,this.tabIndex=0},hideDropdownList:function(){this.selectH=0},similar:function(t,e,n){var i=t.length>e.length?e:t;e==i&&(e=t),t=i,n||(n=1);for(var r=new Array,s=0;s<t.length;s++)for(var o=s+n;o<=t.length;o++){var u=t.substring(s,o);if(-1==e.indexOf(u)){u.length>n&&(r[r.length]=t.substring(s,o-1),s=o-2);break}o==t.length&&(r[r.length]=u)}return r.join("")},dropdownItem:function(t){for(var e=Number(t.currentTarget.dataset.index),n=this.dropdownList,i=0;i<n.length;i++)n[i].selected=i===e;this.dropdownList=n,this.selectedName=0==e?"综合":1==e?"价格升序":"价格降序",this.selectH=0,1===e?this.displayList=this.currentList.sort((function(t,e){return t.price-e.price})):2===e&&(this.displayList=this.currentList.sort((function(t,e){return e.price-t.price})))},screen:function(t){var e=t.currentTarget.dataset.index;this.hideDropdownList(),0==e?this.showDropdownList():1==e?(this.tabIndex=1,this.selectedName="综合",this.dropdownList.forEach((function(t){t.select=!1})),this.displayList=this.currentList.sort((function(t,e){return e.salesNum-t.salesNum}))):2==e?this.isList=!this.isList:3==e&&(this.drawer=!0)},closeDrawer:function(){this.displayList=this.currentList,this.drawer=!1,this.$forceUpdate()},back:function(){this.drawer?this.closeDrawer():t.navigateBack()},search:function(){t.navigateTo({url:"/pages/common/search/search"})}},onReachBottom:function(){this.pullUpOn&&(this.loadding=!1)}};e.default=l}).call(this,n("543d")["default"])},"65d4":function(t,e,n){"use strict";var i=n("2ab0"),r=n.n(i);r.a},"7a43":function(t,e,n){"use strict";(function(t){n("c514");i(n("66fd"));var e=i(n("85e4"));function i(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},"85e4":function(t,e,n){"use strict";n.r(e);var i=n("1d4f"),r=n("3096");for(var s in r)"default"!==s&&function(t){n.d(e,t,(function(){return r[t]}))}(s);n("65d4");var o,u=n("f0c5"),a=Object(u["a"])(r["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],o);e["default"]=a.exports}},[["7a43","common/runtime","common/vendor"]]]);