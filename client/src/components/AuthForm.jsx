import { Form, Button } from 'react-bootstrap';
import { useAuthStore } from '../stores/auth';

export default function AuthForm({ onSuccess, backMethod, type }) {
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    console.log(user);

    onSuccess(user);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading}>
          <Form.Group className="mb-2">
            <Form.Label htmlFor="username" className="mb-1 text-muted">
              <small>Username</small>
            </Form.Label>
            <Form.Control type="text" name="username" id="username" required minLength="5" />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label htmlFor="password" className="mb-1 text-muted">
              <small>Password</small>
            </Form.Label>
            <Form.Control type="password" name="password" id="password" required minLength="5" />
          </Form.Group>
          <Button className="btn-brand text-light border-0 rounded-pill" type="submit">
            {type == 'signup' ? 'Sign Up' : 'Login'}
          </Button>
          {backMethod && (
            <Button
              onClick={backMethod}
              type="button"
              className="btn-brand-secondary text-white border-0 rounded-pill mx-3"
            >
              Go back
            </Button>
          )}
        </fieldset>
      </Form>
    </>
  );
}
