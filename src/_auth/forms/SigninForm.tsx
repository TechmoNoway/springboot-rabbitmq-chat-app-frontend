import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { doLogin, loginUsingGoogle } from "@/services/AuthService";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import PasswordInput from "@/components/shared/PasswordInput";
import Loading from "@/components/shared/Loading";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(1, {
    message: "Dont let the password empty.",
  }),
});

function SigninForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const checkGoogleAuthUser = () => {};

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${credentialResponse.access_token}`,
            },
          }
        );

        const userGoogleLoginForm = {
          username: userInfo.data.name,
          email: userInfo.data.name,
          accessToken: credentialResponse.access_token,
        };

        const googleLoginResponse = await loginUsingGoogle(
          userGoogleLoginForm
        );

        console.log(googleLoginResponse);

        if (googleLoginResponse?.data.status == 200) {
          localStorage.setItem(
            "token",
            JSON.stringify(googleLoginResponse.data.data.accessToken)
          );
          navigate("/");
          toast({
            title: "Login successfully",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Opps! Wrong Credentials",
            description:
              "Something went wrong login with your Google Account.",
            action: (
              <ToastAction altText="Try again">Try again</ToastAction>
            ),
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    onError() {
      console.log("Login Failed");
    },
  });

  //TODO: Update the login function
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await doLogin(values);
    if (response && response.data.data) {
      setIsLoading(false);
      login(JSON.stringify(response.data.data.accessToken));
      navigate("/");
      toast({
        title: "Login successfully",
      });
    } else {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Opps! Wrong Credentials",
        description: "Your username or password can be wrong.",
        action: (
          <ToastAction altText="Try again">Try again</ToastAction>
        ),
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <div className="sm:w-420 flex flex-col">
          <h2 className="text-[30px] text-blue-900 font-bold">
            Sign In
          </h2>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full mt-12"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-900">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      className="py-7 w-96 font-medium text-base bg-gray-100 border-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-900">
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Password"
                      className="py-7 w-96 font-medium text-base bg-gray-100 border-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-blue-500 py-6 text-xl"
            >
              {isLoading ? (
                <div className="flex-center gap-2">
                  <Loading />
                </div>
              ) : (
                "Sign in"
              )}
            </Button>

            <hr />

            <p className="flex justify-center">Or sign in with</p>

            <div className="flex justify-center space-x-5">
              <Button
                className="bg-white w-full text-black border-[1px] border-black space-x-2 hover:text-white"
                type="button"
              >
                <FaGithub className="w-6 h-6" /> <p>Github</p>
              </Button>
              <Button
                className="bg-white w-full text-black border-[1px] border-black space-x-2 hover:text-white"
                onClick={() => loginWithGoogle()}
                type="button"
              >
                <FcGoogle className="w-6 h-6" /> <p>Google</p>
              </Button>
            </div>
            <hr />

            <div className="flex justify-between">
              <p className="font-semibold text-slate-600">
                Don't have an account?
              </p>
              <Link
                to={"/sign-up"}
                className="font-semibold text-blue-600 hover:text-black"
              >
                Sign up for free
              </Link>
            </div>
          </form>
        </div>
      </Form>
    </>
  );
}

export default SigninForm;
