import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '../../test/test-utils';
import { act } from 'react-dom/test-utils';
import Timer from './Timer';

describe('Timer', () => {
  afterAll(() => {
    jest.useRealTimers();
  });
  it('should render', () => {
    render(<Timer />);

    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByLabelText(/elapsed time/i)).toHaveValue(0);
    expect(screen.getByText('0.0s')).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toHaveValue('30000');

    expect(
      screen.getByRole('button', { name: /reset timer/i }),
    ).toBeInTheDocument();
  });

  it('should start timer', async () => {
    jest.useFakeTimers();
    render(<Timer />);

    act(() => {
      jest.advanceTimersByTime(15000);
    });

    expect(screen.getByLabelText(/elapsed time/i)).toHaveValue(50);
    expect(screen.getByText('15.0s')).toBeInTheDocument();
  });

  it('should change duration', () => {
    render(<Timer />);

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, {
      target: { value: '40000' },
    });

    expect(screen.getByText('0.0s')).toBeInTheDocument();
    expect(durationInput).toHaveValue('40000');
  });

  it('should stop if time = duration', () => {
    jest.useFakeTimers();
    render(<Timer />);

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(screen.getByLabelText(/elapsed time/i)).toHaveValue(100);
    expect(screen.getByText('30.0s')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(screen.getByLabelText(/elapsed time/i)).toHaveValue(100);
    expect(screen.getByText('30.0s')).toBeInTheDocument();
  });

  it('should reset timer', async () => {
    jest.useFakeTimers();
    render(<Timer />);
    const user = userEvent.setup({ delay: null });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await user.click(
      screen.getByRole('button', {
        name: /reset timer/i,
      }),
    );

    expect(screen.getByLabelText(/elapsed time/i)).toHaveValue(0);
    expect(screen.getByText('0.0s')).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toHaveValue('30000');
  });

  it('should continue if duration > time', () => {
    jest.useFakeTimers();
    render(<Timer />);

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(screen.getByLabelText(/elapsed time/i)).toHaveValue(100);
    expect(screen.getByText('30.0s')).toBeInTheDocument();

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, {
      target: { value: '60000' },
    });

    act(() => {
      jest.advanceTimersByTime(15000);
    });

    expect(screen.getByLabelText(/elapsed time/i)).toHaveValue(75);
    expect(screen.getByText('45.0s')).toBeInTheDocument();
  });
});
