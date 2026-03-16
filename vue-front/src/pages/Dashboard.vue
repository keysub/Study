<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router'; // 리액트의 useNavigate 역할
import type { Menu } from '../menu';
import '../css/layout.css';
// 1. Props 정의
interface DashboardProps {
  level2Menus: Menu[];
  activeLevel2: Menu | null;
}

const props = defineProps<DashboardProps>();

// 2. Emit 정의 (부모의 onSelect 역할)
const emit = defineEmits<{
  (e: 'onSelect', menu: Menu | null): void;
}>();

const router = useRouter();

// 3. 필터링된 메뉴 목록 (computed 사용)
// 현재 활성화된 메뉴(activeLevel2)를 제외한 목록을 계산합니다.
const filteredMenus = computed(() => {
  if (!props.level2Menus) return [];
  return props.level2Menus.filter(menu => menu.menuId !== props.activeLevel2?.menuId);
});

// 4. 클릭 핸들러
const handleClick = (menu: Menu) => {
  emit('onSelect', menu);
  if (menu.menuUrl) {
    router.push(menu.menuUrl);
  }
};
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-hero">
      <div class="hero-text">
        <h1>👋 환영합니다!</h1>
        <p>
          Vue 3 SPA 학습 프로젝트에 오신 것을 환영합니다.
          <br />
          아래 메뉴를 선택하세요.
        </p>
      </div>
      <div class="hero-image">📚💻</div>
    </div>
    
    <div class="dashboard-cards">
      <!-- 5. 조건부 렌더링 (v-if / v-else) -->
      <template v-if="filteredMenus.length > 0">
        <div 
          v-for="menu in filteredMenus" 
          :key="menu.menuId" 
          class="dash-card" 
          @click="handleClick(menu)"
          style="cursor: pointer"
        >
          <div class="card-icon">📄</div>
          <div class="card-title">{{ menu.menuName }}</div>
          <div class="card-desc">해당 메뉴로 이동합니다</div>
        </div>
      </template>
      
      <div v-else class="no-menu-msg">
        활성화된 하위 메뉴가 없습니다.
      </div>
    </div>
  </div>
</template>

 
