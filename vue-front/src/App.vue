<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, RouterView } from 'vue-router'; // 1. useRouter와 RouterView 추가
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
// import Dashboard from './pages/Dashboard.vue'; // <--- 삭제 (RouterView가 대신함)

import { type Menu, fetchTopMenus, fetchSubMenus } from './menu';
import './css/layout.css';

// --- 라우터 인스턴스 활성화 (이게 없으면 push가 안 됩니다) ---
const router = useRouter(); 

// --- 상태 관리 ---
const mainMenus = ref<Menu[]>([]);
const activeMenu = ref<Menu | null>(null);
const level2Menus = ref<Menu[]>([]);
const activeLevel2 = ref<Menu | null>(null);

// --- 메뉴 선택 로직 ---
const handleSetActiveMenu = async (menu: Menu) => {
  activeMenu.value = menu;
  try {
    const subMenus = await fetchSubMenus(menu.menuId);
    level2Menus.value = subMenus;
    
    // DB 조회 결과 반영: 하위 메뉴가 있으면 첫 번째 메뉴 활성화
    activeLevel2.value = subMenus.length > 0 ? subMenus[0] : null;

    if (menu.menuUrl) {
      // 🚀 핵심 수정: 주소 앞에 무조건 '/'를 붙여서 '절대 경로'로 이동합니다.
      // 이렇게 해야 /pages/pages/dashboard 처럼 중첩되는 현상을 막을 수 있습니다.
      const targetPath = menu.menuUrl.startsWith('/') 
        ? menu.menuUrl 
        : `/${menu.menuUrl}`;
      
      console.log("최종 이동 경로:", targetPath);
      await router.push(targetPath);
    }
  } catch (e) {
    console.error("메뉴 이동 에러:", e);
  }
};






const handleSetActiveLevel2 = (menu: Menu | null) => {
  activeLevel2.value = menu;
};

// --- 초기 데이터 로드 ---
onMounted(async () => {
  try {
    const menus = await fetchTopMenus();
    mainMenus.value = menus;
    if (menus && menus.length > 0) {
      // 초기화 시 첫 번째 메뉴 설정 및 이동
      await handleSetActiveMenu(menus[0]);
    }
  } catch (e) {
    console.error("초기 메뉴 로드 실패:", e);
  }
});
</script>

<template>
  <div id="app-container" v-if="activeMenu">
    <Header 
      :mainMenus="mainMenus" 
      :activeMenu="activeMenu" 
      @setActiveMenu="handleSetActiveMenu"
    />

    <div id="layout">
      <Sidebar 
        :parentMenuName="activeMenu?.menuName || ''"
        :level2Menus="level2Menus"
        :activeLevel2="activeLevel2"
        @setActiveLevel2="handleSetActiveLevel2"
      />

      <main id="mainContent">
        <!-- 
          핵심 수정: Dashboard 컴포넌트를 직접 쓰지 않고 RouterView를 씁니다. 
          이렇게 해야 주소에 따라 Dashboard나 UserManagement가 교체됩니다.
        -->
        <RouterView v-slot="{ Component }">
          <component 
            :is="Component" 
            :level2Menus="level2Menus"
            :activeLevel2="activeLevel2"
            @onSelect="handleSetActiveLevel2"
          />
        </RouterView>
      </main>
    </div>
  </div>
  <div v-else style="padding: 20px;">
    메뉴 데이터를 불러오는 중입니다...
  </div>
</template>
