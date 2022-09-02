import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";
// 错误页面模块
const valuationRouter: Array<RouteRecordRaw> = [
	{
		path: "/valuation",
		component: Layout,
		redirect: "/valuation/index",
		meta: {
			title: "收费计价"
		},
		children: [
			{
				path: "/valuation/index",
				name: "valuation",
				component: () => import("@/views/valuation/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: false,
					title: "收费计价",
					key: "valuation"
				}
			}
		]
	}
];

export default valuationRouter;
