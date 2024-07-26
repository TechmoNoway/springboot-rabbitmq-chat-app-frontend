import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import PasswordInput from "@/components/shared/PasswordInput";
import { register } from "@/services/AuthService";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  email: z.string().min(1, {
    message: "Dont let the email empty.",
  }),
  password: z.string().min(1, {
    message: "Dont let the password empty.",
  }),
  confirmPassword: z.string().min(1, {
    message: "Dont let the confirm password empty.",
  }),
});

function SignupForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const registerForm = {
      username: values.username,
      email: values.email,
      password: values.password,
    };

    const response = await register(registerForm);
    if (response && response.data.data == "username-exists") {
      toast({
        variant: "destructive",
        title: "Opps! Username already exists",
        description: "Please choose a new username.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else if (response && response.data) {
      toast({
        title: "Registration successful",
        description: "Now go sign in to your account.",
      });
      navigate("/sign-in");
      console.log(response);
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex flex-col">
        <h2 className="text-[30px] text-blue-950 font-bold">Sign Up</h2>

        <p className="text-[16px] text-blue-950 font-semibold mt-2">
          Please fill your information below
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="E-mail"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm Password"
                    className="py-7 w-96 font-medium text-base bg-gray-100 border-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="bg-blue-500 py-7 text-xl w-36 flex items-center justify-between"
            >
              <p>Next</p> <IoIosArrowForward className="w-6 h-6" />
            </Button>
          </div>

          <hr className="mt-2 mb-2" />

          <div className="flex justify-between">
            <p className="font-semibold text-slate-600">
              Already have an account?
            </p>
            <Link
              to={"/sign-in"}
              className="font-semibold text-blue-600 hover:text-black"
            >
              Login to your account
            </Link>
          </div>
        </form>
      </div>
    </Form>
  );
}

export default SignupForm;
