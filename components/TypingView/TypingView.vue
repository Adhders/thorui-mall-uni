<template>
    <view class="typing" :style="{
        width: item.style.width*2 + 'rpx',
        marginTop: item.style.top*2+'rpx',
        marginLeft: item.style.left*2 + 'rpx',
        backgroundColor: item.style.backgroundColor,
        color: item.style.color,
        border: item.style.border,
        fontSize: parseInt(item.style.fontSize)*2 + 'rpx',
        lineHeight: item.style.lineHeight*2 + 'rpx',
        textAlign: item.style.textAlign
    }">
        <text :class="{
            bold: item.style.isBold,
            italic: item.style.isItalic,
            delete: item.style.isDelete,
            underline: item.style.isUnderline}">
            {{item.content.text}}
        </text>
    </view>
</template>

<script>
    export default {
        props: ['item'],
    }
</script>

<style scoped>
    .typing{
        color: rgb(102, 102, 102);
        font: 400 12px Arial;
        text-align: left;
        box-sizing: border-box;
        white-space: pre-wrap;
        word-break: break-all;
        line-height: 25px;
        min-height: 25px;
        margin-bottom: 1px;
        z-index: 100;
    }
    .typing .italic{
        font-style:italic;
    }
    .typing .bold{
        font-weight: 700;
    }
    .typing .underline{
        text-decoration:underline;
    }
    .typing .delete{
        text-decoration: line-through;
    }
    .typing .delete.underline{
        text-decoration: underline line-through;
    }
</style>
