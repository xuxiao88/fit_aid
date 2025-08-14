<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const langOptions = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
]

const { t, locale } = useI18n();
const currentLang = ref(locale.value); // 直接用 i18n 当前值


// 获取当前语言（适配 /bmi/zh/ 这种路径）
function getSystemLang() {
  const pathArr = window.location.pathname.split('/');
  const pathLocale = pathArr[2];
  const supportedLocales = ['zh', 'en', 'ja', 'fr', 'es', 'de'];
  return supportedLocales.includes(pathLocale) ? pathLocale : 'en';
}

// 初始化 currentLang
currentLang.value = getSystemLang();
locale.value = currentLang.value;

function changeLang(val) {
  currentLang.value = val;
  locale.value = val;
  const pathArr = window.location.pathname.split('/');
  pathArr[2] = val; // 替换语言段（第二段）
  window.location.pathname = pathArr.join('/');
}

function goTo(val){
  window.location.pathname = `/${val}/${currentLang.value}`;
}
</script>

<template>
  <el-menu mode="horizontal" style="border-bottom: 1px solid #eee; display: flex; align-items: center;">
    <el-menu-item @click="goTo('bmi')">
      {{ t('bmi_menu') }}
    </el-menu-item>
    <el-select v-model="currentLang" @change="changeLang" size="small" style="margin-left:auto; width:120px;">
      <el-option
        v-for="item in langOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-menu>
  <main>
    <slot />
  </main>
</template>

<style scoped></style>
