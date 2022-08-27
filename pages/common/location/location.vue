<template>
	<view class="container">
		<map id="maps" class="tui-maps" show-location :longitude="longitude" :latitude="latitude" :scale="16"
			@regionchange="regionchange">
			<!-- #ifndef MP-ALIPAY -->
			<cover-image class="tui-cover-back" src="https://system.chuangbiying.com/static/images/layout/icon_back_3x.png" @tap.stop="back" />
			<cover-image class="tui-cover-image" :class="{ 'tui-ani': ani }"
				src="https://system.chuangbiying.com/static/images/layout/icon_marker_3x.png" />
			<cover-image src="https://system.chuangbiying.com/static/images/layout/icon_location_3x.png" class="tui-current-img"
				@tap.stop="currentLocation"></cover-image>
			<!-- #endif -->
		</map>
		<!-- #ifdef MP-ALIPAY -->
		<!-- <cover-image class="tui-cover-back" src="https://system.chuangbiying.com/static/images/layout/icon_back_3x.png" @tap.stop="back" /> -->
		<cover-image class="tui-cover-image" :class="{ 'tui-ani': ani }"
			src="https://system.chuangbiying.com/static/images/layout/icon_marker_3x.png" />
		<cover-image src="https://system.chuangbiying.com/static/images/layout/icon_location_3x.png" class="tui-current-img"
			@tap.stop="currentLocation"></cover-image>
		<!-- #endif -->
		<view class="tui-search__box">
			<view class="thorui-flex__center" @tap="search">
				<icon class="tui-icon__search" type="search" :size="14" color="#999"></icon>
				<view class="tui-search__text">搜索地点</view>
			</view>
		</view>
		<scroll-view scroll-y :scroll-top="scrollTop" class="tui-scroll-view" :style="{ height: scrollH + 'px' }"
			@scrolltolower="getLocation">
			<radio-group class="thorui-radio" :style="{ minHeight: scrollH + 'px' }" @change="radioChange">
				<label class="tui-label__width" v-for="(item, index) in address" :key="index">
					<tui-list-cell padding="30rpx">
						<view class="tui-list__item">
							<view class="tui-addr-box">
								<view class="tui-addr-title">{{ item.title }}</view>
								<view class="tui-addr-detail">
									<text class="tui-distance">{{ item.distance | getDistance(item._distance) }}</text>
									<text>{{ item.address }}</text>
								</view>
							</view>
							<view class="tui-radio-box">
								<radio color="#5677fc" :value="index.toString()"></radio>
							</view>
						</view>
					</tui-list-cell>
				</label>
				<tui-loadmore :index="3" v-if="loading"></tui-loadmore>
				<view class="tui-seize__seat"></view>
			</radio-group>
		</scroll-view>
		<view class="tui-btn__box">
			<tui-button disabledGray :disabled="index == -1"  shape="circle" @click="btnFix">确定
			</tui-button>
			<view class="tui-seize__seat"></view>
		</view>
	</view>
</template>

