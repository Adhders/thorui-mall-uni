<template>
    <text class="iconfont" :class="name" :style="[{color: color, fontSize: size}]"></text>
</template>

<script>
    export default {
        props: {
            name: String,
            color: String,
            size: String,
        }
    }
</script>

<style scoped>
@import url("./iconfont.css");

.iconfont {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
}
</style>
