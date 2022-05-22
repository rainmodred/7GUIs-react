import TemperatureConverter from './TemperatureConverter';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test/test-utils';

describe('Temperature Converter', () => {
  it('should convert temperature to fahrenheit', async () => {
    render(<TemperatureConverter />);
    const user = userEvent.setup();

    const temperature = '10';
    const convertedTemperature = 50;
    const celciusInput = screen.getByLabelText('Celcius');
    const fahrenheitInput = screen.getByLabelText('Fahrenheit');

    await user.type(celciusInput, temperature);

    expect(celciusInput).toHaveValue(Number(temperature));
    expect(fahrenheitInput).toHaveValue(convertedTemperature);
  });

  it('should convert temperature to celcius', async () => {
    render(<TemperatureConverter />);
    const user = userEvent.setup();

    const temperature = '50';
    const convertedTemperature = 10;
    const celciusInput = screen.getByLabelText('Celcius');
    const fahrenheitInput = screen.getByLabelText('Fahrenheit');

    await user.type(fahrenheitInput, temperature);

    expect(fahrenheitInput).toHaveValue(Number(temperature));
    expect(celciusInput).toHaveValue(Number(convertedTemperature));
  });
});
