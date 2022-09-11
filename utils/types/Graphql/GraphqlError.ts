export type GraphqlError = {
    extensions: {
        code: string;
        exception: {
            name: string;
            message: string;
            stacktrace: string[];
        }
    };

    locations: Array<{
        column: number;
        line: number;
    }>;

    message: string;

    path: string[];
}