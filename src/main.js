import { createApp, h } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createI18n } from 'vue-i18n';

import zh_bmi from '../locales/zh/bmi.json';
import en_bmi from '../locales/en/bmi.json';
import ja_bmi from '../locales/ja/bmi.json';
import fr_bmi from '../locales/fr/bmi.json';
import es_bmi from '../locales/es/bmi.json';
import de_bmi from '../locales/de/bmi.json';

import zh_whr from '../locales/zh/whr.json';
import en_whr from '../locales/en/whr.json';
import ja_whr from '../locales/ja/whr.json';
import fr_whr from '../locales/fr/whr.json';
import es_whr from '../locales/es/whr.json';
import de_whr from '../locales/de/whr.json';

import zh_menu from '../locales/zh/menu.json';
import en_menu from '../locales/en/menu.json';
import ja_menu from '../locales/ja/menu.json';
import fr_menu from '../locales/fr/menu.json';
import es_menu from '../locales/es/menu.json';
import de_menu from '../locales/de/menu.json';

import Bmi from './bmi/bmi.vue';

// 适配 /bmi/zh/ 这种路径，语言在第二段
const pathArr = window.location.pathname.split('/');
const pathLocale = pathArr[2];
const supportedLocales = ['zh', 'en', 'ja', 'fr', 'es', 'de'];
const defaultLocale = 'en';
const locale = supportedLocales.includes(pathLocale) ? pathLocale : defaultLocale;

const i18n = createI18n({
	legacy: false,
	locale: locale,
	fallbackLocale: 'en',
	messages: {
		zh: { ...zh_bmi, ...zh_whr, ...zh_menu },
		en: { ...en_bmi, ...en_whr, ...en_menu },
		ja: { ...ja_bmi, ...ja_whr, ...ja_menu },
		fr: { ...fr_bmi, ...fr_whr, ...fr_menu },
		es: { ...es_bmi, ...es_whr, ...es_menu },
		de: { ...de_bmi, ...de_whr, ...de_menu }
	}
});

// 根据路径动态选择页面组件
let PageComponent = null;
if (window.location.pathname.includes('/bmi')) {
	PageComponent = Bmi;
} else {
	PageComponent = {
		template: '<div>404 Not Found</div>'
	};
}

const app = createApp({
	render() {
		return h(App, {}, { default: () => h(PageComponent) });
	}
});
app.use(i18n);
app.use(ElementPlus);
app.mount('#app');
