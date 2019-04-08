export interface GuaranteeRegistrationLookupEntry {
    id: string;
    name: string;
    properties: {};
}

export interface GuaranteeRegistrationLookup {
    name: string;
    entries: GuaranteeRegistrationLookupEntry[];
}
