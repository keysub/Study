<script setup lang="ts">
import { useRouter } from 'vue-router'; // 리액트의 useNavigate 역할
import type { Menu } from '../menu';
import '../css/layout.css';
// Props 정의
const props = defineProps<{
  mainMenus: Menu[];
  activeMenu: Menu;
}>();

// Emit 정의 (부모의 setActiveMenu 호출 역할)
const emit = defineEmits<{
  (e: 'setActiveMenu', menu: Menu): void;
}>();

const router = useRouter(); // "페이지 이동 리모컨" 생성

const topMenuClick = (menu: Menu) => {
  // 1. 활성 메뉴 상태 변경 요청
  emit('setActiveMenu', menu);
  
};
</script>

<template>
  <div id="header">
    <div class="header-left">
      <div class="logo-area">
        <span class="logo-icon">💚</span>
        <span class="logo-text">Vue Study</span>
      </div>
    </div>
    <div class="header-center">
      <div class="header-menu">
        <div
          v-for="menu in mainMenus"
          :key="menu.menuId"
          class="menu-item"
          :class="{ active: activeMenu.menuId === menu.menuId }"
          @click="topMenuClick(menu)"
        >
          {{ menu.menuName }}
        </div>
      </div>
    </div>
  </div>
</template>

