<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input">
				<icon type="search" :size='13' color='#333'></icon>
				<input confirm-type="search" placeholder="请输入关键词" :focus="true" auto-focus placeholder-class="tui-input-plholder"
				 class="tui-input" v-model.trim="key" @input="inputKey"/>
				<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
			</view>
			<view class="tui-cancle" @tap="onSearch">搜索</view>
		</view>

		<view class="tui-search-history" v-if="history.length>0">
			<view class="tui-history-header">
				<view class="tui-search-title">搜索历史</view>
				<tui-icon name="delete" :size='14' color='#333' @tap="openActionSheet" class="tui-icon-delete"></tui-icon>
			</view>
			<view class="tui-history-content">
				<view v-for="(item,index) in history" class="tui-history-item"  :key="index" @longpress="showIcon(index)" @tap="onSelect(item)">
					<tui-tag margin="0 24rpx 24rpx 0" type="gray" shape="circle">{{item}}</tui-tag>
					<tui-icon name="close-fill" :size="32" class="tui-item-delete" unit="rpx" v-if="index===removeIndex"
							  @tap="onDelete">
					</tui-icon>
				</view>
			</view>
		</view>
		<view v-show="key">
			<view class="tui-result-box">
				<block v-for="(item,index) in searchList" :key="index">
					<view class="tui-result-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="onDetail(item)">
						<rich-text :nodes="item.showKey"></rich-text>
					</view>
				</block>
			</view>
		</view>
		<tui-actionsheet :show="showActionSheet" :tips="tips" @click="itemClick"  @cancel="closeActionSheet"></tui-actionsheet>
	</view>

</template>

<script>
	import util from "@/utils/util.js"
	export default {
		data() {
			return {
				removeIndex: '',
				history: [],
				hot: [],
				key: "",
				from: "",
				showActionSheet: false,
				tips: "确认清空搜索历史吗？",
				searchResult:[],
				searchList:[],
				productNames: [],
			}
		},
		onLoad(options){
			this.history = uni.getStorageSync('hotKeys') || []
			this.key = options.key
			this.from = options.from
            if(this.from){
				this.history = []
			}
		},
		computed: {
			productList() {
				return this.$store.state.goodsList
			},
			activityGoods(){
				return this.$store.state.activityGoods
			}
		},
		methods: {
			onDelete(index){
				this.history.splice(index, 1)
				uni.setStorage({
					key: 'hotKeys',
					data: this.history
				})
				this.removeIndex = ''
			},
			onSelect(key){
				this.key = key
				this.onInput(this.key)
			},
			onDetail(v){
				setTimeout(()=>{
					if(!this.history.includes(this.key)){
						this.history.push(this.key)
						uni.setStorage({
							key: 'hotKeys',
							data: this.history
						})
					}
				},500)
				if(this.from == 'groupList'){
					uni.navigateTo({
						url: '/pages/index/groupDetail/groupDetail?spu_id=' + v.id
					})
				}else{
					uni.navigateTo({
						url: '/pages/index/productDetail/productDetail?spu_id=' + v.id
					})
				}
			},
			cleanKey: function() {
				this.key = ''
			},
			showIcon(index){
                this.removeIndex = index
			},
			closeActionSheet: function() {
				this.showActionSheet = false
			},
			openActionSheet: function() {
				this.showActionSheet = true
			},
			itemClick: function(e) {
				if (e.index === 0) {
					this.showActionSheet = false;
					this.history = []
					uni.setStorage({
						key: 'hotKeys',
						data: this.history
					})
				}
			},
			onInput(key){
				if (!key) {
					this.searchList = [];
					return;
				}
				//根据关键词查找
				let arr = []
				if(this.from==='groupList'){
					this.searchResult= this.activityGoods.filter((v)=>{
						return v.title.includes(key)
					})
				}
				else{
					this.searchResult= this.productList.filter((v)=>{
						return v.title.includes(key)
					})
				}
				this.searchResult.forEach((item) => {
					arr.push({
						key: item.title,
						spu_id: this.from=='groupList'? item.spu : item.spu_id,
						id: item.id,
						showKey: util.replaceAll(item.title, key, `<label style="color:#E41F19">${key}</label>`)
					})
				})
				this.searchList = arr
				if(this.searchResult.length===0){
					this.tui.toast('没有相关商品')
				}
			},
			inputKey: function(e) {
				console.log('input', e)
				this.key = util.trim(e.detail.value);
				this.onInput(this.key)
			},
			onSearch(){
				if(this.key){
					setTimeout(()=>{
						if(!this.history.includes(this.key) && this.from!='groupList'){
							this.history.push(this.key)
							uni.setStorage({
								key: 'hotKeys',
								data: this.history
							})
							this.key = ''
						}
					},500)
					if(this.searchResult.length===0){
						this.tui.toast('没有相关商品')
					}else{
						this.$store.commit('setSearchResult', this.searchResult)
						if(this.from==='groupList'){
							uni.navigateTo({
								url: '/pages/index/groupList/groupList?searchKey=' + this.key
							})
						}else{
							uni.navigateTo({
								url: '/pages/index/productList/productList?searchKey=' + this.key
							})
						}
					}
				}else{
					this.tui.toast('请输入关键词')
				}
			},
		}
	}
</script>

<style>
	.container {
		padding: 0 30rpx 30rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-searchbox {
		padding: 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-search-input {
		width: 100%;
		height: 66rpx;
		border-radius: 35rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #f2f2f2;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.tui-input {
		flex: 1;
		color: #333;
		padding: 0 16rpx;
		font-size: 28rpx;
	}

	.tui-input-plholder {
		font-size: 28rpx;
		color: #b2b2b2;
	}

	.tui-cancle {
		color: #888;
		font-size: 28rpx;
		padding-left: 30rpx;
		flex-shrink: 0;
	}

	.tui-history-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
	}
	.tui-history-content, .tui-hot-content{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.tui-history-item{
		position: relative;
	}
	.tui-item-delete {
		position: absolute;
		top: -16rpx;
		right: 16rpx;
	}

	.tui-icon-delete {
		padding: 10rpx;
	}

	.tui-search-title {
		font-size: 28rpx;
		font-weight: bold;
	}

	.tui-hot-header {
		padding: 30rpx 0;
	}

	.tui-header {
		padding: 26rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-header-left {
		font-size: 30rpx;
		color: #222;
		border-left: 4rpx solid #EB0909;
		padding-left: 10rpx;
		word-break: break-all;
	}

	.tui-noboredr {
		border-left: 0 !important;
	}

	.tui-result-box {
		font-size: 28rpx;
	}

	.tui-result-item {
		line-height: 28rpx;
		padding: 28rpx 0;
	}
</style>
