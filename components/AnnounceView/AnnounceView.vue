<template>
	<view :class="{notice: item.style.type!=='icon'}" @click="onClick">
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
	.notice /deep/ .u-notice-box{
		margin-left: 0;
	}
</style>
