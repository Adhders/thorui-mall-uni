<template>
    <view :style="{
        marginBottom: item.style.bottomMargin*2 + 'rpx',
        marginTop: item.style.topMargin*2 + 'rpx'}">
        <view class="displayBox type1" v-if="item.style.layout==='1'">
            <view class="merchandise-item" v-for="(product,index) in goodsList" :key="index"
                :class="{border: item.style.type==='3',shadow: item.style.type==='2'}"
                :style="{borderRadius: item.style.borderRadius*2 + 'px'}">
                 <image mode="widthFix" :style="{
                    height: (item.style.scale==='0')? '300rpx' : '600rpx',
                    borderRadius: item.style.type!=='1' ? 0 : item.style.borderRadius*2 + 'rpx' }"
                    :src=product.defaultImageUrl>
                <view class="image-tag" v-show="item.style.showTags">
                    <image style="width: 53px; height: 15px" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_goods.png">
                </view>
                <view class="price-panel">
                    <view class="title"><span>{{product.title}}</span></view>
                    <view class="label-box" v-show="item.style.showTags">
                        <img style="width: 24px" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_member.png">
                        <img style="width: 37px" src="https://system.chuangbiying.com/assets/store/listTpl_limit.png">
                    </view>
                    <view class="icon-box">
                        <view class="price">
                            <view class="price-unit">¥</view>
                            <view class="price-val">{{(product.integerPrice)}}</view>
                            <view class="dot-val" v-if="product.decimalPrice">.{{product.decimalPrice}}</view>
                            <del class="del-val" v-show="item.style.showPrice">¥{{product.originalPrice}}</del>
                        </view>
                        <view class="saled-out" v-show="item.style.showSales">已售{{numFormat(product.salesNum)}}件</view>
                        <tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(product)" v-show="item.style.showCart"></tui-icon>
                    </view>
                </view>
            </view>
        </view>
        <view class="type2" v-if="item.style.layout==='2'">
            <tui-waterfall :listData="item.content.goodsList" :params="item.style" :type="2" :pageSize="10">
				<template slot-scope="{ entity, params}" slot="left"> 
                    <view class="merchandise-item" :class="{ border: params.type==='3',shadow: params.type==='2'}"
                        :style="{ borderRadius: params.borderRadius*2 + 'rpx'}">
                        <image :src=product.defaultImageUrl mode="widthFix" :style="{width: '344rpx', borderRadius: params.type!=='1'? 0 : params.borderRadius*2 + 'rpx'}">
                        <view class="image-tag" v-show="params.showTags">
                            <iamge style="width: 53px; height: 15px" mode="widthFix" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_goods.png">
                        </view>
                        <view class="price-panel">
                            <view class="title"><span>{{entity.title}}</span></view>
                            <view class="label-box" v-show="params.showTags">
                                <img style="width: 24px" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_member.png">
                                <img style="width: 37px" src="https://system.chuangbiying.com/assets/store/listTpl_limit.png">
                            </view>
                            <view class="saled-out" v-show="params.showSales">已售{{numFormat(entity.salesNum)}}件</view>
                            <view class="icon-box">
                                <view class="price">
                                    <view class="price-unit">¥</view>
                                    <view class="price-val">{{(entity.integerPrice)}}</view>
                                    <view class="dot-val" v-if="entity.decimalPrice">.{{entity.decimalPrice}}</view>
                                    <del class="del-val" v-show="params.showPrice">¥{{entity.originalPrice}}</del>
                                </view>
                                <tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(entity)" v-show="params.showCart"></tui-icon>
                            </view>
                        </view>
                    </view>
				</template>
				<template slot-scope="{ entity, params }" slot="right">
                    <view class="merchandise-item" :class="{ border: params.type==='3',shadow: params.type==='2'}"
                        :style="{ borderRadius: params.borderRadius*2 + 'rpx'}">
                        <image :src=product.defaultImageUrl mode="widthFix" :style="{width: '344rpx', borderRadius: params.type!=='1'? 0 : params.borderRadius*2 + 'rpx'}">
                        <view class="image-tag" v-show="params.showTags">
                            <iamge style="width: 53px; height: 15px" mode="widthFix" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_goods.png">
                        </view>
                        <view class="price-panel">
                            <view class="title"><span>{{entity.title}}</span></view>
                            <view class="label-box" v-show="params.showTags">
                                <img style="width: 24px" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_member.png">
                                <img style="width: 37px" src="https://system.chuangbiying.com/assets/store/listTpl_limit.png">
                            </view>
                            <view class="saled-out" v-show="params.showSales">已售{{numFormat(entity.salesNum)}}件</view>
                            <view class="icon-box">
                                <view class="price">
                                    <view class="price-unit">¥</view>
                                    <view class="price-val">{{(entity.integerPrice)}}</view>
                                    <view class="dot-val" v-if="entity.decimalPrice">.{{entity.decimalPrice}}</view>
                                    <del class="del-val" v-show="params.showPrice">¥{{entity.originalPrice}}</del>
                                </view>
                                <tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(entity)" v-show="params.showCart"></tui-icon>
                            </view>
                        </view>
                    </view>
				</template>
			</tui-waterfall>
        </view>
        <view class="displayBox type4" v-if="item.style.layout==='4'">
            <view class="merchandise-item" v-for="(product,index) in goodsList" :key="index"
                :class="{border: item.style.type==='3',shadow: item.style.type==='2'}"
                :style="{borderRadius: item.style.borderRadius*2 + 'rpx'}">
                <img style="width: 260rpx; height: 260rpx;" :src=product.defaultImageUrl :style="{borderRadius: item.style.type!=='1'? 0 : item.style.borderRadius*2 + 'rpx'}">
                <view class="image-tag" v-show="item.style.showTags">
                    <img style="width: 53px; height: 15px" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_goods.png">
                </view>
                <view class="price-panel type4">
                    <view class="title"><span>{{product.title}}</span></view>
                    <view class="label-box" v-show="item.style.showTags">
                        <img style="width: 24px" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_member.png">
                        <img style="width: 37px" src="https://system.chuangbiying.com/assets/store/listTpl_limit.png">
                    </view>
                    <view class="saled-out" v-show="item.style.showSales">已售{{numFormat(product.salesNum)}}件</view>
                    <view class="icon-box">
                        <view class="price">
                            <view class="price-unit">¥</view>
                            <view class="price-val">{{(product.integerPrice)}}</view>
                            <view class="dot-val" v-if="product.decimalPrice">.{{product.decimalPrice}}</view>
                            <del class="del-val" v-show="item.style.showPrice">¥{{product.originalPrice}}</del>
                        </view>
                        <tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(product)" v-show="item.style.showCart"></tui-icon>
                    </view>
                </view>
            </view>
        </view>
        <view class="displayBox type5" v-if="item.style.layout==='5'">
            <view class="merchandise-item" v-for="(product,index) in goodsList" :key="index"
                :class="{border: item.style.type==='3',shadow: item.style.type==='2'}"
                :style="{borderRadius: item.style.borderRadius + 'px'}">
                <img :src="product.defaultImageUrl" :style="{ width: '130px', height: '130px',borderRadius: item.style.type!=='1'? 0 : item.style.borderRadius + 'px'}">
                <view class="image-tag" v-show="item.style.showTags">
                    <img style="width: 53px; height: 15px" src="https://cdn2.weimob.com/saas/@assets/saas-fe-retail-web-stc/retail/images/store/listTpl_goods.png">
                </view>
                <view class="price-panel">
                    <view class="title"><span>{{product.title}}</span></view>
                    <view class="icon-box">
                        <view class="price">
                            <view class="price-unit">¥</view>
                            <view class="price-val">{{(product.integerPrice)}}</view>
                            <view class="dot-val" v-if="product.decimalPrice">.{{product.decimalPrice}}</view>
                            <del class="del-val" v-show="item.style.showPrice">¥{{product.originalPrice}}</del>
                        </view>
                        <tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(product)" v-show="item.style.showCart"></tui-icon>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: ['item'],
        data(){
            return{
                col: 2,
                goodsList: []
            }
        },
        methods: {
            numFormat(v){
                return v>=10000? parseInt(v/10000) + '万+': v
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-button.is-round{
        padding: 0;
    }
    .el-button--primary{
        width: 85px;
        background-color: #ef1033;
        border-color: #ef1033;;
    }
    .displayBox{
        display: flex;
        text-align: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 10px;
    }
    .merchandise-item{
        width: 100%;
        flex-shrink: 0;
        overflow: hidden;
        position: relative;
        margin-bottom: 10px;
        &.shadow{box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)}
        &.border{border: 1px solid #e0e0e0}
        img{
            width: 100%;
            vertical-align: middle;
            object-fit: cover;
        }
        .image-tag{
            position: absolute;
            top: 0;
            left: 0;
        }
        .price-panel {
            margin: 0 6px;
            position: relative;
            .title {
                text-align: left;
                margin: 6px 0;
                font-size: 14px;
                overflow: hidden;
                word-wrap: break-word;
                white-space:normal;
                word-break:break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .label-box{
                display: flex;
                img{
                    object-fit: contain;
                    height: 14px;
                    margin-right: 5px;
                }
            }
            .icon-box{
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                .price {
                    display: flex;
                    height: 40px;
                    align-items: baseline;
                    color: #ef1033;
                    font-weight: bold;
                    .price-unit, .dot-val{
                        font-size: 12px;
                    }
                    .del-val{
                        font-size: 12px;
                        margin-left: 7px;
                        color: #9e9e9e;
                        font-weight: 400;
                    }
                    .price-val{
                        font-size: 16px;
                    }
                }
                .cart{
                    color: #ef1033;
                    font-size: 18px;
                }
            }
        }
        .saled-out{
            font-size: 12px;
            margin-top: 10px;
            color: #9f9f9f;
            flex: auto;
            text-align: left;
        }
    }
    .type1 {
        .saled-out {
            margin: 0 10px 0 0;
            text-align: right;
        }
    }
    .type2{
        padding: 0 10px;
        // .title{
        //     min-height: 32px;
        // }
    }
    .type4{
        .merchandise-item{
            display: flex;
            .price-panel{
                margin: 0 10px;
                flex: 1;
                .icon-box{
                    position: absolute;
                    bottom: -5px;
                }
            }
            .title{
                -webkit-line-clamp: 1;
            }
        }
    }
    .type5 {
        overflow: hidden;
        flex-wrap: nowrap;
        margin-right: 0;
        .merchandise-item {
            width: 130px;
            margin-right: 10px;
            .price-panel{
                height: 60px;
                .icon-box{
                    position: absolute;
                    bottom: -5px;
                }
                .title{
                    // min-height: 28px;
                    font-size: 12px;
                }
            }
        }
    }
</style>
