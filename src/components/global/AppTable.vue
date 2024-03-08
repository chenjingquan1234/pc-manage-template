<!-- table 表格
  https://element-plus.gitee.io/zh-CN/component/tooltip.html
  1.已配置属性的同名透传，属性命名冲突时可通过 tableProps 对象传进来
  2.table-column,hasSelection：通过tableInfo表格信息传递进来
  3.修改表头通过插槽slotHeader或者render-header jsx
  4.显示内容层，genre类型传递，带$号为特殊便于区分(文本:text,序号:$ordinal,日期:$date,图片:$photo,头像:$avatar,字典:$dict,文字提示:$tooltip,按钮操作:$action,$tag:标签,$switch:开关,插槽:$slot,
    其他后续根据业务增删改),关于:$dict字典类型,也可以用request.js那边处理完的值; 关于$tag:加多一个propName，也可以用request.js那边处理完的值;
  5.如需用到table组件的方法，下方defineExpose暴露出来，使用方式通过ref, 如AppTable.value.clearSelection
  6.事件：组件自身：勾选：selection-change；另外自定义：点击：handleClick ,切换：handleSwitch
-->
<template>
  <el-table
    ref="AppTableRef"
    v-scrollbar.deep="{ childSelectors: '.el-table__body-wrapper', color: '#3d7fff', hoverColor: '#508cff' }"
    v-loading="loading"
    class="AppTable-root"
    v-bind="tablePropsResult"
    :class="!(tablePropsResult.data || []).length ? 'empty-data' : ''"
    @selection-change="$emit('selectionChange', $event)"
    @select="$emit('select', $event)"
    @select-all="$emit('selectAll', $event)"
    @expand-change="$emit('expandChange', $event)"
  >
    <el-table-column v-if="tableInfo.hasExpand" type="expand">
      <template #default="{ $index, row }">
        <div class="expand-content">
          <slot name="hasExpand" :row="row"></slot>
        </div>
      </template>
    </el-table-column>
    <el-table-column v-if="tableInfo.hasSelection" type="selection" minWidth="40" :selectable="selectable"></el-table-column>
    <el-table-column
      v-for="item in tableColumnsResult"
      :key="item.key"
      v-bind="item"
    >
      <template v-if="item.slotHeader" #header>
        <template v-if="item.slotHeader.type == 'tooltip'">
          <span>{{ item.label }}</span>
          <AppTooltip :tooltipProps="item.slotHeader.attrs" :extraProps="item.slotHeader.extraAttrs" :content="item.slotHeader.content"></AppTooltip>
        </template>
        <template v-else>
          <span>{{ item.label }}</span>
        </template>
      </template>
      <template #default="{ $index, row }">
        <template v-if="item.genre == '$ordinal'">
          <span>{{ utils.getOrdinalKey($index, pageInfo.pageNum, pageInfo.pageSize) }}</span>
        </template>
        <template v-else-if="item.genre == '$date'">
          <span>{{ utils.getDateStr(row[item.prop]) }}</span>
        </template>
        <template v-else-if="item.genre == '$photo'">
          <img v-viewer :src="row[item.prop]" :style="item.styles">
        </template>
        <template v-else-if="item.genre == '$avatar'">
          <AppAvatar :src="row[item.prop]" :avatarProps="item.attrs"></AppAvatar>
        </template>
        <template v-else-if="item.genre == '$dict'">
          <span v-if="item.dictName !== 'whetherTypeList'" :style="item.styles" :class="`span_${item.prop}_${row[item.prop]}`">{{ dictResult(row[item.prop], item.dictName) }}</span>
          <template v-else>
            <span :style="{ color: row[item.prop] == 1 ? '#1F71FF' : '#F04234' }">{{ dictResult(row[item.prop], item.dictName) }}</span>
          </template>
        </template>
        <template v-else-if="item.genre == '$callback'">
          <span>{{ item.callback(row) || '-' }}</span>
        </template>
        <template v-else-if="item.genre == '$userTags'">
          <template v-if="row[item.prop] && row[item.prop].length">
            <AppTag
              style="marginRight:4px"
              v-for="(t, i) in (row[item.prop] || [])"
              :key="i"
              :type="item.type || ''"
              :tagProps="item.attrs"
            >{{ t || '-' }}</AppTag
          >
          </template>
         <span v-else>-</span>
        </template>
        <template v-else-if="item.genre == '$textTag'">
          <template v-if="item.callback(row)">
            <AppTag
              :type="item.callback(row)?.type"
              :tagProps="item.attrs"
            >{{ item.callback(row)?.name || '-' }}</AppTag
          >
          </template>
         <span v-else>-</span>
        </template>
        <template v-else-if="item.genre == '$agentStatus'">
          <AppTag
            :type="utils.findIdItem(useDict.agentModeList, row[item.prop])?.type"
            :tagProps="item.attrs"
            >{{ utils.findIdItem(useDict.agentModeList, row[item.prop])?.name || '-' }}</AppTag
          >
        </template>
        <template v-else-if="item.genre == '$tag'">
          <AppTag
            v-if="utils.findIdItem(useDict[item.dictName], row[item.prop])?.name"
            :type="utils.findIdItem(useDict[item.dictName], row[item.prop])?.type"
            :tagProps="item.attrs"
            >{{ utils.findIdItem(useDict[item.dictName], row[item.prop])?.name || '-' }}</AppTag
          ><span v-else>-</span>
        </template>
        <template v-else-if="item.genre == '$status'">
          <AppTag :type="row[item.prop] ? '' : 'danger'" :tagProps="item.attrs">{{ row[item.prop] ? '正常' : '停用' }}</AppTag>
        </template>
        <template v-else-if="item.genre == '$show'">
          <AppTag :type="row[item.prop] ? '' : 'danger'" :tagProps="item.attrs">{{ row[item.prop] ? '显示' : '隐藏' }}</AppTag>
        </template>
        <template v-else-if="item.genre == '$online'">
          <AppTag :type="row[item.prop] == 'online' ? 'success' : 'danger'" :tagProps="item.attrs">{{ row[item.prop] == 'online' ? '在线中' : '已下线' }}</AppTag>
        </template>
        <template v-else-if="item.genre == '$tooltip'">
          <AppTooltip :content="row[item.prop]" :tooltipProps="item.attrs"></AppTooltip>
        </template>
        <template v-else-if="item.genre == '$switch'">
          <el-switch v-model="row[item.propName]" @change="$emit('handleSwitch', row, $event)"></el-switch>
        </template>
        <template v-else-if="item.genre == '$icon'">
          <AppIcon v-if="row[item.prop]" :name="row[item.prop]"></AppIcon>
          <span v-else>-</span>
        </template>
        <template v-else-if="item.genre === '$sensitive'">
          <div class="ti-word">
            <template v-if="!item.sensitive">{{ item[item.prop] || '-' }}</template>
            <template v-else-if="item.sensitive.name == 'idNum'">{{ utils.sensitiveIdentityCard(row[item.prop]) || '-'  }}</template>
            <template v-else-if="item.sensitive.name == 'phoneNum'">{{ utils.sensitiveMobile(row[item.prop]) || '-'  }}</template>
          </div>
        </template>
        <template v-else-if="item.genre == '$slot'">
          <slot :name="[item.prop]" :row="row" :index="$index"></slot>
        </template>
        <template v-else-if="item.genre == '$action'">
          <AppButton v-for="v in btnResult(item, row)" :key="v.id" link :class="`btn-${v.way}`" :style="v.styles" :buttonProps="btnAttrResult(v, row)" @click="$emit('handleClick', row, v, $index)">{{ v.name }}</AppButton>
          <slot name="btn-extra" :row="row"></slot>
        </template>
         <!-- 按钮 -->
         <template v-else-if="item.genre == '$action2'">
          <el-dropdown trigger="hover" width="100px">
            <AppButton style="outline: none; color: #1f71ff" link
              >{{item.btnText || '操作'}}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </AppButton>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="v in btnResult(item, row)"  :key="v.id" @click="$emit('handleClick', row, v, $index)">
                  <AppButton
                    link
                    :class="`btn-${v.way}`"
                    :style="v.styles"
                    :buttonProps="btnAttrResult(v, row)"
                    
                    >{{ btnNameResult(v, row)}}</AppButton
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <slot name="btn-extra" :row="row"></slot>
        </template>
        <template v-else>
          <span :style="item.styles">{{ row[item.prop] || isNumber(row[item.prop]) }}</span>
        </template>
      </template>
    </el-table-column>
    <template #empty>
      <slot>
        <AppEmpty v-if="!loading && !tableProps?.data.length"></AppEmpty>
        <p v-else></p>
      </slot>
    </template>
  </el-table>
