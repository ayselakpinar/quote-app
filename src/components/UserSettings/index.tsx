import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useUserContext } from "../../UserContext";
import { Loading } from "../Shared/Loading";
import { CenteredContainer } from "../Shared/CenteredContainer";
import { PageTitle } from "../Shared/PageTitle";
import { Label } from "../Shared/Label";
import { Input } from "../Shared/Input";

interface Category {
  value: string;
  label: string;
}

interface UserSettingsFormData {
  username: string;
  email: string;
  favoriteCategories: string[];
}

interface UserData {
  name: string;
  email: string;
  favoriteCategories: string[];
  updatedAt: Date;
}

const CATEGORIES: Category[] = [
  { value: "general", label: "General" },
  { value: "motivation", label: "Motivation" },
  { value: "wisdom", label: "Wisdom" },
  { value: "love", label: "Love" },
  { value: "life", label: "Life" },
  { value: "success", label: "Success" },
  { value: "happiness", label: "Happiness" },
];

type SaveStatus = "" | "saving" | "saved" | "error";

export const UserSettings: React.FC = (): React.ReactElement => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserSettingsFormData>();

  useEffect(() => {
    async function fetchUserSettings(): Promise<void> {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setValue("username", data.name || "");
          setValue("email", data.email || "");
          setValue("favoriteCategories", data.favoriteCategories || []);
        } else {
          const defaultData: UserData = {
            name: user.name || "",
            email: user.email || "",
            favoriteCategories: [],
            updatedAt: new Date(),
          };
          await setDoc(userDocRef, defaultData);
          setValue("username", defaultData.name);
          setValue("email", defaultData.email);
          setValue("favoriteCategories", defaultData.favoriteCategories);
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSettings();
  }, [user, setValue]);

  const onSubmit = async (data: UserSettingsFormData): Promise<void> => {
    if (!user?.id) {
      setSaveStatus("error");
      return;
    }

    try {
      setSaveStatus("saving");
      const userDocRef = doc(db, "users", user.id);

      const userData: UserData = {
        name: data.username,
        email: data.email,
        favoriteCategories: Array.isArray(data.favoriteCategories)
          ? data.favoriteCategories
          : [],
        updatedAt: new Date(),
      };

      await setDoc(userDocRef, userData);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("error");
    }
  };

  if (loading) {
    return <Loading className="text-2xl text-primary-dark" />;
  }

  if (!user?.id) {
    return (
      <CenteredContainer>
        <div className="text-2xl text-primary-dark">
          Please login to view settings
        </div>
      </CenteredContainer>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <CenteredContainer>
        <PageTitle>User Settings</PageTitle>
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 2,
                    message: "Username must be at least 2 characters",
                  },
                })}
              />
              {errors.username && (
                <div className="mt-1 text-red-500 text-sm">
                  {errors.username.message}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <div className="mt-1 text-red-500 text-sm">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div>
              <Label>Favorite Categories</Label>
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((category) => (
                  <label
                    key={category.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      value={category.value}
                      {...register("favoriteCategories")}
                      className="rounded border-secondary text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              {saveStatus === "saving" ? "Saving..." : "Save Settings"}
            </button>

            {saveStatus === "saved" && (
              <div className="text-green-500 text-center">
                Settings saved successfully!
              </div>
            )}
            {saveStatus === "error" && (
              <div className="text-red-500 text-center">
                Error saving settings. Please try again.
              </div>
            )}
          </form>
        </div>
      </CenteredContainer>
    </div>
  );
};
