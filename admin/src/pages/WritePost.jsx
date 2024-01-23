import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import useStore from "../store";
import { toast, Toaster } from "sonner";
import { useCreatePost } from "../hooks/postHooks";
import { createSlug, uploadFile } from "../utils";
import { Button, Loading } from "../components";

import { Link, RichTextEditor } from "@mantine/tiptap";
import { IconColorPicker, IconUpload } from "@tabler/icons-react";
import { BubbleMenu, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import { Select, TextInput } from "@mantine/core";
import { BiImages } from "react-icons/bi";

const WritePost = () => {
  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { isPending, mutate } = useCreatePost(toast, toggle, user?.token);

  const [category, setCategory] = useState("NEWS");
  const [file, setFile] = useState("");
  const [title, setTitle] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  let editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Write post here..." }),
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraphs"] }),
      TextStyle,
      Color,
    ],
    content: "",
  });

  useEffect(() => {
    file && uploadFile(setFileUrl, file);
  }, [file]);

  const handleSubmit = async () => {
    if (!(fileUrl || category || title)) {
      toast.error("All fields are required!");
      return;
    }
    const slug = createSlug(title);

    mutate({
      title,
      slug,
      cat: category,
      img: fileUrl,
      desc: editor.getHTML(),
    });
  };

  return (
    <div>
      <RichTextEditor editor={editor} className="p-3">
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <TextInput
            withAsterisk
            label="Post Title"
            className="w-full flex-1"
            placeholder="Post Title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            label="Category"
            defaultValue="NEWS"
            placeholder="Pick Category"
            data={["NEWS", "SPORTS", "CODING", "EDUCATION", "FASHION"]}
            onChange={(val) => setCategory(val)}
          />

          <label
            htmlFor="imgUpload"
            className="flex mt-2 items-center gap-1 text-base cursor-pointer dark:text-gray-500 text-gray-700"
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
            <span>
              {file ? (
                file.name
              ) : (
                <span className="flex items-center gap-1">
                  Upload
                  <IconUpload size={15} />
                </span>
              )}
            </span>
          </label>
        </div>

        {editor && (
          <BubbleMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Link />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
        )}
        <RichTextEditor.Toolbar sticky className="text-black" stickyOffset={20}>
          <RichTextEditor.ColorPicker
            colors={[
              "#25262b",
              "#868e96",
              "#fa5252",
              "#e64980",
              "#be4bdb",
              "#7950f2",
              "#4c6ef5",
              "#228be6",
              "#15aabf",
              "#12b886",
              "#40c057",
              "#82c91e",
              "#fab005",
              "#fd7e14",
            ]}
          />
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control interactive={true}>
              <IconColorPicker size="1rem" stroke={1.5} />
            </RichTextEditor.Control>
            <RichTextEditor.Color color="#F03E3E" />
            <RichTextEditor.Color color="#7048E8" />
            <RichTextEditor.Color color="#1098AD" />
            <RichTextEditor.Color color="#37B24D" />
            <RichTextEditor.Color color="#F59F00" />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.UnsetColor />

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content className="py-8 text-black" />
      </RichTextEditor>

      <div className="w-full flex items-end justify-end mt-6">
        {fileUrl && category && title ? (
          <Button
            label="Submit Post"
            onClick={() => handleSubmit()}
            styles="bg-black dark:bg-blue-600"
          />
        ) : (
          <Button
            label="Submit Post"
            styles="bg-slate-500 dark:bg-blue-300 cursor-not-allowed"
          />
        )}
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default WritePost;
