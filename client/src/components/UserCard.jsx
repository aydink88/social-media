import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function UserCard(props) {
  return (
    <>
      <div className={'user-card position-relative my-3 ' + props.class}>
        <img src={props.profilePic} className="rounded-circle user-card__image bg-brand" />
        <div className="user-card__body">
          <div className="user-card__body__info d-flex justify-content-center d-md-block">
            <h3 className="user-card__body__username montserrat">{props.username}</h3>
            <p className="mb-3 d-none d-md-block user-card__body__info__description montserrat">
              {props.description}
            </p>
          </div>
          <div className="user-card__body__actions d-flex justify-content-center d-md-block">
            <Link to={'/u/' + props.username}>
              <button className="btn btn-brand btn-sm rounded-pill text-white px-3">VIEW</button>
            </Link>
          </div>
        </div>
      </div>
      <Card style={{ width: '400px' }} className="flex-row">
        <Card.Img
          src={props.profilePic}
          className="rounded-circle my-4 mx-n10"
          style={{ marginLeft: '-75px', width: 150 }}
        />
        <Card.Body>
          <Card.Title className="mb-2">{props.username}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{props.description}</Card.Subtitle>
          <Button className="btn-brand btn-sm rounded-pill text-white px-3">VIEW</Button>
        </Card.Body>
      </Card>
    </>
  );
}
