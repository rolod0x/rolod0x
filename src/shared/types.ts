export type Label = string;
export type Address = string;
export type Comment = string;
export type AddressType = 'EVM' | 'Solana';

export interface AddressLabel {
  address: Address;
  addressType: AddressType;
  label: Label;
}

export interface LabelComment {
  label: Label;
  comment?: Comment;
}

export type LabelMap = Map<Address, LabelComment>;

export interface AddressLabelComment extends LabelComment {
  address: Address;
  addressType: AddressType;
}

export type ParsedEntries = AddressLabelComment[];
