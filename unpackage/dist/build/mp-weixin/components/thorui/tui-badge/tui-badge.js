(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/thorui/tui-badge/tui-badge"],{"5e92":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"tuiBadge",emits:["click"],props:{type:{type:String,default:"primary"},dot:{type:Boolean,default:!1},margin:{type:String,default:"0"},absolute:{type:Boolean,default:!1},top:{type:String,default:"-8rpx"},right:{type:String,default:"0"},scaleRatio:{type:Number,default:1},translateX:{type:String,default:"0"}},computed:{getStyle:function(){return"scale(".concat(this.scaleRatio,") translateX(").concat(this.translateX,")")}},methods:{handleClick:function(){this.$emit("click",{})}}};e.default=a},"6b12":function(t,e,n){"use strict";n.r(e);var a=n("5e92"),u=n.n(a);for(var r in a)"default"!==r&&function(t){n.d(e,t,(function(){return a[t]}))}(r);e["default"]=u.a},"7a2e":function(t,e,n){"use strict";var a=n("88c5"),u=n.n(a);u.a},"88c5":function(t,e,n){},"966a":function(t,e,n){"use strict";var a;n.d(e,"b",(function(){return u})),n.d(e,"c",(function(){return r})),n.d(e,"a",(function(){return a}));var u=function(){var t=this,e=t.$createElement;t._self._c},r=[]},ca13:function(t,e,n){"use strict";n.r(e);var a=n("966a"),u=n("6b12");for(var r in u)"default"!==r&&function(t){n.d(e,t,(function(){return u[t]}))}(r);n("7a2e");var c,i=n("f0c5"),o=Object(i["a"])(u["default"],a["b"],a["c"],!1,null,"619c075c",null,!1,a["a"],c);e["default"]=o.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/thorui/tui-badge/tui-badge-create-component',
    {
        'components/thorui/tui-badge/tui-badge-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("ca13"))
        })
    },
    [['components/thorui/tui-badge/tui-badge-create-component']]
]);
