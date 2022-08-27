<template>
	<view :class="{notice: item.style.type!=='icon'}" @click="onClick" :style="{
        paddingBottom: item.style.bottomMargin*2 + 'rpx',
        paddingTop: item.style.topMargin*2 + 'rpx'}">
		<tui-notice-bar :is-left="item.style.type!=='none'" height="50" scrollable :content="item.content.news" :color="item.style.color" :speed="item.style.speed*100" 
			:size="item.style.fontSize*2" :backgroundColor="item.style.backgroundColor">
			<template v-slot:left>
				<view class="tui-padding">
					<tui-icon name="news-fill" :size="48" unit="rpx" :color="item.style.iconColor"></tui-icon>
				</view>
			</template>
		</tui-notice-bar>
	</view>
</template>

<script>
	export default {
		props: ['item'],
        methods: {
		    onClick(v){
				this.$emit('goto', this.item.content.chooseLink)
        	}
        }
	}
</script>

<style scoped>
	.tui-padding{
		padding-left: 5px;
	}
</style>
