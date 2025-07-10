import { render, screen, fireEvent } from "@testing-library/react";
import { NavBar } from "../UI/components/navigation/NavBar";
import {
  UsersListerStateContext,
  UsersListerDispatchContext,
  UsersListerInitialState,
  usersListerlocalReducer,
} from "../reducers/auth.reducer";
import { UserRepositoryImpl } from "../network/repositories/user.respository";
import { useReducer, FC, ReactNode } from "react";
import { vi } from "vitest";

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    usersListerlocalReducer,
    UsersListerInitialState
  );
  return (
    <UsersListerStateContext.Provider value={state}>
      <UsersListerDispatchContext.Provider value={dispatch}>
        {children}
      </UsersListerDispatchContext.Provider>
    </UsersListerStateContext.Provider>
  );
};

beforeEach(() => {
  localStorage.clear();
});

function mockUser() {
  vi.spyOn(UserRepositoryImpl.prototype, "getMe").mockResolvedValue({
    id: "1",
    email: "test@example.com",
    firstname: "John",
    lastname: "Doe",
  });
}

describe("NavBar collapsed state", () => {
  test("loads collapsed state from localStorage", async () => {
    localStorage.setItem("navCollapsed", "true");
    mockUser();
    render(<NavBar isOpen={true} onClose={() => {}} />, { wrapper: Wrapper });
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  test("toggle collapse on button click", async () => {
    localStorage.setItem("navCollapsed", "false");
    mockUser();
    render(<NavBar isOpen={true} onClose={() => {}} />, { wrapper: Wrapper });
    const btn = screen.getByLabelText("Réduire la navigation");
    fireEvent.click(btn);
    expect(localStorage.getItem("navCollapsed")).toBe("true");
  });
});
