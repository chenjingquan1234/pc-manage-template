
import password from "./password";

const apis = import.meta.glob(["../api/*.ts"], { eager: true });

function getApiModule() {
  console.log({ apis });
  const res: Record<any, string> = {};
  for (const value of Object.values(apis) as any) {
    const module = value.default;
    console.log(module);
    res[module.name] = module;
  }
  return res;
}

const $api = {
  password
}

export default $api