<template>
    <tui-divider :width="item.style.width+'%'" :height="item.style.height*2"
        :gradual="item.style.gradual"
        :bold="item.style.isBold"
        :size="item.style.fontSize*2"
        :color="item.style.color"
        :dividerColor="item.style.lineColor"
        :backgroundColor="item.style.backgroundColor">
        {{item.content.title}}
    </tui-divider>
</template>

<script>
    export default {
        props: ['item'],
        methods: {}
    }
</script>

<style scoped>
   
</style>

