 <template>
    <view class="vessel" :style="{
         height: parseInt(item.style.maxHeight)*2 +'rpx',
         backgroundImage: `url(${item.content.src})`,
         backgroundColor: item.style.background,
         opacity: item.style.opacity/100}" @tap="onClick(item)">
        <view v-for="(e,index) in item.children" :key="index">
            <WidgetText v-if="e.cmptName==='WidgetText'" :item="e" @tap.stop="onClick(e)"></WidgetText>
            <WidgetPicture v-if="e.cmptName==='WidgetPicture'" :item="e" @tap.stop="onClick(e)"></WidgetPicture>
        </view>
    </view>
</template>
<script>
    export default {
        props: ['item'],
        methods: {
            onClick(v){
                console.log('freeVessel', v)
				this.$emit('goto', v.content.chooseLink)
        	}
        }
    }

</script>

<style lang="scss" scoped>
    .vessel{
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center ;
        position: relative;
    }
</style>
