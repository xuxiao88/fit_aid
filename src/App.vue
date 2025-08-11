<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const langOptions = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'fr', label: 'Français' },
]
function getSystemLang() {
  const sys = navigator.language || navigator.userLanguage || 'en'
  if (sys.startsWith('zh')) return 'zh'
  if (sys.startsWith('ja')) return 'ja'
  if (sys.startsWith('fr')) return 'fr'
  return 'en'
}
const currentLang = ref(getSystemLang())
locale.value = currentLang.value
function changeLang(val) {
  locale.value = val
}
</script>

<template>
  <el-menu mode="horizontal" router style="border-bottom: 1px solid #eee; display: flex; align-items: center;">
    <el-menu-item index="/bmi">
      BMI计算器 / BMI Calculator
    </el-menu-item>
    <el-select v-model="currentLang" @change="changeLang" size="small" style="margin-left:auto; margin-right:24px; width:120px;">
      <el-option
        v-for="item in langOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-menu>
  <router-view />
</template>

<style scoped></style>
