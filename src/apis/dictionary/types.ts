export interface DictInputDTO {
  id?: string;
  type: string;
  name: string;
  value?: string;
  description?: string;
  isEnable: boolean;
  sort?: number;
  createdAt?: string;
}
export interface QueryDictionaryDto {
  type: string;
  keyword: string;
  isEnable: boolean;
  page: number;
  pageSize: number;
}