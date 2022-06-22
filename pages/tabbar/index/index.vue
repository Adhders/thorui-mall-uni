<template>
	<view class="main">
	    <NavBar :page="page" @back="onBack"></NavBar>
		<view class="element-box" :style="{marginTop: (page.style.isEmbedding? 0: height)+'px'}">
			<view class="element-item" v-for="(item,index) in page.arrList" :key="index" :class="{ embedding: page.style.isEmbedding, normal: !page.style.isEmbedding}">
				<CarouselView :item=item v-if="item.cmptName==='CarouselView'" @goto="redirect"></CarouselView>
				<AnnounceView :item=item v-if="item.cmptName==='AnnounceView'" @goto="redirect"></AnnounceView>
				<ButtonView  :item=item v-if="item.cmptName==='ButtonView'" @goto="redirect"></ButtonView>
				<TitleView  :item=item v-if="item.cmptName==='TitleView'" @goto="redirect"></TitleView>
				<VideoView :item=item v-if="item.cmptName==='VideoView'" @goto="redirect"></VideoView>
				<GoodsView :item="item" v-if="item.cmptName==='GoodsView'"></GoodsView>
				<PictureView :item=item v-if="item.cmptName==='PictureView'"  @goto="redirect"></PictureView>
				<TypingView :item=item  v-if="item.cmptName==='TypingView'" @goto="redirect"></TypingView>
				<SearchView :item=item v-if="item.cmptName==='SearchView'"></SearchView>
				<NavigateView  :item=item v-if="item.cmptName==='NavigateView'" @goto="redirect"></NavigateView>
				<FreeVesselView  :item=item v-if="item.cmptName==='FreeVesselView'" @goto="redirect"></FreeVesselView>
				<CrossView :item=item v-if="item.cmptName==='CrossView'" @goto="redirect"></CrossView>
			</view>
		</view>
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
				pages: [],
				page: {}
			};
		},
		onLoad(){
			this.appid = this.$store.state.appid
			let url = '/getStoreGoods/' + this.appid
			this.tui.request(url).then(res=>{
				if (res.code==='0'){
					res.goodsList.forEach((o)=>{
						o.integerPrice = parseInt(o.price)
						o.decimalPrice = o.price.split('.')[1]
					})
					this.goodsList = res.goodsList
					console.log('goodsList', this.goodsList)
					this.$store.commit('setGoodsList', this.goodsList)
				}
			})
		    url = '/getStoreGoodsGroup/' + this.appid
            this.tui.request(url).then(
                res => {
                    if(res.code==='0'){
						let goodsGroup=[]
						res.goodsGroup.forEach((o)=>{
							o.children.forEach((group)=>{
								goodsGroup.push(group)
							})
						})
						this.$store.commit('setGoodsGroup', goodsGroup)
                    }
                }
            ).catch(err => { console.log('err', err) })
			url = '/getStoreDetail/' + this.appid
			this.tui.request(url).then(res => {
                this.pages = res.pages
				this.page = this.pages[0]
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#ff0000'
				})
				console.log('page', this.page)
            }).catch(err => {
                console.log('err', err) 
            }) 
		},
		methods: {
			onBack(e){
				let page = ''
				console.log('back',e)
				switch(e){
					case 'home':
						this.lastIndex = 0
						page = this.pages[0]
					case 'arrowleft':
					    page = this.pages[this.lastIndex]
				}
				this.page=page
			},
			redirect(e){
				console.log('goto', e)
				let page = ''
				if(e.pageName===''){
					return
				}
				switch(e.tabName){
					case '功能页面':
						let title = e.selectedLink.title
						if (title==='首页'){
							page = this.pages[0]
						}else if(title==='分类页'){
							uni.navigateTo({url: '/pages/tabbar/classify/classify'})
						}else if(title==='搜索页'){
							uni.navigateTo({url: '/pages/common/search/search'})
						}else if(title==='全部商品'){
							uni.navigateTo({url: '/pages/index/productList/productList'})
						}else if(title==='用户中心'){
							uni.navigateTo({url: '/pages/tabbar/my/my'})
						}else if(title==='购物车'){
							uni.navigateTo({url: '/pages/tabbar/cart/cart'})
						}else if(title==='全部订单'){
							uni.navigateTo({url: '/pages/my/myOrder/myOrder'})
						}else if(title==='售后订单'){
							uni.navigateTo({url: '/pages/my/refundList/refundList'})
						}else if(title==='地址列表'){
							uni.navigateTo({url: '/pages/my/address/address'})
						}else if(title==='微客服'){	
						}	
						break;
					case '装修页面':
						let pageID = e.selectedLink.id
                        page = this.pages.find((o)=>{return o.id===pageID})
						this.page = page
					case '商品分组':
						let parent = e.selectedLink.parent
						if(parent){
							let groupName = e.selectedLink.name
							uni.navigateTo({url: '/pages/index/productList/productList?groupName=' + groupName})
						}else{
							let groupList = []
							e.selectedLink.children.forEach((o)=>{
								groupList.push(o.name)
							})
							uni.navigateTo({url: '/pages/index/productList/productList?groupList=' + JSON.stringify(groupList)})
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
			}
			
		}	
	};
</script>

<style lang="scss" scoped>
   
   .main, page{
		background-color: #fff;
   }
</style>
