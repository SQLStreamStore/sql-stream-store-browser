export interface HalLink {
    readonly href: string;
    readonly title?: string;
    readonly type?: string;
    readonly templated?: boolean;
    readonly deprecation?: string;
    readonly hreflang?: string;
    readonly name?: string;
}

export interface HalLinks {
    [rel: string]: HalLink[];
}

