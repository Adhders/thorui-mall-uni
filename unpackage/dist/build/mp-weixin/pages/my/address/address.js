(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/my/address/address"],{"1af6":function(t,e,n){"use strict";n.r(e);var i=n("372e"),s=n.n(i);for(var d in i)"default"!==d&&function(t){n.d(e,t,(function(){return i[t]}))}(d);e["default"]=s.a},"372e":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=s(n("0d3e"));function s(t){return t&&t.__esModule?t:{default:t}}var d={data:function(){return{pis:"",select:!1,loadding:!0,selectedAddress:"",selectedIndex:0,actions:[{name:"设为默认",width:80,color:"#FFF",fontsize:28,background:"#c8c7cd"},{name:"删除",color:"#fff",fontsize:28,width:80,background:"#eb0909"}]}},onLoad:function(e){var n=this;e.detailInfo&&(this.select=!0),this.pid=t.getStorageSync("pid");var i="/getAddressList/"+this.pid;this.tui.request(i,"GET",void 0,!0).then((function(t){if("0"===t.code){if(n.loadding=!1,n.select){t.addressList.forEach((function(t){t.select=!1}));var i=t.addressList.findIndex((function(t){return t.detailInfo===e.detailInfo}));-1!==i&&(t.addressList[i].select=!0)}n.$store.commit("setAddress",t.addressList)}})).catch((function(t){console.log("err",t)}))},onShow:function(){this.$forceUpdate()},computed:{addressList:function(){return this.$store.state.addressList}},filters:{getAddress:function(t){return i.default.formatNumber(t)}},methods:{onChange:function(e){if(this.select){var n=getCurrentPages(),i=n[n.length-2];i.$vm.orderForm.address=this.addressList[e],t.navigateBack({delta:1})}},handlerButton:function(e,n){var i=this.$store.state.userInfo;1===n.index?(this.addressList.splice(e,1),0===this.addressList.length&&(i.defaultAddress="")):(this.addressList.forEach((function(t,n){t.default=n===e})),this.$forceUpdate(),i.defaultAddress=this.addressList[e]),this.$store.commit("setUserInfo",i),t.setStorage({key:"userInfo",data:i});var s="/updateCustomer/"+this.pid+"/addressList";this.tui.request(s,"PUT",{addressList:this.addressList}).then((function(t){}))},editAddr:function(e){var n=this.addressList[e];n.isChecked=0===e,t.navigateTo({url:"/pages/my/editAddress/editAddress?selectedIndex=".concat(e,"&address=").concat(JSON.stringify(n))})},addAddress:function(){t.navigateTo({url:"../editAddress/editAddress"})}}};e.default=d}).call(this,n("543d")["default"])},"535d":function(t,e,n){"use strict";var i=n("fdfd"),s=n.n(i);s.a},"6c4d":function(t,e,n){"use strict";(function(t){n("c514");i(n("66fd"));var e=i(n("b42a"));function i(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},"8c5e":function(t,e,n){"use strict";n.d(e,"b",(function(){return s})),n.d(e,"c",(function(){return d})),n.d(e,"a",(function(){return i}));var i={tuiLoading:function(){return n.e("components/thorui/tui-loading/tui-loading").then(n.bind(null,"b45a"))},tuiRadioGroup:function(){return n.e("components/thorui/tui-radio-group/tui-radio-group").then(n.bind(null,"6933"))},tuiLabel:function(){return n.e("components/thorui/tui-label/tui-label").then(n.bind(null,"c8b0"))},tuiRadio:function(){return n.e("components/thorui/tui-radio/tui-radio").then(n.bind(null,"524a"))},tuiSwipeAction:function(){return n.e("components/thorui/tui-swipe-action/tui-swipe-action").then(n.bind(null,"f3bf"))},tuiListCell:function(){return n.e("components/thorui/tui-list-cell/tui-list-cell").then(n.bind(null,"057e"))},tuiButton:function(){return n.e("components/thorui/tui-button/tui-button").then(n.bind(null,"009d"))},tuiNoData:function(){return n.e("components/thorui/tui-no-data/tui-no-data").then(n.bind(null,"5478"))}},s=function(){var t=this,e=t.$createElement,n=(t._self._c,!t.loadding&&t.addressList.length>0?t.__map(t.addressList,(function(e,n){var i=t.__get_orig(e),s=t._f("getAddress")(e.telNumber);return{$orig:i,f0:s}})):null);t.$mp.data=Object.assign({},{$root:{l0:n}})},d=[]},b42a:function(t,e,n){"use strict";n.r(e);var i=n("8c5e"),s=n("1af6");for(var d in s)"default"!==d&&function(t){n.d(e,t,(function(){return s[t]}))}(d);n("535d");var r,o=n("f0c5"),u=Object(o["a"])(s["default"],i["b"],i["c"],!1,null,"16d51d56",null,!1,i["a"],r);e["default"]=u.exports},fdfd:function(t,e,n){}},[["6c4d","common/runtime","common/vendor"]]]);