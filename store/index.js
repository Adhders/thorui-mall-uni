
import fetch from '../common/httpRequest'

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
// #endif
// #ifdef VUE3
import {
	createStore
} from 'vuex'
const store = createStore({
// #endif
	state: {
		appid: "wx09760711e33ab5bb",
		secret: "53dc8454d875811c698b8d42bfac644e",
		//是否登录 项目中改为真实登录信息判断，如token
		isLogin: false,
		//用户信息
		userInfo: {
			avatarUrl: 'https://system.chuangbiying.com/static/images/my/mine_def_touxiang_3x.png',
			phone: '',
			nickName: '',
			gender: 0,
		},
		//登录后跳转的页面路径 + 页面参数
		returnUrl: "",
		//app版本
		version: "1.6.0",
		//当前是否有网络连接
		networkConnected: true,
		isOnline: false,
		width : 750,
		openid: '',
		targetOrder: null,
		likeList: [],
		reviewList: [],
		orderList: [],
		addressList: [],
		currentReview: []
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
		setWidth(state, width){
		    state.width = width
		},
		setOpenid(state, openid){
			state.openid = openid
		},
		setAppid(state, appid){
			state.appid = appid
		},
		login(state, isLogin){
		    state.isLogin = isLogin
		},
		setUserInfo(state, userInfo){
			state.userInfo = userInfo
		},
		setAddress(state, addressList){
			state.addressList = addressList
		},
		setTargetOrder(state, order){
			state.targetOrder = order
	    },
		setReviewList(state, reviewList){
			state.reviewList = reviewList
		},
		setOrderList(state, orderList){
			state.orderList = orderList
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
