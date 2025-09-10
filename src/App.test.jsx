import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { describe, expect, test, vi } from "vitest";

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders login screen by default", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("navigates to dashboard after successful login", async () => {
    render(<App />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(loginButton);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome, john!")).toBeInTheDocument();
  });

  test("navigates to profile from dashboard", async () => {
    render(<App />);

    // Login first
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "jane@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(loginButton);

    // Navigate to profile
    const profileButton = screen.getByRole("button", { name: /view profile/i });
    await userEvent.click(profileButton);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("jane")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  test("navigates back to dashboard from profile", async () => {
    render(<App />);

    // Login and navigate to profile
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "bob@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(loginButton);

    const profileButton = screen.getByRole("button", { name: /view profile/i });
    await userEvent.click(profileButton);

    // Navigate back to dashboard
    const backButton = screen.getByRole("button", {
      name: /back to dashboard/i,
    });
    await userEvent.click(backButton);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome, bob!")).toBeInTheDocument();
  });

  test("logs out and returns to login screen", async () => {
    render(<App />);

    // Login first
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "alice@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(loginButton);

    // Logout
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await userEvent.click(logoutButton);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  test("saves profile changes and updates user data", async () => {
    render(<App />);

    // Login and navigate to profile
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(loginButton);

    const profileButton = screen.getByRole("button", { name: /view profile/i });
    await userEvent.click(profileButton);

    // Edit profile
    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("test");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Test User");

    const bioInput = screen.getByLabelText(/bio/i);
    await userEvent.type(bioInput, "Software Developer");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    // Navigate back to dashboard
    const backButton = screen.getByRole("button", {
      name: /back to dashboard/i,
    });
    await userEvent.click(backButton);

    expect(screen.getByText("Welcome, Test User!")).toBeInTheDocument();
  });

  test("handles profile validation errors", async () => {
    render(<App />);

    // Login and navigate to profile
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(loginButton);

    const profileButton = screen.getByRole("button", { name: /view profile/i });
    await userEvent.click(profileButton);

    // Edit profile with invalid data
    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("test");
    await userEvent.clear(nameInput);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  test("cancels profile editing and resets form", async () => {
    render(<App />);

    // Login and navigate to profile
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(loginButton);

    const profileButton = screen.getByRole("button", { name: /view profile/i });
    await userEvent.click(profileButton);

    // Edit profile
    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("test");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Modified Name");

    // Cancel editing
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    // Name should be reset to original value
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /edit profile/i })
    ).toBeInTheDocument();
  });
});
