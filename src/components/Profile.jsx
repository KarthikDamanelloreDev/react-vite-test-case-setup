import { useState, useEffect } from "react";
import styles from "./styles.module.css";

const Profile = ({ user, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      onSave(formData);
      setIsEditing(false);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Back to Dashboard
          </button>
          <h1 className={styles.title}>Profile</h1>
        </header>

        <div className={styles.profileContent}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className={styles.profileInfo}>
              <h2>{formData.name || "User"}</h2>
              <p>{formData.email}</p>
            </div>
            {!isEditing && (
              <button
                className={styles.editBtn}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={errors.name ? styles.errorInput : ""}
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={errors.email ? styles.errorInput : ""}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Optional"
                className={errors.phone ? styles.errorInput : ""}
              />
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Optional"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows="4"
                className={styles.textarea}
              />
            </div>

            {isEditing && (
              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  Cancel
                </button>
                <button className={styles.saveBtn} onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

