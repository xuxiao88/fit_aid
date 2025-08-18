<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const waist = ref(0)
const hip = ref(0)
const whr = ref(null)
const unit = ref('cm')
const gender = ref('male')
const { t } = useI18n()

const whrCategory = computed(() => {
  if (!whr.value) return ''
  const val = parseFloat(whr.value)
  if (gender.value === 'male') {
    if (val < 0.9) return t('normal')
    if (val < 1.0) return t('risk')
    return t('high_risk')
  } else {
    if (val < 0.8) return t('normal')
    if (val < 0.85) return t('risk')
    return t('high_risk')
  }
})

const whrTableData = computed(() => {
  const val = parseFloat(whr.value)
  if (gender.value === 'male') {
    return [
      { label: t('normal'), range: '<0.9', color: '#67C23A', active: val < 0.9 },
      { label: t('risk'), range: '0.9-0.99', color: '#E6A23C', active: val >= 0.9 && val < 1.0 },
      { label: t('high_risk'), range: '≥1.0', color: '#F56C6C', active: val >= 1.0 },
    ]
  } else {
    return [
      { label: t('normal'), range: '<0.8', color: '#67C23A', active: val < 0.8 },
      { label: t('risk'), range: '0.8-0.84', color: '#E6A23C', active: val >= 0.8 && val < 0.85 },
      { label: t('high_risk'), range: '≥0.85', color: '#F56C6C', active: val >= 0.85 },
    ]
  }
})

function calculateWHR() {
  let whrValue = null
  if (waist.value > 0 && hip.value > 0) {
    whrValue = waist.value / hip.value
    whr.value = whrValue ? whrValue.toFixed(2) : null
  }
}

function tableRowClass({ row }) {
  return row.active ? 'whr-active-row' : ''
}
</script>

<template>
  <div class="whr-container">
    <div class="whr-flex">
      <el-card shadow="hover">
        <h1 style="text-align:center; margin-bottom:24px;">{{ t('whr_title') }}</h1>
        <el-form @submit.prevent="calculateWHR" label-width="60px">
          <el-form-item :label="t('gender')">
            <el-radio-group v-model="gender">
              <el-radio :label="'male'">{{ t('male') }}</el-radio>
              <el-radio :label="'female'">{{ t('female') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('waist')">
            <div style="display: flex; align-items: center; width: 100%;">
              <el-input-number v-model="waist" :min="0" :step="0.1" style="flex: 1;" :placeholder="t('waist')" />
              <span style="margin-left: 8px;">{{ unit }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="t('hip')">
            <div style="display: flex; align-items: center; width: 100%;">
              <el-input-number v-model="hip" :min="0" :step="0.1" style="flex: 1;" :placeholder="t('hip')" />
              <span style="margin-left: 8px;">{{ unit }}</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" style="font-size:20px; min-width:120px;" @click="calculateWHR">{{
              t('calculate') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="hover">
        <div style="display:flex; gap:24px; align-items:flex-start; flex-wrap:nowrap; padding-top: 20px;">
          <div style="flex:0 0 160px; max-width:160px; min-width:120px;">
            <div style="text-align:center;">
              <el-result v-if="whr" icon="success" style="margin: 0 auto; padding: 0;">
                <template #title>
                  <div style="font-size:18px; font-weight:bold;">{{ t('result') }}</div>
                </template>
              </el-result>
              <div v-if="whr" :style="{
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '8px 0',
                color: (() => {
                  const row = whrTableData.find(r => r.active)
                  return row ? row.color : '#333'
                })()
              }">
                {{ whr }}
              </div>
              <div v-if="whr" style="font-size:14px; margin-top:4px;">{{ t('category') }}: {{ whrCategory }}</div>
              <el-result v-else icon="info" style="margin: 0 auto; padding: 0;" :title="t('no_result')" />
              <div v-if="whr" style="margin-top: 20px; padding: 10px; border-radius: 4px; background-color: #f5f5f5;">
                <div v-if="whrCategory === t('normal')" style="color: #67C23A;">
                  {{ t('normal_desc') }}
                </div>
                <div v-else-if="whrCategory === t('risk')" style="color: #E6A23C;">
                  {{ t('risk_desc') }}
                </div>
                <div v-else-if="whrCategory === t('high_risk')" style="color: #F56C6C;">
                  {{ t('high_risk_desc') }}
                </div>
              </div>
            </div>
          </div>
          <div style="flex:1 1 480px; max-width:600px; min-width:220px; padding-right:12px; box-sizing:border-box;">
            <div style="margin-bottom:8px; font-weight:bold;">{{ t('whr_desc') }}</div>
            <el-table :data="whrTableData" border style="width:100%;" :row-class-name="tableRowClass">
              <el-table-column prop="label" :label="t('category')" width="140">
                <template #default="scope">
                  <span :style="{ color: scope.row.color, fontWeight: scope.row.active ? 'bold' : 'normal' }">{{
                    scope.row.label }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="range" :label="t('range')" width="140">
                <template #default="scope">
                  <span :style="{ color: scope.row.color, fontWeight: scope.row.active ? 'bold' : 'normal' }">{{
                    scope.row.range }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
    <div class="whr-flex">
      <el-card shadow="hover" style="margin-top: 20px; flex: 1; min-width: 340px; max-width: 1000px;">
        <div style="display:flex; flex-direction:column; gap:12px;">
          <el-alert type="info" :closable="false" show-icon>
            <template #title>
              <span style="font-weight:bold;">{{ t('waist_guide_title') }}</span>
            </template>
            <div style="font-size:13px; margin-top:4px;">{{ t('waist_guide') }}</div>
          </el-alert>
          <el-alert type="info" :closable="false" show-icon>
            <template #title>
              <span style="font-weight:bold;">{{ t('hip_guide_title') }}</span>
            </template>
            <div style="font-size:13px; margin-top:4px;">{{ t('hip_guide') }}</div>
          </el-alert>
          <div style="display:flex; flex-direction:column; gap:16px;">
              <div>
                <h3 style="margin: 0 0 8px 0; color: #67C23A;">{{ t('normal') }}</h3>
                <p style="margin: 0; font-size: 14px; color: #666;">{{ t('normal_desc') }}</p>
              </div>
              <div>
                <h3 style="margin: 0 0 8px 0; color: #E6A23C;">{{ t('risk') }}</h3>
                <p style="margin: 0; font-size: 14px; color: #666;">{{ t('risk_desc') }}</p>
              </div>
              <div>
                <h3 style="margin: 0 0 8px 0; color: #F56C6C;">{{ t('high_risk') }}</h3>
                <p style="margin: 0; font-size: 14px; color: #666;">{{ t('high_risk_desc') }}</p>
              </div>
            </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<style scoped>
.whr-container {
  max-width: 1200px;
  margin: 40px auto;
}

.whr-flex {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}

.whr-flex>.el-card {
  flex: 1;
  min-width: 340px;
  max-width: 500px;
}

@media (max-width: 800px) {
  .whr-flex {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .whr-flex>.el-card {
    max-width: 100%;
    min-width: 0;
  }
}

.whr-active-row {
  background-color: #409EFF55 !important;
}
</style>
