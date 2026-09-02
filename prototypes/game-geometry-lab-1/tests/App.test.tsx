import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PrototypeApp } from "../src/App";
import { BROKEN_SOURCE, CLUE_SOURCE, FIELD_TEST_OUTPUT } from "../src/experience/mission";
import { storageKey } from "../src/experience/persistence";
import type { EntryVariant } from "../src/experience/model";
import { installMatchMedia } from "./setup";

const routes: Record<EntryVariant, string> = {
  direct: "/direct",
  "hub-first": "/hub-first",
  "earned-hub": "/earned-hub",
};

async function activateWithKeyboard(
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp,
) {
  const button = screen.getByRole("button", { name });
  expect(button).toBeEnabled();
  button.focus();
  expect(button).toHaveFocus();
  await user.keyboard("{Enter}");
}

async function replaceSource(
  user: ReturnType<typeof userEvent.setup>,
  source: string,
) {
  const editor = screen.getByRole("textbox", { name: "Python source" });
  expect(editor).not.toHaveAttribute("readonly");
  editor.focus();
  await user.clear(editor);
  await user.type(editor, source);
  expect(editor).toHaveValue(source);
}

function expectPrintedOutput(expected: string) {
  const output = document.querySelector(".output-surface pre");
  expect(output).not.toBeNull();
  expect(output).toHaveTextContent(expected);
}

async function completeKeyboardJourney(variant: EntryVariant) {
  const user = userEvent.setup();
  render(<PrototypeApp route={routes[variant]} search="?causality=c" />);

  if (variant === "hub-first") {
    expect(screen.getByRole("heading", { name: "Operations Center" })).toBeVisible();
    await activateWithKeyboard(user, /begin first contact/i);
  }
  if (variant === "earned-hub") {
    expect(screen.getByRole("heading", { name: /badge event arrived at 00:43/i })).toBeVisible();
    expect(screen.queryByRole("heading", { name: /operations center/i })).not.toBeInTheDocument();
    await activateWithKeyboard(user, /begin first contact/i);
  }

  expect(screen.getByRole("heading", { name: /mission 001 · first contact/i })).toBeVisible();
  expect(screen.getAllByTestId("mission-beat")).toHaveLength(5);
  await activateWithKeyboard(user, /run first message/i);

  expect(screen.getByRole("heading", { name: /make the message yours/i })).toBeVisible();
  expect(screen.getByLabelText(/four-part causal explanation/i)).toBeVisible();
  expectPrintedOutput("Hello, Sophia!");

  await replaceSource(user, 'print("Signal received")');
  await activateWithKeyboard(user, /run changed message/i);
  expect(screen.getByRole("heading", { name: /your change reached the case/i })).toBeVisible();
  await activateWithKeyboard(user, /continue to predict/i);

  const prediction = screen.getByRole("radio", {
    name: /two lines · console online appears first/i,
  });
  prediction.focus();
  await user.keyboard(" ");
  expect(prediction).toBeChecked();
  await activateWithKeyboard(user, /lock prediction and trace/i);
  await activateWithKeyboard(user, /trace line 1/i);
  expect(screen.getByText(/one source line produced one output line/i)).toBeVisible();
  await activateWithKeyboard(user, /trace line 2/i);
  expect(screen.getByText(/two source lines produced two output lines/i)).toBeVisible();
  await activateWithKeyboard(user, /continue to investigate/i);

  await replaceSource(user, BROKEN_SOURCE);
  await activateWithKeyboard(user, /run the clue/i);
  const feedback = screen.getByRole("heading", { name: /what python noticed/i }).closest("section");
  expect(feedback).not.toBeNull();
  expect(within(feedback!).getByText("Goal")).toBeVisible();
  expect(within(feedback!).getByText("Observed")).toBeVisible();
  expect(within(feedback!).getByText("Clue")).toBeVisible();
  expect(within(feedback!).getByText("Next action")).toBeVisible();

  await replaceSource(user, CLUE_SOURCE);
  await activateWithKeyboard(user, /run repaired line/i);
  expect(screen.getByRole("heading", { name: /message boundary is repaired/i })).toBeVisible();
  await activateWithKeyboard(user, /begin the field test/i);

  await replaceSource(user, `print("${FIELD_TEST_OUTPUT}")`);
  await activateWithKeyboard(user, /submit field test/i);

  const finalHeading =
    variant === "direct"
      ? /first contact is complete/i
      : variant === "hub-first"
        ? /the center reflects what you proved/i
        : /operations center brought online/i;
  expect(screen.getByRole("heading", { name: finalHeading })).toBeVisible();
  expect(screen.getByText("First execution · Introduced")).toBeVisible();
  expect(screen.getByText(/mission 002 · identity tag/i)).toBeVisible();
  expect(screen.queryByRole("button", { name: /begin identity tag/i })).not.toBeInTheDocument();
  await activateWithKeyboard(user, /stop at this boundary/i);
  expect(screen.getByRole("heading", { name: /your investigation is paused/i })).toBeVisible();
  await activateWithKeyboard(user, /resume from here/i);
  expect(screen.getByRole("heading", { name: finalHeading })).toBeVisible();
}

