import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getAuth, updatePassword, updateProfile } from "firebase/auth";
import {
  Avatar,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { Notifications } from "@mantine/notifications";
import { useAuth } from "@/context/AuthProvider";

export const ProfilePage = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<FileWithPath | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL || "");
  const [isEmailPasswordUser, setIsEmailPasswordUser] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(user);
  const form = useForm({
    initialValues: {
      full_name: user?.displayName,
      email: user?.email || "",
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      new_password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirm_new_password: (value, values) =>
        value !== values.new_password ? "Passwords do not match" : null,
    },
  });

  const initialImageUrl = useRef(previewUrl);

  // Check the user's sign-in provider on component mount
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Access providerData from auth.currentUser
      const isEmailPassword = currentUser.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailPasswordUser(isEmailPassword);
    }
  }, []);

  const handleFileDrop = (files: FileWithPath[]) => {
    const file = files[0];
    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  };

  const handleCancel = () => {
    setPreviewUrl(initialImageUrl.current);
    setSelectedFile(null);
    form.setFieldValue("full_name", user?.displayName);
  };

  const handleSaveChanges = async () => {
    const auth = getAuth();
    const { full_name, new_password } = form.values;

    if (!auth.currentUser) {
      alert("No user is currently signed in.");
      return;
    }

    let photoURL = user?.photoURL;
    setLoading(true); // Start loading state

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "TESTIMAGE");
        formData.append("cloud_name", "dhygauckf");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dhygauckf/image/upload",
          formData
        );

        photoURL = response.data.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        alert("An error occurred while uploading the image.");
        setLoading(false);
        return;
      }
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: full_name,
        photoURL,
      });

      if (isEmailPasswordUser && new_password) {
        await updatePassword(auth.currentUser, new_password);
      }

      Notifications.show({
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
        color: "green",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <Container size={1000} my={20}>
      <Title order={2} mb={10}>
        Update Account Information
      </Title>
      <Paper withBorder p={30}>
        <Center>
          <Dropzone
            p={0}
            radius={80}
            h={102}
            w={102}
            accept={IMAGE_MIME_TYPE}
            onDrop={handleFileDrop}
          >
            <Avatar src={previewUrl} alt={user?.displayName || ""} size={100} />
          </Dropzone>
        </Center>
        <Text size="sm" c="dimmed" ta="center" mt="md">
          Upload Profile Picture by clicking on the Image above
        </Text>

        <Group grow mt="md">
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            {...form.getInputProps("full_name")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Email"
            placeholder="Enter email"
            mt="md"
            {...form.getInputProps("email")}
            disabled
          />
        </Group>

        {/* Conditionally render password inputs for email/password users */}
        {isEmailPasswordUser && (
          <>
            <Group grow>
              <PasswordInput
                label="New Password"
                placeholder="Enter new password"
                mt="md"
                {...form.getInputProps("new_password")}
              />
              <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm new password"
                mt="md"
                {...form.getInputProps("confirm_new_password")}
              />
            </Group>
          </>
        )}

        <Group grow justify="end" mt={20}>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveChanges}
            loading={loading}
            disabled={loading}
          >
            Save Changes
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};
