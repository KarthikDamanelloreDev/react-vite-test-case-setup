import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { describe, expect, test, vi } from "vitest";

describe("Login Component", () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders login form with input fields and button", () => {
    render(<Login onLogin={mockOnLogin} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    await userEvent.click(loginButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  test("shows error for invalid email format", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "validpass");
    await userEvent.click(loginButton);

    expect(await screen.findByText(/email is invalid/i)).toBeInTheDocument();
  });

  test("shows error when password is too short", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "123");
    await userEvent.click(loginButton);

    expect(
      await screen.findByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
  });

  test("calls onLogin with user data when form is valid", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(loginButton);

    expect(mockOnLogin).toHaveBeenCalledWith({
      email: "john@example.com",
      name: "john",
    });
  });
});
