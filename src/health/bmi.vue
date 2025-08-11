<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const height = ref(0)
const weight = ref(0)
const bmi = ref(null)
const unit = ref('metric')
const bmiStandard = ref('china') // 默认中国标准
const { t } = useI18n()

const bmiCategory = computed(() => {
  if (!bmi.value) return ''
  const val = parseFloat(bmi.value)
  switch (bmiStandard.value) {
    case 'china':
      if (val < 18.5) return t('underweight')
      if (val < 24) return t('normal')
      if (val < 28) return t('overweight')
      return t('obese')
    case 'japan':
      if (val <= 18.4) return t('underweight')
      if (val <= 22.9) return t('normal')
      if (val <= 24.9) return t('overweight')
      return t('obese')
    case 'singapore':
      if (val <= 14.9) return t('severely_underweight')
      if (val <= 18.4) return t('underweight')
      if (val <= 22.9) return t('normal')
      if (val <= 27.5) return t('overweight')
      if (val <= 40.0) return t('obese')
      return t('severely_obese')
    case 'who':
      if (val <= 16.4) return t('severely_underweight')
      if (val <= 18.4) return t('underweight')
      if (val <= 24.9) return t('normal')
      if (val <= 29.9) return t('overweight')
      if (val <= 34.9) return t('obese1')
      if (val <= 39.9) return t('obese2')
      return t('obese3')
    default:
      return ''
  }
})

const bmiTableData = computed(() => {
  const val = parseFloat(bmi.value)
  switch (bmiStandard.value) {
    case 'china':
      return [
        { label: t('underweight'), range: '<18.5', color: '#409EFF', active: val < 18.5 },
        { label: t('normal'), range: '18.5-23.9', color: '#67C23A', active: val >= 18.5 && val < 24 },
        { label: t('overweight'), range: '24-27.9', color: '#E6A23C', active: val >= 24 && val < 28 },
        { label: t('obese'), range: '≥28', color: '#F56C6C', active: val >= 28 },
      ]
    case 'japan':
      return [
        { label: t('underweight'), range: '<=18.4', color: '#409EFF', active: val <= 18.4 },
        { label: t('normal'), range: '18.5-22.9', color: '#67C23A', active: val > 18.4 && val <= 22.9 },
        { label: t('overweight'), range: '23.0-24.9', color: '#E6A23C', active: val > 22.9 && val <= 24.9 },
        { label: t('obese'), range: '≥25.0', color: '#F56C6C', active: val >= 25.0 },
      ]
    case 'singapore':
      return [
        { label: t('severely_underweight'), range: '<=14.9', color: '#409EFF', active: val <= 14.9 },
        { label: t('underweight'), range: '15.0-18.4', color: '#409EFF', active: val > 14.9 && val <= 18.4 },
        { label: t('normal'), range: '18.5-22.9', color: '#67C23A', active: val > 18.4 && val <= 22.9 },
        { label: t('overweight'), range: '23.0-27.5', color: '#E6A23C', active: val > 22.9 && val <= 27.5 },
        { label: t('obese'), range: '27.6-40.0', color: '#F56C6C', active: val > 27.5 && val <= 40.0 },
        { label: t('severely_obese'), range: '≥40.1', color: '#C0392B', active: val >= 40.1 },
      ]
    case 'who':
      return [
        { label: t('severely_underweight'), range: '<=16.4', color: '#409EFF', active: val <= 16.4 },
        { label: t('underweight'), range: '16.5-18.4', color: '#409EFF', active: val > 16.4 && val <= 18.4 },
        { label: t('normal'), range: '18.5-24.9', color: '#67C23A', active: val > 18.4 && val <= 24.9 },
        { label: t('overweight'), range: '25.0-29.9', color: '#E6A23C', active: val > 24.9 && val <= 29.9 },
        { label: t('obese1'), range: '30.0-34.9', color: '#F56C6C', active: val > 29.9 && val <= 34.9 },
        { label: t('obese2'), range: '35.0-39.9', color: '#F56C6C', active: val > 34.9 && val <= 39.9 },
        { label: t('obese3'), range: '≥40.0', color: '#C0392B', active: val >= 40.0 },
      ]
    default:
      return []
  }
})

function calculateBMI() {
  let bmiValue = null
  if (height.value > 0 && weight.value > 0) {
    if (unit.value === 'metric') {
      // kg/cm
      const h = height.value / 100
      bmiValue = weight.value / (h * h)
    } else if (unit.value === 'imperial') {
      // lb/in
      bmiValue = (weight.value / (height.value * height.value)) * 703
    } else if (unit.value === 'us') {
      // lb/ft
      const h = height.value * 12 // ft to in
      bmiValue = (weight.value / (h * h)) * 703
    }
    bmi.value = bmiValue ? bmiValue.toFixed(2) : null
  }
}

