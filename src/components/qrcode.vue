<template>
    <section>
        <img :class="$style.img" src="../../static/images/qrcode.jpg" alt="qrcode" />
    </section>
</template>

<script>
export default {
    
}
</script>

<style lang="css" module>

    .img {
        display: block;
        width: 100vw;
        height: 100vh;
        object-fit: cover;
    }
</style>
