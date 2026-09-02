import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PrototypeApp } from "../src/App";
import { BROKEN_SOURCE } from "../src/experience/machine";
import {
  CLUE_SOURCE,
  FIELD_TEST_OUTPUT,
} from "../src/experience/mission";
import { storageKey } from "../src/experience/persistence";
import type { Variant } from "../src/experience/model";
import { installMatchMedia } from "./setup";

async function activateWithKeyboard(user: ReturnType<typeof userEvent.setup>, name: RegExp) {
  const button = screen.getByRole("button", { name });
  expect(button).toBeEnabled();
  button.focus();
  expect(button).toHaveFocus();
  await user.keyboard("{Enter}");
}

function expectOpenPath() {
  const primary = document.querySelector<HTMLButtonElement>("[data-primary-action]");
  expect(primary, `Expected a primary action on ${document.querySelector("main")?.dataset.screen}`).not.toBeNull();
  expect(primary).toBeEnabled();
}

async function replaceSource(
  user: ReturnType<typeof userEvent.setup>,
  source: string,
) {
  const editor = screen.getByRole("textbox", { name: "Python-looking source code" });
  expect(editor).not.toHaveAttribute("readonly");
  editor.focus();
  await user.clear(editor);
  await user.type(editor, source);
  expect(editor).toHaveValue(source);
}

async function completeKeyboardJourney(variant: Variant) {
  const route = variant === "direct" ? "/direct" : "/operations-center";
  const user = userEvent.setup();
  render(<PrototypeApp route={route} />);

  if (variant === "operations-center") {
    expect(screen.getByRole("heading", { name: "One Case is waiting." })).toBeVisible();
    expectOpenPath();
    await activateWithKeyboard(user, /begin first contact/i);
  }

  expect(screen.getByRole("heading", { name: /mission 001 · first contact/i })).toBeVisible();
  expectOpenPath();
  await activateWithKeyboard(user, /run message/i);

  expect(screen.getAllByText("Console contact established").length).toBeGreaterThan(0);
  await replaceSource(user, 'print("Signal received")');
  expectOpenPath();
  await activateWithKeyboard(user, /run changed message/i);

  expect(screen.getByRole("heading", { name: /your edit changed the console/i })).toBeVisible();
  expect(screen.getByLabelText("Console output")).toHaveTextContent("Signal received");
  expectOpenPath();
  await activateWithKeyboard(user, /continue to prediction/i);

  const prediction = screen.getByRole("radio", {
    name: /two lines · console online appears first/i,
  });
  prediction.focus();
  await user.keyboard(" ");
  expect(prediction).toBeChecked();
  expectOpenPath();
  await activateWithKeyboard(user, /lock prediction/i);

  expectOpenPath();
  await activateWithKeyboard(user, /inspect line 1/i);
  expect(screen.getByLabelText("Console output")).toHaveTextContent("Console online");
  expectOpenPath();
  await activateWithKeyboard(user, /inspect line 2/i);
  expect(screen.getByLabelText("Console output")).toHaveTextContent("Case ready");
  expectOpenPath();
  await activateWithKeyboard(user, /continue to the clue/i);

  await replaceSource(user, BROKEN_SOURCE);
  expectOpenPath();
  await activateWithKeyboard(user, /run the clue/i);

  const feedback = screen.getByRole("heading", { name: /investigation feedback/i }).closest("section");
  expect(feedback).not.toBeNull();
  expect(within(feedback!).getByText("Goal")).toBeVisible();
  expect(within(feedback!).getByText("Observed")).toBeVisible();
  expect(within(feedback!).getByText("Clue")).toBeVisible();
  expect(within(feedback!).getByText("Next Action")).toBeVisible();

  await replaceSource(user, CLUE_SOURCE);
  expectOpenPath();
  await activateWithKeyboard(user, /run repaired line/i);
  expect(screen.getByLabelText("Console output")).toHaveTextContent("Case ready");
  expectOpenPath();
  await activateWithKeyboard(user, /begin field test/i);

  await replaceSource(user, `print("${FIELD_TEST_OUTPUT}")`);
  expectOpenPath();
  await activateWithKeyboard(user, /submit field test/i);

  expect(screen.getByRole("heading", { name: /first contact complete/i })).toBeVisible();
  expect(screen.getByText("First execution · Introduced")).toBeVisible();
  expect(screen.getByText(/not yet shown: delayed retrieval/i)).toBeVisible();
  expectOpenPath();
  await activateWithKeyboard(
    user,
    variant === "direct"
      ? /continue to next-action panel/i
      : /continue to operations center/i,
  );

  expect(
    screen.getByRole("heading", {
      name:
        variant === "direct"
          ? /the case has a verified channel/i
          : /one new capability is online/i,
    }),
  ).toBeVisible();
  expectOpenPath();
  await activateWithKeyboard(user, /stop at this boundary/i);

  expect(screen.getByRole("heading", { name: /your investigation is paused/i })).toBeVisible();
  expect(document.querySelector("[data-terminal='true']")).toBeInTheDocument();
  expectOpenPath();
}

