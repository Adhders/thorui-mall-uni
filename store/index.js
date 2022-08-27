
import fetch from '../common/httpRequest'

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
// #endif
// #ifdef VUE3
import {createStore} from 'vuex'
const store = createStore({
// #endif
	state: {
		appid: '',
		phone: '', //店铺管理员联系方式
		//用户信息
		userInfo: uni.getStorageSync("userInfo") ? uni.getStorageSync("userInfo") : {
			avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
			phone: '',
			nickName: '',
			gender: 0,
		},
		isLogin: false,
		//登录后跳转的页面路径 + 页面参数
		defaultAddress: '',
		returnUrl: "",
		//当前是否有网络连接
		networkConnected: true,
		isOnline: false,
		targetOrder: null,
		tabBar: {
			iconList: [],
			style: {
				color: "#666666",
				selectedColor: "#EB0909",
				backgroundColor: "#FFFFFF"
			}
		},
		pages: [],
		cart: [], //购物车
		likeList: [],
		reviewLikes: [],
		reviewList: [],
		refundList: [],
		orderList: [],
		//1: "待支付",  2: '待发货', 3 : '待收货' 4: '待评价' 5: '退款'
		orderState: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
		goodsList: [],
		activityGoods: [],
		goodsGroup: [],
		addressList: [],
		currentReview: [],
		searchResult: []
	},
	mutations: {
		setReturnUrl(state, returnUrl) {
			state.returnUrl = returnUrl
		},
		networkChange(state, payload) {
			state.networkConnected = payload.isConnected
		},
		setOnline(state, payload) {
			state.isOnline = state.isOnline
		},
		setShareText(state, shareText){
			state.shareText = shareText
		},
		setAppid(state, appid){
			state.appid = appid
		},
		setPhone(state, phone){
			state.phone = phone
		},
		login(state, isLogin){
		    state.isLogin = isLogin
		},
		setTabBar(state, tabBar){
			state.tabBar = tabBar
		},
		setPages(state, pages){
			state.pages = pages
		},
		setUserInfo(state, userInfo){
			state.userInfo = userInfo
		},
		setAddress(state, addressList){
			state.addressList = addressList
		},
		setCart(state, cart){
			state.cart = cart
		},
		setOrderState(state, orderState){
		    state.orderState = orderState
	    },
		setGoodsList(state, goodsList){
			state.goodsList = goodsList
		},
		setActivityGoods(state, activityGoods){
			state.activityGoods = activityGoods
		},
		setGoodsGroup(state, goodsGroup){
            state.goodsGroup = goodsGroup  
		},
		setReviewList(state, reviewList){
			state.reviewList = reviewList
		},
		setLikeList(state, likeList){
			state.likeList = likeList
		},
		setReviewLikes(state, reviewLikes){
			state.reviewLikes = reviewLikes
		},
		setRefundList(state, refundList){
			state.refundList = refundList
		},
		setOrderList(state, orderList){
			state.orderList = orderList
		},
		setSearchResult(state, searchResult){
            state.searchResult = searchResult
		},
		updateCurrentReview(state, review){
			state.currentReview = review
		}
	},
	actions: {
		getOnlineStatus: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				// #ifndef MP-WEIXIN
				resolve(true)
				// #endif
				// #ifdef MP-WEIXIN
				if (state.isOnline) {
					resolve(state.isOnline)
				} else {
					fetch.request("/Home/GetStatus", "GET", {}, false, true, true).then((res) => {
						if (res.code == 100 && res.data == 1) {
							commit('setOnline', {
								isOnline: true
							})
							resolve(true)
						} else {
							commit('setOnline', {
								isOnline: false
							})
							resolve(false)
						}
					}).catch((res) => {
						reject(false)
					})
				}
				// #endif
			})
		}
	}
})

export default store
