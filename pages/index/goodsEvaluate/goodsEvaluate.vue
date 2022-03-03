<template>
	<view class="container">
		<view class="tui-header">
			<view>
				<text>商品好评度</text>
				<text class="active rate" >{{goodRate}}%</text>
			</view>
			<view >
				<text :class="{active: active===1}" @tap="onChange(1)">默认排序</text>
				<text class="divider" ></text>
				<text :class="{active: active===2}" @tap="onChange(2)">最新排序</text>
			</view>
		</view>
		<view class="tui-attr-box">
			<view class="tui-attr-item"
				  :class="{'tui-attr-active': select==='all'}"
				  @click="select='all'">全部
			</view>
			<view class="tui-attr-item"
				  :class="{'tui-attr-active': select==='image'}"
				  @click="select='image'">有图<text>{{selectedType.image}}</text>
			</view>
			<view class="tui-attr-item"
				  :class="{'tui-attr-active': select==='good'}"
				  @click="select='good'">好评<text>{{selectedType.good}}</text>
			</view>
			<view class="tui-attr-item"
				  :class="{'tui-attr-active': select==='additional'}"
				  @click="select='additional'">追评<text>{{selectedType.additional}}</text>
			</view>
			<view class="tui-attr-item"
				  :class="{'tui-attr-active': select==='negative'}"
				  @click="select='negative'">差评<text>{{selectedType.negative}}</text>
			</view>
		</view>
		<view class="tui-evaluate__box" v-for="(item,index) in displayList" :key="index">
			<view class="tui-flex__center">
				<img :src="item.avatar" class="tui-avatar"></img>
				<view class="tui-nickname">{{item.name}}</view>
			</view>
			<view class="tui-content__box">
				<view class="tui-rate__box">
					<tui-rate :current="item.star" :size="14"></tui-rate>
					<text>{{item.create_time | timeFormat}}</text>
				</view>
				<view class="tui-desc">
					{{item.msg}}
				</view>
				<view class="tui-img__box" v-if="item.imgs && item.imgs.length>0">
					<block v-for="(src,subIndex) in item.imgs" :key="subIndex">
						<image @tap.stop="previewImage(index,subIndex)"
							   :class="{'tui-image':item.imgs.length===1}"
							   :src="webURL+src"
							   :mode="item.imgs.length===1?'widthFix':'aspectFill'"></image>
					</block>
				</view>
				<view class="tui-desc" v-if="item.additional">
					<view class="additional">购买{{item.additional.date}}后追平</view>
					<view>{{item.additional.msg}}</view>
				</view>
				<view class="tui-op__box tui-flex__center">
					<view class="tui-specs">{{item.specs}}</view>
					<view class="tui-flex__center">
						<view class="tui-op-item" @tap="onLike(item.id)">
							<text :class="{'tui-color-red':item.zan}">{{item.likes}}</text>
							<tui-icon :name="likeList.includes(item.id)?'agree-fill':'agree'" :size="34" unit="rpx"
									  :color="likeList.includes(item.id)?'#EB0909':'#333'"></tui-icon>
						</view>
						<view class="tui-op-item" @tap="evaluateDetail(item)">
							<text>{{item.reviews}}</text>
							<tui-icon name="message" :size="40" unit="rpx" color="#333"></tui-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<tui-divider gradual width="50%">没有更多了</tui-divider>
	</view>
</template>

