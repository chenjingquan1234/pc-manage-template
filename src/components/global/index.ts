/**
 * 全局组件
 * Glob 导入：https://cn.vitejs.dev/guide/features.html#glob-import
 */
// 同步方式
const globComponents = import.meta.glob(['./App*.vue', './**/App*.vue'], { eager: true });
export default function install(app: { component: (arg0: string, arg1: any) => void; }) {
  for (const value of Object.values(globComponents) as any) {
    const component = value.default;
    app.component(component.name, component);
  }
}
