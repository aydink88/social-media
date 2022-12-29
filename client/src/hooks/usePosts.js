import { useCallback } from "react";
import { useState } from "react";
import api from "../api/api";
import cogoToast from "../components/cogo-toast";

export default function usePosts(authUsername) {
  const [postsState, setPostsState] = useState({
    loading: false,
    isThereMore: true,
    offset: 0,
    quantity: 5,
    items: [],
  });

  const setLoading = (isLoading) => {
    setPostsState((prev) => ({ ...prev, loading: isLoading }));
  };

  const fetchUserPosts = useCallback(
    async (usernamePosts) => {
      const { offset, quantity, isThereMore, loading } = postsState;

      if (isThereMore && !loading) {
        setLoading(true);
        const res = api.get(`user/${usernamePosts}/posts?offset=${offset}&quantity=${quantity}`);
        if (res.code == 200) {
          const payload = res.response.map((post) => ({
            ...post,
            liked: post.likedBy.includes(authUsername),
          }));
          setPostsState((state) => ({
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
        setLoading(false);
      } else if (!loading) {
        cogoToast.info(`You have reached the bottom 😱!`, {
          position: "bottom-right",
        });
      }
    },
    [postsState]
  );

  return { fetchUserPosts, postsState };
}
