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
import { login } from "@/services/AuthService";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PasswordInput from "@/components/shared/PasswordInput";
import Loading from "@/components/shared/Loading";

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

  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    const token = localStorage.getItem("token");

    if (token == undefined || token == null || token == "") {
      return;
    } else {
      const decodedToken = jwtDecode(token || "");
      const currentUnixTimestamp = Math.floor(Date.now() / 1000);

      if (
        decodedToken.exp !== undefined &&
        decodedToken.exp > currentUnixTimestamp
      ) {
        navigate("/");
        toast({
          title: "Welcome back!",
        });
      } else {
        localStorage.setItem("token", "");
        if (location.pathname != "/sign-in") {
          toast({
            variant: "destructive",
            title: "Opps! Login session expired",
            description: "Please login again.",
          });
        }
        navigate("/sign-in");
      }
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
    },
    onError() {
      console.log("Login Failed");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await login(values);
    if (response && response.data.data) {
      setIsLoading(false);
      localStorage.setItem(
        "token",
        JSON.stringify(response.data.data.accessToken)
      );
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