<script>
	import utils from '@/utils/util.js'
	export default {
		data() {
			return {
				active: 1,
				select: 'all',
				selectedType: {
					image: 0,
					good: 0,
					additional: 0,
					negative: 0,
				},
				webURL: 'http://review.chuangbiying.com/',
				displayList: [],
				goodRate: '100',
			}
		},
		filters: {
			timeFormat(v){
				return utils.formatDate('y-m-d', v)
			}
		},
		onLoad(){
			this.selectedType.image = this.reviewList.filter(v=>{ return v.imgs.length>0 }).length
			this.selectedType.good = this.reviewList.filter(v=>{ return v.star>=4 }).length
			this.selectedType.additional = this.reviewList.filter(v=>{ return v.additional }).length
			this.selectedType.negative = this.reviewList.filter(v=>{ return v.star<=2 }).length
			this.displayList = this.reviewList
			let count = 0
			this.reviewList.forEach((v)=>{
				if(v.star>=4){
					count += 1
				}
			})
			let length = this.reviewList.length
			this.goodRate = (length===0)? 100 : parseInt(count/length*100)
		},
		watch: {
			select(v) {
				switch(v) {
					case 'all' :
						this.displayList = this.reviewList.sort(
							(a,b) => {
								return b.star - a.star
							})
						break;
					case 'good':
						let goodsList = this.reviewList.filter(review =>{
							return review.star>=4
						})
						this.displayList = goodsList.sort(
							(a,b) => {
								return b.star - a.star
							})
						break;
					case 'image':
						let hasImageList = this.reviewList.filter(review=>{
							return review.imgs.length>0

						})
						this.displayList = hasImageList.sort(
							(a,b) => {
								return b.star - a.star
							})
						break;
					case 'negative':
						let negativeList = this.reviewList.filter(review=>{
							return review.star<=2
						})
						this.displayList = negativeList.sort(
							(a,b) => {
								return a.star - b.star
							})
						break;
					case 'additional':
						let additionalList = this.reviewList.filter(review=>{
							return review.additional
						})
						this.displayList = additionalList.sort(
							(a,b) => {
								return b.star - a.star
							})
						break;
				}
			}
		},
		computed: {
			reviewList(){
				return this.$store.state.reviewList
			},
			likeList(){
				return this.$store.state.likeList
			}
		},
		methods: {
			onChange(v){
				console.log('change', v)
				this.active=v
				if(v===1){
					this.displayList = this.reviewList.sort(
						(a,b) => {
							return b.star - a.star
						})
				}else{
					this.displayList = this.reviewList.sort(
						(a,b) => {
							return new Date(b.create_time).getTime() - new Date(a.create_time).getTime()
						})
				}
			},
			onLike(id) {
				let index = this.likeList.indexOf(id)
				let review_index = this.reviewList.findIndex((v)=>{return v.id===id})
				if( index!== -1){
					this.reviewList[review_index].likes -=1
					this.likeList.splice(index,1)
				}else{
					this.reviewList[review_index].likes +=1
					this.likeList.push(id)
				}
			},
			previewImage(index, current) {
				let imgs = this.reviewList[index].imgs
				let urls = imgs.map(item => {
					return this.webURL + item
				})
				uni.previewImage({
					current: current,
					urls: urls
				})
			},
			evaluateDetail(v){
				this.$store.commit('updateCurrentReview', v)
				this.tui.href('/pages/index/evaluateDetail/evaluateDetail')
			}
		}
	}
</script>

<style lang="less">
	.tui-header {
		font-size: 24rpx;
		color: #999;
		display: flex;
		justify-content: space-between;
		padding: 16rpx 30rpx;
		.active {
			font-weight: bold;
			color: #333;
			&.rate{
				padding-left: 12rpx;
			}
		}
		.divider{
			padding: 16rpx 0rpx 0rpx 0rpx;
			margin: 0 12rpx;
			border-left: 1px solid #000;
			font-size: 0;
		}
	}

	.tui-attr-box {
		width: 100%;
		padding: 24rpx 25rpx 0;
		box-sizing: border-box;
		font-size: 0;
		background-color: #fff;
		border-radius: 24rpx;
	}

	.tui-attr-item {
		max-width: 100%;
		min-width: 150rpx;
		height: 64rpx;
		display: -webkit-inline-flex;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #fcedea;
		padding: 0 26rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		font-size: 26rpx;
		border: 1rpx solid #fcedea;
	}

	.tui-attr-active {
		color: #e41f19;
		border: 1rpx solid #e41f19;
	}

	.tui-attr-item text {
		font-weight: bold;
		padding-left: 12rpx;
	}

	.tui-evaluate__box {
		width: 100%;
		padding: 25rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		overflow: hidden;
		margin-top: 20rpx;
		border-radius: 24rpx;
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
		font-size: 28rpx;
		padding-left: 12rpx;
	}

	.tui-content__box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-rate__box {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		padding: 24rpx 0;
	}

	.tui-desc {
		font-size: 28rpx;
		word-break: break-all;
		text-align: justify;
		.additional{
			margin: 10rpx 0;
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
	}

	.tui-image {
		width: 400rpx !important;
		height: auto;
	}

	.tui-op__box {
		width: 100%;
		padding-top: 24rpx;
		font-size: 24rpx;
		font-weight: 500;
		justify-content: space-between;
	}

	.tui-op-item {
		display: flex;
		align-items: center;
		margin-left: 40rpx;
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
</style>
