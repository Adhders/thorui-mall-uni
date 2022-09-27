<template>
	<view class="container">
		<!--screen-->
		<view class="tui-header-screen">
			<view class="tui-search__bar">
				<view class="tui-searchbox" @tap="search">
					<icon type="search" :size="13" color="#999"></icon>
					<text class="tui-search-text" v-if="!searchKey">请输入搜索关键词</text>
					<view class="tui-search-key" v-else>
						<view class="tui-key-text">{{ searchKey }}</view>
						<view @tap.stop="onDelete">
							<tui-icon name="shut" :size="11" color="#fff"></tui-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="tui-screen__box">
				<view class="tui-screen-item" :class="[tabIndex == -1 ? 'tui-active tui-bold' : '']" @tap="screen" data-index="-1">综合</view>
				<view class="tui-screen-item" :class="[tabIndex == 0 ? 'tui-active tui-bold' : '']" @tap="sortOnPrice">
					<view>价格</view>
					<view class="tui-price-arrow">
						<tui-icon name="arrowup" :size="12" bold :color="tabIndex == 0 && ascending? '#e41f18' : '#444'"></tui-icon>
						<tui-icon name="arrowdown" :size="12" bold :color="tabIndex == 0 && !ascending? '#e41f18' : '#444'"></tui-icon>
					</view>
				</view>
				<view class="tui-screen-item" :class="[tabIndex == 1 ? 'tui-active tui-bold' : '']" @tap="screen" data-index="1">销量</view>
				<view class="tui-screen-item" @tap="screen" data-index="2">
					<tui-icon :name="isList ? 'manage' : 'listview'" :size="isList ? 22 : 18" :bold="isList ? false : true" color="#333"></tui-icon>
				</view>
				<view class="tui-screen-item" @tap="screen" data-index="3">
					<text>筛选</text>
					<tui-icon name="screen" :size="12" color="#333" :bold="true"></tui-icon>
				</view>

			</view>
		</view>
		<!--screen-->
		<!--=======商品=======-->
		<view class="tui-product__box">
			<tui-waterfall :listData="displayList" :type="2" :pageSize="10" v-if="!isList">
				<template slot-scope="{ entity }" slot="left">
					<tGroupItem :entity="entity"></tGroupItem>
				</template>
				<template slot-scope="{ entity }" slot="right">
					<tGroupItem :entity="entity"></tGroupItem>	
				</template>
			</tui-waterfall>
			<block v-for="(entity, index) in displayList" :key="index" v-else>
				<tGroupItem :entity="entity" :isList="true"></tGroupItem>
			</block>
		</view>
		<!--=======商品 end=======-->
		<!--左抽屉弹层 筛选 -->
		<tui-drawer mode="right" :visible="drawer"  @close="closeDrawer">
			<view class="tui-drawer-box" :style="{ paddingTop: height + 'px' }">
				<scroll-view class="tui-drawer-scroll" scroll-y :style="{ height: drawerH + 'px' }">
					<view class="tui-drawer-title">
						<text class="tui-title-bold">价格区间</text>
					</view>
					<view class="tui-drawer-content">
						<input placeholder-class="tui-phcolor" class="tui-input" v-model="min" placeholder="最低价"  type="number" @change="onChangePrice" />
						<tui-icon name="reduce" color="#333" :size="14"></tui-icon>
						<input placeholder-class="tui-phcolor" class="tui-input" v-model="max" placeholder="最高价"  type="number" @change="onChangePrice" />
					</view>
					<block v-for="(item,i) in dataList" :key="i">
						<tui-collapse :index="i" :current="item.current" :condition=selectedCondition[i] @click="change">
							<view slot="title">
								<view class="tui-drawer-title">
									<text class="tui-title-bold">{{item.name}}</text>
								</view>
							</view>
							<block v-if="i<=2">
								<view slot="top">
									<view class="tui-drawer-content tui-flex-attr tui-drawer-top">
										<block v-for="(value, j) in item.values.slice(0,3)" :key="j">
											<view class="tui-attr-item" :class="{'tui-btmItem-active': selectedIndex[i].includes(j)}" @tap=onSelect(i,j)>
												<view class="tui-attr-ellipsis">{{value}}</view>
											</view>
										</block>  	
									</view>
								</view>
								<view slot="content">
									<view class="tui-drawer-content tui-flex-attr">
										<block v-for="(value, j) in item.values.slice(3)" :key="j" >
											<view class="tui-attr-item" :class="{'tui-btmItem-active': selectedIndex[i].includes(j+3)}" @tap=onSelect(i,j+3)>
												<view class="tui-attr-ellipsis">{{value}}</view>
											</view>
										</block>  	
									</view>
								</view>
							</block>
							<block v-else> 
								<view slot="content">
									<view class="tui-drawer-content tui-flex-attr">
										<block v-for="(value, j) in item.values" :key="j" >
											<view class="tui-attr-item" :class="{'tui-btmItem-active': selectedIndex[i].includes(j)}" @tap=onSelect(i,j)>
												<view class="tui-attr-ellipsis">{{value}}</view>
											</view>
										</block>  	
									</view>
								</view>
							</block>
						</tui-collapse>
					</block>				
					<view class="tui-safearea-bottom"></view>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea">
						<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover" :hover-stay-time="150" @tap="reset">重置</view>
						<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover" :hover-stay-time="150" @tap="closeDrawer">确定({{currentList.length}}件商品)</view>
					</view>
				</view>
			</view>
		</tui-drawer>
		<!--左抽屉弹层 筛选-->
	</view>
