export type EachArticleInformationType = {
    source: string;
    title: string;
    description: string;
    url: string;
    imageSrc: string;
    publishedAt: string;
    content: string;
    topic: string;
    author: string;
    whichApi: string
};

type BaseArticleType<T> = {
    topics: string[];
    authors: { [key: string]: number };
    sources: { [key: string]: number };
    articles: {
        [key: string]: {
            [key: string]: T[];
        };
    };
};

export type ArticlesFetchApiResponseType = BaseArticleType<EachArticleInformationType>;

export type HomePageStateType = BaseArticleType<EachArticleInformationType> & {
    isProcessing: boolean;
    isFailed: boolean;
    isSuccess: boolean;
    userFilterSelections: {
        [key: string]: string[];
    }
};

export type UpdateFilterEnumsType = "userFilterSelections" | "singleUpdate"

export type UpdatedUserPreferencesType = {
    type: UpdateFilterEnumsType;
    key: string,
    value: string | {
        [key: string]: string | string[]
    }
};