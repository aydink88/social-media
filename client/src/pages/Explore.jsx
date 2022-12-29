import DiscoverUsers from "../components/DiscoverUsers";
import DiscoverPosts from "../components/DiscoverPosts";
import AuthLayout from "../components/AuthLayout";

export default function Explore() {
  return (
    <AuthLayout>
      <div className="container my-5">
        <DiscoverUsers />
        <DiscoverPosts />
      </div>
    </AuthLayout>
  );
}
