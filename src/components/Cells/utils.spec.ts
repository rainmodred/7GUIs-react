import { getCellsInRange, validateFormula, toKey } from './utils';

describe('Cells utils', () => {
  it('toKey should return cell key', () => {
    expect(toKey(0, 0)).toBe('A0');
    expect(toKey(99, 24)).toBe('Z99');
  });

  it('should validate formula', () => {
    expect(validateFormula('=sum(1,2,A1,B2:D2)')).toEqual({
      fn: expect.any(Function),
      numbers: [1, 2],
      cellLabels: ['A1', 'B2', 'C2', 'D2'],
    });
  });

  it('should return cells between range', () => {
    expect(getCellsInRange('A0:D0')).toEqual(['A0', 'B0', 'C0', 'D0']);
    expect(getCellsInRange('A0:A3')).toEqual(['A0', 'A1', 'A2', 'A3']);
    expect(getCellsInRange('A0:B3')).toEqual([
      'A0',
      'A1',
      'A2',
      'A3',
      'B0',
      'B1',
      'B2',
      'B3',
    ]);
    expect(getCellsInRange('B3:A0')).toEqual([
      'A0',
      'A1',
      'A2',
      'A3',
      'B0',
      'B1',
      'B2',
      'B3',
    ]);
  });
});
