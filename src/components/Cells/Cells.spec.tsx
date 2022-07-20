import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '../../test/test-utils';
import Cells from './Cells';

describe('Cells', () => {
  it('should render', async () => {
    render(<Cells />);

    expect(screen.getByRole('heading', { name: /cells/i })).toBeInTheDocument();
  });

  it('can edit cell', async () => {
    render(<Cells />);
    const user = userEvent.setup();

    const inputValue = '1';
    const cell = screen.getByTestId('A0');
    await user.type(cell, inputValue);

    expect(cell).toHaveValue(inputValue);
  });
  describe('Formulas', () => {
    it('should return sum of numbers', async () => {
      render(<Cells />);
      const user = userEvent.setup();
      const formula = '=sum(1,2,3)';

      const cell = screen.getByTestId('A0');
      await user.type(cell, formula);
      fireEvent.blur(cell);

      expect(cell).toHaveValue('6');
    });

    it('should return sum of cells', async () => {
      render(<Cells />);
      const user = userEvent.setup();
      const formula = '=sum(A0:C0)';

      await user.type(screen.getByTestId('A0'), '1');
      await user.type(screen.getByTestId('B0'), '2');
      await user.type(screen.getByTestId('C0'), '3');

      const cell = screen.getByTestId('D0');
      await user.type(cell, formula);
      fireEvent.blur(cell);

      expect(cell).toHaveValue('6');
    });

    it('should show error on invalid formula', async () => {
      render(<Cells />);
      const user = userEvent.setup();
      const formula = '=sum(1';

      const cell = screen.getByTestId('A0');
      await user.type(cell, formula);
      fireEvent.blur(cell);

      expect(cell).toHaveValue('error');
    });
  });
});
