import {GetStoryResponseItem} from "./GetStoryResponseItem";

export interface GetStoryResponse {
    entities: GetStoryResponseItem[];
    totalCount: number;
}