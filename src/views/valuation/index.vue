<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElInputNumber, ElSelect, ElOption, ElPopconfirm } from "element-plus";
import { getGoodsByWordsApi } from "@/api/modules/goods";
import { Goods } from "@/api/interface";
import { CirclePlus, Download, Delete } from "@element-plus/icons-vue";

interface valuationRow {
	num: number;
	name: string;
	type: string;
	unit: string;
	amount: number;
	price: number;
	totalPrice: number;
	tariff: number;
	tax: number;
}
const dataSource = reactive<valuationRow[]>([]);
const addRow = () => {
	const newRow: valuationRow = {
		num: dataSource.length + 1,
		name: "请输入名称",
		type: "-",
		unit: "-",
		amount: 1.0,
		price: 0.0,
		totalPrice: 0.0,
		tariff: 0.0,
		tax: 0.0
	};
	dataSource.push(newRow);
};
const handleDelete = (index: number) => {
	dataSource.splice(index, 1);
	for (let i = index; i < dataSource.length; i++) {
		dataSource[i].num -= 1;
	}
};

const clearAllRow = () => {
	dataSource.splice(0, dataSource.length);
};

const options = ref<Goods.ResGoods[]>([]);
const loading = ref(false);

const remoteMethod = (query: string) => {
	if (query) {
		loading.value = true;
		getGoodsByWordsApi({ words: query }).then(res => {
			loading.value = false;
			if (res.data) {
				options.value = res.data.goods as Goods.ResGoods[];
			}
		});
	} else {
		options.value = [];
	}
};

const goodsSelected = (tableIndex: number, val: string) => {
	const goodIndex = options.value.findIndex(el => el.name == val);
	if (goodIndex !== -1) {
		dataSource[tableIndex].price = options.value[goodIndex].price;
		dataSource[tableIndex].unit = options.value[goodIndex].unit;
		dataSource[tableIndex].type = options.value[goodIndex].type;
		dataSource[tableIndex].totalPrice = options.value[goodIndex].price * dataSource[tableIndex].amount;
		dataSource[tableIndex].tariff = options.value[goodIndex].tariff;
		dataSource[tableIndex].tax = dataSource[tableIndex].totalPrice * dataSource[tableIndex].tariff;
	}
	options.value = [];
};

const amountChange = (tableIndex: number, val: number | undefined) => {
	if (typeof val === undefined) {
		return;
	}
	dataSource[tableIndex].totalPrice = dataSource[tableIndex].price * (val as number);
	dataSource[tableIndex].tax = dataSource[tableIndex].totalPrice * dataSource[tableIndex].tariff;
};
</script>

<template>
	<div class="table-box card">
		<div class="table-header">
			<div class="header-button-lf">
				<el-button type="primary" :icon="CirclePlus" @click="addRow">添加一行</el-button>
				<el-button type="success" :icon="Download" :disabled="!dataSource.length" @click="addRow">生成Excel</el-button>
			</div>
			<div class="header-button-ri">
				<el-popconfirm title="确认要清除全部数据吗?" @confirm="clearAllRow">
					<template #reference>
						<el-button type="danger" icon="Delete" plain :disabled="!dataSource.length">清除全部</el-button>
					</template>
				</el-popconfirm>
			</div>
		</div>

		<el-table :data="dataSource" highlight-current-row>
			<el-table-column prop="num" label="序号" />
			<el-table-column prop="name" label="货物(劳务名称)" width="180">
				<template #default="scope">
					<el-select
						v-model="scope.row.name"
						filterable
						remote
						:remote-method="remoteMethod"
						:loading="loading"
						@change="goodsSelected(scope.$index, $event)"
					>
						<el-option v-for="item in options" :key="item.id" :value="item.name" />
					</el-select>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="规格型号" />
			<el-table-column prop="unit" label="单位" />
			<el-table-column prop="amount" label="数量" min-width="120">
				<template #default="scope">
					<el-input-number
						@change="amountChange(scope.$index, $event)"
						v-model="scope.row.amount"
						:style="{ maxWidth: '90px' }"
						size="small"
						:precision="1"
						:step="1.0"
						:min="0.1"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="单价" />
			<el-table-column prop="totalPrice" label="金额" />
			<el-table-column prop="tariff" label="税率" />
			<el-table-column prop="tax" label="税额" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button :icon="Delete" @click="handleDelete(scope.$index)" circle />
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
