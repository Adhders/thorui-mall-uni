<template>
	<view class="container">
		<view class="tui-evaluate__box">
			<view class="tui-flex__center">
				<image :src="reviewDetail.avatar" class="tui-avatar">
			    <view class="tui-user-info">
					<view class="tui-nickname">{{reviewDetail.name}}</view>
					<tui-rate :current="reviewDetail.star" :size="11"></tui-rate>
				</view>		
				<text class="tui-review-time">{{reviewDetail.create_time | timeFormat}}</text>
			</view>
			<view class="tui-content__box">
				<view class="tui-desc">
					{{reviewDetail.msg}}
				</view>
				<view class="tui-img__box" v-if="reviewDetail.imgs.length>0">
					<block v-for="(src,subIndex) in reviewDetail.imgs" :key="subIndex">
						<image @tap.stop="previewImage(index,subIndex)"
							:class="{'tui-image':reviewDetail.imgs.length===1, 'tui-image-double': reviewDetail.imgs.length===2}"
							:src="webURL+src"
							mode="aspectFill"></image>
					</block>
				</view>
				<view class="tui-desc" v-if="reviewDetail.additional">
					<view class="additional">购买{{reviewDetail.additional.date | timeFormat}}后追平</view>
					<view>{{reviewDetail.additional.msg}}</view>
				</view>
				<view class="tui-img__box" v-if="reviewDetail.additional.imgs.length>0">
					<block v-for="(src,subIndex) in reviewDetail.additional.imgs" :key="subIndex">
						<image @tap.stop="previewImage(index,subIndex,true)"
							:class="{'tui-image':reviewDetail.additional.imgs.length===1, 'tui-image-double': reviewDetail.additional.imgs.length===2}"
							:src="webURL+src"
							mode='aspectFill'>
						</image>
					</block>
				</view>
				<view class="tui-op__box tui-flex__center">
					<view class="tui-specs">{{reviewDetail.specs}}</view>
				</view>
			</view>
		</view>

		<view class="tui-reply__box tui-scroll__box">
			<tui-list-cell padding="25rpx" :hover="false" :lineLeft="false">
				<view class="tui-reply__title">
					全部评论({{reviewDetail.children.length}})
				</view>
			</tui-list-cell>
			<block v-for="(item,index) in reviewDetail.children" :key="index">
				<tui-list-cell padding="25rpx" :hover="false" @tap="reply(index)">
					<view class="tui-flex__center tui-pr__30">
						<img :src="item.avatar" class="tui-avatar">
						<view class="tui-children-nickname">
							<view>{{item.name}}</view>
							<view class="tui-date">{{item.create_time | timeFormat}} </view>
						</view>
						<view class="tui-op-item" @click.stop="onLike(item.id)">
							<text style="font-size: 24rpx">{{item.likes}}</text>
							<tui-icon :name="reviewLikes.includes(item.id)?'agree-fill':'agree'" :size="28" unit="rpx"
								  :color="reviewLikes.includes(item.id)?'#EB0909':'#333'"></tui-icon>
						</view>
					</view>
					<view class="tui-content__box">
						<view class="tui-quote__box" v-if="item.reply">
							<text class="tui-color__link">@{{item.repliedMsg.name}}：</text>
							<text>{{item.repliedMsg.msg}}</text>
						</view>
						<view class="tui-desc">
							{{item.msg}}
						</view>
					</view>
				</tui-list-cell>
			</block>
		</view>
		<view class="tui-pullup__box">
			<tui-divider gradual width="50%">没有更多了</tui-divider>
		</view>
		<view class="tui-tabbar">
			<view class="tui-tabbar__box">
				<view class="tui-input tui-flex__center" @tap="reply(-1)">说点什么呗~</view>
				<view class="tui-tabbar__right">
					<view class="tui-op-item" @tap="onLike(reviewDetail.id)">
						<text>{{reviewDetail.likes}}</text>
						<tui-icon :name="reviewLikes.includes(reviewDetail.id)?'agree-fill':'agree'" :size="34" unit="rpx"
							:color="reviewLikes.includes(reviewDetail.id)?'#EB0909':'#333'">
						</tui-icon>
					</view>
					<view class="tui-op-item" @tap="scrollToReply">
						<text>{{reviewDetail.children.length}}</text>
						<tui-icon name="message" :size="40" unit="rpx" color="#333"></tui-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/util.js'
	export default {
		data() {
			return {
				top: 100,
				webURL: 'http://review.chuangbiying.com/',
			}
		},
		filters: {
			timeFormat(v){
				return utils.formatDate("y-m-d", v);
			}
		},
		onLoad() {
			//请求数据成功之后执行
			setTimeout(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.tui-scroll__box').boundingClientRect((res) => {
					if (res) {
						this.top = res.top;
					}
				}).exec()
			}, 1000)
		},
		computed: {
			reviewDetail(){
				return this.$store.state.currentReview
			},
			reviewLikes(){
				return this.$store.state.reviewLikes
			}
		},
		methods: {
			onLike(id) {
				if(!this.tui.isLogin()) {
					uni.navigateTo({url: '/pages/my/login/login'})
				}else{
					const index = this.reviewLikes.indexOf(id)
					if (id!==this.reviewDetail.id){
						let review_index = this.reviewDetail.children.findIndex((v)=>{return v.id===id})
						if(index!== -1){
							this.reviewDetail.children[review_index].likes -=1
							this.reviewLikes.splice(index,1)
						}else{
							this.reviewDetail.children[review_index].likes +=1
							this.reviewLikes.push(id)
						}
					}else{
						if(index!== -1){
							this.reviewDetail.likes -=1
							this.reviewLikes.splice(index,1)
						}else{
							this.reviewDetail.likes +=1
							this.reviewLikes.push(id)
						}
					}
					let url = '/updateGoodsReview/' + this.reviewDetail.id + '/reply'
					this.tui.request(url,'PUT', {'likes': this.reviewDetail.likes, 'children': this.reviewDetail.children}).then(res=>{})
					let customer_url =  "/updateCustomer/" +  uni.getStorageSync("pid") + '/reviewLikes'
					this.tui.request(customer_url, 'PUT', {'reviewLikes': id}).then(res=>{})
				}
			},
			reply(index) {
				const baseUrl = '/pages/index/evaluateReply/evaluateReply'
				let url = baseUrl + '?index=' + index
				this.tui.href(url, true)
			},
			scrollToReply() {
				uni.pageScrollTo({
					scrollTop: this.top,
					duration: 100
				})
			},
			previewImage(index, current, additional) {
				let imgs = []
				if(additional){
					imgs = this.reviewDetail.additional.imgs
				}else{
					imgs = this.reviewDetail.imgs
				}
				let urls = imgs.map(item => {
					return this.webURL + item
				})
				uni.previewImage({
					current: current,
					urls: urls
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.container {
		padding-bottom: 100rpx;
	}

	.tui-evaluate__box {
		width: 100%;
		padding: 25rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		overflow: hidden;
		margin-top: 20rpx;
	}

	.tui-flex__center {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-user-info {
		flex: 1;
		 margin-left: 10rpx
	}
	.tui-avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
	}

	.tui-nickname {
		margin-left: 5rpx;
		font-size: 22rpx;
	}
	.tui-children-nickname{
		margin-left: 10rpx;
		font-size: 22rpx;
	}
	.tui-review-time {
		font-size: 24rpx;
   		margin-left: 12rpx;
    	color: #999;
	}

	.tui-content__box {
		width: 100%;
		padding: 0 25rpx;
		box-sizing: border-box;
	}

	.tui-rate__box {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		padding: 12rpx 0 20rpx;
	}

	.tui-desc {
		margin-top: 20rpx;
		font-size: 24rpx;
		word-break: break-all;
		text-align: justify;
		.additional{
			margin: 10rpx 0;
			color: #e41f19;
		}
	}

	.tui-img__box {
		width: 100%;
		font-size: 0;
		padding-top: 4rpx;
	}

	.tui-img__box image{
		width: 200rpx;
		height: 200rpx;
		margin-right: 12rpx;
		margin-top: 12rpx;
		border-radius: 8rpx;
	}
	
	.tui-image {
		width: 375rpx !important;
		height: 375rpx !important;
		border-radius: 10rpx;
	}

	.tui-image-double {
		width: 315rpx !important;
		height: 315rpx  !important;
		border-radius: 10rpx;
		&:last-child{
			margin-right: 0;
		}
	}
	.tui-op__box {
		width: 100%;
		padding-top: 24rpx;
	}

	.tui-op-item {
		display: flex;
		align-items: center;
		margin-left: auto;
		flex-shrink: 0;
		font-size: 24rpx;
	}

	.tui-op-item text {
		padding-right: 6rpx;
	}

	.tui-specs {
		font-size: 22rpx;
		color: #999;
		font-weight: 400;
		word-break: break-all;
	}

	.tui-color-red {
		color: #EB0909;
	}

	.tui-reply__title {
		font-size: 26rpx;
		font-weight: bold;
	}
	.tui-color__link {
		color: #586c94;
	}

	.tui-quote__box {
		background-color: #F8F8F8;
		color: #999;
		font-size: 24rpx;
		padding: 16rpx;
		box-sizing: border-box;
		border-radius: 4rpx;
		margin: 20rpx 0;
	}

	.tui-pr__30 {
		padding-right: 30rpx;
	}

	.tui-tabbar {
		width: 100%;
		height: 100rpx;
		position: fixed;
		z-index: 996;
		left: 0;
		bottom: 0;
		background-color: #fff;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box;
	}

	.tui-tabbar::before {
		content: ' ';
		width: 100%;
		border-top: 1px solid #b2b2b2;
		position: absolute;
		top: 0;
		left: 0;
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 0;
		z-index: 3;
	}

	.tui-tabbar__box {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-input {
		width: 60%;
		height: 70rpx;
		background-color: #F8F8F8;
		color: #999;
		font-size: 24rpx;
		border-radius: 70px;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.tui-tabbar__right {
		width: 40%;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-tabbar__right .tui-op-item {
		width: 50%;
		justify-content: flex-end;
	}

	.tui-pullup__box {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