</template>
<script setup lang="ts" name="AppTable">
  import { ref, computed, useAttrs } from 'vue';
  import utils from '@/utils';
  import loadingAttrs from '@/compositions/loading-attrs';
  import { useDictStore } from '@/stores/dict';
  import { isFunction } from '@/utils/is';
  const useDict = useDictStore(); // 字典信息
  const props = defineProps({
    // 组件属性
    tableProps: { type: Object, default() { return {}; } },
    // 表格信息
    tableInfo: { type: Object, default() { return {}; } },
    // 页码页数
    pageInfo: { type: Object, default() { return { pageNum: 1, pageSize: 10 }; } },
    // loading状态
    loading: { type: Boolean, default() { return false; } },
  });
  // 组件暴露自己的属性
  const AppTableRef = ref<any>(null);
  defineExpose({
    // Table Methods https://element-plus.gitee.io/zh-CN/component/table.html#table-events
    get clearSelection() { return AppTableRef.value!.clearSelection(); },
    get getSelectionRows() { return AppTableRef.value!.getSelectionRows(); },
    // get toggleRowSelection() { return AppTableRef.value!.toggleRowSelection(); },
    get toggleAllSelection() { return AppTableRef.value!.toggleAllSelection(); },
    // get toggleRowExpansion() { return AppTableRef.value!.toggleRowExpansion(); },
    // get setCurrentRow() { return AppTableRef.value!.setCurrentRow(); },
    // get clearSort() { return AppTableRef.value!.clearSort(); },
    // get clearFilter() { return AppTableRef.value!.clearFilter(); },
    get doLayout() { return AppTableRef.value!.doLayout(); },
    // get sort() { return AppTableRef.value!.sort(); },
    // get scrollTo() { return AppTableRef.value!.scrollTo(); },
    get setScrollTop() { return AppTableRef.value!.setScrollTop(); },
    get setScrollLeft() { return AppTableRef.value!.setScrollLeft(); },
    toggleRowSelection,
    get store() { return AppTableRef.value!.store; },
  });
  // 用于多选表格切换勾选
  function toggleRowSelection(row, selected) {
    AppTableRef.value!.toggleRowSelection(row, selected);
  }
  // 勾选列
  function selectable(row, index) {
    return !row.disabled;
  }
  const attrs = useAttrs(); // attrs
  // 组件属性合并结果
  const tablePropsResult = computed(() => {
    return utils.deepAssign(
      {
        stripe: false,
        height: 'auto',
        data: [],
        emptyText: '暂无相关数据',
      },
      attrs,
      props.tableProps,
      loadingAttrs, // loading的属性也合并
    );
  });
  // 表格项结果
  const tableColumnsResult = computed(() => {
    return (props.tableInfo.columns || []).filter(item => item.show !== false);
  });
  // 按钮组件属性结果
  const btnAttrResult = computed(() => {
    return (v, row) => {
      const mergeAttr = {}
      // 如果有属性是函数，则把row扔进去处理结果
      if(v.attrs) {
        Object.keys(v.attrs).map(key => {
          if(isFunction(v.attrs[key])) {
            mergeAttr[key] = v.attrs[key]?.(row)
          } else {
            mergeAttr[key] = v.attrs[key]
          }
          
        })
      }
      return utils.deepAssign(
        {
          type: 'primary',
          size: 'small',
        },
        mergeAttr,
      );
    };
  });
  // 按钮名称结果
  const btnNameResult = computed(() => {
    return (v,row) => {
      if(isFunction(v.name)) return v.name?.(row)
      return v.name
    };
  });
  // 字典结果
  const dictResult = computed(() => {
    return (prop, dictName) => {
      const findItem = (useDict[dictName] || []).find((item) => item.id == prop) || {};
      return findItem?.name || '-';
    };
  });
  // 是否数字
  const isNumber = computed(() => {
    return (value) => {
      return typeof value === 'number' && !isNaN(value) ? value : '-';
    };
  });
  // 按钮结果
  const btnResult = computed(() => {
    return (item, row) => {
      // disabled禁止不显示 openDisabled
      const list = (item.btnList || []).filter((v:{ openDisabled, disabled: { prop, value}}) => {
        const openDisabled = v.openDisabled;
        const { prop, value } = v?.disabled || { prop: '', value: [] };
        if (!openDisabled) {
          return true;
        }
        return !(value || []).includes(row[prop]);
      });
      return list;
    };
  });
  // 文本类型截取内容省略号
  function truncatedContent(text, maxLength = 30) {
    return (text || '').length >= maxLength ? `${text.slice(0, maxLength)}...` : text;
  }
</script>
<style scoped lang="scss">
  .AppTable-root :deep(){

    .el-table__header-wrapper{ border-top-left-radius:9px; border-top-right-radius:9px;}
    .el-table__header{ background:#1D2132;
      *{ color: #646670; font-weight: normal;}
      th{ background: #F4F5F7;}
    }
    .el-table__inner-wrapper{ height:100% !important;}
    th,td{text-align: center;}
    .el-button{margin: 2px; font-size: 14px;}
    .el-table__fixed-right-patch{ background: none;border:none;}
    .hover-row{
      .el-table__cell{ background-color:#F4F5F7;}
    }
    .AppEmpty-root{ padding-bottom: 10px; }
  }
  .AppTable-root{
    &.empty-data{ min-height: 300px; }
  }
</style>
