import { Formatter } from './formatter';

const addr = '0xe3D82337F79306712477b642EF59B75dD62eF109';
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
});
