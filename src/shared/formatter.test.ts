import { Formatter } from './formatter';

const addr = '0xe3D82337F79306712477b642EF59B75dD62eF109';
const solanaAddr = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
const label = 'my address label';

describe('Formatter', () => {
  it('formats a label with no changes', () => {
    const formatter = new Formatter('%n');
    expect(formatter.format(label, addr)).toEqual(label);
  });

  it('formats a label with some parentheses', () => {
    const formatter = new Formatter('[%n]');
    expect(formatter.format(label, addr)).toEqual('[' + label + ']');
  });

  it('formats a label with leading digits', () => {
    const formatter = new Formatter('<%n | 0x%6l>');
    expect(formatter.format(label, addr)).toEqual(`<${label} | 0xe3D823>`);
  });

  it('formats a label with trailing digits', () => {
    const formatter = new Formatter('%n | %4r');
    expect(formatter.format(label, addr)).toEqual(`${label} | F109`);
  });

  it('formats a label with leading and trailing digits', () => {
    const formatter = new Formatter('0x%4l...%n...%4r');
    expect(formatter.format(label, addr)).toEqual(`0xe3D8...${label}...F109`);
  });

  it('formats a label with a full address', () => {
    const formatter = new Formatter('%n (%a)');
    expect(formatter.format(label, addr)).toEqual(`${label} (${addr})`);
  });

  it('formats a label combining internal digits with other formats', () => {
    // Test the format used by Kraken
    const formatter = new Formatter('0x%2l %2i4 ... %-8i4 %4r');
    expect(formatter.format(label, addr)).toEqual('0xe3 D823 ... D62e F109');
  });

  it('formats a label with the address prefix', () => {
    const formatter = new Formatter('%n (%p%4l…%4r)');
    expect(formatter.format(label, addr)).toEqual(`${label} (0xe3D8…F109)`);
  });

  it('formats a label with the empty prefix of a Solana address', () => {
    const formatter = new Formatter('%n (%p%4l…%4r)');
    expect(formatter.format(label, solanaAddr)).toEqual(`${label} (DYw8…NSKK)`);
  });

  it('formats a label with internal digits of a Solana address', () => {
    const formatter = new Formatter('%2i4 ... %-8i4');
    expect(formatter.format(label, solanaAddr)).toEqual('w8jC ... mG5C');
  });

  it.each([addr, solanaAddr])('preserves %%p in a label-only format for %s', address => {
    const formatter = new Formatter('%n');
    expect(formatter.format('100%profit', address)).toEqual('100%profit');
  });

  it.each([
    [addr, '0xe3D8…F109'],
    [solanaAddr, 'DYw8…NSKK'],
  ])('preserves %%p in a label while formatting the prefix for %s', (address, abbreviated) => {
    const formatter = new Formatter('%n (%p%4l…%4r)');
    expect(formatter.format('100%profit', address)).toEqual(`100%profit (${abbreviated})`);
  });
});
