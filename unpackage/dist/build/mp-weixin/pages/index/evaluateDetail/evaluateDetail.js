(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/evaluateDetail/evaluateDetail"],{"0c8f":function(e,i,t){"use strict";(function(e){Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var n=r(t("0d3e"));function r(e){return e&&e.__esModule?e:{default:e}}var u={data:function(){return{top:100,webURL:"https://review.chuangbiying.com/"}},filters:{timeFormat:function(e){return n.default.formatDate("y-m-d",e)},intervalTime:function(e){var i=new Date,t=new Date(e),n=(i-t)/1e3,r=parseInt(n/86400),u=parseInt(n/3600),a=parseInt(n/60);return r?r+"天":u?u+"小时":a?a+"分钟":"1分钟"}},onLoad:function(){var i=this;setTimeout((function(){var t=e.createSelectorQuery().in(i);t.select(".tui-scroll__box").boundingClientRect((function(e){e&&(i.top=e.top)})).exec()}),1e3)},computed:{reviewDetail:function(){return this.$store.state.currentReview},reviewLikes:function(){return this.$store.state.reviewLikes}},methods:{onLike:function(i){if(this.tui.isLogin()){var t=this.reviewLikes.indexOf(i);if(i!==this.reviewDetail.id){var n=this.reviewDetail.children.findIndex((function(e){return e.id===i}));-1!==t?(this.reviewDetail.children[n].likes-=1,this.reviewLikes.splice(t,1)):(this.reviewDetail.children[n].likes+=1,this.reviewLikes.push(i))}else-1!==t?(this.reviewDetail.likes-=1,this.reviewLikes.splice(t,1)):(this.reviewDetail.likes+=1,this.reviewLikes.push(i));var r="/updateGoodsReview/"+this.reviewDetail.id+"/reply";this.tui.request(r,"PUT",{likes:this.reviewDetail.likes,children:this.reviewDetail.children}).then((function(e){}));var u="/updateCustomer/"+e.getStorageSync("pid")+"/reviewLikes";this.tui.request(u,"PUT",{reviewLikes:i}).then((function(e){}))}else e.navigateTo({url:"/pages/my/login/login"})},reply:function(e){var i="/pages/index/evaluateReply/evaluateReply",t=i+"?index="+e;this.tui.href(t,!0)},scrollToReply:function(){e.pageScrollTo({scrollTop:this.top,duration:100})},previewImage:function(i,t){var n=this,r=[];r=t?this.reviewDetail.additional.imgs:this.reviewDetail.imgs;var u=r.map((function(e){return n.webURL+e}));e.previewImage({current:i,urls:u})}}};i.default=u}).call(this,t("543d")["default"])},"0caf":function(e,i,t){"use strict";t.r(i);var n=t("c1b4"),r=t("d2a1");for(var u in r)"default"!==u&&function(e){t.d(i,e,(function(){return r[e]}))}(u);t("81d7");var a,l=t("f0c5"),o=Object(l["a"])(r["default"],n["b"],n["c"],!1,null,"757a8c4b",null,!1,n["a"],a);i["default"]=o.exports},"66f7":function(e,i,t){},"81d7":function(e,i,t){"use strict";var n=t("66f7"),r=t.n(n);r.a},"8fe0":function(e,i,t){"use strict";(function(e){t("c514");n(t("66fd"));var i=n(t("0caf"));function n(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=t,e(i.default)}).call(this,t("543d")["createPage"])},c1b4:function(e,i,t){"use strict";t.d(i,"b",(function(){return r})),t.d(i,"c",(function(){return u})),t.d(i,"a",(function(){return n}));var n={tuiRate:function(){return t.e("components/thorui/tui-rate/tui-rate").then(t.bind(null,"0193"))},tuiListCell:function(){return t.e("components/thorui/tui-list-cell/tui-list-cell").then(t.bind(null,"057e"))},tuiIcon:function(){return Promise.all([t.e("common/vendor"),t.e("components/thorui/tui-icon/tui-icon")]).then(t.bind(null,"acf0"))},tuiDivider:function(){return t.e("components/thorui/tui-divider/tui-divider").then(t.bind(null,"5664"))}},r=function(){var e=this,i=e.$createElement,t=(e._self._c,e._f("timeFormat")(e.reviewDetail.create_time)),n=e.reviewDetail.additional?e._f("intervalTime")(e.reviewDetail.additional.date):null,r=e.__map(e.reviewDetail.children,(function(i,t){var n=e.__get_orig(i),r=e._f("timeFormat")(i.create_time),u=e.reviewLikes.includes(i.id),a=e.reviewLikes.includes(i.id);return{$orig:n,f2:r,g0:u,g1:a}})),u=e.reviewLikes.includes(e.reviewDetail.id),a=e.reviewLikes.includes(e.reviewDetail.id);e.$mp.data=Object.assign({},{$root:{f0:t,f1:n,l0:r,g2:u,g3:a}})},u=[]},d2a1:function(e,i,t){"use strict";t.r(i);var n=t("0c8f"),r=t.n(n);for(var u in n)"default"!==u&&function(e){t.d(i,e,(function(){return n[e]}))}(u);i["default"]=r.a}},[["8fe0","common/runtime","common/vendor"]]]);