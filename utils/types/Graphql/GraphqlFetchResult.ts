import { GraphqlError } from "./GraphqlError";

export type GraphqlFetchResult = {
    data: any;
    errors: GraphqlError[];
}