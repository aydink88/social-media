import { Spinner } from 'react-bootstrap';

export default function Loading(props) {
  return (
    <Spinner
      animation="border"
      role="status"
      className={`text-brand${props.classes ? ' ' + props.classes : ''}`}
    >
      <span className="visually-hidden sr-only">Loading...</span>
    </Spinner>
  );
}
