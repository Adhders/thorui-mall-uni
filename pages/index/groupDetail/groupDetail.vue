<template>
	<view class="container">
		<!--header-->
		<view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }">
			<view class="tui-header" :style="{ paddingTop: top + 'px', opacity: opcity }">商品详情</view>
			<view class="tui-header-icon" :style="{ marginTop: top + 'px' }">
				<view class="tui-icon-box" :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }" @tap="back">
					<tui-icon name="arrowleft" :size="30" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
				</view>

				<view class="tui-icon-box tui-icon-ml" :style="{backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')'}" @tap.stop="openMenu">
					<tui-icon name="more-fill" :size="20" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
					<tui-badge type="red" :scaleRatio="0.8" absolute top="0" right="-4rpx">5</tui-badge>
				</view>

			</view>
		</view>
		<!--header-->

		<!--banner-->
		<view class="tui-banner-swiper">
			<swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" :style="{ height: scrollH + 'px' }"
			 @change="bannerChange">

				<block v-for="(item, index) in banner" :key="index">
					<swiper-item :data-index="index" @tap.stop="previewImage">
						<image :src="item" class="tui-slide-image" :style="{ height: scrollH + 'px' }" />
					</swiper-item>
				</block>
			</swiper>
			<view class="tui-video__box" @tap.stop="play">
				<image src="https://www.thorui.cn/images/mall/img_video_3x.png" mode="widthFix"></image>
				<view>00′30″</view>
			</view>
			<view class="tui-banner-tag">
				<tui-tag padding="12rpx 18rpx" type="translucent" shape="circleLeft" :scaleMultiple="0.82" originRight>{{ bannerIndex + 1 }}/{{ banner.length }}</tui-tag>
			</view>
		</view>

		<!--banner-->

		<view class="tui-pro-detail">
			<view class="tui-product-title tui-border-radius">
				<view class="tui-price__box">
					<view class="tui-pro-pricebox tui-padding">
						<view class="tui-pro-price">
							<view>
								<text>￥</text>
								<text class="tui-price">49</text>
								<text>.00</text>
							</view>
							<view class="tui-original-price tui-white__gray">￥199.00</view>
						</view>
						<view class="tui-sold tui-white__gray">
							<view class="tui-price-tag">2人团</view>
							<text>已拼1000件</text>
						</view>
					</view>
					<view class="tui-right__box">库存充足</view>
				</view>
				<view class="tui-pro-titbox">
					<view class="tui-pro-title">谈判官明星同款耳坠韩国气质简约显脸瘦的耳环女百搭个性长款耳钉 个性水滴耳环【A2】</view>
					<view  class="tui-share-position" @tap="showSharePopup">
						<tui-tag type="gray" shape="circleLeft" padding="12rpx 16rpx">
							<view class="tui-share-box">
								<tui-icon name="partake" color="#999" :size="15"></tui-icon>
								<text class="tui-share-text tui-gray tui-size">分享</text>
							</view>
						</tui-tag>
					</view>
				</view>
				<view class="tui-padding">
					<view class="tui-sub-title tui-size tui-gray">此商品将于2019-06-28,10点结束闪购特卖，时尚美饰联合专场</view>
					<view class="tui-guarantee__box">
						<view class="tui-gt-item">
							<image :src="webURL + 'img_trueguarantee_3x.png'" class="tui-gt-img" mode="widthFix"></image>
							<text>正品保证</text>
						</view>
						<view class="tui-gt-item">
							<image :src="webURL + 'img_falseto10_3x.png'" class="tui-gt-img" mode="widthFix"></image>
							<text>假一赔十</text>
						</view>
						<view class="tui-gt-item">
							<image :src="webURL + 'img_postage.png'" class="tui-gt-img" mode="widthFix"></image>
							<text>满99包邮</text>
						</view>
					</view>
				</view>
			</view>
			<!--正在拼团中-->
			<view class="tui-radius-all tui-mtop">
				<tui-list-cell padding="30rpx" arrow @click="moreGroup">
					<view class="tui-group-text tui-between">
						<view class="tui-group-title">6人正在拼团，可直接参与</view>
						<view class="tui-sub__title">查看全部</view>
					</view>
				</tui-list-cell>

				<!-- :style="{ height: list.length === 1 ? '156rpx' : '312rpx' }" -->
				<!-- :display-multiple-items="list.length === 1 ? 1 : 2" -->
				<swiper :indicator-dots="false" :autoplay="true" :interval="5000" :duration="500" :circular="true"
				 :display-multiple-items="2" :vertical="true" class="tui-group-swiper" style="height: 312rpx;">
					<block v-for="(item, index) in 6" :key="index">
						<swiper-item>
							<view class="tui-group-user">
								<view class="tui-user-left">
									<image :src="webURL+ (index%2==0?'mine_avatar_3x.jpg':'img_not_tuxedo.png')" :lazy-load="true"></image>
									<view class="tui-user-anme">{{index%2===0?'echo.':'不许人间见白头'}}</view>
								</view>
								<view class="tui-user-right">
									<view class="tui-user-countdown">
										<view class="tui-group-num">
											还差<text class="tui-color-red">1</text>人拼成
										</view>
										<view class="tui-group-countdown">
											<view class="tui-countdown-right">剩余</view>
											<tui-countdown :time="3800" scale colonColor="#EB0909" borderColor="#EB0909" color="#EB0909"></tui-countdown>
											<view class="tui-countdown-left">结束</view>
										</view>
									</view>
									<tui-button width="128rpx" height="54rpx" :size="26" shadow type="danger" shape="circle" @click="showPopup">
										去参团
									</tui-button>
								</view>
							</view>
						</swiper-item>
					</block>
				</swiper>

			</view>

			<!--拼团规则玩法介绍-->
			<view class="tui-group-rule tui-mtop tui-radius-all">
				<tui-list-cell padding="30rpx" arrow @click="showModal">
					<view class="tui-group-text tui-between">
						<view class="tui-group-title">拼团规则</view>
						<view class="tui-sub__title">拼团玩法介绍</view>
					</view>
				</tui-list-cell>
				<view class="tui-step__box">
					<view class="tui-step-item">
						<image :src="webURL+'img_opengroup_3x.png'"></image>
						<view class="tui-step-text">团长开团</view>
					</view>
					<view class="tui-step-arrow">
						<image :src="webURL+'img_arrow_3x.png'"></image>
					</view>
					<view class="tui-step-item">
						<image :src="webURL+'img_invitefriends_3x.png'"></image>
						<view class="tui-step-text">邀请好友</view>
					</view>
					<view class="tui-step-arrow">
						<image :src="webURL+'img_arrow_3x.png'"></image>
					</view>
					<view class="tui-step-item">
						<image :src="webURL+'img_spellgroupsuccess_3x.png'"></image>
						<view class="tui-step-text">拼团成功</view>
					</view>
					<view class="tui-step-arrow">
						<image :src="webURL+'img_arrow_3x.png'"></image>
					</view>
					<view class="tui-step-item">
						<image :src="webURL+'img_tosend_3x.png'"></image>
						<view class="tui-step-text">等待发货</view>
					</view>
				</view>
			</view>

			<view class="tui-discount-box tui-radius-all tui-mtop">
				<view class="tui-list__cell" @tap="coupon">
					<view class="tui-bold tui-cell-title">领券</view>
					<view class="tui-flex-center">
						<tui-tag type="red" shape="circle" padding="12rpx 24rpx" size="24rpx">满99减8</tui-tag>
						<tui-tag margin="0 0 0 20rpx" type="red" padding="12rpx 24rpx" size="24rpx" shape="circle">满59减5</tui-tag>
					</view>
					<view class="tui-ml-auto">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>

				<view class="tui-list__cell tui-last" @tap="showPopup">
					<view class="tui-bold tui-cell-title">促销</view>
					<view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>多买优惠</tui-tag>
							<text>满1件，立减最低1件商品价格，包邮（限中国内地）</text>
						</view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>满额返券</tui-tag>
							<text>满2件，立减最低2件商品价格，包邮（限中国内地）</text>
						</view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>特别赠品</tui-tag>
							<text>满3件，立减最低3件商品价格，包邮（限中国内地）</text>
						</view>
					</view>
					<view class="tui-right">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>
			</view>

			<view class="tui-basic-info tui-mtop tui-radius-all">
				<view class="tui-list__cell" @tap="showPopup">
					<view class="tui-bold tui-cell-title">已选</view>
					<view class="tui-selected-box">个性水滴耳环【A2】,1个，可选服务</view>
					<view class="tui-ml-auto">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>
				<view class="tui-list__cell" @tap="showPopup">
					<view class="tui-bold tui-cell-title">送至</view>
					<view class="tui-addr-box">
						<view class="tui-addr-item">北京朝阳区三环到四环之间</view>
						<view class="tui-addr-item">今日23:59前完成下单，预计6月28日23:30前发货，7月1日24:00前送达</view>
					</view>
					<view class="tui-right">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>
				<view class="tui-list__cell tui-last">
					<view class="tui-bold tui-cell-title">运费</view>
					<view class="tui-selected-box">在线支付免运费</view>
				</view>
				<view class="tui-guarantee">
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">可配送海外</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">店铺发货&售后</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">7天无理由退货</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">闪电退款</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">极速审核</text>
					</view>
				</view>
			</view>

			<view class="tui-cmt-box tui-mtop tui-radius-all">
				<view class="tui-list__cell tui-last tui-between">
					<view class="tui-bold tui-cell-title">评价</view>
					<view class="tui-flex-center" @tap="evaluate">
						<text class="tui-cmt-all">查看全部</text>
						<tui-icon name="more-fill" :size="20" color="#ff201f"></tui-icon>
					</view>
				</view>

				<view class="tui-cmt-content tui-padding">
					<view class="tui-cmt-user">
						<image src="https://system.chuangbiying.com/static/images/news/avatar_2.jpg" class="tui-acatar"></image>
						<view>z***9</view>
					</view>
					<view class="tui-cmt">物流很快，很适合我的风格❤</view>
					<view class="tui-attr">颜色：叠层钛钢流苏耳环（A74）</view>
				</view>

				<view class="tui-cmt-btn">
					<tui-button width="240rpx" height="64rpx" :size="24" type="black" plain shape="circle" @click="evaluate">查看全部评价</tui-button>
				</view>
			</view>

			<view class="tui-nomore-box">
				<tui-nomore text="宝贝详情" backgroundColor="#f7f7f7"></tui-nomore>
			</view>
			<view class="tui-product-img tui-radius-all">
				<image :src="'https://www.thorui.cn/img/detail/' + (index + 1) + '.jpg'" v-for="(img, index) in 20" :key="index"
				 mode="widthFix"></image>
			</view>
			<tui-nomore text="已经到最底了" backgroundColor="#f7f7f7"></tui-nomore>
			<view class="tui-safearea-bottom"></view>
		</view>

		<!--底部操作栏-->
		<view class="tui-operation">
			<view class="tui-operation-left tui-col-5">
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150">
					<tui-icon name="kefu" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">客服</view>
				</view>
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="shop">
					<tui-icon name="shop" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">店铺</view>
				</view>
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150">
					<tui-icon name="like" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">收藏</view>
				</view>
			</view>
			<view class="tui-operation-right tui-right-flex tui-col-7 tui-btnbox-4">
				<view class="tui-flex-1">
					<tui-button height="100rpx" :size="26" type="warning" shape="rightAngle" @click="showPopup">
						<view class="tui-btn__box">
							<view>单独购买</view>
							<view class="tui-flex-end">
								<view class="tui-size-26">￥</view>
								<view class="tui-size-36">199</view>
								<view class="tui-size-26">.00</view>
							</view>
						</view>
					</tui-button>
				</view>
				<view class="tui-flex-1">
					<tui-button height="100rpx" :size="26" type="danger" shape="rightAngle" @click="showPopup">
						<view class="tui-btn__box">
							<view>发起拼团</view>
							<view class="tui-flex-end">
								<view class="tui-size-28">￥</view>
								<view class="tui-price-large tui-size-36">49</view>
								<view class="tui-size-28">.00</view>
							</view>
						</view>
					</tui-button>
				</view>
			</view>
		</view>

		<!--底部操作栏-->

		<!--顶部下拉菜单-->
		<tui-top-dropdown backgroundColor="rgba(76, 76, 76, 0.95)" :show="menuShow" :height="0" @close="closeMenu">
			<view class="tui-menu-box tui-padding tui-ptop">
				<view class="tui-menu-header" :style="{ paddingTop: top + 'px' }">功能直达</view>
				<view class="tui-menu-itembox">
					<block v-for="(item, index) in topMenu" :key="index">
						<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="btnTopMenu(index)">
							<view class="tui-badge-box">
								<tui-icon :name="item.icon" color="#fff" :size="item.size"></tui-icon>
								<tui-badge type="red" :scaleRatio="0.8" absolute right="-8rpx" v-if="item.badge">{{ item.badge }}</tui-badge>
							</view>
							<view class="tui-menu-text">{{ item.text }}</view>
						</view>
					</block>
				</view>
				<view class="tui-icon-up_box">
					<tui-icon name="up" color="#fff" :size="26" @click="closeMenu"></tui-icon>
				</view>
			</view>
		</tui-top-dropdown>
		<!---顶部下拉菜单-->

		<!--底部选择层-->
		<tui-bottom-popup :show="popupShow" @close="hidePopup">
			<view class="tui-popup-box">
				<view class="tui-product-box tui-padding">
					<image src="https://www.thorui.cn/img/product/11.jpg" class="tui-popup-img"></image>
					<view class="tui-popup-price">
						<view class="tui-amount tui-bold">￥49.00</view>
						<view class="tui-number">编号:4373299399393</view>
					</view>
				</view>
				<scroll-view scroll-y class="tui-popup-scroll">
					<view class="tui-scrollview-box">
						<view class="tui-bold tui-attr-title">颜色</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item">五角星钻耳线</view>
							<view class="tui-attr-item">米子珍珠耳线</view>
							<view class="tui-attr-item">花朵镶钻耳线</view>
							<view class="tui-attr-item">扇子珍珠流苏耳线</view>
							<view class="tui-attr-item tui-attr-active">扇子珍珠流苏耳线耳线</view>
						</view>

						<view class="tui-number-box tui-bold tui-attr-title">
							<view class="tui-attr-title">数量</view>
							<tui-numberbox :max="99" :min="1" :value="value" @change="change"></tui-numberbox>
						</view>
						<view class="tui-bold tui-attr-title">尺寸</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item">5cm</view>
							<view class="tui-attr-item">8cm</view>
							<view class="tui-attr-item">12cm</view>
							<view class="tui-attr-item">16cm</view>
							<view class="tui-attr-item tui-attr-active">18cm</view>
						</view>

						<view class="tui-bold tui-attr-title">保障服务</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item">半年掉钻保 ￥4.0</view>
						</view>

						<view class="tui-bold tui-attr-title">只换不修</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item">三月意外换￥2.0</view>
							<view class="tui-attr-item">半年意外换￥2.0</view>
						</view>
					</view>
				</scroll-view>
				<view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn">
					<view class="tui-flex-1">
						<tui-button height="100rpx" :size="26" type="warning" shape="rightAngle" @click="submit">
							<view class="tui-btn__box">
								<view>单独购买</view>
								<view class="tui-flex-end">
									<view class="tui-size-26">￥</view>
									<view class="tui-size-36">199</view>
									<view class="tui-size-26">.00</view>
								</view>
							</view>
						</tui-button>
					</view>
					<view class="tui-flex-1">
						<tui-button height="100rpx" :size="26" type="danger" shape="rightAngle" @click="submit">
							<view class="tui-btn__box">
								<view>发起拼团</view>
								<view class="tui-flex-end">
									<view class="tui-size-28">￥</view>
									<view class="tui-price-large tui-size-36">49</view>
									<view class="tui-size-28">.00</view>
								</view>
							</view>
						</tui-button>
					</view>
				</view>
				<view class="tui-right">
					<tui-icon name="close-fill" color="#999" :size="20" @click="hidePopup"></tui-icon>
				</view>
			</view>
		</tui-bottom-popup>
		<!--底部选择层-->
		<!--拼团玩法介绍-->
		<tui-modal :show="modal" shape="circle" padding="30rpx 40rpx" custom>
			<view class="tui-modal__title">拼团玩法</view>
			<view class="tui-modal__p">1.全民拼团，所有用户都可直接参团或开团；</view>
			<view class="tui-modal__p">2.拼团成功，指开团在规定时间内达到规定成团人数；</view>
			<view class="tui-modal__p">3.拼团失败，指开团后在规定时间内未能找到相应的人数的好友参团，该团失败，系统取消该团订单，退款原路退回。</view>
			<view class="tui-modal__btn">
				<tui-button type="danger" shape="circle" width="280rpx" height="68rpx" :size="26" @click="modal = false">我知道了</tui-button>
			</view>
		</tui-modal>

		<!--底部分享弹层-->
		<tui-bottom-popup :show="sharePopup" @close="hideSharePopup">
			<view class="tui-share__box">
				<view class="tui-share__header">
					<text>分享</text>
					<view class="tui-close__box" @tap="hideSharePopup">
						<tui-icon name="shut" :size="20" color="#C9C9C9"></tui-icon>
					</view>
				</view>
				<view class="tui-share__list">
					<button open-type="share" class="tui-share-btn" @tap="onShare">
						<view class="tui-share__item">
							<image src="https://system.chuangbiying.com/static/images/mall/icon_popup_share.png"></image>
							<view class="tui-share__text">分享给好友</view>
						</view>
					</button>
					<view class="tui-share__item" @tap="createPoster">
						<image src="https://system.chuangbiying.com/static/images/mall/icon_popup_poster.png"></image>
						<view class="tui-share__text">生成分享海报</view>
					</view>
				</view>
			</view>
		</tui-bottom-popup>
		<!--底部分享弹层-->
		<canvas :style="{ width: winWidth + 'px', height: winHeight + 'px' }" canvas-id="posterId" id="posterId" class="tui-poster__canvas"></canvas>
		<tui-modal custom :show="modalShow" backgroundColor="transparent" padding="0" @cancel="hideShareModal">
			<view class="tui-poster__box" :style="{marginTop:height+'px'}">
				<image src="https://system.chuangbiying.com/static/images/mall/icon_popup_closed.png" class="tui-close__img" @tap.stop="hideShareModal"></image>
				<image :src="posterImg" v-if="posterImg" class="tui-poster__img"></image>
				<tui-button type="danger" width="460rpx" height="80rpx" shape="circle" @click="savePic">保存图片</tui-button>
				<view class="tui-share__tips">保存图片到手机相册后，将图片分享到您的圈子</view>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import thorui from '@/components/common/tui-clipboard/tui-clipboard.js'
	import poster from '@/components/common/tui-poster/tui-poster.js'
	export default {
		data() {
			return {
				webURL: 'https://thorui.cn/images/mall/group/',
				height: 64, //header高度
				top: 26, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				iconOpcity: 0.5,
				banner: [
					'https://www.thorui.cn/img/product/11.jpg',
					'https://www.thorui.cn/img/product/2.png',
					'https://www.thorui.cn/img/product/33.jpg',
					'https://www.thorui.cn/img/product/4.png',
					'https://www.thorui.cn/img/product/55.jpg',
					'https://www.thorui.cn/img/product/6.png',
					'https://www.thorui.cn/img/product/7.jpg',
					'https://www.thorui.cn/img/product/8.jpg'
				],
				bannerIndex: 0,
				topMenu: [{
						icon: 'message',
						text: '消息',
						size: 26,
						badge: 3
					},
					{
						icon: 'home',
						text: '首页',
						size: 23,
						badge: 0
					},
					{
						icon: 'people',
						text: '我的',
						size: 26,
						badge: 0
					},
					{
						icon: 'cart',
						text: '购物车',
						size: 23,
						badge: 2
					},
					{
						icon: 'kefu',
						text: '客服小蜜',
						size: 26,
						badge: 0
					},
					{
						icon: 'feedback',
						text: '我要反馈',
						size: 23,
						badge: 0
					},
					{
						icon: 'share',
						text: '分享',
						size: 26,
						badge: 0
					}
				],
				menuShow: false,
				popupShow: false,
				value: 1,
				modal: false,
				sharePopup: false,
				posterImg: '',
				winWidth: uni.upx2px(560 * 2),
				winHeight: uni.upx2px(890 * 2),
				modalShow: false
			};
		},
		onLoad: function(options) {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif

			setTimeout(() => {
				uni.getSystemInfo({
					success: res => {
						this.width = obj.left || res.windowWidth;
						this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
						this.top = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
						this.scrollH = res.windowWidth;
					}
				});
			}, 0);
		},
		methods: {
			bannerChange: function(e) {
				this.bannerIndex = e.detail.current;
			},
			previewImage: function(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.banner[index],
					urls: this.banner
				});
			},
			back: function() {
				uni.navigateBack();
			},
			openMenu: function() {
				this.menuShow = true;
			},
			closeMenu: function() {
				this.menuShow = false;
			},
			showPopup: function() {
				this.popupShow = true;
			},
			hidePopup: function() {
				this.popupShow = false;
			},
			change: function(e) {
				this.value = e.value;
			},
			evaluate() {
				this.tui.href('/pages/index/goodsEvaluate/goodsEvaluate')
			},
			common: function() {
				this.tui.toast('功能开发中~');
			},
			btnTopMenu(index) {
				this.closeMenu()
				if (index == 4) {
					uni.makePhoneCall({
						phoneNumber: "10086"
					})
				} else if (index == 6) {
					this.showSharePopup()
				} else {
					let url = {
						0: '/pages/my/message/message',
						1: "/pages/tabbar/index/index",
						2: '/pages/tabbar/my/my',
						3: '/pages/tabbar/cart/cart',
						5: '/pages/my/feedback/feedback?page=mall'
					} [index];
					if (index == 0 || index == 5) {
						url && this.tui.href(url)
					} else {
						uni.switchTab({
							url: url
						})
					}
				}
			},
			submit() {
				this.popupShow = false;
				uni.navigateTo({
					url: '/pages/order/submitOrder/submitOrder'
				});
			},
			btnRemind() {
				this.remind = this.remind == 1 ? 2 : 1
			},
			coupon() {
				uni.navigateTo({
					url: '/pages/index/coupon/coupon'
				});
			},
			onShare() {
				this.hideSharePopup()
				//#ifdef APP-PLUS
				plus.share.sendWithSystem({
						content: 'ThorUI商城模板',
						href: 'https://www.thorui.cn/'
					},
					function() {
						console.log('分享成功');
					},
					function(e) {
						console.log('分享失败：' + JSON.stringify(e));
					}
				);
				//#endif
				// #ifdef H5
				thorui.getClipboardData('https://thorui.cn/doc', res => {
					if (res) {
						this.tui.toast('链接复制成功，赶快去分享吧~');
					} else {
						this.tui.toast('链接复制失败');
					}
				});
				// #endif
			},
			shop() {
				this.tui.href('/pages/index/shop/shop')
			},
			play() {
				uni.navigateTo({
					url: '/pages/index/video/video',
					animationType: 'zoom-out'
				})
			},
			showModal() {
				this.modal = true
			},
			moreGroup() {
				this.tui.href('/pages/index/groupMore/groupMore')
			},
			showSharePopup(){
				this.sharePopup = true
			},
			hideSharePopup() {
				this.sharePopup = false
			},
			async createPoster() {
				this.hideSharePopup()
				if (this.posterImg) {
					this.modalShow = true;
					return;
				}
				uni.showLoading({
					mask: true,
					title: '图片生成中...'
				});
				let mainPic = await poster.getImage('https://www.thorui.cn/img/product/poster.jpg');
				let qrcode = await poster.getImage('https://thorui.cn/extend/share/applets.png');
				// #ifdef MP-WEIXIN
				await poster.removeSavedFile();
				// #endif
				if (mainPic && qrcode) {
					const imgs = {
						mainPic: mainPic,
						qrcode: qrcode
					};
					let text = '谈判官明星同款耳坠韩国气质简约显脸瘦的耳环女百搭个性长款耳钉 个性水滴耳环【A2】';
					poster.drawGoodsPoster('posterId', this.winWidth, this.winHeight, imgs, text, '49.00', '199.00', 'ThorUI示例小程序',
						res => {
							uni.hideLoading();
							if (res) {
								this.posterImg = res;
								setTimeout(() => {
									this.modalShow = true;
								}, 60);
							} else {
								this.tui.toast('生成海报失败,请稍后再试');
							}
						});
				} else {
					uni.hideLoading();
					this.tui.toast('生成海报图片下载失败,请稍后再试');
				}
			},
			hideShareModal() {
				this.modalShow = false;
			},
			savePic() {
				if (this.posterImg) {
					// #ifdef H5
					uni.previewImage({
						urls: [this.posterImg]
					});
					// #endif

					// #ifndef H5
					poster.saveImage(this.posterImg);
					// #endif

					this.hideShareModal();
				}
			}
		},
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
		}
	};
