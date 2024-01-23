import { useState } from "react";
import useStore from "../store";
import { useInputState } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Group, TextInput } from "@mantine/core";
import { PasswordStrength, Button } from "../components";
import { useSignIn } from "../hooks/authHooks";

const LoginForm = ({ isSignIn, setIsSignIn, toast, toggle, setFormClose }) => {
  const { signIn } = useStore();
  const { data, isSuccess, isPending, mutate } = useSignIn(toast, toggle);
  const [strength, setStrength] = useState(0);
  const [passValue, setPassValue] = useInputState("");
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email!"),
    },
  });

  const handleSubmit = async (values) => {
    setFormClose(true);

    mutate({
      ...values,
      password: passValue,
    });

    if (isSuccess) {
      setFormClose(false);
      setTimeout(() => {
        signIn(data);
        navigate("/dashboard");
      }, 2000);
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <TextInput
        withAsterisk
        label="Email Address"
        placeholder="your@email.com"
        {...form.getInputProps("email")}
      />
      <PasswordStrength
        value={passValue}
        setValue={setPassValue}
        setStrength={setStrength}
        isSignIn={isSignIn}
      />

      <Group
        className={`w-full flex ${
          isSignIn ? "justify-end" : "justify-between"
        }`}
        mt="md"
      >
        <Button
          type="submit"
          styles="h-10 text-sm dark:bg-blue-600 bg-black"
          label="Submit"
        />
      </Group>

      <p className="text-sm font-bold">
        {isSignIn ? "Don't have an account ?" : "Already have an account ?"}
        <span
          className="underline text-blue-600 ml-1 cursor-pointer"
          onClick={() => setIsSignIn((prev) => !prev)}
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
