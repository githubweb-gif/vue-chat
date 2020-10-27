<template>
  <div id="groupDetails">
    <div class="header top">
      <div class="back">
        <span class="link el-icon-arrow-left" @click="$router.go(-1)" />
      </div>
      <span class="el-icon-more" />
    </div>
    <div class="cover">
      <img src="https://t9.baidu.com/it/u=583874135,70653437&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1604385877&t=9f8c44eff2ec6aed87afa3eb72082e53" alt="">
    </div>
    <div class="groupInfo">
      <div class="header">
        <div class="name">开心就好了</div>
        <div class="time">2020-10-27</div>
      </div>
      <div class="Introduction">
        壬戌之秋1，七月既望2，苏子与客泛舟游于赤壁之下。清风徐来3，水波不兴4。举酒属客5，诵明月之诗6，歌窈窕之章7。
      </div>
      <div class="groupPepole">
        <div class="header">
          <div class="title">群成员</div>
          <div>
            <span>成员管理</span>
            <span class="el-icon-arrow-right" />
          </div>
        </div>
        <div class="list">
          <div v-for="(item,index) in 8" :key="index" :class="['item', index === 4? 'last-item' : '']">
            <div class="avatar">
              <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=887906380,1521954931&fm=26&gp=0.jpg" alt="">
            </div>
            <div class="name">vue</div>
          </div>
          <div class="addPeople item">
            <div class="icon el-icon-plus avatar" />
            <div class="name">邀请</div>
          </div>
        </div>
      </div>
      <div class="group-name info">
        <div>群名称</div>
        <div class="content">开心就好了</div>
        <div class="el-icon-arrow-right" />
      </div>
      <div class="group-bulletin info">
        <div>群公告</div>
        <div class="content">壬戌之秋1，七月既望2</div>
        <div class="el-icon-arrow-right" />
      </div>
      <div class="group-markName info">
        <div>群昵称</div>
        <div class="content">壬戌之</div>
        <div class="el-icon-arrow-right" />
      </div>
      <div class="message-setting info">
        <div>消息免打扰</div>
        <van-switch v-model="checked" active-color="#ffe431" size="24px" />
      </div>
    </div>
    <div class="logout-group">退出群聊</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/header.scss';
#groupDetails {
  position: relative;
  display: flex;
  flex-direction: column;
  .header {
    background-color: #ffffff;
    border: 0;
  }
  .top {
    background-color: rgba(255, 255, 255, 0);
    font-size: 26px;
    color: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .cover {
    height: 192px;
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .groupInfo {
    flex: 1;
    transform: translateY(-20px);
    background-color: #ffffff;
    border-radius: 20px;
    padding: 20px 16px 0;
    .header {
      margin-bottom: 10px;
      height: auto;
      padding: 0;
      .name {
        font-size: 24px;
        font-weight: 600;
      }
      .time {
        color: rgba(39,40,50,0.50);
      }
    }
    .Introduction {
      color: #272832;
      margin-bottom: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 14px;
      color: #272832;
      letter-spacing: -0.48px;
      line-height: 24px;
    }
    .groupPepole {
      margin-bottom: 25px;
      .header {
        font-size: 18px;
        .title {
          font-weight: 600;
        }
        span {
          font-size: 14px;
          color: rgba(39,40,50,0.50);
        }
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        .item {
          margin-right: 20px;
          margin-bottom: 16px;
          .avatar {
            border-radius: 10px;
            width: 52px;
            height: 52px;
            margin-bottom: 4px;
            img {
              display: block;
              width: 52px;
              height: 52px;
              border-radius: 10px;
            }
          }
          .name {
            text-align: center;
            font-size: 16px;
            line-height: 16px;
          }
        }
        .last-item {
          margin: 0;
        }
        .addPeople {
          .icon {
            background-color: #ffe431;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
          }
        }
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      padding: 17px 0;
      .content {
        margin-left: 10px;
        flex: 1;
        color: rgba(39,40,50,0.60);
      }
    }
  }
  .logout-group {
    transform: translateY(-20px);
    text-align: center;
    color: red;
    padding: 10px 0;
  }
}
</style>
