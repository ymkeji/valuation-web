import { Goods } from "@/api/interface/index";
import http from "@/api";

export const getGoodsByWordsApi = (params: { words: string }) => {
	return http.get<{ goods: Goods.ResGoods[] }>(`good/list/${params.words}`);
};
