<!-- upload 上传文件
  https://element-plus.gitee.io/zh-CN/component/upload.html
-->
<template>
  <el-upload
    v-if="!filedInfoPropsResult.url"
    ref="uploadRef"
    v-model:accept="acceptResult"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-exceed="handleExceed"
    v-bind="uploadPropsResult"
    class="AppUpload-root"
  >
    <slot>
      <AppButton>
        <AppIcon name="Plus"></AppIcon><span v-if="btnText">{{ btnText }}</span>
      </AppButton>
    </slot>
    <!-- 插槽透传 -->
    <template v-for="name in Object.keys($slots)" :key="name" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-upload>
  <!-- 有文件的情况下 -->
  <div v-else class="AppUpload-file">
    <template v-if="fileType == 'photo'">
      <AppImage :src="filedInfoPropsResult.url"></AppImage>
      <AppIcon name="View" class="ico-view" @click="previewFile"></AppIcon>
    </template>
    <template v-else-if="fileType == 'file'">
      <div class="file-doc">DOC</div>
      <AppIcon name="Download" class="ico-view" @click="downLoadFile"></AppIcon>
    </template>
    <AppIcon name="Delete" class="ico-del" @click="delFile"></AppIcon>
  </div>
</template>

<script setup lang="ts" name="AppUpload">
  import { ref, useAttrs, computed } from 'vue';
  import { genFileId } from 'element-plus';
  import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
  import { useCommon } from '@/compositions/common';
  import { utils } from '@/utils';
  import { useDictStore } from '@/stores/dict';
  import { api as viewerApi } from 'v-viewer';
  const props = defineProps({
    // 文件类型
    accept: { type: String, default: '' },
    // 文件类型:photo,video,file
    fileType: { type: String, default: 'photo' },
    // 快速文件类型:photo,video,file
    quickFileType: { type: String, default: '' }, // 对应字典的useDictStore的fileTypeList
    // 按钮文字
    btnText: { type: String, default: '' },
    // 组件属性
    uploadProps: { type: Object, default() { return {}; } },
    // 限制大小 默认2M
    limitSize: { type: Number, default: 2 },
    // 文件信息传递过来 fieldName:字段名，url:路径
    filedInfoProps: { type: Object, default() { return { fieldName: '', url: '' }; } },
  });
  const emit = defineEmits(['update:accept', 'on-fileInfo', 'on-del']);
  const { proxy } = useCommon();
  const uploadRef = ref<UploadInstance>(); //
  const attrs = useAttrs(); // attrs
  // 组件合并结果
  const uploadPropsResult = computed(() => {
    return utils.deepAssign(
      {
        action: '',
        limit: 1,
        listType: 'text',
        showFileList: false,
        drag: false,
      },
      attrs,
      props.uploadProps,
    );
  });
  // 限制类型
  const useDict = useDictStore();
  const fileTypeAccept = (useDict.fileTypeList || []).map((item: { accept: any; }) => item.accept).filter(Boolean);
  const filterType = (useDict.fileTypeList || []).filter((item: { type: string; }) => item.type === props.quickFileType).map((item: { accept: any; }) => item.accept).filter(Boolean);
  // 当前接收的文件类型
  const acceptResult = computed({
    get: () => filterType.toString() || props.accept || fileTypeAccept.toString(),
    set: (value) => emit('update:accept', value),
  });
  // 文件字段信息和路径
  const filedInfoPropsResult:Global.Info = computed(() => {
    return utils.deepAssign(
      fileInfoValue.value,
      props.filedInfoProps,
    );
  });

  // 上传文件之前
  const handleBeforeUpload = (file: UploadRawFile) => {
    return new Promise((resovle, reject) => {
      const { name, size } = file;
      console.log('size', size, size / 1024, size / 1024/ 1024);
      const suffix = (name.substring(name.lastIndexOf('.') + 1)).toLowerCase(), // 文件后缀 转为小写
            limit_size = props.limitSize || 2, // 限制大小
            size_bl = size / 1024 / 1024 < limit_size, // 大小是否
            type_bl = acceptResult.value.indexOf(suffix) > -1; // 类型是否
      if (!type_bl) {
        utils.messageAlert({ message: '上传的文件格式错误，请重新上传', type: 'warning' });
        reject();
        return false;
      } else if (!size_bl) {
        const text = props.limitSize >= 1 ? `${limit_size}MB` : `${limit_size * 1024}KB`;
        utils.messageAlert({ message: `上传的文件大小不能超过${text}哦`, type: 'warning' });
        reject();
        return false;
      } else {
        resovle(true);
      }
    });
  };
  // 覆盖默认的上传行为
  const handleUpload = (data: { file: any; }) => {
    let params = new FormData();
    return fileUpload(params, data.file);
  };
  // 文件上传
  const filePreviewList = ref<Global.Info[]>([]); // 存预览图集合
  const fileInfoValue = ref<Global.Info>({ url: '', name: '' }); // 文件字段路径信息
  const fileUpload = async (params: FormData, file: { uid: any; name: string}) => {
    const url = await getBase64(file);
    const name = file.name;
    try {
      // 文件上传接口(暂时没有)
      // console.log('params', params);
      // const res = await proxy.$requests.fileInfo.upload.request(params);
      // emit('on-fileInfo', res);
      const info = { url, name, fieldName: props.filedInfoProps.fieldName };
      console.log('info', info);
      fileInfoValue.value = { ...info };
      // console.log('url>>', url, url.length);
      emit('on-fileInfo', info, params, file);
      utils.messageAlert({ message: '上传成功' });
    } catch (error) {
      utils.messageAlert({ message: '上传失败，请联系管理员', type: 'warning' });
    }
    return false;
  };
  // 当超出限制limit时，执行的钩子函数
  const handleExceed: UploadProps['onExceed'] = async (files) => {
    uploadRef.value!.clearFiles();
    const file = files[0] as UploadRawFile; // 直接换掉第一张
    file.uid = genFileId();
    // 下一步操作...
    await handleBeforeUpload(file);
    await handleUpload({ file });
  };

  // 设置base64格式
  const getBase64 = (file) => {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      let imgResult:string | ArrayBuffer | null = '';
      reader.readAsDataURL(file);
      reader.onload = function() {
        imgResult = reader.result;
      };
      reader.onerror = function(error) {
        reject(error);
      };
      reader.onloadend = function() {
        resolve(imgResult);
      };
    });
  };
  // 预览文件
  function previewFile() {
    filePreviewList.value = [filedInfoPropsResult.value];
    const $viewer = viewerApi({
      options: {
        toolbar: true,
        url: 'url',
        initialViewIndex: 0,
      },
      images: filePreviewList.value,
    });
  }
  // 移除文件
  function delFile() {
    fileInfoValue.value = { url: '', name: '', fieldName: '' };
    emit('on-del', props.filedInfoProps.fieldName);
  }
  // 下载文件
  function downLoadFile() {
    proxy.$utils.downLoadFile(fileInfoValue.value.url, fileInfoValue.value.name || '文件');
  }
</script>

<style lang="scss" scoped>
  .AppUpload-file{ width: 73px; height: 73px; overflow: hidden;position: relative; border: 1px solid var(--el-border-color);
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    &:hover{
      &::after{ display: block; }
      .AppIcon-root{ display: block;}
    }
    &::after{ content: ''; width: 100%; height: 100%; background-color: rgba($color: #000000, $alpha: 0.3); position: absolute; left: 0; top: 0;
      display: none; transition: all .2s;}
    .AppIcon-root{ position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; color: #fff; font-size: 16px; cursor: pointer;
      display: none;
      &:hover{ opacity: 0.9;}
      &.ico-view{ left: 35%; }
      &.ico-del{ left: 65%; }
    }
    .file-doc{ width: 100%; height: 100%; background-color: #566ce5; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px;}
  }
</style>
