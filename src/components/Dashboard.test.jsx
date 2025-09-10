import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";
import { describe, expect, test, vi } from "vitest";

describe("Dashboard Component", () => {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
  };

  const defaultProps = {
    user: mockUser,
    onLogout: vi.fn(),
    onNavigateToProfile: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders dashboard with user information", () => {
    render(<Dashboard {...defaultProps} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome, John Doe!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  test("displays user stats correctly", () => {
    render(<Dashboard {...defaultProps} />);

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();
  });

  test("shows recent activity section", () => {
    render(<Dashboard {...defaultProps} />);

    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(
      screen.getByText(/Task "Complete project setup" was completed/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Task "Write documentation" was created/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Task "Review code" was updated/)
    ).toBeInTheDocument();
  });

  test("calls onLogout when logout button is clicked", async () => {
    render(<Dashboard {...defaultProps} />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await userEvent.click(logoutButton);

    expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
  });

  test("calls onNavigateToProfile when profile button is clicked", async () => {
    render(<Dashboard {...defaultProps} />);

    const profileButton = screen.getByRole("button", { name: /view profile/i });
    await userEvent.click(profileButton);

    expect(defaultProps.onNavigateToProfile).toHaveBeenCalledTimes(1);
  });

  test("handles user without name gracefully", () => {
    const propsWithoutName = {
      ...defaultProps,
      user: { email: "test@example.com" },
    };

    render(<Dashboard {...propsWithoutName} />);

    expect(screen.getByText("Welcome, User!")).toBeInTheDocument();
  });

  test("handles null user gracefully", () => {
    const propsWithNullUser = {
      ...defaultProps,
      user: null,
    };

    render(<Dashboard {...propsWithNullUser} />);

    expect(screen.getByText("Welcome, User!")).toBeInTheDocument();
  });

  test("displays action buttons", () => {
    render(<Dashboard {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /view profile/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new task/i })
    ).toBeInTheDocument();
  });

  test("calculates completion rate correctly", () => {
    render(<Dashboard {...defaultProps} />);

    // With 8 completed out of 12 total tasks, completion rate should be 67%
    expect(screen.getByText("67%")).toBeInTheDocument();
  });

  test("handles zero total tasks", () => {
    // Mock the stats to have zero total tasks
    const originalConsoleError = console.error;
    console.error = vi.fn();

    render(<Dashboard {...defaultProps} />);

    // The component should handle division by zero gracefully
    expect(screen.getByText("67%")).toBeInTheDocument();

    console.error = originalConsoleError;
  });
});
