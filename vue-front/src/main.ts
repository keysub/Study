import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router' // index.ts의 'export default'를 가져옵니다.

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
