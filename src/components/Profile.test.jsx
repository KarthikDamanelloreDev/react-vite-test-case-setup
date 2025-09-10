import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "./Profile";
import { describe, expect, test, vi } from "vitest";

describe("Profile Component", () => {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    bio: "Software developer",
    location: "New York",
  };

  const defaultProps = {
    user: mockUser,
    onSave: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders profile with user information", () => {
    render(<Profile {...defaultProps} />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /edit profile/i })
    ).toBeInTheDocument();
  });

  test("displays form fields with user data", () => {
    render(<Profile {...defaultProps} />);

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123-456-7890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Software developer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
  });

  test("shows avatar with first letter of name", () => {
    render(<Profile {...defaultProps} />);

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  test("enables editing mode when edit button is clicked", async () => {
    render(<Profile {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /edit profile/i })
    ).not.toBeInTheDocument();
  });

  test("allows editing form fields in edit mode", async () => {
    render(<Profile {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("John Doe");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Smith");

    expect(nameInput).toHaveValue("Jane Smith");
  });

  test("validates required fields", async () => {
    render(<Profile {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("John Doe");
    const emailInput = screen.getByDisplayValue("john@example.com");

    await userEvent.clear(nameInput);
    await userEvent.clear(emailInput);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("validates email format", async () => {
    render(<Profile {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const emailInput = screen.getByDisplayValue("john@example.com");
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "invalid-email");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    expect(screen.getByText("Email is invalid")).toBeInTheDocument();
  });

  test("validates phone number format", async () => {
    render(<Profile {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const phoneInput = screen.getByDisplayValue("123-456-7890");
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, "invalid-phone-123abc");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    expect(screen.getByText("Phone number is invalid")).toBeInTheDocument();
  });

  test("calls onSave with form data when save is clicked", async () => {
    render(<Profile {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("John Doe");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Smith");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    expect(defaultProps.onSave).toHaveBeenCalledWith({
      name: "Jane Smith",
      email: "john@example.com",
      phone: "123-456-7890",
      bio: "Software developer",
      location: "New York",
    });
  });

  test("calls onBack when back button is clicked", async () => {
    render(<Profile {...defaultProps} />);

    const backButton = screen.getByRole("button", {
      name: /back to dashboard/i,
    });
    await userEvent.click(backButton);

    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  test("cancels editing and resets form data", async () => {
    render(<Profile {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("John Doe");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Smith");

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /edit profile/i })
    ).toBeInTheDocument();
  });

  test("clears errors when user starts typing", async () => {
    render(<Profile {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("John Doe");
    await userEvent.clear(nameInput);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    expect(screen.getByText("Name is required")).toBeInTheDocument();

    await userEvent.type(nameInput, "New Name");
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
  });

  test("handles user without optional fields", () => {
    const userWithoutOptional = {
      name: "John Doe",
      email: "john@example.com",
    };

    const props = {
      ...defaultProps,
      user: userWithoutOptional,
    };

    render(<Profile {...props} />);

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
  });
});

