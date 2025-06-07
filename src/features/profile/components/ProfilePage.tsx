import { useState, FormEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "@/features/auth/api/authApi";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Loader2 } from "lucide-react";

type ProfileFormData = {
  firstName: string;
  lastName: string;
  bio?: string;
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FormErrors = {
  profile: Partial<ProfileFormData>;
  password: Partial<PasswordFormData>;
};

const ProfilePage = () => {
  const { t } = useTranslation(['profile','auth','common']);
  const { data: user, isLoading: isFetching } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    profile: {},
    password: {},
  });

  useEffect(() => {
    if (user)
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || "",
      });
  }, [user]);

  if (isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const validateProfile = () => {
    const errs: FormErrors["profile"] = {};
    if (!profileData.firstName.trim()) errs.firstName = t("firstNameRequired");
    if (!profileData.lastName.trim()) errs.lastName = t("lastNameRequired");
    setErrors((e) => ({ ...e, profile: errs }));
    return !Object.keys(errs).length;
  };

  const validatePassword = () => {
    const errs: FormErrors["password"] = {};
    if (!passwordData.currentPassword)
      errs.currentPassword = t("currentPasswordRequired");
    if (!passwordData.newPassword) errs.newPassword = t("newPasswordRequired");
    else if (passwordData.newPassword.length < 8)
      errs.newPassword = t("auth:passwordMinLength");
    if (passwordData.newPassword !== passwordData.confirmPassword)
      errs.confirmPassword = t("auth:passwordMismatch");
    setErrors((e) => ({ ...e, password: errs }));
    return !Object.keys(errs).length;
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;
    try {
      await updateProfile(profileData).unwrap();
      toast({ title: t("updateSuccess") });
    } catch {
      toast({ title: t("somethingWentWrong"), variant: "destructive" });
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    try {
      const { currentPassword, newPassword } = passwordData;
      await updatePassword({ currentPassword, newPassword }).unwrap();
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({ title: t("passwordUpdateSuccess") });
    } catch {
      toast({ title: t("somethingWentWrong"), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("personalInfo")}
        </h1>
        <p className="text-muted-foreground">{t("contactSupportEmail")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* User info card */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar} alt={user?.firstName} />
              <AvatarFallback className="text-2xl">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h2 className="text-xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-sm mt-1 capitalize bg-muted inline-block px-2 py-1 rounded">
                {user?.role}
              </p>
            </div>

            <Button className="w-full">{t("changeProfilePicture")}</Button>
          </CardContent>
        </Card>

        {/* Profile settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("updateProfile")}</CardTitle>
            <CardDescription>{t("updateProfileDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value: string) => setActiveTab(value)}
              className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t("personalInfo")}
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t("security")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("firstName")}</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData((p) => ({
                              ...p,
                              firstName: e.target.value,
                            }))
                          }
                          className={
                            errors.profile.firstName ? "border-destructive" : ""
                          }
                        />
                        {errors.profile.firstName && (
                          <p className="text-sm text-destructive">
                            {errors.profile.firstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("lastName")}</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData((p) => ({
                              ...p,
                              lastName: e.target.value,
                            }))
                          }
                          className={
                            errors.profile.lastName ? "border-destructive" : ""
                          }
                        />
                        {errors.profile.lastName && (
                          <p className="text-sm text-destructive">
                            {errors.profile.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("contactSupportEmail")}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">{t("bio")}</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileData.bio || ""}
                        onChange={(e) =>
                          setProfileData((p) => ({ ...p, bio: e.target.value }))
                        }
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                        placeholder={t("bioPlaceholder")}
                      />
                    </div>

                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("common:saving")}
                        </>
                      ) : (
                        t("common:save")
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="security">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        {t("currentPassword")}
                      </Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            currentPassword: e.target.value,
                          }))
                        }
                        className={
                          errors.password.currentPassword
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.password.currentPassword && (
                        <p className="text-sm text-destructive">
                          {errors.password.currentPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t("auth:newPassword")}</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            newPassword: e.target.value,
                          }))
                        }
                        className={
                          errors.password.newPassword
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.password.newPassword && (
                        <p className="text-sm text-destructive">
                          {errors.password.newPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        {t("auth:confirmPassword")}
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className={
                          errors.password.confirmPassword
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.password.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {errors.password.confirmPassword}
                        </p>
                      )}
                    </div>

                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("updating")}
                        </>
                      ) : (
                        t("changePassword")
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
