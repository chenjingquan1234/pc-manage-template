import { computed, getCurrentInstance, ref, onBeforeUnmount } from 'vue';


export function useVModel(props, emit, { modelValue = "modelValue" } = {}) {
  const modelValueResult = computed({
    get() {
      return props[modelValue];
    },
    set(value) {
      emit(`update:${modelValue}`, value);
    },
  });
  return {
    modelValueResult,
  };
}
