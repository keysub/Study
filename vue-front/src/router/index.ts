import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import UserManagement from '../pages/UserManagement.vue';
import WbsSetup from '../pages/WbsSetup.vue' ;
import WbsExecution from '../pages/WbsExecution.vue' ;


const routes = [
  // '/'로 들어오면 바로 '/pages/dashboard'로 점프!
  { path: '/', redirect: '/pages/dashboard' }, 
  
  // 반드시 앞에 '/'가 붙어 있어야 합니다.
  { 
    path: '/pages/dashboard', 
    name: 'Dashboard', // 이름을 붙여주면 더 안전합니다.
    component: Dashboard 
  },
  { 
    path: '/pages/userManagement', 
    name: 'UserManagement',
    component: UserManagement 
  },
  { 
    path: '/pages/WbsSetup', 
    name: 'WbsSetup',
    component: WbsSetup 
  },
  { 
    path: '/pages/WbsExecution', 
    name: 'WbsExecution',
    component: WbsExecution 
  },
];


const router = createRouter({
  history: createWebHistory('/vue/'),
  routes,
});

// ✅ 반드시 default로 내보내야 main.ts에서 중괄호 없이 가져올 수 있습니다.
export default router;
