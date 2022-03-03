<template>
	<view class="tui-button__container" :style="{width: width,height: height,margin:margin,borderRadius: radius}"
		@touchstart="handleStart" @touchend="handleClick" @touchcancel="handleEnd" @tap="handleTap">
		<button class="tui-button" :class="[
				bold ? 'tui-text__bold' : '',
				time && (plain || link) ? 'tui-button__opacity' : '',
				disabled && !disabledBackground ? 'tui-button__opacity' : '',
				!width || width==='100%' || width==='true'?'tui-button__flex-1':'',
				time && !plain && !link ? 'tui-button__active' : ''
			]" :style="{
				width: width,
				height: height,
				lineHeight: height,
				background: disabled && disabledBackground ? disabledBackground : (plain ? 'transparent' : background),
				borderWidth:borderWidth,
				borderColor: borderColor ? borderColor : disabled && disabledBackground ? disabledBackground : (link?'transparent':background),
				borderRadius: radius,
				fontSize: size + 'rpx',
				color: disabled && disabledBackground ? disabledColor : color
			}" :loading="loading" :form-type="formType" :open-type="openType" @getuserinfo="bindgetuserinfo"
			@getphonenumber="bindgetphonenumber" @contact="bindcontact" @error="binderror"
			@opensetting="bindopensetting" :disabled="disabled" :scope="scope">
			<text class="tui-button__text" :class="{'tui-text__bold':bold}" v-if="text"
				:style="{fontSize: size + 'rpx',lineHeight:size + 'rpx',color: disabled && disabledBackground ? disabledColor : color}">{{text}}</text>
			<slot></slot>
		</button>
	</view>
</template>

<script>
	export default {
		name: 'tui-form-button',
		emits: ['click', 'getuserinfo', 'contact', 'getphonenumber', 'error', 'opensetting'],
		// #ifndef VUE3
		// #ifdef MP-WEIXIN
		behaviors: ['wx://form-field-button'],
		// #endif
		// #endif
		props: {
			//按钮背景色
			background: {
				type: String,
				default: '#5677fc'
			},
			//按钮显示文本
			text: {
				type: String,
				default: ''
			},
			//按钮字体颜色
			color: {
				type: String,
				default: '#fff'
			},
			//按钮禁用背景色
			disabledBackground: {
				type: String,
				default: ''
			},
			//按钮禁用字体颜色
			disabledColor: {
				type: String,
				default: ''
			},
			borderWidth: {
				type: String,
				// #ifdef APP-NVUE
				default: '0.5px'
				// #endif
				// #ifndef APP-NVUE
				default: '1rpx'
				// #endif
			},
			borderColor: {
				type: String,
				default: ''
			},
			//宽度
			width: {
				type: String,
				default: '100%'
			},
			//高度
			height: {
				type: String,
				default: '96rpx'
			},
			//字体大小，单位rpx
			size: {
				type: [Number, String],
				default: 32
			},
			bold: {
				type: Boolean,
				default: false
			},
			margin: {
				type: String,
				default: '0'
			},
			//圆角
			radius: {
				type: String,
				default: '6rpx'
			},
			plain: {
				type: Boolean,
				default: false
			},
			link: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			loading: {
				type: Boolean,
				default: false
			},
			formType: {
				type: String,
				default: ''
			},
			openType: {
				type: String,
				default: ''
			},
			//支付宝小程序 
			//当 open-type 为 getAuthorize 时，可以设置 scope 为：phoneNumber、userInfo
			scope: {
				type: String,
				default: ''
			},
			index: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				time: 0,
				trigger: false,
				tap: false
			};
		},
		methods: {
			handleStart() {
				if (this.disabled) return;
				this.trigger = false;
				this.tap = true;
				if (new Date().getTime() - this.time <= 150) return;
				this.trigger = true;
				this.time = new Date().getTime();
			},
			handleClick() {
				if (this.disabled || !this.trigger) return;
				this.time = 0;
				this.$emit('click', {
					index: Number(this.index)
				});
			},
			handleTap() {
				// #ifdef H5
				if (this.tap || this.disabled) return;
				this.$emit('click', {
					index: Number(this.index)
				});
				// #endif
			},
			handleEnd() {
				if (this.disabled) return;
				setTimeout(() => {
					this.time = 0;
				}, 150);
			},
			bindgetuserinfo({
				detail = {}
			} = {}) {
				this.$emit('getuserinfo', detail);
			},
			bindcontact({
				detail = {}
			} = {}) {
				this.$emit('contact', detail);
			},
			bindgetphonenumber({
				detail = {}
			} = {}) {
				this.$emit('getphonenumber', detail);
			},
			binderror({
				detail = {}
			} = {}) {
				this.$emit('error', detail);
			},
			bindopensetting({
				detail = {}
			} = {}) {
				this.$emit('opensetting', detail);
			}
		}
	};
</script>

<style scoped>
	.tui-button__container {
		position: relative;
	}

	.tui-button {
		/* #ifdef APP-NVUE */
		border-width: 0.5px;
		/* #endif */
		/* #ifndef APP-NVUE */
		border-width: 1rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		/* #endif */
		border-style: solid;
		position: relative;
		padding-left: 0;
		padding-right: 0;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		transform: translateZ(0);
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
		/* #endif */
	}

	.tui-button__flex-1 {
		flex: 1;
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
	}

	.tui-button::after {
		border: 0;
	}

	/* #ifndef APP-NVUE */
	.tui-button__active {
		overflow: hidden !important;
	}

	.tui-button__active::after {
		content: ' ';
		background-color: rgba(0, 0, 0, 0.1);
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		right: 0;
		top: 0;
		transform: none;
		z-index: 1;
		border-radius: 0;
	}

	/* #endif */
	.tui-button__text {
		text-align: center;
		flex-direction: row;
		align-items: center;
		justify-content: center !important;
		padding-left: 0 !important;

	}

	.tui-button__opacity {
		opacity: 0.5;
	}

	.tui-text__bold {
		font-weight: bold;
	}
</style>
