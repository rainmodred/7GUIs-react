import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test/test-utils';

import CRUD from './CRUD';

const users = [
  {
    name: 'Jon',
    surname: 'Snow',
  },
  {
    name: 'Robb',
    surname: 'Stark',
  },
];

describe('CRUD', () => {
  it('should render', () => {
    render(<CRUD />);

    expect(screen.getByText('CRUD')).toBeInTheDocument();
    expect(screen.getByLabelText(/filter prefix:/i)).toHaveValue('');
    expect(screen.getByLabelText(/^name:/i)).toHaveValue('');
    expect(screen.getByLabelText(/surname:/i)).toHaveValue('');

    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should create new user', async () => {
    render(<CRUD />);
    const user = userEvent.setup();
    const [JON] = users;

    await user.type(screen.getByLabelText(/^name:/i), JON.name);
    await user.type(screen.getByLabelText(/surname/i), JON.surname);

    expect(screen.getByLabelText(/^name:/i)).toHaveValue(JON.name);
    expect(screen.getByLabelText(/surname:/i)).toHaveValue(JON.surname);

    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(
      screen.getByRole('option', { name: 'Snow, Jon' }),
    ).toBeInTheDocument();
  });

  it('should not create new user with empty fields', async () => {
    render(<CRUD />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('should update selected user', async () => {
    render(<CRUD />);
    const user = userEvent.setup();
    const [JON, ROBB] = users;

    await user.type(screen.getByLabelText(/^name:/i), JON.name);
    await user.type(screen.getByLabelText(/surname/i), JON.surname);
    await user.click(screen.getByRole('button', { name: /create/i }));

    await user.selectOptions(
      screen.getByRole('listbox'),
      screen.getByRole('option', {
        name: 'Snow, Jon',
      }),
    );

    await user.type(screen.getByLabelText(/^name:/i), ROBB.name);
    await user.type(screen.getByLabelText(/surname/i), ROBB.surname);

    await user.click(screen.getByRole('button', { name: /update/i }));

    expect(
      screen.getByRole('option', { name: 'Stark, Robb' }),
    ).toBeInTheDocument();
  });

  it('should delete user', async () => {
    render(<CRUD />);
    const user = userEvent.setup();
    const [JON, ROBB] = users;

    await user.type(screen.getByLabelText(/^name:/i), JON.name);
    await user.type(screen.getByLabelText(/surname/i), JON.surname);
    await user.click(screen.getByRole('button', { name: /create/i }));

    await user.type(screen.getByLabelText(/^name:/i), ROBB.name);
    await user.type(screen.getByLabelText(/surname/i), ROBB.surname);
    await user.click(screen.getByRole('button', { name: /create/i }));

    await user.selectOptions(
      screen.getByRole('listbox'),
      screen.getByRole('option', {
        name: 'Snow, Jon',
      }),
    );
    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(screen.queryAllByRole('option')).toHaveLength(1);
    expect(
      screen.getByRole('option', { name: 'Stark, Robb' }),
    ).toBeInTheDocument();
  });
  it('should filter user', async () => {
    render(<CRUD />);
    const user = userEvent.setup();
    const [JON, ROBB] = users;

    await user.type(screen.getByLabelText(/^name:/i), JON.name);
    await user.type(screen.getByLabelText(/surname/i), JON.surname);
    await user.click(screen.getByRole('button', { name: /create/i }));

    await user.type(screen.getByLabelText(/^name:/i), ROBB.name);
    await user.type(screen.getByLabelText(/surname/i), ROBB.surname);
    await user.click(screen.getByRole('button', { name: /create/i }));

    await user.type(screen.getByLabelText(/filter prefix:/i), 'sn');

    expect(
      screen.getByRole('option', { name: 'Snow, Jon' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Stark, Robb' }),
    ).not.toBeInTheDocument();
  });
});
