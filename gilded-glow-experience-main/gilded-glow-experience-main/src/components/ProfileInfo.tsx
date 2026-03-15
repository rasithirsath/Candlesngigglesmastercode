import { useState } from "react";

const ProfileInfo = ({ user }) => {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
  });

  return (
    <div>
      <h2 className="text-2xl text-primary mb-6">Profile Information</h2>

      <div className="space-y-4">
        <input value={form.name} disabled={!editing} />
        <input value={form.email} disabled />
        <input value={form.phone} disabled={!editing} />
      </div>

      <button onClick={() => setEditing(!editing)}>
        {editing ? "Save" : "Edit"}
      </button>
    </div>
  );
};

export default ProfileInfo;
