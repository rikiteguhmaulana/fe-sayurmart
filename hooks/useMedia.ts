import mediaService from "@/services/media.service";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const useMedia = () => {
  const { data: session } = useSession();
  // upload service
  const uploadFile = async (
    file: File,
    callback: (fileUrl: string) => void
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await mediaService.upload(
        formData,
        session?.user.token as string
      );

      const fileUrl = response.data.data.secure_url;
      if (fileUrl) {
        callback(fileUrl);
      } else {
        throw new Error("Failed to get file URL from response");
      }
    } catch (error: any) {
      console.error("Frontend upload error:", error);
      throw error;
    }
  };

  // mutation upload
  const { mutate: mutateUploadFile, isPending: isPendingUploadFile } =
    useMutation({
      mutationFn: (variables: {
        file: File;
        callback: (fileUrl: string) => void;
      }) => uploadFile(variables.file, variables.callback),
      onError: (error) => {
        console.log(error);
      },
    });

  // handle upload
  const handleUploadFile = (
    files: FileList,
    onChange: (files: FileList | undefined) => void,
    callback: (fileUrl?: string) => void
  ) => {
    if (files.length !== 0) {
      // Jangan set onChange(files) ke form karena imageUrl mengharapkan string URL
      // Kita hanya perlu melakukan mutasi upload
      mutateUploadFile({
        file: files[0],
        callback,
      });
    }
  };

  // remove service
  const deleteFile = async (
    fileUrl: string,
    callback: () => void,
    token: string
  ) => {
    const res = await mediaService.remove(fileUrl, token);
    if (res.data.status === 200) {
      callback();
    }
  };

  const { mutate: mutateDeleteFile, isPending: isPendingDeleteFile } =
    useMutation({
      mutationFn: (variables: {
        fileUrl: string;
        callback: () => void;
        token: string;
      }) => deleteFile(variables.fileUrl, variables.callback, variables.token),
      onError: (error) => {
        console.log(error);
      },
    });

  // handle delete
  const handleDeleteFile = (
    fileUrl: string | FileList | undefined,
    callback: () => void
  ) => {
    if (typeof fileUrl === "string") {
      mutateDeleteFile({
        fileUrl,
        callback,
        token: session?.user.token as string,
      });
    } else {
      callback();
    }
  };

  return {
    // mutation
    mutateUploadFile,
    isPendingUploadFile,
    mutateDeleteFile,
    isPendingDeleteFile,
    // handle
    handleUploadFile,
    handleDeleteFile,
  };
};

export default useMedia;
