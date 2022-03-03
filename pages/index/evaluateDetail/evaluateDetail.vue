<template>
	<view class="container">
		<view class="tui-evaluate__box">
			<view class="tui-flex__center">
				<img :src="reviewDetail.avatar" class="tui-avatar">
				<view class="tui-nickname">{{reviewDetail.name}}</view>
			</view>
			<view class="tui-content__box">
				<view class="tui-rate__box">
					<tui-rate :current="reviewDetail.star" :size="14"></tui-rate>
					<text>{{reviewDetail.create_time | dateTimeFormat}}</text>
				</view>
				<view class="tui-desc">
					{{reviewDetail.msg}}
				</view>
				<view class="tui-img__box">
					<block v-for="(src,subIndex) in reviewDetail.imgs" :key="subIndex">
						<image @tap.stop="previewImage(index,subIndex)"
							   :class="{'tui-image':reviewDetail.imgs.length===1}"
							   :src="webURL+src"
							   :mode="reviewDetail.imgs.length===1?'widthFix':'aspectFill'"></image>
					</block>
				</view>
				<view class="tui-op__box tui-flex__center">
					<view class="tui-specs">{{reviewDetail.specs}}</view>
				</view>
			</view>
		</view>

		<view class="tui-reply__box tui-scroll__box">
			<tui-list-cell padding="25rpx" :hover="false" :lineLeft="false">
				<view class="tui-reply__title tui-flex__center">
					全部评论<text> ({{reviewDetail.reviews}})</text>
				</view>
			</tui-list-cell>
			<block v-for="(item,index) in reviewDetail.children" :key="index">
				<tui-list-cell padding="25rpx" :hover="false">
					<view class="tui-flex__center tui-pr__30">
						<img :src="item.avatar" class="tui-avatar">
						<view class="tui-nickname">
							<view>{{item.name}}</view>
							<view class="tui-date">{{item.create_time | timeFormat}} </view>
						</view>
						<view class="tui-op-item" @tap="onLike(item.id)">
							<text>{{item.likes}}</text>
							<tui-icon :name="likeList.includes(item.id)?'agree-fill':'agree'" :size="34" unit="rpx"
								  :color="likeList.includes(item.id)?'#EB0909':'#333'"></tui-icon>
						</view>
					</view>
					<view class="tui-content__box tui-reply__box">
						<view class="tui-quote__box" v-if="item.reply">
							<text class="tui-color__link">{{item.repliedMsg.name}}：</text>
							<text>{{item.repliedMsg.msg}}</text>
						</view>
						<view class="tui-desc" @tap="reply(index)">
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
				<view class="tui-input tui-flex__center" @tap="reply()">说点什么呗~</view>
				<view class="tui-tabbar__right">
					<view class="tui-op-item" @tap="onLike()">
						<text>{{reviewDetail.likes}}</text>
						<tui-icon :name="likeList.includes(id)?'agree-fill':'agree'" :size="34" unit="rpx"
								  :color="likeList.includes(id)?'#EB0909':'#333'"></tui-icon>
					</view>
					<view class="tui-op-item" @tap="scrollToReply">
						<text>{{reviewDetail.reviews}}</text>
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
				id: '',
				top: 100,
				webURL: 'http://review.chuangbiying.com/',
			}
		},
		filters: {
			timeFormat(v){
				const stringTime = new Date(Date.parse(v));
				return utils.timeAgo(stringTime.getTime())
			},
			dateTimeFormat(v){
				return utils.formatDate('y-m-d', v)
			}
		},
		onLoad() {
			//当前留言的id
			this.id = this.reviewDetail.id
			// //请求数据成功之后执行
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
			likeList(){
				return this.$store.state.likeList
			}
		},
		methods: {
			onLike(id) {
				if (id!==undefined){
					let index = this.likeList.indexOf(id)
					let review_index = this.reviewDetail.children.findIndex((v)=>{return v.id===id})
					if( index!== -1){
						this.reviewDetail.children[review_index].likes -=1
						this.likeList.splice(index,1)
					}else{
						this.reviewDetail.children[review_index].likes +=1
						this.likeList.push(id)
					}
				}else{
					let index = this.likeList.indexOf(this.id)
					if( index!== -1){
						this.reviewDetail.likes -=1
						this.likeList.splice(index,1)
					}else{
						this.reviewDetail.likes +=1
						this.likeList.push(id)
					}
				}
				let url = '/updateGoodsReview/' + this.id + '/reply'
				this.tui.request(url,'PUT', this.reviewDetail).then(res=>{})
			},
			reply(index) {
				const baseUrl = '/pages/index/evaluateReply/evaluateReply'
				let url = baseUrl + '&index=' + index
				this.tui.href(url)
			},
			scrollToReply() {
				uni.pageScrollTo({
					scrollTop: this.top,
					duration: 100
				})
			},
			previewImage(index, current) {
				let imgs = this.reviewDetail[index].imgs
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

<style scoped>
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
	}

	.tui-avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
	}

	.tui-nickname {
		font-size: 24rpx;
		padding-left: 12rpx;
	}
	.tui-date{
		color: #999
	}

	.tui-content__box {
		width: 100%;
		padding: 0 30rpx 0 76rpx;
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
		font-size: 28rpx;
		word-break: break-all;
		text-align: justify;
	}

	.tui-img__box {
		width: 100%;
		font-size: 0;
		padding-top: 4rpx;
	}

	.tui-img__box image {
		width: 180rpx;
		height: 180rpx;
		margin-right: 12rpx;
		margin-top: 12rpx;
	}

	.tui-image {
		width: 360rpx !important;
		height: auto;
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
		font-size: 24rpx;
		color: #999;
		font-weight: 400;
		word-break: break-all;
	}

	.tui-color-red {
		color: #EB0909;
	}

	.tui-reply__box {
		padding-top: 20rpx;
	}

	.tui-reply__title {
		font-size: 30rpx;
		font-weight: bold;
	}

	.tui-reply__title text {
		font-size: 28rpx;
		margin-left: 6rpx;
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
		margin-bottom: 20rpx;
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
