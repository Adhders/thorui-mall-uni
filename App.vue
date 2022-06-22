<script>
	export default {
		onLaunch: function() {
			this.calcNavBarInfo()
		},
		globalData: {
			//全局数据管理
			windowWidth: 390,
			navBarHeight: 0, // 导航栏高度
			menuBottom: 0, // 胶囊距底部间距（顶部间距也是这个）
			menuTop: 0, // 胶囊距手机的顶部距离
			menuHeight: 0, // 胶囊高度
			menuWidth: 0, // 胶囊宽度
		},
		methods: {
			/**
			 * @description 计算导航栏信息
			 */
			calcNavBarInfo() {
				// 获取系统信息
				const systemInfo = uni.getSystemInfoSync();
				console.log('systemInfo', systemInfo)
				this.globalData.windowWidth = systemInfo.windowWidth
				// 胶囊按钮位置信息
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				console.log('menuButtonInfo', menuButtonInfo)
				// 导航栏高度 = 状态栏到胶囊的间距（胶囊上坐标位置-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
				this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
				// 状态栏和菜单按钮(标题栏)之间的间距
				// 等同于菜单按钮(标题栏)到正文之间的间距（胶囊上坐标位置-状态栏高度）
				this.globalData.menuBottom = menuButtonInfo.top - systemInfo.statusBarHeight;
				this.globalData.menuTop = menuButtonInfo.top
				this.globalData.menuWidth = menuButtonInfo.width
				// 菜单按钮栏(标题栏)的高度
				this.globalData.menuHeight = menuButtonInfo.height;
				console.log('navBarHeight', this.globalData.navBarHeight, 'menuTop', this.globalData.menuTop, 'menuHeight', this.globalData.menuHeight)
			}
		},
		onShow: function() {

		},
		onHide: function() {
			//console.log('App Hide')
		},
		onError: function(err) {
			//全局错误监听
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
				const res = uni.getSystemInfoSync();
				let errMsg = `手机品牌：${res.brand}；手机型号：${res.model}；操作系统版本：${res.system}；客户端平台：${res.platform}；错误描述：${err}`;
				console.log('发生错误：' + errMsg);
			});
			// #endif
		}
	};
</script>

<style>
	@import './common/app.css';
</style>