</script>

<style>
	page {
		background-color: #f7f7f7;
	}

	.container {
		padding-bottom: 110rpx;
	}

	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 995;
	}

	.tui-header {
		width: 100%;
		font-size: 18px;
		line-height: 18px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-header-icon {
		position: fixed;
		top: 0;
		left: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 9999;
	}

	.tui-header-icon .tui-badge {
		background: #e41f19 !important;
		position: absolute;
		right: -4px;
	}

	.tui-icon-ml {
		margin-left: 20rpx;
	}

	.tui-icon-box {
		position: relative;
		height: 20px !important;
		width: 20px !important;
		padding: 6px !important;

		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-banner-swiper {
		position: relative;
	}

	.tui-video__box {
		width: 166rpx;
		height: 60rpx;
		position: absolute;
		left: 50%;
		bottom: 50rpx;
		transform: translateX(-50%);
		z-index: 2;
	}

	.tui-video__box image {
		width: 166rpx;
		height: 60rpx;
	}

	.tui-video__box view {
		width: 100%;
		height: 100%;
		font-size: 24rpx;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		padding-left: 66rpx;
		box-sizing: border-box;
	}

	.tui-banner-tag {
		position: absolute;
		color: #fff;
		bottom: 30rpx;
		right: 0;
	}

	.tui-slide-image {
		width: 100%;
		display: block;
	}

	/*顶部菜单*/

	.tui-menu-box {
		box-sizing: border-box;
	}

	.tui-menu-header {
		font-size: 34rpx;
		color: #fff;
		height: 32px;
		display: flex;
		align-items: center;
	}

	.tui-menu-itembox {
		color: #fff;
		padding: 40rpx 10rpx 0 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		font-size: 26rpx;
	}

	.tui-menu-item {
		width: 22%;
		height: 160rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		margin-right: 4%;
		margin-bottom: 4%;
	}

	.tui-menu-item:nth-of-type(4n) {
		margin-right: 0;
	}

	.tui-badge-box {
		position: relative;
	}

	.tui-badge-box .tui-badge-class {
		position: absolute;
		top: -8px;
		right: -8px;
	}

	.tui-msg-badge {
		top: -10px;
	}

	.tui-icon-up_box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-menu-text {
		padding-top: 12rpx;
	}

	.tui-opcity .tui-menu-text,
	.tui-opcity .tui-badge-box {
		opacity: 0.5;
		transition: opacity 0.2s ease-in-out;
	}

	/*顶部菜单*/

	/*内容 部分*/

	.tui-padding {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-ml-auto {
		margin-left: auto;
	}

	/* #ifdef H5 */
	.tui-ptop {
		padding-top: 44px;
	}

	/* #endif */

	.tui-size {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-gray {
		color: #999;
	}

	.tui-white__gray {
		color: rgba(255, 255, 255, .8);
		font-weight: normal;
		font-size: 26rpx;
	}

	.tui-color-red {
		color: #EB0909;
	}

	.tui-border-radius {
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
	}

	.tui-radius-all {
		border-radius: 24rpx;
		overflow: hidden;
	}

	.tui-mtop {
		margin-top: 26rpx;
	}

	.tui-pro-detail {
		box-sizing: border-box;
		color: #333;
	}

	.tui-product-title {
		background: #fff;
		padding-bottom: 30rpx;
	}

	.tui-price__box {
		width: 100%;
		height: 130rpx;
		display: flex;
	}

	.tui-pro-pricebox {
		width: 540rpx;
		height: 130rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #FFFFFF;
		font-size: 26rpx;
		line-height: 26rpx;
		background: linear-gradient(-30deg, #FF1F2E, #F52C6C);
		flex-shrink: 0;
	}

	.tui-pro-price {
		display: flex;
		align-items: flex-end;
	}

	.tui-price {
		font-size: 44rpx;
		line-height: 42rpx;
	}

	.tui-sold {
		width: 100%;
		height: 44rpx;
		padding-left: 4rpx;
		display: flex;
		align-items: center;
		padding-top: 10rpx;
	}

	.tui-price-tag {
		height: 38rpx;
		border: 1rpx solid #fff;
		border-radius: 6rpx;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		line-height: 24rpx;
		transform: scale(0.8);
		transform-origin: 0 center;
		border-radius: 6rpx;
		padding: 0 8rpx;
	}

	.tui-original-price {
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		text-decoration: line-through;
	}

	.tui-right__box {
		flex: 1;
		background-color: #FFE5E5;
		font-size: 28rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #EB0909;
	}

	.tui-pro-titbox {
		font-size: 32rpx;
		font-weight: 500;
		position: relative;
		padding: 0 150rpx 0 30rpx;
		box-sizing: border-box;
	}

	.tui-pro-title {
		padding-top: 20rpx;
	}

	.tui-share-btn {
		flex: 1;
		display: block;
		background: transparent;
		margin: 0;
		padding: 0;
		border-radius: 0;
		border: 0;
		line-height:1;
	}

	.tui-share-btn::after {
		border: 0;
	}

	.tui-share-box {
		display: flex;
		align-items: center;
	}

	.tui-share-position {
		position: absolute;
		right: 0;
		top: 30rpx;
	}

	.tui-share-text {
		padding-left: 8rpx;
	}

	.tui-sub-title {
		padding: 20rpx 0;
		line-height: 32rpx;
	}

	.tui-guarantee__box {
		display: flex;
		padding: 12rpx 88rpx 0;
		box-sizing: border-box;
		justify-content: space-between;
		align-items: center;
		background: #fff;
	}

	.tui-gt-item {
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}

	.tui-gt-item text {
		transform: scale(0.8);
		transform-origin: center center;
	}

	.tui-gt-img {
		width: 24rpx;
		height: 26rpx;
		flex-shrink: 0;
	}

	.tui-group-text {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-group-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: bold;
		padding-left: 16rpx;
		border-left: 2px solid #eb0909;
		box-sizing: border-box;
	}

	.tui-sub__title {
		font-size: 26rpx;
		padding-right: 30rpx;
	}

	.tui-step__box {
		width: 100%;
		height: 210rpx;
		background: #fff;
		padding: 0 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.tui-step-item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 26rpx;
		color: #666666;
	}

	.tui-step-item image {
		width: 64rpx;
		height: 55rpx;
		flex-shrink: 0;
	}

	.tui-step-item image:first-child {
		width: 60rpx !important;
	}

	.tui-step-arrow {
		height: 90rpx;
	}

	.tui-step-arrow image {
		width: 11rpx;
		height: 20rpx;
		flex-shrink: 0;
	}

	.tui-step-text {
		line-height: 26rpx;
		padding-top: 24rpx;
	}

	.tui-discount-box {
		background: #fff;
	}

	.tui-list__cell {
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 36rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-right {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}

	.tui-top40 {
		top: 40rpx !important;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-list__cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 126rpx;
	}

	.tui-last::after {
		border-bottom: 0 !important;
	}

	.tui-flex-center {
		display: flex;
		align-items: center;
	}


	.tui-cell-title {
		width: 66rpx;
		padding-right: 30rpx;
		flex-shrink: 0;
	}

	.tui-promotion-box {
		display: flex;
		align-items: center;
		padding: 10rpx 0;
		width: 80%;
	}

	.tui-promotion-box text {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-basic-info {
		background: #fff;
	}

	.tui-addr-box {
		width: 76%;
	}

	.tui-addr-item {
		padding: 10rpx;
		line-height: 34rpx;
	}

	.tui-guarantee {
		background: #fdfdfd;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 30rpx 30rpx 30rpx;
		font-size: 24rpx;
	}

	.tui-guarantee-item {
		color: #999;
		padding-right: 30rpx;
		padding-top: 10rpx;
	}

	.tui-pl {
		padding-left: 4rpx;
	}

	.tui-cmt-box {
		background: #fff;
	}

	.tui-between {
		justify-content: space-between !important;
	}

	.tui-cmt-all {
		color: #ff201f;
		padding-right: 8rpx;
	}

	.tui-cmt-content {
		font-size: 26rpx;
	}

	.tui-cmt-user {
		display: flex;
		align-items: center;
	}

	.tui-acatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		display: block;
		margin-right: 16rpx;
	}

	.tui-cmt {
		padding: 14rpx 0;
	}

	.tui-attr {
		font-size: 24rpx;
		color: #999;
		padding: 6rpx 0;
	}

	.tui-cmt-btn {
		padding: 50rpx 0 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-nomore-box {
		padding-top: 10rpx;
	}

	.tui-product-img {
		display: flex;
		flex-direction: column;
		transform: translateZ(0);
	}

	.tui-product-img image {
		width: 100%;
		display: block;
	}

	/*底部操作栏*/

	.tui-col-7 {
		width: 58.33333333%;
	}

	.tui-col-5 {
		width: 41.66666667%;
	}

	.tui-operation {
		width: 100%;
		height: 100rpx;
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 0;
		left: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
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

	.tui-operation-left {
		display: flex;
		align-items: center;
	}

	.tui-operation-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
	}

	.tui-operation-text {
		font-size: 22rpx;
		color: #333;
	}

	.tui-opacity {
		opacity: 0.5;
	}

	.tui-scale-small {
		transform: scale(0.9);
		transform-origin: center center;
	}

	.tui-operation-right {
		height: 100rpx;
		padding-top: 0;

	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-flex-1 {
		flex: 1;
	}

	.tui-img__clock {
		width: 30rpx;
		height: 30rpx;
		margin-right: 8rpx;
	}

	/*底部操作栏*/

	/*底部选择弹层*/

	.tui-popup-class {
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-popup-box {
		position: relative;
		padding: 30rpx 0 100rpx 0;
	}

	.tui-popup-btn {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	/* .tui-popup-btn .tui-btn-class {
		width: 90% !important;
		display: block !important;
		font-size: 28rpx !important;
	} */

	/* .tui-icon-close {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	} */

	.tui-product-box {
		display: flex;
		align-items: flex-end;
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
		padding-left: 20rpx;
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

	.tui-popup-scroll {
		height: 600rpx;
		font-size: 26rpx;
	}

	.tui-scrollview-box {
		padding: 0 30rpx 60rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-attr-title {
		padding: 10rpx 0;
		color: #333;
	}

	.tui-attr-box {
		font-size: 0;
		padding: 20rpx 0;
	}

	.tui-attr-item {
		max-width: 100%;
		min-width: 200rpx;
		height: 64rpx;
		display: -webkit-inline-flex;
		display: inline-flex;
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
		background: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-attr-active::after {
		content: '';
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}

	.tui-number-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0 30rpx 0;
		box-sizing: border-box;
	}

	/*底部选择弹层*/

	/*拼团玩法介绍 modal*/
	.tui-modal__title {
		text-align: center;
		font-weight: bold;
		padding-bottom: 8rpx;
	}

	.tui-modal__p {
		font-size: 26rpx;
		color: #888;
		padding-top: 20rpx;
	}

	.tui-modal__btn {
		width: 100%;
		padding: 60rpx 0 20rpx;
		display: flex;
		justify-content: center;
	}

	/*正在拼团*/
	.tui-group-swiper {
		width: 100%;
		background-color: #fff;
	}

	.tui-group-user {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 35rpx 40rpx;
		box-sizing: border-box;
	}

	.tui-user-left {
		font-size: 30rpx;
		display: flex;
		align-items: center;
	}

	.tui-user-left image {
		height: 80rpx;
		width: 80rpx;
		flex-shrink: 0;
		border-radius: 50%;
		margin-right: 16rpx;
	}

	.tui-user-right {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-user-anme {
		max-width: 160rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.tui-group-num {
		font-size: 26rpx;
		line-height: 26rpx;
		padding-bottom: 12rpx;
	}

	.tui-user-countdown {
		padding-right: 18rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tui-sub-title {
		font-size: 28rpx;
		padding-right: 30rpx;
	}

	.tui-group-countdown {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #666666;
		white-space: nowrap;
	}

	.tui-countdown-right {
		padding-right: 6rpx;
	}

	.tui-countdown-left {
		padding-left: 6rpx;
	}

	.tui-btn__box {
		height: 98rpx;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		line-height: 28rpx;
		padding: 18rpx 0 14rpx 0;
		box-sizing: border-box;
	}

	.tui-size-26 {
		font-size: 26rpx;
		line-height: 26rpx;
		padding-top: 4rpx;
	}

	.tui-size-36 {
		font-size: 36rpx;
		line-height: 34rpx;
		font-weight: 500;
	}

	.tui-flex-end {
		display: flex;
		align-items: flex-end;
	}

	/*分享弹层*/
	.tui-share__box {
		width: 100%;
		height: 380rpx;
		background-color: #fff;
	}

	.tui-share__header {
		padding: 40rpx 0;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
		text-align: center;
		position: relative;
	}

	.tui-close__box {
		position: absolute;
		right: 25rpx;
		top: 25rpx;
	}
	.tui-share__list{
		width: 100%;
		padding-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tui-share__item{
		flex: 1;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.tui-share__item image{
		width: 120rpx;
		height: 120rpx;
	}
	.tui-share__text{
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
		padding-top: 18rpx;
	}

	/*海报modal弹层*/
	.tui-poster__canvas {
		background-color: #fff;
		position: absolute;
		left: -9999px;
	}

	.tui-poster__box {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.tui-close__img {
		width: 48rpx;
		height: 48rpx;
		position: absolute;
		right: 0;
		top: -60rpx;
	}

	.tui-poster__img {
		width: 560rpx;
		height: 890rpx;
		border-radius: 20rpx;
		margin-bottom: 40rpx;
	}

	.tui-share__tips {
		font-size: 24rpx;
		transform: scale(0.8);
		transform-origin: center center;
		color: #ffffff;
		padding-top: 12rpx;
	}
</style>
