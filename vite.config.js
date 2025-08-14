import path from 'path';
import { viteGenerateHtmlI18n } from 'vite-plugin-generate-html-i18n';
import vueDevTools from 'vite-plugin-vue-devtools';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import locale from './locales/vite_locale.js';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteGenerateHtmlI18n({
      translations: {
        en: locale.en,
        zh: locale.zh,
        ja: locale.ja,
        fr: locale.fr,
        es: locale.es,
        de: locale.de
      },
      selector: '[data-i18n]',
      getTranslationKey: el => el.getAttribute('data-i18n'),
      deleteSourceHtmlFiles: false,
      verbose: true,
      glob: (outputPath) => `${outputPath}/src/**/*.html`,
      modifyDocumentBefore: (document, { language }) => {
        document.documentElement.setAttribute("lang", language);
      },
      modifyElement: (el, value, {key,language,translations}) => {
        if(el.tagName === 'META' && el.hasAttribute('name') && el.getAttribute('name') === 'description') {
          el.setAttribute('content', value);
        }
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        def: path.resolve(__dirname, 'index.html'),
        bmi: path.resolve(__dirname, 'src/bmi/index.html'),
        // whr: path.resolve(__dirname, 'src/whr/index.html'),
        // 如有其它页面，继续添加
      }
    }
  }
});
