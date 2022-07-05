<template>
	<view class="tui-safe-area">
		<tui-loading :fixed="false" v-if="loadding"></tui-loading>
		<view v-else>
			<view class="tui-address" v-if="addressList.length>0">
			<tui-radio-group>
				<tui-label v-for="(address,index) in addressList" :key="index" @click="onChange(index)">
					<view class="tui-align__center">
						<tui-radio v-if="select" :checked="address.select" :value="index" color="#e81d1b" borderColor="#999">
						</tui-radio>
						<tui-swipe-action :actions="actions" @click="handlerButton(index, $event)" style="width: 100%">
							<template v-slot:content>
								<tui-list-cell padding="0">
									<view class="tui-address-flex">
										<view class="tui-address-left">
											<view class="tui-address-main">
												<view class="tui-address-name tui-ellipsis">{{address.userName}}</view>
												<view class="tui-address-tel">{{address.telNumber | getAddress}}</view>
											</view>
											<view class="tui-addr">
												<view class="tui-address-label" v-if="address.default">默认</view>
												<view class="tui-address-label" v-if="address.label">{{address.label}}</view>
												<text>{{address.location + address.detailInfo}}</text>
											</view>
										</view>
										<view class="tui-address-imgbox" @tap.stop="editAddr(index)">
											<image class="tui-address-img" src="https://system.chuangbiying.com/static/images/mall/my/icon_addr_edit.png" />
										</view>
									</view>
								</tui-list-cell>
							</template>
						</tui-swipe-action>
					</view>
				</tui-label>
			</tui-radio-group>
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
				pis: '',
				select: false, //是否选择地址
				loadding: true,
				selectedAddress: '',
				selectedIndex: 0,
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
		onLoad(options){
			this.select = options.select? true: false
			this.pid = uni.getStorageSync("pid")
			const url = '/getAddressList/' + this.pid
			this.tui.request(url,'GET', undefined, true).then((res)=>{
				if(res.code==='0'){
					this.loadding=false
					if(this.select){ //初始化选择
						res.addressList.forEach((o)=>{o.select=false})
						let index = res.addressList.findIndex((o)=>{return o.default})
						if(index!==-1){
							res.addressList[index].select=true
						}else{
							res.addressList[0].select=true
						}
					}
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
			onChange(index){
				if(this.select){
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					prevPage.$vm.orderForm.address = this.addressList[index]; //修改上一页data里面的地址
					uni.navigateBack({
						delta: 1
					})
				}
			},
			handlerButton(i, e) {
				if(e.index===1){
					this.addressList.splice(i, 1)
				}else{
					this.addressList.forEach((o,index)=>{
						o.default=index===i
					})
					let userInfo = this.$store.state.userInfo
					userInfo.defaultAddress = this.addressList[i]
					this.$store.commit('setUserInfo', userInfo)
					uni.setStorage({
						key: 'userInfo',
						data: userInfo,
					})
				}
				const url = '/updateCustomer/' + this.pid + '/' + 'addressList'
				this.tui.request(url, 'PUT',{addressList: this.addressList}).then(res => {})
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

<style scoped>
	.tui-address {
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: 160rpx;
	}
	.tui-address-flex {
		display: inline-flex;
		justify-content: space-between;
		align-items: center;
	}
	.tui-align__center{
		display: flex;
		align-items: center;
		background: #fff;
	}
	 .tui-align__center >>> .tui-checkbox__input{
		margin-left: 20rpx;
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
	.tui-addr {
		font-size: 24rpx;
		word-break: break-all;
		padding-bottom: 25rpx;
		padding-left: 25rpx;
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 620rpx;
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
