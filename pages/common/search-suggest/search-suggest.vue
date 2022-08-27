<template>
	<view class="container">
		<view class="tui-search__bar">
			<view class="tui-search__box">
				<icon class="tui-icon__search" type="search" :size="14" color="#999"></icon>
				<input confirm-type="search" auto-focus class="tui-search__input" placeholder="搜索地点" :value="keywords"
					@confirm="search" @input="inputChange" />
				<view class="tui-icon__clear" v-if="keywords" @tap="clearInput">
					<icon type="clear" size="14"></icon>
				</view>
				<view class="tui-btn__search" @tap="search">搜索</view>
			</view>
		</view>
		<view class="tui-list-view">
			<tui-list-cell v-for="(item, index) in result" :key="index" @click="choose(index)">
				<view class="thorui-flex">
					<tui-icon name="position" color="#888" :size="20"></tui-icon>
					<view class="tui-addr__box">
						<view class="tui-addr-title">{{ item.title }}</view>
						<view class="tui-addr-detail">{{ item.address }}</view>
						<view class="tui-tag" v-if="item.type > 0 && item.type < 5">{{ item.type | getType }}</view>
					</view>
				</view>
			</tui-list-cell>
		</view>
		<tui-loadmore :index="3" v-if="loading"></tui-loadmore>
		<tui-divider width="50%" v-if="!loading && !pullUpOn">没有更多了</tui-divider>
	</view>
</template>

<script>
	//小程序需要在后台添加业务域名 https://apis.map.qq.com
	import QQMapWX from '@/utils/qqmap-wx-jssdk.min.js'
	export default {
		data() {
			return {
				keywords: '',
				key: 'LWQBZ-SLH6F-VNOJD-N2ZI5-DA3YE-CKBR2',
				qqmapsdk: null,
				loading: false,
				pageIndex: 1,
				result: [],
				pullUpOn: true
			};
		},
		onLoad() {
			this.qqmapsdk = new QQMapWX({
				key: this.key
			});
		},
		filters: {
			getType(type) {
				//0:普通POI / 1:公交车站 / 2:地铁站 / 3:公交线路 / 4:行政区划
				type = type || 0;
				return ['', '公交车站', '地铁站', '公交线路', '行政区划'][type];
			}
		},
		methods: {
			search(input) {
				if (!this.keywords && !input) {
					this.tui.toast('请输入搜索地点');
					return;
				}
				this.pageIndex = 1;
				this.pullUpOn = true;
				this.result = [];
				this.loading = true;
				this.getSuggest(this.keywords);
			},
			inputChange(e) {
				this.keywords = e.detail.value;
				this.search(true);
			},
			clearInput() {
				this.keywords = '';
			},
			getSuggest(keywords) {
				// #ifdef H5
				//https://lbs.qq.com/webservice_v1/guide-suggestion.html
				//&location=${this.latitude + ',' +  this.longitude}
				let url = `https://apis.map.qq.com/ws/place/v1/suggestion?keyword=${keywords}&region_fix=0&policy=0&page_size=10&page_index=${
				this.pageIndex
			}&get_subpois=1&output=jsonp&key=${this.key}`;
				this.tui.tuiJsonp(
					url,
					res => {
						if (res.status === 0) {
							let data = res.data || [];
							this.result = this.result.concat(data);
							this.pageIndex++;
							this.loading = false;
							if (data.length < 10) {
								this.pullUpOn = false;
							}
						}
					},
					'QQmap'
				);
				// #endif

				// #ifndef H5
				this.qqmapsdk.getSuggestion({
					keyword: keywords,
					page_index: this.pageIndex,
					success: res => {
						let data = res.data || [];
						this.result = this.result.concat(data);
						this.pageIndex++;
						this.loading = false;
						if (data.length < 10) {
							this.pullUpOn = false;
						}
					},
					fail: res => {
						this.loading = false;
						console.log(res);
					}
				});
				// #endif
			},
			choose(index) {
				if (this.result.length === 0) return;
				let item = this.result[index];
				uni.$emit('location', {
					...item.location,
					keywords: item.title
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 0);
			}
		},
		onReachBottom: function() {
			if (!this.pullUpOn || this.loading) return;
			this.loading = true;
			this.getSuggest(this.keywords);
		}
	};
</script>

<style>
	.container {
		width: 100%;
		overflow-x: hidden;
	}

	.tui-search__bar {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		position: relative;
	}

	.tui-search__bar::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 1rpx;
		left: 0;
		bottom: 0;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		transform: scaleY(0.5);
	}

	.tui-search__box {
		width: 100%;
		height: 72rpx;
		background-color: #f2f2f2;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		padding-left: 24rpx;
		box-sizing: border-box;
	}

	.tui-icon__search {
		flex-shrink: 0;
		margin-right: 8rpx;
	}

	.tui-search__input {
		flex: 1;
		font-size: 28rpx;
	}

	.tui-icon__clear {
		width: 60rpx;
		height: 100%;
		padding: 0 10rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.tui-btn__search {
		flex-shrink: 0;
		height: 100%;
		padding: 0 24rpx;
		margin-left: auto;
		font-size: 28rpx;
		color: #5677fc;
		display: flex;
		align-items: center;
		position: relative;
	}

	.tui-btn__search::before {
		content: '';
		position: absolute;
		height: 40%;
		border-left: 1rpx solid #999;
		top: 30%;
		left: 0;
	}

	.tui-addr__box {
		width: 100%;
		padding: 0 30rpx 0 12rpx;
		box-sizing: border-box;
	}

	.tui-addr-title {
		flex: 1;
		font-size: 34rpx;
		color: #222;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-addr-detail {
		flex: 1;
		font-size: 26rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 8rpx 0;
	}

	.tui-tag {
		display: inline-flex;
		padding: 6rpx 20rpx;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #999;
		border: 1rpx solid #999;
		border-radius: 30rpx;
	}
</style>