<script>
	//小程序需要在后台添加业务域名 https://apis.map.qq.com
	import QQMapWX from '@/utils/qqmap-wx-jssdk.min.js'
	export default {
		data() {
			return {
				ani: true,
				mapCtx: null,
				mapObj: null,
				longitude: 121.499763,
				latitude: 31.23958,
				key: 'LWQBZ-SLH6F-VNOJD-N2ZI5-DA3YE-CKBR2',
				qqmapsdk: null,
				scrollH: 0,
				address: [],
				timer: null,
				keywords: '车站',
				location: null,
				pageIndex: 1,
				loading: false,
				pullUpOn: true,
				scrollTop: 0,
				index: -1,
				isClick: false, //选择地址防止app端刷新地址
				changeTimer: null,
				ruleForm: null,
			};
		},
		filters: {
			getDistance(distance, _distance) {
				distance = distance || _distance;
				let result = '';
				if (distance < 1000) {
					result = distance + 'm';
				} else {
					result = (distance / 1000).toFixed(2) + 'km';
				}
				return result;
			}
		},
		onLoad(options) {
			//POI搜索关键字
			this.keywords = options.keywords || '车站';
			setTimeout(() => {
				let sys = uni.getSystemInfoSync();
				this.scrollH = sys.windowHeight - uni.upx2px(600) - 46; //78=30+8*2
				this.qqmapsdk = new QQMapWX({
					key: this.key
				});
				this.currentLocation();
			}, 80);
			uni.$on('location', res => {
				this.latitude = res.lat;
				this.longitude = res.lng;
				this.keywords = res.keywords;
				this.getPoiAround();
			});
			this.ruleForm = JSON.parse(options.ruleForm)
			this.selectedIndex = options.selectedIndex
		},
		onReady() {
			// #ifdef APP-PLUS
			if (!this.mapCtx) {
				this.mapCtx = uni.createMapContext('maps');
			}
			this.mapObj = this.mapCtx.$getAppMap();
			this.mapObj.onstatuschanged = e => {
				// 地图发生变化的时候，获取中间点，也就是cover-image指定的位置
				if (this.longitude != 114.010857 && !this.isClick) {
					this.mapCtx.getCenterLocation({
						type: 'gcj02',
						success: res => {
							// this.longitude = res.latitude;
							// this.latitude = res.longitude;
							this.getAddress(res.longitude, res.latitude);
						}
					});
				}
			};
			// #endif
		},
		methods: {
			calculateDistance(to, callback) {
				this.qqmapsdk.calculateDistance({
					from: '', //默认当前位置
					to: to,
					success: res => {
						callback && callback(res.result);
					},
					fail: res => {
						callback && callback(false);
						console.log(res);
					}
				});
			},
			getPoiAround() {
				if (!this.keywords) return;
				this.pageIndex = 1;
				this.pullUpOn = true;
				this.address = [];
				this.index = -1;
				this.scrollTop = 1;
				setTimeout(() => {
					this.scrollTop = 0;
				}, 10);
				this.getLocation(this.keywords);
			},
			regionchange(e) {
				let isEnd = e.type == 'end';
				// #ifdef APP-PLUS || MP-WEIXIN
				isEnd = e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag');
				// #endif
				if (isEnd) {
					clearTimeout(this.timer);
					this.ani = false;
					this.timer = setTimeout(() => {
						this.ani = true;
					}, 300);
					if (!this.mapCtx) {
						this.mapCtx = uni.createMapContext('maps');
					}
					this.mapCtx.getCenterLocation({
						type: 'gcj02',
						success: res => {
							this.latitude = res.latitude;
							this.longitude = res.longitude;
							this.getAddress(res.longitude, res.latitude);
						}
					});
				}
			},
			getAddress: function(lng, lat) {
				// #ifdef H5
				let url =
					`https://apis.map.qq.com/ws/geocoder/v1/?location=${lat + ',' + lng}&key=${this.key}&get_poi=0&callbackName=QQmap&output=jsonp&coord_type=5`;
				this.tui.tuiJsonp(
					url,
					res => {
						if (res.status === 0) {
							this.keywords = res.result.formatted_addresses.recommend;
							this.getPoiAround();
						}
					},
					'QQmap'
				);
				// #endif

				// #ifndef H5
				//根据经纬度获取地址信息
				this.qqmapsdk.reverseGeocoder({
					location: {
						latitude: lat,
						longitude: lng
					},
					success: res => {
						this.keywords = res.result.formatted_addresses.recommend;
						this.getPoiAround();
					},
					fail: res => {
						this.keywords = '车站';
						this.getPoiAround();
					}
				});
				// #endif
			},
			currentLocation() {
				const that = this;
				uni.getLocation({
					// #ifdef APP-PLUS || MP-WEIXIN
					type: 'gcj02',
					// #endif
					altitude: true,
					success(res) {
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.getAddress(res.longitude, res.latitude);
					},
					fail(res) {
						that.getAddress(that.longitude, that.latitude);
					}
				});
			},
			getLocation() {
				if (!this.pullUpOn || this.loading) return;
				this.loading = true;
				let keywords = this.keywords;
				let index = keywords.indexOf('(');
				if (index !== -1) {
					keywords = keywords.substring(0, index);
				}
				// #ifdef H5
				//https://lbs.qq.com/webservice_v1/guide-suggestion.html
				let url =
					`https://apis.map.qq.com/ws/place/v1/suggestion?keyword=${keywords}&location=${this.latitude +
				',' +
				this.longitude}&region_fix=1&policy=0&page_size=10&page_index=${this.pageIndex}&get_subpois=1&output=jsonp&key=${this.key}`;
				this.tui.tuiJsonp(
					url,
					res => {
						if (res.status === 0) {
							let data = res.data || [];
							this.calculateDistance(data, d => {
								if (d) {
									let arr = d.elements || [];
									for (let i = 0, len = data.length; i < len; i++) {
										data[i].distance = arr[i].distance;
									}
								}
								this.address = this.address.concat(data);
								this.pageIndex++;
								this.loading = false;
								if (data.length < 10) {
									this.pullUpOn = false;
								}
							});
						}
					},
					'QQmap'
				);
				// #endif

				// #ifndef H5
				this.qqmapsdk.getSuggestion({
					keyword: keywords,
					page_index: this.pageIndex,
					location: {
						latitude: this.latitude,
						longitude: this.longitude
					},
					success: res => {
						let data = res.data || [];
						this.calculateDistance(data, d => {
							if (d) {
								let arr = d.elements || [];
								for (let i = 0, len = data.length; i < len; i++) {
									data[i].distance = arr[i].distance;
								}
							}
							this.address = this.address.concat(data);
							this.pageIndex++;
							this.loading = false;
							if (data.length < 10) {
								this.pullUpOn = false;
							}
						});
					},
					fail: res => {
						this.loading = false;
						console.log(res);
					}
				});
				// #endif
			},
			search() {
				this.tui.href('../search-suggest/search-suggest');
			},
			back() {
				uni.navigateBack();
			},
			radioChange(e) {
				clearTimeout(this.changeTimer);
				this.changeTimer = null;
				this.index = Number(e.detail.value);
				let item = this.address[this.index];
				this.isClick = true;
				this.latitude = item.location.lat;
				this.longitude = item.location.lng;
				//防止App端触发change事件刷新地址
				this.changeTimer = setTimeout(() => {
					this.isClick = false;
				}, 1200);
			},
			btnFix() {
				let address = this.address[this.index];
				this.ruleForm.location = address.province + " " + address.city + " " + address.district;
				this.ruleForm.detailInfo = address.address
				const baseUrl  = "/pages/my/editAddress/editAddress?address=" + JSON.stringify(this.ruleForm)
				let url = (this.selectedIndex!==undefined)?
						baseUrl + '&selectedIndex=' + this.selectedIndex : baseUrl
				uni.redirectTo({ url: url })
			}
		}
	};
