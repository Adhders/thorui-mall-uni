<template>
    <view class="carousel" :style="{
    	marginBottom: item.style.bottomMargin*2+ 'rpx',
    	marginTop: item.style.topMargin*2 + 'rpx',
    }">
       <u-swiper  :list=item.content.imgList  name="src"
		     :height="item.height*2"
             :effect3d="item.style.layout==='huadong'"
		     :effect3d-previous-margin=getMargin(item.style.space)
			 :mode=getMode(item.style.paginationStyle)
			 :interval=item.style.interval
			 @click="click">
	   </u-swiper>
    </view>
</template>

<script>
    export default {
        props: ['item'],
		data() {
			return {
				list: [{
					image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
					title: '昨夜星辰昨夜风，画楼西畔桂堂东'
				},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				title: false,
				mode: 'round',
				indicatorPos: 'bottomCenter',
				effect3d: false,

			}
		},
		methods: {
			click(v){
				console.log(v)
			},
			getMargin(v){
				return v === '0'? 30 : v === '1'? 50 : 70
			},
			getMode(v){
				return v=== '1' ? 'round' : v === '2' ? 'rect' : v === '3' ? 'number' : 'none'
			}
		}
    }
</script>
