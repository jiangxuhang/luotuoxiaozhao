<template>
    <section>
        <article class="item kcb" @click="toKcb">
            <div>
                <img src="../../images/kcb.png" alt="">
            </div>
            <div class="text">
                课程表<br>
                黑大专属
            </div>
        </article>
        <article class="item hdtree" @click="toTree">
            <div>
                <img src="../../images/hdtree.png" alt="">
            </div>
            <div class="text">
                黑大树<br>
            </div>
        </article>
        <article class="item logo">
            <div>
                <img src="../../images/nyg.png" alt="">
            </div>
        </article>
        <article class="item link" @click="link">
            <div class="textInfo">
                <img src="../../images/aboutUs.png" alt="">
            </div>
            <div class="text">
                关于我们
            </div>
        </article>
        <article class="item return" @click="toIHD">
            <div>
                <img src="../../images/iHeiDa.png" alt="">
            </div>
            <div class="text">
                i黑大
            </div>
        </article>
    </section>
</template>

<script>
export default {
    methods: {
        link() {
            wx.navigateTo({ url:"../linkUs/main" })
        },
        toKcb() {
            wx.navigateToMiniProgram({
                appId:'wxde2483aafa70e9da',
                path:'pages/index/main',
                extraData: {
                    foo: 'bar'
                },
                envVersion: 'release',
                success(res) {
                    console.log('success');
                }
            })
        },
        toTree()
        {
            wx.navigateToMiniProgram({
                appId:'wx3e41342d7dbcb69e',
                path:'pages/index/main',
                extraData: {
                    foo: 'bar'
                },
                envVersion: 'release',
                success(res) {
                    console.log('success');
                }
            })
        },
        toIHD()
        {
            wx.navigateToMiniProgram({
                appId:'wxf55966fb59609a71'
            })
        }
    }
}
</script>

<style lang = "scss" scoped>
    .item {
        position: absolute;
        height: 198rpx;
        width: 214rpx;
        div {
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .text {
            text-align: center;
            font-family: PingFangSC-Regular;
            color: #5E5C5C;
            font-size: 32rpx;

        }
    }
    .kcb {
        left: 80rpx;
        top: 180rpx;
    }
    .hdtree {
       left: 472rpx;
       top: 180rpx;
    }
    .logo {
        left: 226rpx;
        top:500rpx;
        width: 310rpx;
        height: 310rpx;
    }
    .link {
        left: 76rpx;
        top: 870rpx;
    }
    .return {
        left: 472rpx;
        top: 870rpx;
    }
    .textInfo {
        text-align: center;
    }
</style>


