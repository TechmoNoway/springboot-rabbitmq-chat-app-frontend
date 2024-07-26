import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import { IoClose } from "react-icons/io5";
import { IUser } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { searchUserByString } from "@/services/UserService";
import { useSelector } from "react-redux";

type Props = {
  onClose: () => void;
};

const SearchUser = ({ onClose }: Props) => {
  const currentUser = useSelector((state: any) => state?.auth);
  const [searchUser, setSearchUser] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const handleSearchUser = async () => {
    setLoading(true);
    if (search.trim() !== "") {
      const response = await searchUserByString(debouncedSearch);

      setSearchUser(
        response?.data.data.filter(
          (u: IUser) => u.id !== currentUser.id
        )
      );
    } else {
      setSearchUser([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearchUser();
  }, [debouncedSearch]);

  return (
    <>
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
        <div className="w-full max-w-lg mx-auto mt-10">
          {/**input search user */}
          <div className="bg-white rounded h-14 overflow-hidden flex ">
            <input
              type="text"
              placeholder="Search user by name, email...."
              className="w-full outline-none py-1 h-full px-4"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <div className="h-14 w-14 flex justify-center items-center">
              <IoSearchOutline size={25} />
            </div>
          </div>

          <div className="bg-white mt-2 w-full px-2 py-3 rounded">
            {searchUser.length === 0 && !loading && (
              <div className="text-center text-slate-500">
                no user found!
              </div>
            )}

            {loading && <Loading />}

            {searchUser.length !== 0 &&
              !loading &&
              searchUser.map((user, index) => {
                return (
                  <UserSearchCard
                    key={user.id}
                    user={user}
                    onClose={onClose}
                  />
                );
              })}
          </div>
        </div>

        <div
          className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
          onClick={onClose}
        >
          <button>
            <IoClose />
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchUser;
