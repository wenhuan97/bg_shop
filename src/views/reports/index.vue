<template>
  <div class="reports-container">
    <div ref="main" style="width: 750px; height: 400px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getReport } from '@/api/orders'
import _ from 'lodash'

export default {
  name: 'reportsIndex',
  components: {},
  props: {},
  data() {
    return {
      // 需要合并的对象
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)
    //   获取报表数据
    const { data } = await getReport()
    if (data.meta.status === 200) {
      this.$message.success('获取折线图成功')
    } else {
      this.$message.error('获取失败')
    }
    // 合并获取的数据
    const result = _.merge(data.data, this.options)

    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style scoped lang="less">
</style>
