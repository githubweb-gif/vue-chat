<template>
  <div id="map">
    <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center">
      <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index" />
    </el-amap>
    <div class="mapList">
      <div v-for="i in mapData" :key="i.id" class="item" @click="changeLaLn(i.location)">
        <div class="name">{{ i.name }}</div>
        <div class="distance">
          <span>{{ i.distance + 'm' }}</span>
          <span class="fenge">|</span>
          <span>{{ i.address }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    const self = this
    return {
      mapData: [],
      key: 'aee7cc085fc25b723455a438f4f54d94',
      center: [121.59996, 31.197646],
      lng: 0,
      lat: 0,
      loaded: false,
      plugin: [{
        convert: true,
        GeoLocationFirst: true,
        useNative: true,
        pName: 'Geolocation',
        events: {
          init(o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
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
            click: () => {
              alert('click marker')
            },
            dragend: (e) => {
              console.log('---event---: dragend')
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
  watch: {
    lat() {
      if (this.mapData.length > 0) {
        return
      }
      this.req_post()
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    req_post() {
      const registerUrl = `https://restapi.amap.com/v3/place/around`
      const that = this
      const data = {
        key: this.key,
        location: `${this.lat},${this.lng}`,
        types: '010000',
        radius: '2000',
        offset: 10
      }
      axios.get(registerUrl, { params: data })
        .then(function(res) {
          that.mapData = res.data.pois
          console.log(res.data.pois)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    changeLaLn(value) {
      const data = value.split(',')
      const position = this.markers[0].position
      this.markers[0].position = [position[0] + 0.002, position[1] - 0.002]
      this.center = data
      this.lat = data[0]
      this.lng = data[1]
    }
  }
}
</script>

<style lang="scss" scoped>

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
    padding: 10px 10px;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    .item {
        padding-bottom: 8px;
        cursor: pointer;
        .name {
            margin-bottom: 10px;
        }
        .distance {
            font-size: 14px;
            color: #797673;
        .fenge {
            padding: 0 4px;
        }
        }
    }
}

</style>

