<template>
	<page>
		<NavBar :page="page" @back="onBack"></NavBar>
		<scroll-view scroll-y style="height: 100vh;" show-scrollbar>
			<view class="element-box"
				:style="{marginTop: (page.style.isEmbedding? 0: height)+'px', paddingBottom: (visible? height: 0) + 'px'}">
				<view class="element-item" v-for="(item,index) in page.arrList" :key="index"
					:class="{ embedding: page.style.isEmbedding, normal: !page.style.isEmbedding}">
					<CarouselView :item=item v-if="item.cmptName==='CarouselView'" @goto="redirect"></CarouselView>
					<AnnounceView :item=item v-if="item.cmptName==='AnnounceView'" @goto="redirect"></AnnounceView>
					<ButtonView :item=item v-if="item.cmptName==='ButtonView'" @goto="redirect"></ButtonView>
					<TitleView :item=item v-if="item.cmptName==='TitleView'" @goto="redirect"></TitleView>
					<VideoView :item=item v-if="item.cmptName==='VideoView'" @goto="redirect"></VideoView>
					<GoodsView :item="item" v-if="item.cmptName==='GoodsView'"></GoodsView>
					<GroupBuyView :item="item" v-if="item.cmptName==='GroupBuyView'"></GroupBuyView>
					<PictureView :item=item v-if="item.cmptName==='PictureView'" @goto="redirect"></PictureView>
					<TypingView :item=item v-if="item.cmptName==='TypingView'" @goto="redirect"></TypingView>
					<SearchView :item=item v-if="item.cmptName==='SearchView'"></SearchView>
					<NavigateView :item=item v-if="item.cmptName==='NavigateView'" @goto="redirect"></NavigateView>
					<FreeVesselView :item=item v-if="item.cmptName==='FreeVesselView'" @goto="redirect"></FreeVesselView>
					<CrossView :item=item v-if="item.cmptName==='CrossView'" @goto="redirect"></CrossView>
				</view>
			</view>
		</scroll-view>	
		<tui-tabbar :current="current" :tabBar="tabBar.list" v-if="visible" :color="tabBar.color"
			:selectedColor="tabBar.selectedColor" :backgroundColor="tabBar.backgroundColor" @click="tabbarSwitch">
		</tui-tabbar>
	</page>
</template>
<script>
	export default {
		data() {
			return {
				appid: '',
				height: getApp().globalData.navBarHeight,
				startVideo: true,
				scrollTop: 0,
				lastIndex: 0, //上一页面的索引
				visible: true,
				current: 0,
				pageStack: [], //页面堆栈
				page: {},
			}
		},
		onLoad() {
			this.appid = getApp().globalData.appid
			if(this.goodsList.length===0){
				let url = '/getStoreGoods/' + this.appid
				this.tui.request(url).then(res => {
					console.log('res', res)
					if (res.code === '0') {
						res.goodsList.forEach((o) => {
							o.integerPrice = parseInt(o.price)
							o.decimalPrice = o.price.split('.')[1]
						})
						this.$store.commit('setGoodsList', res.goodsList)
						url = '/getStoreGoodsGroup/' + this.appid
						this.tui.request(url).then(
							res => {
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
			}
			if(this.pages.length===0){
				let url = '/getStoreDetail/' + this.appid
				this.tui.request(url).then(res => {
					if (res.code === '0') {
						this.page = res.pages[0]
						this.$store.commit('setPhone', res.mobile)
						this.$store.commit('setPages', res.pages)
						this.$store.commit('setTabBar', res.tabBar)
					}
				}).catch(err => {
					console.log('err', err)
				})
			}else(
				this.page = this.pages[0]
			)
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
		computed: {
			pages(){
				return this.$store.state.pages
			},
			goodsList(){
				return this.$store.state.goodsList
			},
			tabBar(){
				return this.$store.state.tabBar
			}
		},
		methods: {
			onBack(e) {
				switch (e) {
					case 'home':
						this.visible = true
						this.page = this.pages[0]
						this.pageStack = []
						break;
					case 'arrowleft':
						this.page = this.pageStack.pop()
						if (this.pageStack.length === 0) {
							this.visible = true
						}
						break;
				}
			},
			redirect(e) {
				if (e.pageName === '') {
					return
				}
				switch (e.tabName) {
					case '功能页面':
						let title = e.selectedLink.title
						if (title === '首页') {
							this.page = this.pages[0]
							this.visible = true
							this.pageStack = []
						}else if(title==='分类页'){
							this.tui.href('/pages/tabbar/classify/classify')
						}else if(title==='搜索页'){
							this.tui.href('/pages/common/search/search')
						}else if(title==='全部商品'){
							this.tui.href('/pages/index/productList/productList')
						}else if(title==='用户中心'){
							this.tui.href('/pages/tabbar/my/my')
						}else if(title==='购物车'){
							this.tui.href('/pages/tabbar/cart/cart')
						}else if(title==='全部订单'){
							this.tui.href('/pages/my/myOrder/myOrder')
						}else if(title==='售后订单'){
							this.tui.href('/pages/my/refundList/refundList')
						}else if(title==='地址列表'){
							this.tui.href('/pages/my/address/address')
						}else if(title==='微客服'){}	
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
							if (groupType === 'list'){
								this.tui.href('/pages/index/list/list?groupName=' + groupName)
							} else{
								this.tui.href('/pages/tabbar/classify/classify?groupName=' + groupName)
							}
						} else {
							let groupList = []
							e.selectedLink.children.forEach((o) => {
								groupList.push(o.name)
							})
							this.tui.href('/pages/index/productList/productList?groupList=' + JSON.stringify(groupList))
						}
						break;
					case '商品详情':
						let spu_id = e.selectedLink.spu_id
						let id = e.selectedLink.id
						this.tui.href('/pages/index/productDetail/productDetail?spu_id=' + spu_id + '&sku_id=' + id)
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

</style>
