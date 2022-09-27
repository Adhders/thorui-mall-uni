<template>
    <tui-bottom-popup :show="popupShow" @close="hidePopup">
        <view class="tui-popup-box">
			<view class="tui-product-box tui-padding">
				<image :src="sku.src? sku.src : goodsDetail.defaultImageUrl" class="tui-popup-img"  mode="aspectFill"></image>
				<view class="tui-price-box">
					<view class="tui-popup-price">
						<view class="tui-amount tui-bold">￥{{goodsDetail.price}}</view>
						<view class="tui-number" v-if="unSelect.length==0">已选择: {{skuSpecValueList | attrFormat}}</view>
                        <view class="tui-number" v-else>请选择: {{unSelect.join(' ')}}</view>
					</view>
					<tui-numberbox style="flex-direction: row;" :max="99" :min="1" :value="buyNum" @change="change"></tui-numberbox>
				</view>
			</view>
			<scroll-view scroll-y class="tui-popup-scroll">
				<view class="tui-scrollview-box">
					<view v-for="(item, i) in propsList" :key=i>
						<view class="tui-bold tui-attr-title">{{item.name}}</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item" v-for="(value, j) in item.values" :key=j
									@tap="onSelect(i,j)" :class="{'tui-attr-active': selectedIndex[i]===j, 'invalid': isInvalid(i,j)}">
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
	data() {
		return {
            popupShow: false,
            unSelect: [],
            buyNum: 1,
            sku: {src: ''},
            defaultImageUrl: '',
            skuList: [],
            propsList: [], //商品属性
            invalidSkuIndexList: [],
            selectedIndex: [],
            skuSpecValueList: [], //商品去重后的属性
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
        },
        cart() {
            return this.$store.state.cart
        }
    },
    methods: {
        initial(id){
            let index = this.goodsList.findIndex((o)=>{return o.id == id})
            if(index === -1){
                uni.redirectTo({url: '/pages/index/invalidProduct/invalidProduct'})
            }else{
                this.goodsDetail = this.goodsList[index]
                this.skuList=this.goodsDetail.skuList
                this.sku = this.skuList[0]
            }
			this.$nextTick(()=>{
				let attrs = {}
                this.goodsDetail.selectedGoodsAttrList.forEach(attr=>{
                    if(attr[0] in attrs){
                        attrs[attr[0]].push(attr[1])
                    }else{
                        attrs[attr[0]] = [attr[1]]
                    }
                })
				this.propsList = Object.keys(attrs).map((i)=>{
					return { 'name': i, 'values': Array.from(attrs[i])}
				}); //对象转数组
                // console.log('propsList', this.propsList)
                this.invalidSkuIndexList = this.verify() // 获取失效sku的索引
                // console.log('invalidSkuIndexList', this.invalidSkuIndexList)
                // 默认第一个属性
				this.selectedIndex = new Array(this.propsList.length).fill(0)
                this.skuSpecValueList = this.sku.skuSpecValueList
                this.$emit('select', this.goodsDetail, this.skuSpecValueList, this.unSelect)
			}) 
        },
        onSelect(i,j){
            if(!this.isInvalid(i,j)){
                if (this.selectedIndex[i]===j){
                    this.selectedIndex[i]=-1
                    this.sku = this.skuList[0]
                }else{
                    this.selectedIndex[i]=j
                    if(this.selectedIndex.indexOf(-1)==-1){
                        let skuSpecValueList = []
                        this.propsList.forEach((o, index)=>{
                            let res = {name: o.name, value: o.values[this.selectedIndex[index]]}
                            skuSpecValueList.push(res)
                        })
                        this.sku = this.skuList.find((_sku)=>{
                            let s1 = _sku.skuSpecValueList.map((o)=>{return o.value})
                            let s2 = skuSpecValueList.map((o)=>{return o.value})
                            return s1.toString()==s2.toString()
                        })
                        this.skuSpecValueList = skuSpecValueList
                    }
                }
                // 更新没选中列表
                let res = []
                this.selectedIndex.forEach((i, index)=>{
                    if(i==-1){ res.push(this.propsList[index].name) }
                })
                this.unSelect = res
                this.goodsDetail.price = this.sku.price
                this.goodsDetail.originalPrice = this.sku.originalPrice
                this.$emit('select', this.goodsDetail, this.skuSpecValueList, this.unSelect)
            }else{
                this.tui.toast('该规格已售罄')
            }
        },
        isInvalid(i,j){
            let selectedIndex = JSON.parse(JSON.stringify(this.selectedIndex))
            selectedIndex[i]=j
            if (-1 in selectedIndex){
                return false
            }else{
                return this.invalidSkuIndexList.includes(selectedIndex.toString())
            }
        },
        verify(){
            let res = []
            this.skuList.forEach((v)=>{
                if(v.stock<=0){
                    let indexList = v.skuSpecValueList.map((attr, index)=>{
                        return this.propsList[index].values.indexOf(attr.value)
                    })
                    res.push(indexList.toString())
                }
            })
            return res
        },
        hidePopup: function() {
            this.popupShow = false;
        },
        change: function(e) {
            this.buyNum = e.value;
            this.$emit('change', e)
        },
        addCart() {
            if(this.unSelect.length>0){
                this.tui.toast(`请选择: ${this.unSelect.join(' ')}`)
            }else{
                let newGoods = {
                    id: this.goodsDetail.id,
                    skuId: this.sku.skuId,
                    price: this.sku.price,
                    title: this.goodsDetail.title,
                    slogan: this.goodsDetail.slogan,
                    defaultImageUrl: this.sku.src? this.sku.src : this.goodsDetail.defaultImageUrl,
                    propertyList: this.skuSpecValueList,
                    buyNum: this.buyNum,
                    invalid: this.sku.stock<=0, 
                    select: false
                }
                if(!this.tui.isLogin()) {
                    uni.navigateTo({url: '/pages/my/login/login'})
                }else{
                    let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/updateCart'
                    let index = this.cart.findIndex((o)=>{return o.skuId === newGoods.skuId})
                    if(index===-1){
                        this.cart.unshift(newGoods)
                    }else{
                        this.cart[index].buyNum +=newGoods.buyNum
                    }
				    this.tui.request(url, 'PUT', {'cart': this.cart}).then((res)=>{
                        if(res.code==0){
                            this.tui.toast('添加成功')
                        }
                    })
                }
                this.popupShow = false;
            }
        },
        submit() {
            if(this.unSelect.length>0){
                this.tui.toast(`请选择: ${this.unSelect.join(' ')}`)
            }else{
                this.popupShow = false;
                let goods = [{
                    id: this.goodsDetail.id,
                    skuId: this.sku.skuId,
                    price: this.sku.price,
                    title: this.goodsDetail.title,
                    slogan: this.goodsDetail.slogan,
                    defaultImageUrl: this.sku.src? this.sku.src : this.goodsDetail.defaultImageUrl,
                    propertyList: this.skuSpecValueList,
                    buyNum: this.buyNum,
                }]
                let url = "/pages/order/submitOrder/submitOrder?mode=''&goods=" + JSON.stringify(goods)
                this.tui.href(url, true);
            }
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