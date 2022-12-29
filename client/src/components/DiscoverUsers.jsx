import { useEffect } from 'react';
import { discoverUsers, restartState as restartStateUsers, useUsersStore } from '../stores/users';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';

export default function DiscoverUsers() {
  const { items: users, loading: usersLoading } = useUsersStore((state) => state);

  useEffect(() => {
    discoverUsers();
    return () => {
      restartStateUsers();
    };
  }, []);

  return (
    <>
      <h2 className="montserrat">Discover users</h2>
      <div
        className="d-inline-flex flex-row w-100 mb-5"
        style={{ overflowX: 'scroll', overflowY: 'hidden', minHeight: '100px' }}
      >
        {usersLoading && (
          <div className="d-flex justify-content-center m-auto">
            <Loading />
          </div>
        )}
        {users.map((user) => (
          <div className={'mx-3 mx-md-5 px-md-5 animate__animated animate__fadeIn'} key={user._id}>
            <UserCard {...user} />
          </div>
        ))}
      </div>
    </>
  );
}
