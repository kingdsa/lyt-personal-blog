import request from "@/utils/axios";
import { DictInputDTO, QueryDictionaryDto } from './types';
const Dictionary = "/dictionary";
const Dictionary_Api = {
  /** 获取字典数据 */
  getDictionary(params: QueryDictionaryDto) {
    return request.get<ListDataTotalCount<DictInputDTO>>(`${Dictionary}/list`, {
      params,
    });
  },
  /** 创建字典数据 */
  createDictionary(data: DictInputDTO) {
    return request.post<string>(`${Dictionary}/create`, data);
  },
  /** 编辑字典数据 */
  updateDictionary(data: DictInputDTO) {
    return request.patch<string>(`${Dictionary}/${data.id}`, data);
  },
  /** 删除字典数据 */
  deleteDictionary(id: string) {
    return request.delete<string>(`${Dictionary}/${id}`);
  },
}
export default Dictionary_Api;