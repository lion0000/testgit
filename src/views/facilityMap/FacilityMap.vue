<template>
    <div style="height: 100%;display: flex;flex-direction: column;">
      <div style="width: 100%;">
        <el-row :gutter="10"
                style="margin: -20px -20px 21px;padding: 20px 20px 20px 15px;background: #fff;">
          <el-col :span="8">
            <el-input v-model="table_param.imsi"
                      placeholder="请输入IMEI"
                      clearable></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary"
                      icon="el-icon-search"
                      @click="queryPower">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div style="flex: 1;display: flex;">
        <div style="flex: 1;overflow:hidden;min-width: 550px;padding-bottom: 72px;background: #fff;">
      <el-table :data="tableData"
                height="100%"
                @select="selectData"
                @select-all="selectDataAll"
                border
                v-loading="loading">
        <el-table-column type="selection"
                         v-if="tableData.length!==0"></el-table-column>
        <el-table-column type="index"
                         width="50"
                         label="序号"></el-table-column>
        <el-table-column prop="Imsi"
                         show-overflow-tooltip
                         label="IMEI"></el-table-column>
        <el-table-column prop="Longitude"
                         show-overflow-tooltip
                         label="经度">
                         </el-table-column>
        <el-table-column prop="Latitude"
                         show-overflow-tooltip
                         label="纬度"></el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :pager-count="5"
                     :page-sizes="[50, 100, 150, 200]"
                     :page-size="50"
                     layout="total, sizes, prev, pager, next"
                     :total="total_num"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </div>
  <div style="width: 60%;padding-left: 20px;height: 100%;">
  <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" scroll-wheel-zoom>
    <bm-marker v-for="item in log_and_lat" :key="item.id" :position="{lng: item.Longitude, lat: item.Latitude}" animation="BMAP_ANIMATION_DROP" :icon="{url:require('../../assets/execute.png'), size: {width: 25, height: 41}}">
      <bm-label :content="item.Imsi" labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: 25, height: -20}"/>
    </bm-marker>
  </baidu-map>
  </div>
      </div>

    </div>

</template>

<script>
import { queryTableData } from '@/api/FacilityMap'
export default {
  name: 'FacilityMap',
  data () {
    return {
      center: { lng: 0, lat: 0 }, // 经纬度
      zoom: 3, // 地图展示级别
      count: 0,
      currentPage: 1,
      total_num: 0,
      loading: false,
      fill_imsi: '',
      log_and_lat: [],
      map: '',
      BMap: '',
      points: [],
      table_param: { pageIndex: 1, pageSize: 50 },
      tableData: []
    }
  },
  methods: {
    handler ({ BMap, map }) {
      // console.log(BMap, map)
      this.center.lng = 105.404
      this.center.lat = 35.915
      this.zoom = 5
      this.BMap = BMap
      this.map = map
    },
    queryPower () {
      this.loading = true
      this.selectData([])
      queryTableData(this.table_param).then(response => {
        this.tableData = response.data.data.DeviceLogInfoList
        this.total_num = response.data.data.Count
        this.loading = false
      })
    },
    selectData (selection) {
      this.log_and_lat = selection
      this.points = []
      if (this.log_and_lat.length > 0) {
        this.log_and_lat.forEach(item => {
          this.points.push(new this.BMap.Point(item.Longitude, item.Latitude))
        })
        const view = this.map.getViewport(this.points)
        const mapZoom = view.zoom
        const centerPoint = view.center
        this.map.centerAndZoom(centerPoint, mapZoom)
      }
    },
    selectDataAll (selection) {
      this.selectData(selection)
    },
    // 每页条数
    handleSizeChange (val) {
      this.table_param.pageSize = val
      this.queryPower()
    },
    // 当前页数
    handleCurrentChange (val) {
      this.table_param.pageIndex = val
      this.queryPower()
    }
  },
  created () {
    this.queryPower()
  }
}
</script>

<style>
.map {
  width: 100%;
  height: 100%;
}
.anchorBL{
display: none;
}
</style>
