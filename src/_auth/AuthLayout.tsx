import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <div className="bg-black hidden xl:block h-screen w-5/12 object-cover bg-no-repeat"></div>

      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>

      {/* <img
            src=""
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          /> */}
    </>
  );
};

export default AuthLayout;
