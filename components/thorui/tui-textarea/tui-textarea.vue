<template>
	<view :class="{'tui-textarea__border':textareaBorder}" :style="{marginTop:marginTop+'rpx'}" @tap="fieldClick">
		<view class="tui-textarea__wrap"
			:class="{'tui-line__left':lineLeft,'tui-border__top':!borderTop || textareaBorder,'tui-border__bottom':!borderBottom || textareaBorder,'tui-textarea__flex-start':flexStart}"
			:style="{padding:padding,backgroundColor:backgroundColor}">
			<!-- #ifdef APP-NVUE -->
			<view class="tui-textarea__required" v-if="required && !flexStart">
				<text :style="{color:requiredColor,paddingTop:'2rpx'}">*</text>
			</view>
			<text class="tui-textarea__required" :style="{color:requiredColor,top:requiredTop}"
				v-if="required && flexStart">*</text>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<view class="tui-textarea__required" :class="{'tui-required__flex-start':flexStart}"
				:style="{color:requiredColor,top:flexStart?requiredTop:'50%'}" v-if="required">*</view>
			<!-- #endif -->
			<view class="tui-textarea__label"
				:style="{fontSize:labelSize+'rpx',color:labelColor,minWidth:labelWidth+'rpx'}" v-if="label">
				<text :style="{fontSize:labelSize+'rpx',color:labelColor}">{{label}}</text>
			</view>
			<slot name="left"></slot>
			<view class="tui-textarea__flex-1">
				<textarea class="tui-textarea__self" :class="{'tui-text__right':textRight}"
					:style="{height:height,minHeight:minHeight,fontSize:size+'rpx',color:color}"
					placeholder-class="tui-placeholder" :name="name" :value="inputVal" :placeholder="placeholder"
					:placeholderStyle="placeholderStyl" :disabled="disabled" :cursor-spacing="cursorSpacing"
					:maxlength="maxlength" :focus="focused" :auto-height="autoHeight" :fixed="fixed"
					:confirm-type="confirmType" :show-confirm-bar="showConfirmBar" :cursor="cursor"
					:selection-start="selectionStart" :selection-end="selectionEnd" :adjust-position="adjustPosition"
					:hold-keyboard="holdKeyboard" :show-count="false" :disable-default-padding="disableDefaultPadding"
					:auto-blur="autoBlur" @focus="onFocus" @blur="onBlur" @input="onInput" @confirm="onConfirm"
					@linechange="onLinechange" @keyboardheightchange="onKeyboardheightchange"></textarea>
				<view class="tui-textarea__counter" :style="{fontSize:counterSize+'rpx',color:counterColor}"
					v-if="isCounter && maxlength!=-1">
					<text :style="{fontSize:counterSize+'rpx',color:counterColor}">{{count}}/{{maxlength}}</text>
				</view>
			</view>
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tui-textarea",
		emits: ['input', 'update:modelValue', 'focus', 'blur', 'confirm', 'click', 'linechange', 'keyboardheightchange'],
		//这里加group是为了避免在表单中使用时给组件加value属性
		// #ifndef VUE3
		// #ifdef MP-WEIXIN
		//加group是为了避免在表单中使用时给组件加value属性
		behaviors: ['wx://form-field-group'],
		// #endif
		// #ifdef MP-BAIDU || MP-QQ
		//如果在这些平台不需要也能识别，则删除
		behaviors: ['uni://form-field'],
		// #endif
		// #endif
		// #ifdef MP-WEIXIN
		options: {
			addGlobalClass: true,
			virtualHost: true
		},
		// #endif
		props: {
			//是否为必填项
			required: {
				type: Boolean,
				default: false
			},
			requiredColor: {
				type: String,
				default: '#EB0909'
			},
			requiredTop: {
				type: String,
				default: '32rpx'
			},
			//左侧标题
			label: {
				type: String,
				default: ''
			},
			//标题字体大小
			labelSize: {
				type: Number,
				default: 32
			},
			labelColor: {
				type: String,
				default: '#333'
			},
			//label 最小宽度 rpx
			labelWidth: {
				type: Number,
				default: 140
			},
			//获取焦点
			focus: {
				type: Boolean,
				default: false
			},
			autoHeight: {
				type: Boolean,
				default: false
			},
			fixed: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: ''
			},
			placeholderStyle: {
				type: String,
				default: ''
			},
			//输入框名称
			name: {
				type: String,
				default: ''
			},
			//输入框值
			value: {
				type: [Number, String],
				default: ''
			},
			// #ifdef VUE3
			//输入框值
			modelValue: {
				type: [Number, String],
				default: ''
			},
			// #endif
			disabled: {
				type: Boolean,
				default: false
			},
			maxlength: {
				type: [Number, String],
				default: 140
			},
			cursorSpacing: {
				type: Number,
				default: 0,
			},
			confirmType: {
				type: String,
				default: 'done'
			},
			showConfirmBar: {
				type: Boolean,
				default: true
			},
			cursor: {
				type: Number,
				default: -1
			},
			selectionStart: {
				type: Number,
				default: -1
			},
			selectionEnd: {
				type: Number,
				default: -1
			},
			adjustPosition: {
				type: Boolean,
				default: true
			},
			disableDefaultPadding: {
				type: Boolean,
				default: true
			},
			holdKeyboard: {
				type: Boolean,
				default: false
			},
			autoBlur: {
				type: Boolean,
				default: false
			},
			height: {
				type: String,
				default: '200rpx'
			},
			minHeight: {
				type: String,
				default: '200rpx'
			},
			//标题与输入框是否顶端对齐
			flexStart: {
				type: Boolean,
				default: false
			},
			//输入框字体大小 rpx
			size: {
				type: Number,
				default: 32
			},
			//输入框字体颜色
			color: {
				type: String,
				default: '#333'
			},
			// 是否显示 textarea 边框
			textareaBorder: {
				type: Boolean,
				default: false
			},
			// 是否显示上边框
			borderTop: {
				type: Boolean,
				default: true
			},
			// 是否显示下边框
			borderBottom: {
				type: Boolean,
				default: true
			},
			//下边框线条是否有左偏移距离
			lineLeft: {
				type: Boolean,
				default: false
			},
			// 是否自动去除两端的空格
			trim: {
				type: Boolean,
				default: true
			},
			textRight: {
				type: Boolean,
				default: false
			},
			//输入框padding值
			padding: {
				type: String,
				default: '26rpx 30rpx'
			},
			//输入框背景颜色
			backgroundColor: {
				type: String,
				default: '#FFFFFF'
			},
			//输入框margin-top值 rpx
			marginTop: {
				type: Number,
				default: 0
			},
			//是否显示底部输入长度计数
			isCounter: {
				type: Boolean,
				default: false
			},
			//计数文本颜色
			counterColor: {
				type: String,
				default: '#999'
			},
			//计数文本大小 rpx
			counterSize: {
				type: Number,
				default: 28
			}
		},
		data() {
			return {
				placeholderStyl: '',
				count: 0,
				focused: false,
				inputVal: ''
			};
		},
		watch: {
			focus(val) {
				this.$nextTick(() => {
					this.focused = val
				})
			},
			placeholderStyle() {
				this.fieldPlaceholderStyle()
			},
			// #ifdef VUE3
			modelValue(newVal) {
				this.inputVal = newVal
			},
			// #endif
			value(newVal) {
				this.inputVal = newVal
				this.count = this.getCount(this.inputVal.length)
			}
		},
		created() {
			// #ifndef VUE3
			this.inputVal = this.value
			// #endif

			// #ifdef VUE3
			if (this.value && !this.modelValue) {
				this.inputVal = this.value
			} else {
				this.inputVal = this.modelValue
			}
			// #endif
			this.count = this.getCount(this.inputVal.length)
			this.fieldPlaceholderStyle()
		},
		mounted() {
			this.$nextTick(() => {
				this.focused = this.focus
			})
		},
		methods: {
			getCount(count) {
				const max = Number(this.maxlength)
				if (count > max) {
					return max
				}
				return count;
			},
			fieldPlaceholderStyle() {
				if (this.placeholderStyle) {
					this.placeholderStyl = this.placeholderStyle
				} else {
					const size = uni.upx2px(this.size)
					this.placeholderStyl = `fontSize:${size}px`
				}
			},
			onInput(event) {
				let value = event.detail.value;
				if (this.trim) value = this.trimStr(value);
				const lenth = value.length;
				const max = Number(this.maxlength)
				if (lenth > max) {
					lenth = max;
					value = value.substring(0, max - 1)
				}
				this.count = lenth;
				this.$emit('input', value);
				// #ifdef VUE3
				this.$emit('update:modelValue', value)
				// #endif
			},
			onFocus(event) {
				this.$emit('focus', event);
			},
			onBlur(event) {
				this.$emit('blur', event);
			},
			onConfirm(e) {
				this.$emit('confirm', e.detail.value);
			},
			fieldClick() {
				this.$emit('click', {
					name: this.name
				});
			},
			onLinechange(e) {
				this.$emit('linechange', e.detail)
			},
			onKeyboardheightchange(e) {
				this.$emit('keyboardheightchange', e.detail)
			},
			trimStr(str) {
				return str.replace(/^\s+|\s+$/g, '');
			}
		}
	}
