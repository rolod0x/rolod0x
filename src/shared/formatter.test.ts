import { Formatter } from './formatter';

const label = 'my address label';

describe('Formatter', () => {
  const testCases = [
    { name: 'evm address with 0x prefix', addr: '0xe3D82337F79306712477b642EF59B75dD62eF109' },
    { name: 'evm address without 0x prefix', addr: 'e3D82337F79306712477b642EF59B75dD62eF109' },
  ];

  testCases.forEach(({ name, addr }) => {
    describe(name, () => {
      it('formats a label with no changes', () => {
        const formatter = new Formatter('%n');
        expect(formatter.format(label, addr, 'EVM')).toEqual(label);
      });

      it('formats a label with some parentheses', () => {
        const formatter = new Formatter('[%n]');
        expect(formatter.format(label, addr, 'EVM')).toEqual('[' + label + ']');
      });

      it('formats a label with leading digits', () => {
        const formatter = new Formatter('<%n | %6l>');
        const expected = addr.startsWith('0x') ? `<${label} | 0xe3D823>` : `<${label} | e3D823>`;
        expect(formatter.format(label, addr, 'EVM')).toEqual(expected);
      });

      it('formats a label with trailing digits', () => {
        const formatter = new Formatter('%n | %4r');
        expect(formatter.format(label, addr, 'EVM')).toEqual(`${label} | F109`);
      });

      it('formats a label with leading and trailing digits', () => {
        const formatter = new Formatter('%4l...%n...%4r');
        const prefix = addr.startsWith('0x') ? '0xe3D8' : 'e3D8';
        expect(formatter.format(label, addr, 'EVM')).toEqual(`${prefix}...${label}...F109`);
      });

      it('formats a label with a full address', () => {
        const formatter = new Formatter('%n (%a)');
        expect(formatter.format(label, addr, 'EVM')).toEqual(`${label} (${addr})`);
      });
    });

    it('formats a label combining internal digits with other formats', () => {
      // Test the format used by Kraken
      const formatter = new Formatter('%2l %2i4 ... %-8i4 %4r');
      const prefix = addr.startsWith('0x') ? '0xe3' : 'e3';
      expect(formatter.format(label, addr, 'EVM')).toEqual(`${prefix} D823 ... D62e F109`);
    });
  });
});
