/**
 * 路由配置
 * meta字段说明：
 *  title：页面标题
 *  noLogin：无需登录的页面，为true时不判断登录状态直接进入
 */
import { createRouter, createWebHistory, type RouteRecordRaw, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router';
import localRoutes from '@router/localRoutes'
export const routes: RouteRecordRaw[] = [
  // 根路径
  { path: '/', redirect: '/home' },
  ...localRoutes,
];
export const router = createRouter({
  // createWebHashHistory()带#号,  createWebHistory()需部署配置nginx，否则刷新后报错空白
  history: createWebHistory(),
  routes,
});



export default router;
export const routesFlat = router.getRoutes();
