<template>
	<view class="container">
		<tui-list-cell :hover="false">
			<view class="tui-goods__box">
				<image :src="goodsImage" class="tui-goods__img" mode="widthFix"></image>
				<view class="tui-rate__box">
					<view class="tui-rate__text">商品评分</view>
					<tui-rate :current="postData.star" @change="change"></tui-rate>
				</view>
			</view>
		</tui-list-cell>
		<tui-list-cell :hover="false" padding="0">
			<textarea class="tui-textarea" placeholder="产品怎么样,说说优缺点..." v-model="postData.msg" maxlength="200"></textarea>
		</tui-list-cell>
		<tui-list-cell :hover="false">
			<view class="tui-img__title">添加图片</view>
			<tui-upload :serverUrl="action"
						:formData="formData"
						:width = width
						:height = height
						@complete="onSuccess">
			</tui-upload>
		</tui-list-cell>
		<view class="tui-check__box">
			<checkbox-group>
				<label class="tui-checkbox">
					<checkbox color="#fff" @click="postData.anonymous=!postData.anonymous"></checkbox>
					<text class="tui-cb__text">匿名评价</text>
				</label>
			</checkbox-group>
		</view>

		<view class="tui-btn__box">
			<tui-button type="danger" height="88rpx" shape="circle" @click="onSubmit">提交评价</tui-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				spu_id: 1,
				width: '',
				height: '',
				formData: {},
				bucket_image: 'chuangbiying-review',
				action: 'http://up-cn-east-2.qiniup.com',
				goodsImage: 'https://system.chuangbiying.com/static/images/product/1.jpg',
				postData: {
					msg: '',
					specs: '双血统；公母随机',
					name: '',
					avatar: '',
					star: 5,
					anonymous: false,
				}
			}
		},
		onLoad(){

			//将系统宽度px转换为rpx
			let systemWidth = this.$store.state.width/(uni.upx2px(100)/100)
			// 100为页面两边的距离加上图片间隔
			this.width = (systemWidth-100)/3
			this.height = this.width
			let url =  '/upload/token/' + this.bucket_image
            this.tui.request(url)
                .then(response => {
                    this.uptoken=response.token
					this.formData={'token': this.uptoken}
                })
                .catch(error => {
                    console.log(error.response)
                }
            )
			this.postData.name = this.userInfo.nickName
			this.postData.avatar = this.userInfo.avatarUrl
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			orderList() {
				return this.$store.state.orderList
			}
		},
		methods: {
			change(e) {
				this.postData.star = e.index
			},
			onSuccess(v){
				if(v.status===1){
					this.postData.imgs = v.keyList
				}
			},
			onSubmit(){
				let url = '/addGoodsReview/' + this.spu_id
				this.tui.request(url,'POST', this.postData).then(res=>{
					if(res.code==='0'){
						this.tui.toast('评论成功');
						this.tui.href('/pages/my/myOrder/myOrder')
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx 0;
	}

	.tui-goods__box {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-goods__img {
		width: 104rpx;
		height: 104rpx;
	}

	.tui-rate__box {
		flex: 1;
		height: 100%;
		padding-left: 20rpx;
		font-size: 26rpx;
	}

	.tui-rate__text {
		margin-bottom: 16rpx;
	}

	.tui-textarea {
		width: 100%;
		height: 300rpx;
		font-size: 28rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #fff;
	}

	.tui-img__title {
		padding-bottom: 24rpx;
	}

	.tui-check__box {
		padding:25rpx 30rpx;
	}

	.tui-checkbox {
		min-width: 70rpx;
		height: 45rpx;
		display: flex;
		align-items: center;
	}

	/* #ifdef MP-WEIXIN */
	.tui-checkbox .wx-checkbox-input {
		width: 40rpx;
		height: 40rpx;
		margin-right: 0 !important;
		border-radius: 50% !important;
		transform: scale(0.8);
		transform-origin: center 30%;
		border-color: #d1d1d1 !important;
	}

	.tui-checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		background: #eb0909;
		width: 44rpx !important;
		height: 44rpx !important;
		border: none;
	}

	/* #endif */
	/* #ifndef MP-WEIXIN */

	>>>.tui-checkbox .uni-checkbox-input {
		width: 40rpx;
		height: 40rpx;
		margin-right: 0 !important;
		border-radius: 50% !important;
		transform: scale(0.8);
		border-color: #d1d1d1 !important;
	}

	>>>.tui-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		background: #eb0909;
		width: 45rpx !important;
		height: 45rpx !important;
		border: none;
	}

	/* #endif */

	.tui-cb__text {
		font-size: 28rpx;
		padding-left: 8rpx;
		color: #999;
	}

	.tui-btn__box {
		width: 100%;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
	}
</style>
