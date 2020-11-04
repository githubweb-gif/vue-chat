<template>
  <div id="map">
    <div class="header">
      <div class="close" @click="sendMap('取消')">取消</div>
      <div class="sendmap" @click="sendMap">
        发送
      </div>
    </div>
    <el-amap ref="map" :zoom="zoom" vid="amap" :events="events" :plugin="plugin" class="amap-demo" :center="center">
      <template>
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index" />
      </template>
    </el-amap>
    <div class="mapList">
      <el-amap-search-box :search-option="searchOption" class="search-box" :on-search-result="onSearchResult" />
      <div class="main">
        <div v-for="i in mapData" :key="i.id" class="item" @click="changeLaLn(i)">
          <div class="name">{{ i.name }}</div>
          <div class="distance">
            <span>{{ i.distance + 'm' }}</span>
            <span class="fenge">|</span>
            <span>{{ i.address }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { sendMessage, sendGroupMsg } from '@/api/user'
export default {
  props: {
    showComponent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const self = this
    return {
      mapData: [],
      zoom: 15,
      key: 'aee7cc085fc25b723455a438f4f54d94',
      center: [121.59996, 31.197646],
      lng: 0,
      lat: 0,
      searchOption: {
        city: '全国',
        citylimit: false
      },
      // 自己定位位置具体信息
      location: {},
      // 自己定位具体地址
      formattedAddress: '',
      // 要发送的位置信息

      place: '', // 经纬度 具体位置 所在地区
      loaded: false,
      events: {
        complete: (data) => {
          console.log(data)
        }
      },
      plugin: [{
        position: 'RB',
        pName: 'Scale'
      }, {
        convert: true,
        enableHighAccuracy: true,
        GeoLocationFirst: false, // 为false的时候pc端优先使用ip定位
        timeout: 30000, // 超过10秒后停止定位，默认：无穷大
        showIndoorMap: false, // 不展示室内
        pName: 'Geolocation',
        events: {
          init(o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              console.log(status)
              console.log(result)
              if (result && result.position) {
                self.location = result.addressComponent
                self.formattedAddress = result.formattedAddress
                self.lng = result.position.lng
                self.lat = result.position.lat
                self.center = [self.lng, self.lat]
                self.markers[0].position = [self.lng, self.lat]
                self.loaded = true
                self.$nextTick()
              }
            })
          }
        }
      }],
      markers: [
        {
          position: [0, 0],
          events: {
            dragend: (e) => {
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
            }
          },
          visible: true,
          draggable: false,
          template: '<span>1</span>'
        }
      ]
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    oneSelf() {
      return this.$store.getters.userInfo
    }
  },
  watch: {
    lat() {
      if (this.mapData.length > 0) {
        return
      }
      this.req_post()
    }
  },
  methods: {
    req_post() {
      const registerUrl = `https://restapi.amap.com/v3/place/around`
      const that = this
      const data = {
        key: this.key,
        location: `${this.lat},${this.lng}`,
        types: '120000',
        radius: '2000',
        offset: 10
      }
      const locationName = this.formattedAddress.split(this.location.district)[1]
      const location = {
        name: locationName,
        distance: 100,
        address: this.location.district,
        location: `${this.lng},${this.lat}`
      }
      const arr = [location.location, location.name, location.address]
      this.place = arr.join('&')
      axios.get(registerUrl, { params: data })
        .then(function(res) {
          that.mapData = res.data.pois
          that.mapData.unshift(location)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    changeLaLn(value) {
      console.log(value)
      const obj = [
        value.location,
        value.name,
        value.adname + value.address
      ]
      this.place = obj.join('&')
      const data = value.location.split(',')
      this.markers[0].position = data
      this.center = data
    },
    sendMap(value) {
      this.$emit('showComponent', false)
      if (value === '取消') {
        return
      }
      if (this.$route.path === '/chat') {
        const data = { types: 3, message: this.place, userID: this
          .oneSelf.id, friendID: this.id }
        sendMessage(data).then((res) => {
          const { data: { data, user }} = res
          data.userID = user
          this.$store.commit('ACCEPT_DATA', data)
          this.socket.emit('msg', { fromID: this
            .oneSelf.id, toID: this.id, msg: data })
        }).catch(() => {
          this.$router.push('/')
        })
      } else if (this.$route.path === '/groupChat') {
        const data = { types: 3, message: this.place, userID: this
          .oneSelf.id, GroupID: this.id }
        sendGroupMsg(data).then((res) => {
          this.$store.commit('ACCEPT_DATA', res.data)
          this.socket.emit('groupMsg', { GroupID: this.id, msg: res.data })
        }).catch(() => {
          this.$router.push('/')
        })
      }
    },
    onSearchResult(pois) {
      console.log(pois)
      const obj = [
        pois[0].lng + ',' + pois[0].lat,
        pois[0].name,
        pois[0].address
      ]
      this.place = obj.join('&')
      const data = [pois[0].lng, pois[0].lat]
      this.center = data
      this.markers[0].position = data
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/header.scss';
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba($color: #ffffff, $alpha: 0);
  font-size: 0.43rem;
}
#map {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 2001;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #ffffff;
    overflow: hidden;
}

.amap-demo {
    flex: 2;
}

.mapList {
    padding: 0.27rem;
    flex: 1;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    .search-box {
      width: 100%;
      margin-bottom: 0.27rem;
      font-size: 0.5rem;
    }
    .main {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .item {
        padding-bottom: 0.21rem;
        margin: 0 0.21rem;
        cursor: pointer;
        .name {
            margin-bottom: 0.27rem;
            font-size: 0.5rem;
        }
        .distance {
            font-size: 0.37rem;
            color: #797673;
        .fenge {
            padding: 0 0.11rem;
        }
        }
    }
}

.sendmap {
    top: 2%;
    right: 5%;
    padding: 0.135rem 0.27rem;
    background-color: rgb(35, 194, 33);
    border-radius: 10%;
}

</style>

