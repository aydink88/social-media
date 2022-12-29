import { newPost as newPostAction } from '../stores/posts';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth';
import { Form } from 'react-bootstrap';

const randomPhrasesTextarea = [
  'What are you thinking?',
  "It's a beautiful day isn't it",
  "Tell us a story, i know you're not boring ♪",
  'In many ways, still miss good old days.',
];

export default function NewPostForm({ profileId }) {
  const profilePic = useAuthStore((state) => state.profilePic);
  const [youtubeInput, setYoutubeInput] = useState(false);
  const [selectedPlaceholderPhrase, setSelectedPlaceholderPhrase] = useState(null);
  const getRandomQuote = () => {
    const rand = Math.floor(Math.random() * randomPhrasesTextarea.length);
    setSelectedPlaceholderPhrase(randomPhrasesTextarea[rand]);
  };
  const toggleYoutubeInput = () => {
    setYoutubeInput((prev) => !prev);
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    newPostAction({
      username: profileId,
      message: e.target.message.value,
      extra: {
        value: e.target.extra.value,
        extraType: 'youtube',
      },
    });
    e.target.message.value = '';
    e.target.extra.value = '';
  };

  useEffect(getRandomQuote, []);

  return (
    <div className="d-flex gap-2">
      <div className="mr-4 d-none d-md-block">
        <img
          src={profilePic}
          className="d-block mx-auto rounded-circle border"
          style={{ width: '75px' }}
        />
      </div>
      <div className="mt-2 w-100">
        <Form onSubmit={handleNewPost}>
          <Form.Group className="mb-2">
            <Form.Control
              id="message"
              name="message"
              className="form-control border-top-0 border-left-0 border-right-0 border-brand rounded-0 profile__body__textarea__input"
              required
              placeholder={selectedPlaceholderPhrase}
              as="textarea"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <input
              name="extra"
              id="extra"
              className={'form-control mt-2 ' + (youtubeInput ? 'd-flex' : 'd-none')}
              placeholder="https://www.youtube.com/watch?v=dO368WjwyFs"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <button type="submit" className="btn btn-brand rounded-pill float-right text-white">
              <i className="fas fa-paper-plane"></i> Submit
            </button>
            <button
              type="button"
              onClick={toggleYoutubeInput}
              className="btn btn-brand-secondary text-white rounded-pill float-right px-3 mx-2"
            >
              <i className="fab fa-youtube"></i> Youtube
            </button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