function tableRowClass({ row }) {
  return row.active ? 'bmi-active-row' : ''
}
</script>

<template>
  <div class="bmi-container">
    <div class="bmi-flex">
      <el-card shadow="hover">
        <h1 style="text-align:center; margin-bottom:24px;">{{ t('title') }}</h1>
        <el-form @submit.prevent="calculateBMI" label-width="40px">
          <el-form-item :label="t('unit')">
            <div style="display:flex; align-items:center; width:100%;">
              <el-select v-model="unit" style="flex:1">
                <el-option :label="t('metric')" :value="'metric'" />
                <el-option :label="t('imperial')" :value="'imperial'" />
                <el-option :label="t('us')" :value="'us'" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="t('height')">
            <div style="display:flex; align-items:center; width:100%;">
              <el-input-number v-model="height" :min="0" :step="1" style="flex:1" :placeholder="t('height')" />
              <span style="margin-left:8px; white-space:nowrap;">{{ unit==='metric' ? 'cm' : (unit==='imperial' ? 'in' : 'ft') }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="t('weight')">
            <div style="display:flex; align-items:center; width:100%;">
              <el-input-number v-model="weight" :min="0" :step="0.1" style="flex:1" :placeholder="t('weight')" />
              <span style="margin-left:8px; white-space:nowrap;">{{ unit==='metric' ? 'kg' : 'lb' }}</span>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="display:flex; justify-content:center; align-items:center; width:100%;">
              <el-button type="primary" size="large" style="font-size:20px; min-width:120px;" @click="calculateBMI">{{ t('calculate') }}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="hover">
        <div style="margin-bottom:16px;">
        <el-form-item :label="t('standard')">
          <el-select v-model="bmiStandard" style="flex:1">
            <el-option :label="t('china_standard')" :value="'china'" />
            <el-option :label="t('japan_standard')" :value="'japan'" />
            <el-option :label="t('singapore_standard')" :value="'singapore'" />
            <el-option :label="t('who_standard')" :value="'who'" />
          </el-select>
        </el-form-item>
        </div>
        <div style="display:flex; gap:24px; align-items:flex-start; flex-wrap:nowrap;">
          <div style="flex:0 0 160px; max-width:160px; min-width:120px;">
            <div style="text-align:center; margin-top:12px;">
              <el-result
                v-if="bmi"
                icon="success"
                style="margin-bottom:0; padding-bottom:0;"
              >
                <template #title>
                  <div style="font-size:18px; font-weight:bold;">{{ t('result') }}</div>
                </template>
              </el-result>
              <div v-if="bmi"
                :style="{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  margin: '8px 0',
                  color: (() => {
                    const row = bmiTableData.find(r => r.active)
                    return row ? row.color : '#333'
                  })()
                }"
              >
                {{ bmi }}
              </div>
              <div v-if="bmi" style="font-size:14px; margin-top:4px;">{{ t('category') }}: {{ bmiCategory }}</div>
              <el-result
                v-else
                icon="info"
                style="margin-bottom:0; padding-bottom:0;"
                :title="t('no_result')"
                :sub-title="t('please_input')"
              />
            </div>
          </div>
          <div style="flex:1 1 480px; max-width:600px; min-width:220px; padding-right:12px; box-sizing:border-box;">
            <div style="margin-bottom:8px; font-weight:bold;">{{ t('bmi_desc') }}</div>
            <el-table :data="bmiTableData" border style="width:100%;" :row-class-name="tableRowClass">
              <el-table-column prop="label" :label="t('category')" width="140">
                <template #default="scope">
                  <span :style="{color: scope.row.color, fontWeight: scope.row.active ? 'bold' : 'normal'}">{{ scope.row.label }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="range" :label="t('range')" width="140">
                <template #default="scope">
                  <span :style="{color: scope.row.color, fontWeight: scope.row.active ? 'bold' : 'normal'}">{{ scope.row.range }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.bmi-container {
  max-width: 1200px;
  margin: 40px auto;
}
.bmi-flex {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}
.bmi-flex > .el-card {
  flex: 1;
  min-width: 340px;
  max-width: 500px;
}
@media (max-width: 800px) {
  .bmi-flex {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  .bmi-flex > .el-card {
    max-width: 100%;
    min-width: 0;
  }
}
/* 激活行背景色，明显高亮，使用主色且透明度更低 */
.bmi-active-row {
  background-color: #409EFF55 !important;
}
</style>