</script>

<style>
	page {
		height: 100%;
		display: flex;
		justify-content: center;
		background-color: #ffffff;
		overflow: hidden;
	}

	.container {
		width: 100%;
		height: 100%;
		background-color: #ffffff;
	}

	.tui-maps {
		width: 100%;
		height: 600rpx;
	}

	.tui-cover-image {
		width: 60rpx;
		height: 60rpx;
		position: fixed;
		top: 300rpx;
		left: 50%;
		margin-top: -60rpx;
		margin-left: -30rpx;
		z-index: 10;
	}

	.tui-ani {
		animation: ani 0.4s linear;
	}

	@-webkit-keyframes ani {
		0% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-50rpx);
		}

		100% {
			transform: translateY(0);
		}
	}

	.tui-current-img {
		width: 76rpx;
		height: 76rpx;
		border-radius: 50%;
		box-shadow: 0 15rpx 10rpx -15rpx #bbb;
		position: fixed;
		top: 470rpx;
		right: 40rpx;
		z-index: 10;
	}

	.tui-cover-back {
		width: 60rpx;
		height: 60rpx;
		position: fixed;
		/* #ifdef H5 */
		top: 30rpx;
		/* #endif */
		/* #ifndef H5 */
		top: 60rpx;
		/* #endif */
		left: 30rpx;
	}

	.tui-search__box {
		width: 100%;
		padding: 10px 30rpx;
		box-sizing: border-box;
	}

	.thorui-flex__center {
		width: 100%;
		height: 72rpx;
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
		background-color: #f2f2f2;
		border-radius: 50rpx;
	}

	.tui-search__text {
		padding-left: 20rpx;
		font-size: 13px;
		line-height: 13px;
		color: #999;
	}

	.tui-list__item {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-addr-box {
		flex: 1;
		max-width: 88%;
	}

	.tui-addr-title {
		width: 100%;
		font-size: 34rpx;
		line-height: 36rpx;
		color: #222;
		padding-bottom: 12rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-addr-detail {
		width: 100%;
		font-size: 26rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-distance {
		color: #5677fc;
		padding-right: 8rpx;
	}

	.tui-label__width {
		width: 100%;
	}

	.thorui-radio {
		padding-bottom: 96rpx;
	}

	.tui-radio-box {
		flex-shrink: 0;
	}

	.tui-seize__seat {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-btn__box {
		width: 100%;
		background-color: #fff;
		padding: 12rpx 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #666;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 10;
		box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
		-webkit-backface-visibility: hidden;
	}
</style>
