import { render, screen } from '../../test/test-utils';
import CircleDrawer from './CircleDrawer';

describe('Circle Drawer', () => {
  it('should render', () => {
    render(<CircleDrawer />);

    expect(screen.getByText('Circle Drawer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
  });

  it.todo('should draw circle on click');
});
