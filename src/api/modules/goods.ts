import { Goods } from "@/api/interface/index";
import http from "@/api";

export const getGoodsByWordsApi = (params: { words: string }) => {
	return http.get<Goods.ResGoods[]>(`api/good/list/${params.words}`);
};
