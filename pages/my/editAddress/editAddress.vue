<template>
	<view class="tui-addr-box">
		<tui-list-cell padding="0" arrow @tap="handleChoiceAddress">
			<view class="tui-list-cell" >
				<view><tui-icon name="wechat" color="#28c445"></tui-icon></view>
				<view class="wechat-address">获取微信收货地址</view>
			</view>
		</tui-list-cell>
		<form @submit="formSubmit">
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">收货人</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="userName" v-model="ruleForm.userName" placeholder="请输入收货人姓名" maxlength="15" type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">手机号码</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="telNumber" v-model="ruleForm.telNumber" placeholder="请输入收货人手机号码" maxlength="11"
					 type="text" />
				</view>
			</tui-list-cell>
			<picker :value="value" mode="multiSelector" @change="picker" @columnchange="columnPicker" :range="multiArray">
				<tui-list-cell  padding="0">
					<view class="tui-line-cell">
						<view class="tui-title"><text class="tui-title-city-text">所在城市</text></view>
						<input placeholder-class="tui-phcolor" class="tui-input tui-pr__30" disabled name="city" placeholder="请选择城市" maxlength="50"
						 type="text" v-model="ruleForm.location"/>
					</view>
				</tui-list-cell>
			</picker>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">详细地址</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="detailInfo" v-model='ruleForm.detailInfo' placeholder="请输入详细的收货地址" maxlength="50"
					 type="text" />
					<view @click.stop="getAddress">
						<tui-icon name="gps" :size="22"></tui-icon>
					</view>
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">邮政编码</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="postalCode" v-model='ruleForm.postalCode' placeholder="请输入邮政编码（可省略）" maxlength="50"
					 type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">地址类型</view>
					<text v-for="(label,index) in lists" :key="index"
						class="tui-label-item"
						@tap="onSelect(label)"
						:class="{'tui-label-active':ruleForm.label===label}">{{label}}
					</text>
				</view>
			</tui-list-cell>
			<!-- 默认地址 -->
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-swipe-cell">
					<view>设为默认地址</view>
					<tui-switch :checked="ruleForm.default" @change="onChange" color="#19be6b" scaleRatio="0.8" />
				</view>
			</tui-list-cell>

			<!-- <view class="tui-get-address">
				<tui-button shadow shape="circle" type="green"  @click="handleChoiceAddress">获取微信收货地址</tui-button>
			</view> -->

			<!-- 保存地址 -->
			<view class="tui-addr-save">
				<tui-button shadow type="danger" shape="circle" formType="submit">保存收货地址</tui-button>
			</view>
		</form>
	</view>
</template>

