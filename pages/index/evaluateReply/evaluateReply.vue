<template>
	<view class="container">
		<textarea class="tui-textarea"
				  :placeholder="placeholder"
				  v-model = "ruleForm.msg"
				  maxlength="200" auto-focus>
		</textarea>
		<view class="tui-btn__box">
			<tui-button type="danger" height="88rpx" shape="circle" @tap="onSubmit">发送</tui-button>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/util.js'
	export default {
		data() {
			return {
				placeholder: '回复留言',
				ruleForm: {
					id: '',
					name: '张三',
					avatar: 'https://system.chuangbiying.com/static/images/news/avatar_1.jpg',
					reply: false,
					create_time: "",
					msg: '',
					likes: 0,
				}
			}
		},
		onLoad(options) {
			if (options.index==='undefined'){
				this.placeholder = '回复' + this.reviewDetail.name
			}else{
				this.ruleForm.reply = true
				let replied_item = this.reviewDetail.children[options.index]
				this.placeholder = '回复' + replied_item.name
				this.ruleForm.repliedMsg = { name: replied_item.name, msg: replied_item.msg }
			}
		},
		computed: {
			reviewDetail() {
				return this.$store.state.currentReview
			}
		},
		methods: {
			onSubmit(){
				if(this.ruleForm.msg){
					const timestamp = new Date().getTime()
					this.ruleForm.id = timestamp
					this.ruleForm.create_time = utils.formatDate('y-m-d h:i:s', timestamp, 2)
					this.reviewDetail.children.push(this.ruleForm)
					this.reviewDetail.reviews +=1
					let url = '/updateGoodsReview/' + this.reviewDetail.id + '/reply'
					this.tui.request(url,'PUT', this.reviewDetail).then(res=>{
						if (res.code==='0'){
							this.tui.toast('留言成功')
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 300)
						}
					})
				}else{
					this.tui.toast('请至少输入两个字符')
				}
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx 0;
	}
	.tui-textarea {
		width: 100%;
		height: 300rpx;
		font-size: 28rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #fff;
	}
	.tui-btn__box{
		width: 100%;
		padding: 60rpx;
		box-sizing: border-box;
	}
</style>