</template>

<script>
	import tGroupItem from '@/components/views/t-group-item/t-group-item'
	export default {
		components: {
			tGroupItem
		},
		data() {
			return {
				min: '',
				max: '',
				selectH: 0,
				searchKey: '',
				isList: false, //列表或大图
				tabIndex: -1, //顶部筛选索引
				drawer: false,
				ascending: false,
				drawerH: 0,
				tabbarHeight: uni.upx2px(100),
				displayList: [],
				currentList: [],
				selectedIndex: [],
				selectedCondition: [],
				dataList: [],
				pageIndex: 1,
			}
		},
		onLoad(options) {
			if(options.searchKey){
				this.searchKey = options.searchKey
				this.currentList = this.$store.state.searchResult
			}else{
				this.currentList = this.productList
			}
			this.$nextTick(()=>{
				let groupNames = []
				this.goodsGroup.forEach((o)=>{groupNames.push(o.name)})
				this.dataList.push({name: '全部分类', current: 0, values: groupNames})
				let attrs = {}
				this.productList.forEach((o) => {
					o.selectedGoodsAttrList.forEach(v=>{
						if(attrs[v.name]){
							attrs[v.name].add(v.value)
						}else{
							attrs[v.name] = new Set([v.value])
						}
					})
				})
				let propsList = Object.keys(attrs).map((i)=>{
					return { 'name': i, 'values': Array.from(attrs[i])} //对象转数组   
				}).sort((a,b)=>{return b.values.length - a.values.length}); //按照属性元素个数排序
				propsList.forEach((props)=>{
					this.dataList.push({name: props.name, current: -1, values: props.values})
				})
				this.selectedCondition = new Array(this.dataList.length).fill('')
				this.selectedIndex = this.dataList.map(function(){return []})
			})
			uni.getSystemInfo({
				success: res => {
					let drawerH = res.windowHeight;
					// #ifdef H5
					this.drawerH = drawerH + 44;
					// #endif
					// #ifndef H5
					this.drawerH = drawerH;
					// #endif
				}
			});
		},
		computed: {
			goodsGroup() {
				return this.$store.state.goodsGroup
			},
			productList(){
				return this.$store.state.activityGoods
			}
		},
		watch:{
			currentList(v){
				if(v.length===0) {
					this.tui.toast('暂无匹配商品，更改选项试试吧')
				} 
				this.displayList = v
			}
		},
		methods: {
			search: function() {
				this.tui.href('/pages/common/search/search?from=groupList')
			},
			screen: function(e) {
				this.hideDropdownList();
				let index = e.currentTarget.dataset.index;
				if (index == -1 || index == 1) {
					this.tabIndex = index;
					this.displayList = this.currentList.sort((a,b)=>{ return b.salesNum-a.salesNum})
				} else if (index == 2) {
					this.isList = !this.isList;
				} else if (index == 3) {
					this.drawer = true;
				}
			},
			hideDropdownList: function() {
				this.selectH = 0;
			},
			sortOnPrice: function(e) {
				this.tabIndex = 0;
				this.ascending = !this.ascending
				if(this.ascending){
					this.displayList = this.currentList.sort((a,b)=>{ return a.activityPrice-b.activityPrice })
				}
				else{
					this.displayList = this.currentList.sort((a,b)=>{ return b.activityPrice-a.activityPrice })
				}
			},
			change(e){
				let index = e.index;
				let item = this.dataList[index];
				item.current = item.current == index ? -1 : index
			},
			reset() {
				let size = this.dataList.length
				this.min = ''
				this.max = ''
				this.selectedIndex = this.dataList.map(function(){return []})
				this.selectedCondition = new Array(size).fill('')
			},
			onDelete(){
				this.searchKey = ''
				this.isList = false
				this.currentList = this.productList
			},
			onChangePrice(){
				this.filter()
			},
			filter(){
				let res = this.productList
				if(this.min){
					res = res.filter((o)=>{
						return o.price>=this.min
					})
				}
				if(this.max){
					res = res.filter((o)=>{
						return o.price<=this.max
					})
				}
				let selectedGroups = this.selectedCondition[0]? this.selectedCondition[0].split('，') : []
				if(selectedGroups.length>0){
					res = res.filter((o)=>{
						let intersection = o.selectedClassifyList.filter((v) =>
						selectedGroups.includes(v)) //计算交集 
						return intersection.length>0
					})
				}
				let attrs = []
				this.selectedCondition.slice(1).forEach((o)=>{
					if(o){
						attrs.push(...o.split('，'))
					}
				})
				if(attrs.length>0){
					res = res.filter((o)=>{
						let elements = []
						o.selectedGoodsAttrList.forEach((e)=>{elements.push(e.value)})
						let intersection = elements.filter((v) => attrs.includes(v)) //计算交集 
						return intersection.length>0
					})
				}
				this.currentList = res   
			},
			onSelect(i,j){
				let index = this.selectedIndex[i].indexOf(j)
				if(index !== -1){
					this.selectedIndex[i].splice(index, 1)
				}else{
					this.selectedIndex[i].push(j)
				}
				let res = ''
				const values = this.dataList[i].values
				this.selectedIndex[i].forEach((k)=>{
					res = res + values[k] + '，'
				})
				res = res.slice(0, res.length - 1)
				this.selectedCondition[i]=res
				this.$forceUpdate()
				this.$nextTick(()=>{
					this.filter()
				})
			},
			closeDrawer: function() {
				this.displayList=this.currentList
				this.drawer = false;
				this.$forceUpdate()
			}
		}
	}