</script>

<style>
	.tui-textarea__wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		display: flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		align-items: center;
		position: relative;

		/* #ifdef APP-NVUE */
		border-top-width: 0.5px;
		border-top-style: solid;
		border-top-color: rgba(0, 0, 0, 0.1);
		border-bottom-width: 0.5px;
		border-bottom-style: solid;
		border-bottom-color: rgba(0, 0, 0, 0.1);
		padding: 26rpx 30rpx;
		/* #endif */
	}

	.tui-textarea__flex-start {
		align-items: flex-start !important;
	}

	/* #ifndef APP-NVUE */
	.tui-textarea__wrap::before {
		content: ' ';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1px solid var(--thorui-line-color, rgba(0, 0, 0, 0.1));
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		transform-origin: 0 0;
		z-index: 2;
		pointer-events: none;
	}


	.tui-textarea__wrap::after {
		content: ' ';
		position: absolute;
		border-bottom: 1px solid var(--thorui-line-color, rgba(0, 0, 0, 0.1));
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		transform-origin: 0 100%;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 2;
		pointer-events: none;
	}

	.tui-line__left::after {
		left: 30rpx !important;
	}

	.tui-border__top::before {
		border-top: 0;
	}

	.tui-border__bottom::after {
		border-bottom: 0;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.tui-border__top {
		border-top-width: 0;
	}

	.tui-border__bottom {
		border-bottom-width: 0;
	}

	/* #endif */
	.tui-textarea__required {
		position: absolute;
		left: 12rpx;
		/* #ifndef APP-NVUE */
		height: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		line-height: 1.15;
		/* #endif */

		/* #ifdef APP-NVUE */
		flex: 1;
		height: 100wx;
		align-items: center;
		justify-content: center;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.tui-required__flex-start {
		transform: translateY(0);
	}

	/* #endif */
	.tui-textarea__label {
		padding-right: 12rpx;
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		/* #endif */
	}

	.tui-textarea__self {
		flex: 1;
		/* #ifndef APP-NVUE */
		width: 100%;
		overflow: visible;
		box-sizing: border-box;
		/* #endif */

		/* #ifdef APP-NVUE */
		padding-top: 6px;
		padding-bottom: 10px;
		/* #endif */

		/* #ifdef MP-ALIPAY || MP-TOUTIAO*/
		padding-top: 0 !important;
		padding-bottom: 0;
		/* #endif */

		/* #ifdef MP-TOUTIAO */
		background-color: rgba(255, 255, 255, 0) !important;
		/* #endif */
	}

	.tui-placeholder {
		/* #ifndef APP-NVUE */
		color: var(--thorui-text-color-placeholder, #ccc);
		overflow: visible;
		/* #endif */
		/* #ifdef APP-NVUE */
		color: #ccc;
		/* #endif */

		/* #ifdef MP-TOUTIAO */
		padding-top: 0 !important;
		/* #endif */
	}

	/* #ifdef MP */
	>>>.tui-placeholder {
		color: var(--thorui-text-color-placeholder, #ccc);
		overflow: visible;
	}

	/* #endif */

	.tui-textarea__border {
		border-radius: 4rpx;
		position: relative;
		/* #ifdef APP-NVUE */
		border-style: solid;
		border-width: 0.5px;
		border-color: #d1d1d1;
		/* #endif */
		/* #ifndef APP-NVUE */
		border-width: 0;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.tui-textarea__border::after {
		content: ' ';
		position: absolute;
		height: 200%;
		width: 200%;
		border: 1px solid var(--thorui-border-color, #d1d1d1);
		transform-origin: 0 0;
		transform: scale(0.5);
		left: 0;
		top: 0;
		border-radius: 8rpx;
		pointer-events: none;
	}

	/* #endif */
	.tui-textarea__flex-1 {
		flex: 1;
	}

	.tui-textarea__counter {
		padding-top: 8rpx;
		text-align: right;
		/* #ifdef APP-NVUE */
		flex-direction: row;
		flex: 1;
		justify-content: flex-end;
		/* #endif */
	}
</style>
