<template>
    <tui-bottom-popup :show="popupShow" @close="hidePopup" :translateY="scrollTop">
        <view class="tui-popup-box">
			<view class="tui-product-box tui-padding">
				<image :src="goodsDetail.defaultImageUrl" class="tui-popup-img"  mode="aspectFill"></image>
				<view class="tui-price-box">
					<view class="tui-popup-price">
						<view class="tui-amount tui-bold">￥{{goodsDetail.price}}</view>
						<view class="tui-number">已选择: {{selectedGoodsAttrList | attrFormat}}</view>
					</view>
					<tui-numberbox style="flex-direction: row;" :max="99" :min="1" :value="buyNum" @change="change"></tui-numberbox>
				</view>
			</view>
			<scroll-view scroll-y class="tui-popup-scroll">
				<view class="tui-scrollview-box">
					<view v-for="(item, i) in propsList" :key=i>
						<view class="tui-bold tui-attr-title">{{item.name}}</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item"
								v-for="(value, j) in item.values" :key=j
									@tap="onSelect(i,j)"
								:class="{ 'tui-attr-active': selectedIndex[i]===j, 'invalid': isInvalid(i,j)}">
									{{value}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn">
                <view class="tui-flex-1">
                    <tui-button height="72rpx" :size="28" type="danger" shape="circle" @tap="addCart">加入购物车</tui-button>
                </view>
                <view class="tui-flex-1">
                    <tui-button height="72rpx" :size="28" type="warning" shape="circle" @tap="submit">立即购买</tui-button>
                </view>
            </view>
			<view class="tui-right">
				<tui-icon name="close-fill" color="#999" :size="20"  @tap="hidePopup"></tui-icon>
			</view>
		</view>
    </tui-bottom-popup>
</template>
<script>
export default {
	name: 'addCart',
	props: {
        'goods': {
            type: Object,
            default: null,
        },
        'scrollTop':{
            type: String,
            default: '0'
        }
    },
	data() {
		return {
            popupShow: false,
            buyNum: 1,
            skuList: [],
            skuArray: [], 
            propsList: [], //商品属性
            invalidSkuList: [],
            invalidSkuIndexList: [],
            selectedIndex: [],
            selectedGoodsAttrList: [], //商品去重后的属性
			goodsDetail: {selectedGoodsPropList: []},
        }
	},
    filters: {
        attrFormat(attr) {
            let res = ''
            attr.forEach((o)=>{
                res+=o.value+'，'
            })
            return res.slice(0, -1)
        },
    },
    computed: {
        goodsList() {
            return this.$store.state.goodsList
        }
    },
    watch: {
        goods(v){
            if(v){
                this.buyNum=1
                this.skuList=[]
                this.skuArray=[]
                this.propsList=[]
                this.invalidSkuList=[],
                this.invalidSkuIndexList=[],
                this.selectedIndex=[],
                this.selectedGoodsAttrList=[]
                this.initial(v.spu_id, v.sku_id)
            }
        }
    },
    methods: {
        initial(spu_id, sku_id){
			this.skuList = this.goodsList.filter((o)=>{return o.spu_id === spu_id})
			if(this.skuList.length===0){
				uni.redirectTo({url: '/pages/index/invalidProduct/invalidProduct'})
			}
			if(sku_id){
                let index = this.skuList.findIndex((o)=>{return o.id === sku_id})
				if(index === -1){
					uni.redirectTo({url: '/pages/index/invalidProduct/invalidProduct'})
				}else{
					this.goodsDetail = this.skuList[index]
				}
			}else{
				this.goodsDetail = this.skuList[0]
			}
			let attrs = {}
			this.goodsDetail.selectedGoodsAttrList.forEach(v=>{
				if(!attrs[v.name]){
					attrs[v.name] = v.value
				}
			})
			this.selectedGoodsAttrList=Object.keys(attrs).map((i)=>{
				return { 'name': i, 'value': attrs[i] }
			}); //对象转数组   

			this.$nextTick(()=>{
				let attrs = {}
				this.skuList.forEach((o) => {
					o.selectedGoodsAttrList.forEach(v=>{
						if(attrs[v.name]){
							attrs[v.name].add(v.value)
						}else{
							attrs[v.name] = new Set([v.value])
						}
					})
				})
				this.propsList = Object.keys(attrs).map((i)=>{
					return { 'name': i, 'values': Array.from(attrs[i])}
				}); //对象转数组
				this.propsList.forEach((o)=>{
					let skuValues = o.values.map((v)=>{return { 'name': o.name, 'value': v }})
					this.skuArray.push(skuValues)
				})
				this.verify() // 获取失效sku列表invalidList
			    this.invalidSkuList.forEach((o)=>{ // 获取失效sku列表invalidList 的索引
					let indexList = []
					o.forEach((v)=>{
						let prop = JSON.parse(v)
						indexList.push(Array.from(attrs[prop.name]).indexOf(prop.value)) 
					})
					this.invalidSkuIndexList.push(JSON.stringify(indexList))
				})
				let labelNames = Object.keys(attrs)
				this.selectedIndex = new Array(this.propsList.length).fill(0)
				this.selectedGoodsAttrList.forEach((o)=>{
                    let i = labelNames.indexOf(o.name)
                    this.selectedIndex[i] = this.propsList[i].values.indexOf(o.value) 
				})
                this.$emit('select', this.goodsDetail, this.selectedGoodsAttrList)
			}) 
        },
        onSelect(i,j){
            if(!this.isInvalid(i,j)){
                this.selectedIndex[i]=j
                let attr = new Array()
                let selectedGoodsAttrList = []
                this.propsList.forEach((o, index)=>{
                    let res = {name: o.name, value: o.values[this.selectedIndex[index]]}
                    selectedGoodsAttrList.push(res)
                    attr.push(JSON.stringify(res))
                })
                this.selectedGoodsAttrList = selectedGoodsAttrList
                let skuIndex = this.skuList.findIndex(o=>{
                    let intersection = o.selectedGoodsAttrList.filter((v) =>
                    attr.includes(JSON.stringify(v))) //计算交集  
                    return intersection.length === attr.length
                })
                this.goodsDetail = this.skuList[skuIndex]
                this.$emit('select', this.goodsDetail, this.selectedGoodsAttrList)
            }else{
                this.tui.toast('该规格已售罄')
            }
        },
        isInvalid(i,j){
            let selectedIndex = JSON.parse(JSON.stringify(this.selectedIndex))
            selectedIndex[i]=j
            return this.invalidSkuIndexList.includes(JSON.stringify(selectedIndex))
        },
        // 计算商品sku笛卡尔积
        calcDescartes(array) {
            if (array.length < 2) return array[0].map((o)=>{return new Array(o)}) || [];
            return array.reduce((total, currentValue) => {
                let res = [];
                total.forEach(t => {
                    currentValue.forEach(cv => {
                        if (t instanceof Array) // 或者使用 Array.isArray(t)
                        res.push([...t, cv]);
                        else
                        res.push([t, cv]);
                    })
                })
                return res;
            })
        },
        //验证商品sku是否失效
        verify(){
            let descartes = this.calcDescartes(this.skuArray)
            descartes.forEach((m)=>{
                let attr = []
                m.forEach((n)=>{attr.push(JSON.stringify(n))})
                let skuIndex = this.skuList.findIndex(o=>{
                let intersection = o.selectedGoodsAttrList.filter((v) =>
                    attr.includes(JSON.stringify(v)))   
                return intersection.length === attr.length})
                if(skuIndex===-1){
                    this.invalidSkuList.push(attr)
                }
            })
        },
        hidePopup: function() {
            this.popupShow = false;
        },
        change: function(e) {
            this.buyNum = e.value;
        },
        addCart() {
            let newGoods = {
                id: this.goodsDetail.id,
                spu_id: this.goodsDetail.spu_id,
                price: this.goodsDetail.price,
                integerPrice: this.goodsDetail.integerPrice,
                decimalPrice: this.goodsDetail.decimalPrice,
                title: this.goodsDetail.title,
                slogan: this.goodsDetail.slogan,
                defaultImageUrl: this.goodsDetail.defaultImageUrl,
                propertyList: this.selectedGoodsAttrList,
                buyNum: this.buyNum,
            }
            if(!this.tui.isLogin()) {
                uni.navigateTo({url: '/pages/my/login/login'})
            }else{
                let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/addCart'
                this.tui.request(url, 'PUT', {'newGoods': newGoods}).then(res=>{
                        if(res.code==='0'){
                            this.$emit('add', newGoods)
                            this.tui.toast('成功添加到购物车')
                        }
                    }
                )

            }
            this.popupShow = false;
        },
        submit() {
            this.popupShow = false;
            let goods = [{
                id: this.goodsDetail.id,
                spu_id: this.goodsDetail.spu_id,
                price: this.goodsDetail.price,
                integerPrice: this.goodsDetail.integerPrice,
                decimalPrice: this.goodsDetail.decimalPrice,
                title: this.goodsDetail.title,
                slogan: this.goodsDetail.slogan,
                defaultImageUrl: this.goodsDetail.defaultImageUrl,
                propertyList: this.selectedGoodsAttrList,
                buyNum: this.buyNum,
            }]
            let url = '/pages/order/submitOrder/submitOrder?goods=' + JSON.stringify(goods)
            this.tui.href(url, true);
        },
    }
};
</script>

<style lang="less" scoped>
    .tui-popup-box {
        position: relative;
        padding: 30rpx 0 100rpx 0;
        .tui-padding {
            padding: 0 30rpx;
            box-sizing: border-box;
        }
        .tui-price-box{
            flex-direction: column;
            margin-left: 20rpx;
            display: flex;
            justify-content: space-between;
        }
        .tui-popup-price {
            padding-bottom: 8rpx;
        }
        .tui-product-box {
            display: flex;
            flex-direction: row;
            font-size: 24rpx;
            padding-bottom: 30rpx;
        }
        .tui-popup-img {
            height: 200rpx;
            width: 200rpx;
            border-radius: 24rpx;
            display: block;
        }

        .tui-popup-price {
            padding-bottom: 8rpx;
        }

        .tui-amount {
            color: #ff201f;
            font-size: 36rpx;
        }
        .tui-number {
            font-size: 24rpx;
            line-height: 24rpx;
            padding-top: 12rpx;
            color: #999;
        }
    }
    .tui-popup-scroll {
		max-height: 600rpx;
		font-size: 26rpx;
		.tui-scrollview-box {
			padding: 0 30rpx 60rpx 30rpx;
			box-sizing: border-box;
			.tui-attr-title {
				padding: 10rpx 0;
				color: #333;
			}
			.tui-attr-box {
				font-size: 0;
				padding: 20rpx 0;
                flex-direction: row;
				.tui-attr-item {
					max-width: 100%;
					min-width: 200rpx;
					height: 64rpx;
					display: -webkit-inline-flex;
					display: inline-flex;
                    flex-direction: row;
					align-items: center;
					justify-content: center;
					background: #f7f7f7;
					padding: 0 26rpx;
					box-sizing: border-box;
					border-radius: 32rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					font-size: 26rpx;
				}
				.tui-attr-active {
					background: #fcedea;
					color: #e41f19;
					font-weight: bold;
					position: relative;
					&::after {
						content: '';
						position: absolute;
						border: 1rpx solid #e41f19;
						width: 100%;
						height: 100%;
						border-radius: 40rpx;
						left: 0;
						top: 0;
					}
					&.invalid::after{
						display: none;
					}
				}
				.invalid {
					color: #888;
					opacity: 0.5;
					background: #f7f7f7;
				}	
			}
		}

    }
	.tui-operation {
		width: 100%;
		height: 100rpx;
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
        flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 0;
		left: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.tui-operation::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-operation-right {
		height: 100rpx;
		padding: 0 12rpx;
		box-sizing: border-box;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
        flex-direction: row;
		justify-content: center;
	}
    .tui-right {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}
	.tui-flex-1 {
		flex: 1;
		padding: 6rpx;
	}
    .tui-popup-btn {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
    }
</style>