</script>

<style>
	.tui-search__bar {
		width: 100%;
		background-color: #fff;
		padding: 20rpx 25rpx;
		box-sizing: border-box;
	}

	.tui-searchbox {
		width: 100%;
		height: 64rpx;
		margin-right: 30rpx;
		border-radius: 15px;
		font-size: 24rpx;
		background: #f7f7f7;
		padding: 6rpx 20rpx;
		box-sizing: border-box;
		color: #999;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.tui-search-text {
	padding-left: 16rpx;
}

	.tui-search-key {
		max-width: 80%;
		height: 80%;
		padding: 0 16rpx;
		margin-left: 12rpx;
		display: flex;
		align-items: center;
		border-radius: 15px;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
	}

	.tui-key-text {
		box-sizing: border-box;
		padding-right: 12rpx;
		font-size: 22rpx;
		line-height: 22rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/*screen*/

	.tui-header-screen {
		width: 100%;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		z-index: 996;
	}

	.tui-screen__box {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		position: relative;
		background: #fff;
	}


	.tui-screen-item {
		height: 28rpx;
		line-height: 28rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-btmItem-active {
		background-color: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-btmItem-active::after {
		content: '';
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}


	.tui-addr-left {
		padding-left: 6rpx;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-active {
		color: #e41f19;
	}


	/*screen*/

	.tui-price-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 12rpx;
	}


	/*筛选*/
	.tui-drawer-box {
		width: 686rpx;
		font-size: 24rpx;
		overflow: hidden;
		position: relative;
		padding-bottom: 100rpx;
	}

	.tui-drawer-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 80rpx;
	}

	.tui-title-bold {
		font-size: 26rpx;
		font-weight: bold;
		flex-shrink: 0;
	}

	.tui-location {
		margin-right: 6rpx;
	}

	.tui-attr-right {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
	}
	.tui-all-box {
		width: 90%;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.tui-drawer-content {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.tui-drawer-top {
		padding-top: 16rpx;
	}
	.tui-input {
		border: 0;
		height: 64rpx;
		border-radius: 32rpx;
		width: 45%;
		background-color: #f7f7f7;
		text-align: center;
		font-size: 24rpx;
		color: #333;
	}

	.tui-phcolor {
		text-align: center;
		color: #b2b2b2;
		font-size: 24rpx;
	}

	.tui-flex-attr {
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.tui-attr-item {
		width: 30%;
		height: 64rpx;
		background-color: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 5%;
		margin-bottom: 5%;
	}

	.tui-attr-ellipsis {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 96%;
		text-align: center;
	}

	.tui-attr-item:nth-of-type(3n) {
		margin-right: 0%;
	}

	.tui-attr-btnbox {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 1000;
		box-sizing: border-box;
		padding: 30rpx;
		background: #fff;
	}

	.tui-attr-safearea {
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-attr-btnbox::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1px solid #eaeef1;
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 0;
	}

	.tui-drawer-btn {
		width: 47%;
		text-align: center;
		height: 70rpx;
		border-radius: 35rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.tui-drawerbtn-black {
		border: 1rpx solid #555;
	}

	.tui-drawerbtn-primary {
		background: #e41f19;
		color: #fff;
	}

	/*========商品 start======*/
	.tui-product__box {
		width: 100%;
		padding: 194rpx 16rpx 60rpx 16rpx;
		box-sizing: border-box;
	}
</style>
