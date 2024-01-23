import { Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useInputState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Button, PasswordStrength } from "../components";
import { useNavigate } from "react-router-dom";
import { BiImages } from "react-icons/bi";
import { uploadFile } from "../utils";
import { useSignUp } from "../hooks/authHooks";

const SignUpForm = ({ toast, toggle, isSignIn, setIsSignIn, setFormClose }) => {
  const { mutate } = useSignUp(toast, toggle);
  const [strength, setStrength] = useState(0);
  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [passValue, setPassValue] = useInputState("");
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    validate: {
      firstName: (value) =>
        value.length < 3 ? "First name is too short" : null,
      lastName: (value) => (value.length < 3 ? "Last name is too short" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email!"),
    },
  });

  const handleSubmit = (values) => {
    if (isSignIn && strength < 90) return;
    setFormClose(true);

    const res = mutate({
      ...values,
      password: passValue,
      image: fileUrl,
      accountType: "Writer",
    });
  };

  useEffect(() => {
    file && uploadFile(setFileUrl, file);
  }, [file]);

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="flex flex-col gap-3"
    >
      <div className="w-full flex gap-2">
        <TextInput
          className="w-full"
          withAsterisk
          label="First Name"
          placeholder="first name"
          {...form.getInputProps("firstName")}
        />
        <TextInput
          className="w-full"
          withAsterisk
          label="Last Name"
          placeholder="last name"
          {...form.getInputProps("lastName")}
        />
      </div>
      <TextInput
        className="w-full"
        withAsterisk
        label="Email Address"
        placeholder="abc@email.com"
        {...form.getInputProps("email")}
      />
      <PasswordStrength
        value={passValue}
        setValue={setPassValue}
        setStrength={setStrength}
        isSignIn={false}
      />

      <Group
        className="w-full flex"
        style={{ justifyContent: "space-between" }}
        mt="md"
      >
        <div className="flex flex-col items-center justify-between">
          <label
            htmlFor="imgUpload"
            className="flex items-center gap-1 text-base cursor-pointer dark:text-gray-500 text-gray-700"
          >
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              data-max-size="5120"
              id="imgUpload"
              accept=".jpg,.png,.jpeg"
            />
            <BiImages />
            <span>{file ? file.name : "Pictures"}</span>
          </label>
        </div>

        {!fileUrl ? (
          <Button
            label="Submit"
            styles="h-10 text-sm dark:bg-blue-600 bg-gray-500 cursor-not-allowed"
            disabled
          />
        ) : (
          <Button
            type="submit"
            styles="h-10 text-sm dark:bg-blue-600 bg-black"
            label="Submit"
          />
        )}
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

export default SignUpForm;