describe.each<Variant>(["direct", "operations-center"])(
  "%s complete browser-like keyboard path",
  (variant) => {
    it("has no dead end and covers happy, error, recovery, Field Test, and clean stop", async () => {
      await completeKeyboardJourney(variant);
    });
  },
);

describe("reload, reset, route, and reduced-motion behavior", () => {
  it("reloads the saved Mission state and announces recovery", async () => {
    const user = userEvent.setup();
    const firstRender = render(<PrototypeApp route="/direct" />);
    await activateWithKeyboard(user, /run message/i);
    expect(screen.getByRole("heading", { name: /make the response yours/i })).toBeVisible();
    firstRender.unmount();

    render(<PrototypeApp route="/direct" />);
    expect(screen.getByRole("heading", { name: /make the response yours/i })).toBeVisible();
    expect(screen.getByText("Reload state recovered")).toBeVisible();
    expect(screen.getByText("Saved prototype state recovered on reload.")).toHaveClass("sr-only");
  });

  it("resets only the active variant after explicit confirmation", async () => {
    const otherKey = storageKey("operations-center");
    window.localStorage.setItem(otherKey, "keep-this-separate");
    const user = userEvent.setup();
    render(<PrototypeApp route="/direct" />);
    await activateWithKeyboard(user, /run message/i);

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("alertdialog", { name: /reset this variant/i })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /reset variant/i }));

    expect(screen.getByRole("heading", { name: /bring the channel online/i })).toBeVisible();
    expect(screen.getByRole("textbox", { name: /python-looking source code/i })).toHaveValue(
      'print("Hello, Sophia!")',
    );
    expect(window.localStorage.getItem(otherKey)).toBe("keep-this-separate");
  });

  it("exposes an explicit reduced-motion mode and text-equivalent trace path", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<PrototypeApp route="/direct" />);

    expect(document.querySelector("[data-motion='reduced']")).toBeInTheDocument();
    expect(screen.getByText("Reduced motion")).toBeVisible();
    await activateWithKeyboard(user, /run message/i);
    await replaceSource(user, 'print("Quiet signal")');
    await activateWithKeyboard(user, /run changed message/i);
    await activateWithKeyboard(user, /continue to prediction/i);
    const unsure = screen.getByRole("radio", { name: /not sure yet/i });
    unsure.focus();
    await user.keyboard(" ");
    await activateWithKeyboard(user, /lock prediction/i);

    expect(screen.getByText(/text-equivalent trace/i)).toBeVisible();
    expect(screen.getByText("No line inspected yet.")).toBeVisible();
  });

  it("offers obvious, stable routes without requiring a rebuild", () => {
    render(<PrototypeApp route="/" />);
    expect(screen.getByRole("link", { name: /open variant a/i })).toHaveAttribute(
      "href",
      "/direct",
    );
    expect(screen.getByRole("link", { name: /open variant b/i })).toHaveAttribute(
      "href",
      "/operations-center",
    );
  });
});
