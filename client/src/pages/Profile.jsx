import { useEffect } from "react";
import { changeDescription } from "../stores/settings";
import {
  fetchProfile,
  restartState,
  toggleEditingDescription,
  useProfileStore,
} from "../stores/profile";
import { fetchUserPosts, restartState as restartStatePosts, usePostsStore } from "../stores/posts";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import Post from "../components/Post";
import NewPostForm from "../components/NewPostForm";
import ProfilePictureModal from "../components/ProfilePictureModal";
import Loading from "../components/Loading";
import cogoToast from "../components/cogo-toast";
import AuthLayout from "../components/AuthLayout";
import Auth from "../components/Auth";
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const profile = useProfileStore((state) => state);
  const { ownProfile } = profile;
  const { items: posts, loading: postsLoading } = usePostsStore((state) => state);

  const location = useLocation();
  const { id } = useParams();
  const scrollRef = useBottomScrollListener(() => {
    fetchUserPosts(id);
  });

  useEffect(() => {
    initializeProfile();
    restartState();
    restartStatePosts();
    return () => {
      restartState();
      restartStatePosts();
    };
  }, [location.pathname]);

  const initializeProfile = () => {
    fetchProfile(id);
    fetchUserPosts(id);
  };

  const toggleProfilePictureModal = () => {
    if (ownProfile) {
      setShowProfilePicModal((prev) => !prev);
    }
  };

  const updateDescription = (e) => {
    e.preventDefault();
    const description = e.target.description.value;

    if (profile.description == description) {
      cogoToast.warn(
        <p>
          Ehm... i don&apos;t wanna be the one to tell you what to do but...{" "}
          <strong>descriptions are the same 🙊</strong>
        </p>,
        {
          position: "bottom-right",
        }
      );
    } else if (description.length > 150) {
      cogoToast.warn("Descriptions shouldn't be longer than 150 characters", {
        position: "bottom-right",
      });
    } else {
      Promise.resolve(changeDescription(description)).then(() => toggleEditingDescription());
    }
  };

  return (
    <AuthLayout>
      <div className="d-flex flex-column flex-md-row profile w-100">
        {showProfilePicModal && ownProfile && (
          <ProfilePictureModal isVisible={showProfilePicModal} toggle={toggleProfilePictureModal} />
        )}
        <div
          className={
            "d-none d-md-flex sidenav flex-column " +
            (!profile.visibleSidenav ? "sidenav--inactive" : "")
          }
        >
          <div className="sidenav__description">
            <div
              onClick={toggleProfilePictureModal}
              className={
                "sidenav__avatar mx-auto d-block mt-5 mb-2" +
                (ownProfile && " sidenav__avatar--owner cursor-pointer")
              }
            >
              <img
                src={profile.profilePic}
                className={
                  "sidenav__avatar__image img-fluid rounded-circle mx-auto d-block w-100 h-100"
                }
              />
              <span className="sidenav__avatar--owner__camera">
                <i className="fas fa-camera"></i>
              </span>
            </div>
            <p className="text-center text-white title mt-3">{profile.username}</p>
            {profile.editingDescription ? (
              <div className="px-5 mb-3">
                <form onSubmit={updateDescription}>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      id="description"
                      defaultValue={profile.description}
                      maxLength={150}
                    ></textarea>
                  </div>
                  <div className="form-group d-flex justify-content-end">
                    <button
                      className="btn btn-brand-secondary text-white mr-2 rounded-pill"
                      type="button"
                      onClick={toggleEditingDescription}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-brand text-white rounded-pill">Update</button>
                  </div>
                </form>
              </div>
            ) : (
              <p className="text-left text-white text-wrap description px-5 mb-0">
                {profile.description || "It seems this user hasn't provided a description 🥴!"}
              </p>
            )}
            {ownProfile && !profile.editingDescription && (
              <a
                className="text-left btn-link text-brand-secondary btn px-5"
                onClick={toggleEditingDescription}
              >
                Edit description <i className="fas fa-pencil-alt"></i>
              </a>
            )}
            <div className="d-flex flex-column justify-content-between h-100">
              <div className="d-flex justify-content-between px-5">
                <div>
                  <p className="text-white mb-0">{profile.posts} Posts</p>
                </div>
                <div>
                  <p className="text-white mb-0">{profile.likes} Likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="d-flex position-relative profile__body justify-content-center flex-wrap"
          ref={scrollRef}
        >
          <Auth>
            {profile.openProfile || ownProfile ? (
              <div className="profile__body__textarea w-100 mt-5">
                <div className="card border-0">
                  <div className="card-body">
                    <NewPostForm profileId={id} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5">
                <i className="fas fa-lock"></i> This user doesn&apos;t allow posts on his profile.
              </p>
            )}
          </Auth>
          <div className="profile__body__posts w-100">
            <div className="d-flex flex-column">
              {posts.map((post, i) => (
                <Post {...post} key={post.message + "_" + i} />
              ))}
              {postsLoading && (
                <div className="d-flex justify-content-center">
                  <Loading classes="my-5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
