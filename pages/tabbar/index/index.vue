<template>
	<view class="father">
		<NavBar :page="page" @back="onBack"></NavBar>
		<view class="element-box"
			:style="{marginTop: (page.style.isEmbedding? 0: height)+'px', marginBottom: (visible? height: 0) + 'px'}">
			<view class="element-item" v-for="(item,index) in page.arrList" :key="index"
				:class="{ embedding: page.style.isEmbedding, normal: !page.style.isEmbedding}">
				<CarouselView :item=item v-if="item.cmptName==='CarouselView'" @goto="redirect"></CarouselView>
				<AnnounceView :item=item v-if="item.cmptName==='AnnounceView'" @goto="redirect"></AnnounceView>
				<ButtonView :item=item v-if="item.cmptName==='ButtonView'" @goto="redirect"></ButtonView>
				<TitleView :item=item v-if="item.cmptName==='TitleView'" @goto="redirect"></TitleView>
				<VideoView :item=item v-if="item.cmptName==='VideoView'" @goto="redirect"></VideoView>
				<GoodsView :item="item" v-if="item.cmptName==='GoodsView'"></GoodsView>
				<PictureView :item=item v-if="item.cmptName==='PictureView'" @goto="redirect"></PictureView>
				<TypingView :item=item v-if="item.cmptName==='TypingView'" @goto="redirect"></TypingView>
				<SearchView :item=item v-if="item.cmptName==='SearchView'"></SearchView>
				<NavigateView :item=item v-if="item.cmptName==='NavigateView'" @goto="redirect"></NavigateView>
				<FreeVesselView :item=item v-if="item.cmptName==='FreeVesselView'" @goto="redirect"></FreeVesselView>
				<CrossView :item=item v-if="item.cmptName==='CrossView'" @goto="redirect"></CrossView>
			</view>
		</view>
		<tui-tabbar :current="current" :tabBar="tabBar.list" v-if="visible" :color="tabBar.color"
			:selectedColor="tabBar.selectedColor" :backgroundColor="tabBar.backgroundColor" @click="tabbarSwitch">
		</tui-tabbar>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				height: getApp().globalData.navBarHeight,
				goodsList: [],
				startVideo: true,
				lastIndex: 0, //上一页面的索引
				appid: '',
				visible: true,
				current: 0,
				pageStack: [], //页面堆栈
				pages: [],
				page: {},
				tabBar: {
					iconList: [],
					style: {
						color: "#666666",
						selectedColor: "#EB0909",
						backgroundColor: "#FFFFFF"
					}
				}
			}
		},
		onLoad() {
			this.appid = this.$store.state.appid
			let url = '/getStoreGoods/' + this.appid
			this.tui.request(url).then(res => {
				console.log('res', res)
				if (res.code === '0') {
					res.goodsList.forEach((o) => {
						o.integerPrice = parseInt(o.price)
						o.decimalPrice = o.price.split('.')[1]
					})
					this.goodsList = res.goodsList
					this.$store.commit('setGoodsList', this.goodsList)
					url = '/getStoreGoodsGroup/' + this.appid
					this.tui.request(url).then(
						res => {
							console.log('group', res)
							if (res.code === '0') {
								let goodsGroup = []
								res.goodsGroup.forEach((o) => {
									o.children.forEach((group) => {
										goodsGroup.push(group)
									})
								})
								goodsGroup.forEach((v) => {
									v.goodsList = []
									this.goodsList.forEach((o) => {
										if (o.selectedClassifyList.includes(v.name)) {
											v.goodsList.push(o)
										}
									})
								})
								this.$store.commit('setGoodsGroup', goodsGroup)
							}
						}
					).catch(err => {
						console.log('err', err)
					})
				}
			})
			url = '/getStoreDetail/' + this.appid
			this.tui.request(url).then(res => {
				if (res.code === '0') {
					this.tabBar = res.tabBar
					this.pages = res.pages
					this.page = this.pages[0]
					this.$store.commit('setTabBar', this.tabBar)
					this.$store.commit('setPages', this.pages)
					console.log('page', this.page)
				}
			}).catch(err => {
				console.log('err', err)
			})
		},
		onShow() {

			let index = this.pages.findIndex((o) => {
				return o.id === this.page.id
			})
			if (index === 0) {
				this.visible = true
			}
			this.current = 0
		},
		methods: {
			onBack(e) {
				let page = ''
				switch (e) {
					case 'home':
						this.visible = true
						page = this.pages[0]
						this.pageStack = []
					case 'arrowleft':
						page = this.pageStack.pop()
						if (this.pageStack.length === 0) {
							this.visible = true
						}
				}
				this.page = page
			},
			redirect(e) {
				if (e.pageName === '') {
					return
				}
				switch (e.tabName) {
					case '功能页面':
						let title = e.selectedLink.title
						if (title === '首页') {
							let page = ''
							page = this.pages[0]
							this.visible = true
							this.pageStack = []
						} else if (title === '分类页') {
							uni.navigateTo({
								url: '/pages/tabbar/classify/classify'
							})
						} else if (title === '搜索页') {
							uni.navigateTo({
								url: '/pages/common/search/search'
							})
						} else if (title === '全部商品') {
							uni.navigateTo({
								url: '/pages/index/productList/productList'
							})
						} else if (title === '用户中心') {
							uni.navigateTo({
								url: '/pages/tabbar/my/my'
							})
						} else if (title === '购物车') {
							uni.navigateTo({
								url: '/pages/tabbar/cart/cart'
							})
						} else if (title === '全部订单') {
							uni.navigateTo({
								url: '/pages/my/myOrder/myOrder'
							})
						} else if (title === '售后订单') {
							uni.navigateTo({
								url: '/pages/my/refundList/refundList'
							})
						} else if (title === '地址列表') {
							uni.navigateTo({
								url: '/pages/my/address/address'
							})
						} else if (title === '微客服') {}
						break;
					case '装修页面':
						let pageID = e.selectedLink.id
						this.pageStack.push(this.page)
						let index = this.pages.findIndex((o) => {
							return o.id === pageID
						})
						this.visible = index === 0
						this.page = this.pages[index]
						break;
					case '商品分组':
						let parent = e.selectedLink.parent
						let groupType = e.selectedLink.groupType
						if (parent) {
							let groupName = e.selectedLink.name
							if (groupType === 'list') {
								uni.navigateTo({
									url: '/pages/index/list/list?groupName=' + groupName
								})
							} else {
								uni.navigateTo({
									url: '/pages/tabbar/classify/classify?groupName=' + groupName
								})
							}
						} else {
							let groupList = []
							e.selectedLink.children.forEach((o) => {
								groupList.push(o.name)
							})
							uni.navigateTo({
								url: '/pages/index/productList/productList?groupList=' + JSON.stringify(groupList)
							})
						}
						break;
					case '商品详情':
						let spu_id = e.selectedLink.spu_id
						let id = e.selectedLink.id
						uni.navigateTo({
							url: '/pages/index/productDetail/productDetail?spu_id=' + spu_id + '&sku_id=' + id
						})
						break;
					case '自定义链接':
						let customForm = e.customForm
						break;
				}
			},
			tabbarSwitch(e) {
				this.current = e.index
				this.redirect(e.chooseLink)
			}
		}
	};
</script>

<style lang="scss" scoped>
		.father {
			width: 100vw;
			height: 100vh;
			overflow-x: hidden;
			overflow-y: auto;
		}
	
		// ::-webkit-scrollbar {
		// 	width: 10px;
		// 	height: 0;
		// 	color: transparent;
		// 	// display: none;
		// }

	//   .main, page{
	// overflow: hidden;
	// height: 100%;
	// background-color: #fff;
	//   }
	//   .element-box{
	// width: 100vw;
	// height: 100vh;
	// background-color: #ffffff;
	// display: flex;
	// flex-direction: column;	
	//  overflow-y: auto;
	//  height: 100%;
	//   }
</style>
