<template>
    <view class="carousel tui-banner-swiper " :style="{
    	marginBottom: item.style.bottomMargin*2+ 'rpx',
    	marginTop: item.style.topMargin*2 + 'rpx',
		height: item.style.height*2 + 'rpx',
		borderRadius: item.style.borderRadius*2 + 'rpx',
    }">
	   <swiper @change="bannerChange" circular :indicator-dots="false"  autoplay :interval="item.style.interval"
			:duration="150" :style="{height: item.style.height*2 + 'rpx', margin: `0 ${item.style.pageMargin*2 + 'rpx'}`}" 
			:previous-margin="item.style.space*2+'rpx'" :next-margin="item.style.space*2+'rpx'" > 
			<swiper-item v-for="(img,index) in item.content.imgList" :key="index" @click="onClick(img)">
                <image class="img" :src="img.src"  mode='widthFix'/>
			</swiper-item>
		</swiper>
			<!--实际使用按需传入props，此处只为演示-->
		<tui-swiper-dot :type="type" :count="count" :current="current" :currentTitle="currentTitle" :left="left" :right="right"
			:bottom="bottom" :width="width" :height="height" :radius="radius" :backgroundColor="backgroundColor" :activeBgColor="activeBgColor"
			:color="color" :activeColor="activeColor" :size="size" :margin="margin" :padding="padding"></tui-swiper-dot>
    </view>
</template>

<script>
    export default {
        props: ['item'],
		data() {
			return {
				list: [],
				current: 0,
				type: 1,
				count: 0,
				currentTitle: "",
				left: "0",
				right: "auto",
				bottom: "30rpx",
				width: "16rpx",
				height: "16rpx",
				radius: "50%",
				backgroundColor: "#bfbfbf",
				activeBgColor: "#f5eaf0",
				color: "#333",
				activeColor: "#fff",
				size: 24,
				margin: "0 8rpx",
				padding: "0 20rpx",
			}
		},
		mounted(){
			this.count = this.item.content.imgList.length
			this.getMode(this.item.style.type)
		},
		methods: {
			getMode(v){
				switch (v) {
					case 2:
						this.type = 1;
						this.width = "12px";
						this.height = "6px";
						this.radius = "6px"
						break;
                    case 3:
					    this.type = 4;
						this.right="0";
						this.width="72rpx";
						this.height="44rpx";
						this.backgroundColor = "rgba(0,0,0,0.4)";
						this.color = "#fff";
						this.radius="120px 0 0 120px";
						break;    
					case 4:
						this.type = 3;
						this.width = "100%";
						this.height = "48rpx";
						this.bottom = "0";
						this.backgroundColor = "rgba(0,0,0,0.4)";
						this.color = "#fff";
						this.currentTitle = this.item.content.imgList[this.current].name
						break;
					default:
						break;
				}
			},
			bannerChange: function(e) {
				this.current = e.detail.current;
				this.currentTitle = this.item.content.imgList[this.current].name
			},
			onClick(v){
				this.$emit('goto', v.chooseLink)
        	}
		}
    }
</script>
<style>
	.img{
		width: 100%;
	}
	.tui-banner-swiper {
		position: relative;
	}
</style>
