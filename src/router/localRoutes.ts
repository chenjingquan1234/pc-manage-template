// 路由列表
export const localRoutes = [
  {
    path: "/demo",
    name: "demo",
    component: () => import("@views/GlobalComponenetdemo/index.vue"),
    meta: {
      title: "全局组件预览",
    },
  }
];

export default localRoutes;