<script>
	import form from "@/components/common/tui-validation/tui-validation.js"
	import cityData from '@/utils/picker.city.min.js'
	export default {
		data() {
			return {
				lists: ["公司", "家", "学校", "其他"],
				selectList: cityData,
				multiArray: [], //picker数据
				value: [0, 0, 0],
				ruleForm: {
					telNumber: '',
					userName: '',
					label: '',
					location: '',
					default: false,
					detailInfo: '',
					postalCode: '',
				}
			}
		},
		onLoad(options) {
			if(options.address){
				this.ruleForm = JSON.parse(options.address)
				this.selectedIndex = options.selectedIndex
				uni.setNavigationBarTitle({
				　　title: this.ruleForm.new? '添加地址' : '修改地址',
				})
			}else{
				this.ruleForm.new = true // 标记是添加新地址
				uni.setNavigationBarTitle({
				　　title: '添加地址',
				})
			}
			this.multiArray = [
				this.toArr(this.selectList),
				this.toArr(this.selectList[0].children),
				this.toArr(this.selectList[0].children[0].children)
			]
		},
		computed: {
			addressList(){
				return this.$store.state.addressList
			}
		},
		methods: {
			onChange(e){
				console.log('change', e)
				this.ruleForm.default=e.detail.value
			},
			onSelect(v){
				this.$set(this.ruleForm, 'label', v)
				this.$forceUpdate()
			},
			handleChoiceAddress(){
				let _this = this
				wx.getSetting({
				  success(res) {
					if (res.authSetting['scope.address']) {
					  wx.chooseAddress({
						success(res) {
							_this.ruleForm = res
						    _this.ruleForm.location =  res.provinceName + " " + res.cityName + " " + res.countyName;
						}
					  })
					} else {
					    if (res.authSetting['scope.address'] == false) {
						    wx.openSetting({
						        success(res) {
							    console.log(res.authSetting)
						    }
						})
					  } else {
						wx.chooseAddress({
						  success(res) {
						  	_this.ruleForm = res
						    _this.ruleForm.location =  res.provinceName + " " + res.cityName + " " + res.countyName;
						  }
						})
					  }
					}
				  }
				})
			},
			getAddress() {
				const baseUrl  = "/pages/common/location/location?ruleForm=" + JSON.stringify(this.ruleForm)
				let url = (this.selectedIndex!==undefined)?
						baseUrl + '&selectedIndex=' + this.selectedIndex : baseUrl
				uni.redirectTo({ url: url })
			},
			picker: function(e) {
				let value = e.detail.value;
				if (this.selectList.length > 0) {
					let provice = this.selectList[value[0]].text
					let city = this.selectList[value[0]].children[value[1]].text
					let district = this.selectList[value[0]].children[value[1]].children[value[2]].text
					// this.selectList[value[0]].children[value[1]].children[value[2]].value
					this.ruleForm.location = provice + " " + city + " " + district;
				}
			},
			toArr(object) {
				let arr = [];
				for (let i in object) {
					arr.push(object[i].text);
				}
				return arr;
			},
			columnPicker: function(e) {
				//第几列 下标从0开始
				let column = e.detail.column;
				//第几行 下标从0开始
				let value = e.detail.value;
				if (column === 0) {
					this.multiArray = [
						this.multiArray[0],
						this.toArr(this.selectList[value].children),
						this.toArr(this.selectList[value].children[0].children)
					];
					this.value = [value, 0, 0]
				} else if (column === 1) {
					this.multiArray = [
						this.multiArray[0],
						this.multiArray[1],
						this.toArr(this.selectList[this.value[0]].children[value].children)
					];
					this.value = [this.value[0], value, 0]
				}
			},
			formSubmit: function(e) {
				//表单规则
				let rules = [{
					name: "userName",
					rule: ["required", "minLength:2"], //可使用区间，此处主要测试功能
					msg: ["请输入姓名", "姓名必须2个或以上字符"]
				}, {
					name: "telNumber",
					rule: ["required", "isMobile"],
					msg: ["请输入手机号", "请输入正确的手机号"]
				}, {
					name: "city",
					rule: ["required", "minLength:2"],
					msg: ["请输入姓名", "姓名必须2个或以上字符"]
				},{
					name: "detailInfo",
					rule: ["required", "minLength:2"],
					msg: ["请输入姓名", "姓名必须2个或以上字符"]
				},{
					name: "postalCode",
					rule: [ "minLength:6", "maxLength:6"],
					msg: [ "请输入正确的邮编", "请输入正确的邮编"]
				}];
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = form.validation(formData, rules);
				if (!checkRes) {
					delete this.ruleForm.new
					if(this.ruleForm.default){
						this.addressList.forEach((o)=>{o.default=false})
					}
					if(this.selectedIndex!==undefined){
						this.addressList[this.selectedIndex] = this.ruleForm
					}
					else{
						this.addressList.push(this.ruleForm)
						if(this.addressList.length===1){
							let userInfo = this.$store.state.userInfo
							userInfo.defaultAddress = this.ruleForm
							this.$store.commit('setUserInfo', userInfo)
							uni.setStorage({
								key: 'userInfo',
								data: userInfo,
							})
							let pages = getCurrentPages(); //获取所有页面栈实例列表
							let prevPage = pages[pages.length - 2]; //上一页页面实例
							// console.log('prevPage', prevPage)
							if(prevPage.route.split('/').pop()==='submitOrder'){
								prevPage.$vm.orderForm.address = this.ruleForm; //当上一页为提交订单时，设置订单地址
							}
						}
					}
					const pid = uni.getStorageSync("pid")
					const url = '/updateCustomer/' + pid + '/' + 'addressList'
					this.tui.request(url, 'PUT',{addressList: this.addressList}).then(res => {
						if(res.code==='0'){
							this.$store.commit('setAddress', this.addressList)
							uni.navigateBack({delta: 1})
						}
					})
				} else {
					uni.showToast({
						title: checkRes,
						icon: "none"
					});
				}
			},
		}
	}
</script>

<style scoped>
	.tui-input input{
		font-size: 28rpx;
	}
	.tui-addr-box {
		padding: 20rpx 0;
	}
	.tui-list-cell {
		display: flex;
		align-items: center;
		padding: 24rpx 30rpx;
		margin-bottom: 20rpx;
	}
    .wechat-address{
		margin-left: 20rpx
	}

	.tui-line-cell {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items:center;
	}

	.tui-title {
		width: 140rpx;
		font-size: 28rpx;
		flex-shrink: 0;
	}
	
	.tui-title-city-text {
		width: 180rpx;
		height: 40rpx;
		display: block;
		line-height: 46rpx;
	}

	.tui-input {
		font-size: 28rpx;
		width: 500rpx;
	}
	.tui-pr__30{
		padding-right: 30rpx;
	}
	.tui-input-city {
		flex: 1;
		height: 40rpx;
		font-size: 28rpx;
		padding-right: 30rpx;
	}

	.tui-phcolor {
		color: #ccc;
		font-size: 28rpx;
	}
	.tui-cell-title {
		font-size: 28rpx;
		flex-shrink: 0;
	}
	.tui-label-item {
		width: 76rpx;
		height: 40rpx;
		border: 1rpx solid rgb(136, 136, 136);
		border-radius: 6rpx;
		font-size: 26rpx;
		text-align: center;
		line-height: 40rpx;
		margin-right: 20rpx;
		display: inline-block;
		transform: scale(0.92);
	}

	.tui-label-active {
		background: #E41F19;
		border-color: #E41F19;
		color: #fff;
	}

	.tui-swipe-cell {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 10rpx 24rpx;
		box-sizing: border-box;
		border-radius: 6rpx;
		overflow: hidden;
		font-size: 28rpx;
	}
	.tui-addr-save{
		padding: 30rpx 30rpx;
	}
	.tui-del {
		padding: 24rpx 30rpx;
	}
</style>
