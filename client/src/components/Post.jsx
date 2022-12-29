import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { likePost, unlikePost, deletePost as deletePostAction } from '../stores/posts';
import { Link } from 'react-router-dom';
import Linkify from 'linkify-react';
import cogoToast from './cogo-toast';
import YouTube from 'react-youtube';
import { useAuthStore } from '../stores/auth';
import { Card, Stack } from 'react-bootstrap';

dayjs.extend(relativeTime);

function Post(props) {
  const { _id, username, isLogged } = useAuthStore();
  const deletePost = () => {
    deletePostAction({ postId: props._id });
  };

  const canDeleteIt = () => {
    if (_id && props.author._id) {
      // If i own the post.
      return _id == props.author._id;
    } else if (username && props.match.params.id) {
      // If the post is in my profile, even if i don't own it.
      return username == props.match.params.id;
    }
  };

  // const parseText = () => {
  //   const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  //   const textFractions = props.message.split;
  // };

  const handleLike = () => {
    if (!isLogged) {
      return cogoToast.warn(`You must be logged in to perform this action 😢`, {
        position: 'bottom-right',
      });
    }

    if (props.liked) {
      unlikePost(props._id);
    } else {
      likePost(props._id);
    }
  };

  return (
    <Card className="w-100 my-3 post">
      <Card.Header className="border-0 d-flex justify-content-between">
        <div>
          <small className="text-muted">{dayjs().from(dayjs(props.createdAt))} ago.</small>
        </div>
        <Stack direction="horizontal" gap={1}>
          <div>
            <Link to={'/u/' + props.author.username}>{props.author.username}</Link>
          </div>
          <div className="post__avatar">
            <Link to={'/u/' + props.author.username}>
              <img
                src={props.author.profilePic}
                className="img-fluid cursor-pointer rounded-circle"
              />
            </Link>
          </div>
        </Stack>
      </Card.Header>
      <Card.Body className="p-3">
        <Linkify options={{ target: '_blank' }}>
          <Card.Text className="my-0 py-0 ws-pre-line">{props.message}</Card.Text>
        </Linkify>
        {props.extra && (
          <div className="mt-3">
            <YouTube
              videoId={props.extra.value}
              opts={{
                width: '100%',
                height: '400',
              }}
            />
          </div>
        )}
        <div
          onClick={handleLike}
          className="d-inline-flex px-3 py-1 text-brand-secondary rounded-pill post__likes cursor-pointer"
        >
          <span>
            {props.likes}{' '}
            <i className={`mr-1 ${props.liked ? 'fas fa-heart' : 'far fa-heart'}`}></i>
          </span>
        </div>
        {canDeleteIt() && (
          <div
            onClick={deletePost}
            className="d-inline-flex px-3 py-1 rounded-pill post__delete cursor-pointer"
          >
            <span className="text-danger">
              <i className="fas fa-times"></i>
            </span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default Post;
