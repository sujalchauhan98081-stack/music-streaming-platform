import { useState } from "react";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { updateProfileApi, changePasswordApi } from "../api/authApi";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await updateProfileApi(profileForm);
      setUser(data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setPasswordLoading(true);
    try {
      await changePasswordApi({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="pt-6 max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-textSecondary text-sm capitalize">{user?.role} account</p>
        </div>
      </div>

      {/* --- Edit Profile --- */}
      <section className="bg-surface rounded-lg p-6 mb-6">
        <h2 className="font-bold mb-4">Profile Details</h2>
        <form onSubmit={handleProfileSubmit}>
          <InputField
            label="Name"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          />
          <InputField
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
          />
          <Button type="submit" loading={profileLoading}>
            Save Changes
          </Button>
        </form>
      </section>

      {/* --- Change Password --- */}
      <section className="bg-surface rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-textSecondary" />
          <h2 className="font-bold">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <InputField
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
          <InputField
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
          <InputField
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          />
          <Button type="submit" loading={passwordLoading}>
            Update Password
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Profile;