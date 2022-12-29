import { useEffect } from 'react';
import { discoverPosts, restartState as restartStatePosts, usePostsStore } from '../stores/posts';
import { Row, Col } from 'react-bootstrap';
import Post from '../components/Post';
import Loading from '../components/Loading';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

export default function DiscoverPosts() {
  const scrollRef = useBottomScrollListener(() => discoverPosts());
  const { items: posts, loading: postsLoading } = usePostsStore((state) => state);

  useEffect(() => {
    discoverPosts();
    return () => {
      restartStatePosts();
    };
  }, []);

  return (
    <>
      <h2 className="montserrat">Explore posts</h2>
      <Row className="mt-5" ref={scrollRef}>
        {posts.map((post, i) => (
          <Col xs={12} lg={6} className="animate__animated animate__fadeIn" key={post._id + i}>
            <Post {...post} />
          </Col>
        ))}
        {postsLoading && (
          <div className="d-flex justify-content-center m-auto my-5 py-5">
            <Loading />
          </div>
        )}
      </Row>
    </>
  );
}
