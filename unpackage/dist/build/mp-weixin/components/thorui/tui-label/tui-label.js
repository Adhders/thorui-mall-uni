(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/thorui/tui-label/tui-label"],{"32d3":function(t,n,e){"use strict";var r;e.d(n,"b",(function(){return i})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return r}));var i=function(){var t=this,n=t.$createElement;t._self._c},o=[]},"3c8d":function(t,n,e){},"93ed":function(t,n,e){"use strict";function r(t,n){var e;if("undefined"===typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(e=i(t))||n&&t&&"number"===typeof t.length){e&&(t=e);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,c=!1;return{s:function(){e=t[Symbol.iterator]()},n:function(){var t=e.next();return u=t.done,t},e:function(t){c=!0,a=t},f:function(){try{u||null==e.return||e.return()}finally{if(c)throw a}}}}function i(t,n){if(t){if("string"===typeof t)return o(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?o(t,n):void 0}}function o(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a={name:"tui-label",props:{padding:{type:String,default:"0"},margin:{type:String,default:"0"},isFull:{type:Boolean,default:!1}},created:function(){this.childrens=[]},methods:{onClick:function(t){if(this.$emit("click",t),this.childrens&&this.childrens.length>0){var n,e=r(this.childrens);try{for(e.s();!(n=e.n()).done;){var i=n.value;i.labelClick()}}catch(o){e.e(o)}finally{e.f()}}}}};n.default=a},c8b0:function(t,n,e){"use strict";e.r(n);var r=e("32d3"),i=e("f3cf");for(var o in i)"default"!==o&&function(t){e.d(n,t,(function(){return i[t]}))}(o);e("cb11");var a,u=e("f0c5"),c=Object(u["a"])(i["default"],r["b"],r["c"],!1,null,"3ca27122",null,!1,r["a"],a);n["default"]=c.exports},cb11:function(t,n,e){"use strict";var r=e("3c8d"),i=e.n(r);i.a},f3cf:function(t,n,e){"use strict";e.r(n);var r=e("93ed"),i=e.n(r);for(var o in r)"default"!==o&&function(t){e.d(n,t,(function(){return r[t]}))}(o);n["default"]=i.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/thorui/tui-label/tui-label-create-component',
    {
        'components/thorui/tui-label/tui-label-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("c8b0"))
        })
    },
    [['components/thorui/tui-label/tui-label-create-component']]
]);
