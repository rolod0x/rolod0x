export interface AddressData {
    label: string;
    comment?: string;
}

export type LabelMap = Record<string, AddressData>;