describe.each<EntryVariant>(["direct", "hub-first", "earned-hub"])(
  "%s complete keyboard path",
  (variant) => {
    it("has no dead end through error, repair, Field Test, boundary, stop, and resume", async () => {
      await completeKeyboardJourney(variant);
    });
  },
);

describe("reviewer causality comparison", () => {
  it("switches A, B, and C presentation without changing the printed result", async () => {
    const user = userEvent.setup();
    render(<PrototypeApp route="/direct" search="?causality=c" />);
    await activateWithKeyboard(user, /run first message/i);

    const expectedOutput = "Hello, Sophia!";
    expect(document.querySelector("[data-causality='c']")).toBeInTheDocument();
    expectPrintedOutput(expectedOutput);

    await user.click(screen.getByRole("radio", { name: "A" }));
    expect(document.querySelector("[data-causality='a']")).toBeInTheDocument();
    expectPrintedOutput(expectedOutput);
    expect(document.querySelector("[data-folder-state]" )).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "B" }));
    expect(document.querySelector("[data-causality='b']")).toBeInTheDocument();
    expectPrintedOutput(expectedOutput);
    expect(document.querySelector("[data-folder-state='open']")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "C" }));
    expect(document.querySelector("[data-causality='c']")).toBeInTheDocument();
    expectPrintedOutput(expectedOutput);
    expect(screen.getByText(/successful result reached the first contact file/i)).toBeVisible();
  });
});

describe("reduced motion, persistence, reset, and routes", () => {
  it("preserves the same causal text and Case state with reduced motion", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<PrototypeApp route="/direct" search="?causality=c" />);
    expect(document.querySelector("[data-motion='reduced']")).toBeInTheDocument();
    expect(screen.getByText("Reduced motion")).toBeVisible();
    await activateWithKeyboard(user, /run first message/i);
    expect(document.querySelector("[data-folder-state='open']")).toBeInTheDocument();
    expect(screen.getByText(/ordered static explanation/i)).toBeVisible();
    expect(screen.getByText(/successful result reached the first contact file/i)).toBeVisible();
  });

  it("reloads the exact route state and reports restoration only in reviewer controls", async () => {
    const user = userEvent.setup();
    const first = render(<PrototypeApp route="/direct" search="?causality=b" />);
    await activateWithKeyboard(user, /run first message/i);
    first.unmount();
    render(<PrototypeApp route="/direct" search="?causality=b" />);
    expect(screen.getByRole("heading", { name: /make the message yours/i })).toBeVisible();
    expect(screen.getByText("Saved state restored")).toBeVisible();
  });

  it("resets only the active route after confirmation", async () => {
    const otherKey = storageKey("earned-hub");
    window.localStorage.setItem(otherKey, "keep-separate");
    const user = userEvent.setup();
    render(<PrototypeApp route="/direct" search="?causality=c" />);
    await activateWithKeyboard(user, /run first message/i);
    await user.click(screen.getByRole("button", { name: /reset route/i }));
    expect(screen.getByRole("alertdialog", { name: /reset this route/i })).toBeVisible();
    await user.click(screen.getAllByRole("button", { name: /reset route/i }).at(-1)!);
    expect(screen.getByRole("heading", { name: /run the waiting message/i })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Python source" })).toHaveValue('print("Hello, Sophia!")');
    expect(window.localStorage.getItem(otherKey)).toBe("keep-separate");
  });

  it("exposes stable reviewer links to every route", () => {
    render(<PrototypeApp route="/" />);
    expect(screen.getByRole("link", { name: /variant a · direct mission/i })).toHaveAttribute("href", "/direct?causality=c");
    expect(screen.getByRole("link", { name: /variant b · hub first/i })).toHaveAttribute("href", "/hub-first?causality=c");
    expect(screen.getByRole("link", { name: /variant c · earned hub/i })).toHaveAttribute("href", "/earned-hub?causality=c");
  });
});
