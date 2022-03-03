<template>
	<view class="tui-safe-area">
		<tui-loading :fixed="false" v-if="loadding"></tui-loading>
		<view v-else>
			<view class="tui-address" v-if="addressList.length>0">
			<block v-for="(address,index) in addressList" :key="index">
				<tui-swipe-action :actions="actions" @click="handlerButton(index, $event)" :forbid="index===0">
					<template v-slot:content>
						<tui-list-cell padding="0">
							<view class="tui-address-flex">
								<view class="tui-address-left">
									<view class="tui-address-main">
										<view class="tui-address-name tui-ellipsis">{{address.userName}}</view>
										<view class="tui-address-tel">{{address.telNumber | getAddress}}</view>
									</view>
									<view class="tui-address-detail">
										<view class="tui-address-label" v-if="index===0">默认</view>
										<view class="tui-address-label" v-if="address.label">{{address.label}}</view>
										<text>{{address.detailInfo}}</text>
									</view>
								</view>
								<view class="tui-address-imgbox" @click="editAddr(index)">
									<image class="tui-address-img" src="https://system.chuangbiying.com/static/images/mall/my/icon_addr_edit.png" />
								</view>
							</view>
						</tui-list-cell>
					</template>
				</tui-swipe-action>
			</block>
		</view>
			<!-- 新增地址 -->
			<view class="tui-address-new" v-if="addressList.length>0">
				<tui-button shadow shape="circle" type="danger" @click="addAddress">新增收货地址</tui-button>
			</view>
			<tui-no-data v-else imgUrl="https://system.chuangbiying.com/static/images/toast/img_nodata.png" @click="addAddress"  btnText="新建地址">
				<text class="tui-color__black">您还没有地址哦！</text>
				<!--如果需要自定义按钮，可在插槽中自定义，不使用默认按钮-->
			</tui-no-data>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/util.js'

	export default {
		data() {
			return {
				loadding: true,
				actions: [{
						name: '设为默认',
						width: 80,
						color: '#FFF',
						fontsize: 28,
						background: '#c8c7cd'
					},
					{
						name: '删除',
						color: '#fff',
						fontsize: 28,
						width: 80,
						background: '#eb0909'
					}
				]
			}
		},
		onLoad(){
			const pid = uni.getStorageSync("pid")
			const url = '/getAddressList/' + pid
			this.tui.request(url,'GET', undefined, true).then((res)=>{
				if(res.code==='0'){
					this.loadding=false
					this.$store.commit('setAddress', res.addressList)
				}
			}).catch(err=>{
				console.log('err', err)
			})
		},
		onShow(){
			this.$forceUpdate()
		},
		computed: {
			addressList(){
				return this.$store.state.addressList
			}
		},
		filters: {
			getAddress(mobile){
				return utils.formatNumber(mobile)
			}
		},
		methods: {
			handlerButton(i, e) {
				let index = e.index;
				if(index===1){
					this.addressList.splice(i, 1)
					this.tui.toast('删除成功', );
				}else{
					let temp = this.addressList[i]
					this.addressList.splice(i,1)
					this.addressList.unshift(temp)
				}
			},
			editAddr(index) {
				let address = this.addressList[index]
				address.isChecked = index === 0
				uni.navigateTo({
					url: `/pages/my/editAddress/editAddress?selectedIndex=${index}&address=${JSON.stringify(address)}`
				})
			},
			addAddress(){
				uni.navigateTo({
					url: '../editAddress/editAddress'
				})
			}
		}
	}
</script>

<style>
	.tui-page__spacing {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.thorui-loading__2,.thorui-loading__3,.tui-padding{
		margin-top: 80rpx;
	}
	.tui-address {
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: 160rpx;
	}
	.tui-address-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tui-address-main {
		width: 600rpx;
		height: 70rpx;
		display: flex;
		font-size: 30rpx;
		line-height: 86rpx;
		padding-left: 30rpx;
	}

	.tui-address-name {
		width: 120rpx;
		height: 60rpx;
	}

	.tui-address-tel {
		margin-left: 12rpx;
	}

	.tui-address-detail {
		font-size: 24rpx;
		word-break: break-all;
		padding-bottom: 25rpx;
		padding-left: 25rpx;
		padding-right: 120rpx;
	}

	.tui-address-label {
		padding: 5rpx 8rpx;
		flex-shrink: 0;
		background: #e41f19;
		border-radius: 6rpx;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: center center;
		margin-right: 6rpx;
	}

	.tui-address-imgbox {
		width: 80rpx;
		height: 100rpx;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		right: 10rpx;
	}

	.tui-address-img {
		width: 36rpx;
		height: 36rpx;
	}

	.tui-address-new {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		padding: 20rpx 25rpx 30rpx;
		box-sizing: border-box;
		background: #fafafa;
	}

	.tui-safe-area {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
