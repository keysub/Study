<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; 
import type { Menu } from '../menu';
import '../css/layout.css';
// 1. 타입을 인터페이스로 정의
interface SidebarProps {
  parentMenuName: string;
  level2Menus: Menu[];
  activeLevel2: Menu | null;
}

// 2. 정의한 인터페이스를 Props에 적용 (한 번만 선언해야 합니다)
const props = defineProps<SidebarProps>();

// 2. Emit 정의 (상태 변경을 부모에게 알림)
const emit = defineEmits<{
  (e: 'setActiveLevel2', menu: Menu | null): void;
}>();

const router = useRouter();
const route = useRoute(); // 현재 경로 정보 객체

// 3. State 정의 (리액트의 useState 역할)
const open = ref(true);

// 4. 메뉴 클릭 핸들러
const sideMenuClick = (menu: Menu) => {
  emit('setActiveLevel2', menu);
  if (menu.menuUrl) {
    router.push(menu.menuUrl);
  }
};

// 5. Watcher (리액트의 useEffect 역할)
// activeLevel2가 변경될 때마다 실행되며, 현재 경로와 다를 경우 자동으로 이동
watch(
  () => props.activeLevel2,
  (newActive) => {
    if (newActive && newActive.menuUrl) {
      // route.path가 현재 브라우저 주소입니다.
      if (route.path !== newActive.menuUrl) {
        router.push(newActive.menuUrl);
      }
    }
  },
  { immediate: true } // 컴포넌트가 처음 로드될 때도 실행 (useEffect의 마운트 시점과 동일)
);
</script>

<template>
  <div id="sidebar">
    <div class="sidebar-group">
      <!-- 메뉴 열기/닫기 토글 -->
      <div 
        class="sidebar-title" 
        @click="open = !open" 
        style="cursor: pointer"
      >
        📁 {{ parentMenuName }} {{ open ? "▾" : "▸" }}
      </div>

      <!-- v-if를 사용하여 open일 때만 렌더링 -->
      <div 
        v-if="open" 
        class="sidebar-list" 
        :class="{ active: open }"
      >
        <div
          v-for="menu in level2Menus"
          :key="menu.menuId"
          class="sidebar-item"
          :class="{ active: activeLevel2?.menuId === menu.menuId }"
          @click="sideMenuClick(menu)"
          style="cursor: pointer"
        >
          📄 {{ menu.menuName }}
        </div>
      </div>
    </div>
  </div>
</template>

