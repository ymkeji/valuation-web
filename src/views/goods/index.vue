<template>
	<div class="table-box">
		<ProTable ref="proTable" :columns="columns" :requestApi="getUserList" :initParam="initParam" :dataCallback="dataCallback">
			<!-- 表格 header 按钮 -->
			<template #tableHeader="scope">
				<el-button type="primary" :icon="CirclePlus" @click="downloadFile">新增用户</el-button>
				<el-button type="primary" :icon="Upload" plain @click="downloadFile">批量添加用户</el-button>
				<el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
				<el-button type="primary" :icon="Download" plain @click="importExcel">导入数据</el-button>
				<el-button
					type="danger"
					:icon="Delete"
					plain
					:disabled="!scope.isSelected"
					@click="downloadFile"
					v-if="BUTTONS.batchDelete"
				>
					批量删除用户
				</el-button>
			</template>
			<!-- Expand -->
			<template #expand="scope">
				{{ scope.row }}
			</template>
			<!-- 用户状态 slot -->
			<template #status="scope">
				<!-- 如果插槽的值为 el-switch，第一次加载会默认触发 switch 的 @change 方法，所有在外层包一个盒子，点击触发盒子 click 方法（暂时只能这样解决） -->
				<div @click="downloadFile" v-if="BUTTONS.status">
					<el-switch
						:value="scope.row.status"
						:active-text="scope.row.status === 1 ? '启用' : '禁用'"
						:active-value="1"
						:inactive-value="0"
					/>
				</div>
				<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" v-else>
					{{ scope.row.status === 1 ? "启用" : "禁用" }}
				</el-tag>
			</template>
			<!-- 表格操作 -->
			<template #operation>
				<el-button type="primary" link :icon="Delete">删除</el-button>
			</template>
		</ProTable>
		<el-dialog v-model="importExcelVisible" title="导入数据">
			<el-upload action="#" drag :limit="1" :http-request="uploadExcel">
				<el-icon class="el-icon--upload"><upload-filled /></el-icon>
				<div class="el-upload__text">文件拖拽到此处以进行上传或<em>点击上传</em></div>
				<template #tip>
					<div class="el-upload__tip">xlsx/xlx files with a size less than 500kb</div>
				</template>
			</el-upload>
		</el-dialog>
	</div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import type { UploadRequestOptions } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import { CirclePlus, Delete, Download, Upload, UploadFilled } from "@element-plus/icons-vue";
import { getUserList, exportUserInfo, getUserStatus, getUserGender } from "@/api/modules/user";
const importExcelVisible = ref(false);
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
	type: 1
});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
	return {
		datalist: data.datalist,
		total: data.total,
		pageNum: data.pageNum,
		pageSize: data.pageSize
	};
};

// 页面按钮权限
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 80, fixed: "left" },
	{ type: "index", label: "#", width: 80 },
	{ type: "expand", label: "Expand", width: 100 },
	{ prop: "username", label: "用户姓名", width: 130, search: true },
	// 😄 enum 可以直接是数组对象，也可以是请求方法(proTable 内部会执行获取 enum 的这个方法)，下面用户状态也同理
	// 😄 enum 为请求方法时，后台返回的数组对象 key 值不是 label 和 value 的情况，可以在 searchProps 中指定 label 和 value 的 key 值
	{
		prop: "gender",
		label: "性别",
		width: 120,
		sortable: true,
		search: true,
		searchType: "select",
		enum: getUserGender,
		searchProps: { label: "genderLabel", value: "genderValue" }
	},
	{ prop: "idCard", label: "身份证号", search: true },
	{ prop: "email", label: "邮箱", search: true },
	{ prop: "address", label: "居住地址", search: true },
	{
		prop: "status",
		label: "用户状态",
		sortable: true,
		search: true,
		searchType: "select",
		enum: getUserStatus,
		searchProps: { label: "userLabel", value: "userStatus" }
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 200,
		sortable: true,
		search: true,
		searchType: "datetimerange",
		searchProps: {
			disabledDate: (time: Date) => time.getTime() < Date.now() - 8.64e7
		},
		searchInitParam: ["2022-08-30 00:00:00", "2022-08-20 23:59:59"]
	},
	{ prop: "operation", label: "操作", width: 120, fixed: "right" }
];

// 导出用户列表
const downloadFile = async () => {
	useDownload(exportUserInfo, "用户列表", proTable.value.searchParam);
};

const importExcel = () => {
	importExcelVisible.value = true;
};

const uploadExcel = async (options: UploadRequestOptions) => {
	console.log(options);
};
</script>
