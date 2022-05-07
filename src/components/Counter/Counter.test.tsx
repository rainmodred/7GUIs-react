import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test/test-utils';
import Counter from './Counter';

describe('Counter', () => {
  it('should increment counter on click', async () => {
    render(<Counter />);
    const user = userEvent.setup();

    const counter = screen.getByText('0');
    const counterBtn = screen.getByRole('button', { name: 'count' });

    expect(counter).toBeInTheDocument();

    await user.click(counterBtn);

    expect(counter).toHaveTextContent('1');
  });
});
