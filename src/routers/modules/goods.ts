import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";
const goodsRouter: Array<RouteRecordRaw> = [
	{
		path: "/goods",
		component: Layout,
		redirect: "/goods/index",
		meta: {
			title: "商品管理"
		},
		children: [
			{
				path: "/goods/index",
				name: "goods",
				component: () => import("@/views/goods/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: false,
					title: "商品管理",
					key: "goods"
				}
			}
		]
	}
];

export default goodsRouter;
