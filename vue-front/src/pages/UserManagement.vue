<script setup lang="ts">
import { computed } from 'vue';
import type { Menu } from '../menu';

// 1. Props 정의
interface UserManagementProps {
  level2Menus: Menu[];
  activeLevel2: Menu | null;
}

const props = defineProps<UserManagementProps>();

// 2. Emit 정의 (부모의 onSelect 역할)
const emit = defineEmits<{
  (e: 'onSelect', menu: Menu | null): void;
}>();

// 3. Computed 속성 (리액트의 변수 계산 로직 역할)
const currentMenuName = computed(() => {
  return props.activeLevel2?.menuName || "User Management";
});

// 관리 가능한 메뉴 이름을 쉼표로 연결
const manageableMenus = computed(() => {
  return props.level2Menus.map((m) => m.menuName).join(", ");
});
</script>

<template>
  <div class="user-mgmt-page">
    <div class="user-mgmt-card">
      <div class="user-mgmt-icon">👤</div>
      <h1>{{ currentMenuName }}</h1>
      <p class="status-text">현재 개발중입니다</p>
      <p class="sub-text">곧 기능이 추가됩니다</p>
    </div>

    <!-- 4. 조건부 렌더링 (v-if) -->
    <div 
      v-if="level2Menus.length > 0" 
      class="manageable-list"
    >
      관리 가능 메뉴: {{ manageableMenus }}
    </div>
  </div>
</template>

<style scoped>
/* 페이지 전용 스타일 */
.user-mgmt-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}

.user-mgmt-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 500px;
}

.user-mgmt-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.status-text {
  color: #ef4444;
  font-weight: bold;
  margin-top: 15px;
}

.sub-text {
  color: #64748b;
  font-size: 14px;
}

.manageable-list {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
</style>
