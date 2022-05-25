import FlightBooker from './FlightBooker';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '../../test/test-utils';

describe('FlightBooker', () => {
  it('should render', async () => {
    render(<FlightBooker />);

    expect(screen.getByText('Flight Booker')).toBeInTheDocument();
    expect(screen.getAllByRole('option').length).toBe(2);
    expect(
      (
        screen.getByRole('option', {
          name: 'one-way flight',
        }) as HTMLOptionElement
      ).selected,
    ).toBeTruthy();
    expect(
      (
        screen.getByRole('option', {
          name: 'return flight',
        }) as HTMLOptionElement
      ).selected,
    ).toBeFalsy();

    expect(screen.getByLabelText(/departure date/i)).toBeEnabled();
    expect(screen.getByLabelText(/return date/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();
  });

  it('should enable return date input', async () => {
    render(<FlightBooker />);
    const user = userEvent.setup();

    await user.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', {
        name: 'return flight',
      }),
    );

    expect(screen.getByLabelText(/departure date/i)).toBeEnabled();
    expect(screen.getByLabelText(/return date/i)).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Book' })).toBeInTheDocument();
  });

  it('should disable book button', async () => {
    render(<FlightBooker />);
    const user = userEvent.setup();

    await user.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', {
        name: 'return flight',
      }),
    );

    const departureDateInput = screen.getByLabelText(/departure date/i);
    const returnDateInput = screen.getByLabelText(/return date/i);

    await user.clear(departureDateInput);
    await user.clear(returnDateInput);

    await user.type(departureDateInput, '2021-01-02');
    await user.type(returnDateInput, '2021-01-01');

    expect(screen.getByRole('button', { name: 'Book' })).toBeDisabled();
  });
});
