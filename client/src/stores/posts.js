import create from 'zustand';
import { useAuthStore } from './auth';
import { useProfileStore } from './profile';
import API from '../api/api';
import cogoToast from '../components/cogo-toast';

const defaultState = {
  loading: false,
  isThereMore: true,
  offset: 0,
  quantity: 5,
  items: [],
};

export const usePostsStore = create(() => defaultState);

export const fetchUserPosts = async (usernamePosts) => {
  const { username } = useAuthStore.getState();
  const { offset, quantity, isThereMore, loading } = usePostsStore.getState();

  if (isThereMore && !loading) {
    usePostsStore.setState((state) => ({
      ...state,
      loading: true,
    }));

    const res = await API.get(`user/${usernamePosts}/posts?offset=${offset}&quantity=${quantity}`);
    if (res.code == 200) {
      const payload = res.response.map((post) => ({
        ...post,
        liked: post.likedBy.includes(username),
      }));
      usePostsStore.setState((state) => ({
        ...state,
        isThereMore: !!payload.length,
        offset: state.offset + state.quantity,
        items: [
          ...state.items,
          ...payload.map((post) => ({
            ...post,
            author: {
              ...post.author,
              profilePic: post.author.profilePic,
            },
          })),
        ],
      }));
    }
    usePostsStore.setState((state) => ({
      ...state,
      loading: false,
    }));
  } else if (!loading) {
    cogoToast.info(`You have reached the bottom 😱!`, {
      position: 'bottom-right',
    });
  }
};

export const discoverPosts = async () => {
  const { _id: id } = useAuthStore.getState();
  const postsState = usePostsStore.getState();
  const { isThereMore, loading } = postsState;
  if (isThereMore && !loading) {
    usePostsStore.setState((state) => ({
      ...state,
      loading: true,
    }));
    const res = await API.get('discover/posts');
    if (res.code == 200) {
      const payload = res.response.map((post) => ({
        ...post,
        liked: post.likedBy.includes(id),
      }));
      usePostsStore.setState((state) => ({
        ...state,
        items: [
          ...state.items,
          ...payload.map((post) => ({
            ...post,
            author: {
              ...post.author,
              profilePic: post.author.profilePic,
            },
          })),
        ],
      }));
    }
    usePostsStore.setState((state) => ({
      ...state,
      loading: false,
    }));
  } else {
    cogoToast.info(`You have reached the bottom 😱!`, {
      position: 'bottom-right',
    });
  }
};

export const newPost = async (data) => {
  try {
    const profileState = useProfileStore.getState();
    const { username: profile } = profileState;
    const { username } = data;

    const res = await API.post(`user/${username}/new/post`, { ...data });
    if (res.code == 200) {
      cogoToast.success(`Post submitted`, {
        position: 'bottom-right',
      });

      if (username == profile) {
        const payload = {
          newPost: res.response,
        };
        usePostsStore.setState((state) => ({
          ...state,
          items: [
            {
              ...payload.newPost,
              author: {
                ...payload.newPost.author,
                profilePic: payload.newPost.author.profilePic,
              },
            },
            ...state.items,
          ],
        }));
      }
    }
  } catch (e) {
    cogoToast.error(`There were an error submitting your post.`, {
      position: 'bottom-right',
    });
  }
};

export const likePost = async (postId) => {
  const res = await API.post(`post/${postId}/like`);
  if (res.code == 200) {
    const payload = {
      likedPost: res.response,
    };
    usePostsStore.setState((state) => ({
      ...state,
      items: state.items.map((post) =>
        post._id == payload.likedPost._id
          ? {
              ...post,
              likes: payload.likedPost.likes,
              likedBy: payload.likedPost.likedBy,
              liked: true,
            }
          : post
      ),
    }));
  }
};

export const unlikePost = async (postId) => {
  const res = await API.post(`post/${postId}/unlike`);
  if (res.code == 200) {
    const payload = {
      unlikedPost: res.response,
    };
    usePostsStore.setState((state) => ({
      ...state,
      items: state.items.map((post) =>
        post._id == payload.unlikedPost._id
          ? {
              ...post,
              likes: payload.unlikedPost.likes,
              likedBy: payload.unlikedPost.likedBy,
              liked: false,
            }
          : post
      ),
    }));
  }
};

export const deletePost = async (data) => {
  const { postId } = data;
  const res = await API.delete(`post/${postId}`);
  cogoToast.warn(`Post deleted`, {
    position: 'bottom-right',
  });
  usePostsStore.setState((state) => ({
    ...state,
    items: state.items.filter((post) => post._id != res.deletedPost._id),
  }));
};

export const updatePostsPicture = (url) => {
  const { username } = useAuthStore.getState();
  const payload = {
    url,
    username,
  };
  usePostsStore.setState((state) => {
    const username = payload.username;
    const items = state.items.map((post) => {
      if (post.author.username == username) {
        return {
          ...post,
          author: {
            ...post.author,
            profilePic: payload.url,
          },
        };
      } else {
        return post;
      }
    });
    return { ...state, items };
  });
};

export const restartState = () => {
  usePostsStore.setState(defaultState);
};
