export type Label = string;
export type Address = string;

export interface LabelComment {
  label: Label;
  comment?: string;
}

export type LabelMap = Map<Address, LabelComment>;

export interface AddressLabelComment extends LabelComment {
  address: Address;
}

export type ParsedEntries = AddressLabelComment[];

export interface Counter {
  count: number;
}
