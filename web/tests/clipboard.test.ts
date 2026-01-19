import { describe, test, expect, beforeEach, mock } from "bun:test";
import { copyToClipboard, showCopyToast } from "../clipboard";

// Mock for navigator clipboard
const mockClipboard = {
  writeText: mock(async () => {}),
};

describe("Clipboard Utility Tests", () => {
  describe("copyToClipboard", () => {
    beforeEach(() => {
      // Reset mocks
      mockClipboard.writeText.mockClear();
    });

    test("returns success when clipboard API works", async () => {
      // Setup mock
      const originalNavigator = globalThis.navigator;
      const originalWindow = globalThis.window;

      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: mockClipboard },
        writable: true,
      });
      Object.defineProperty(globalThis, "window", {
        value: { isSecureContext: true },
        writable: true,
      });

      const result = await copyToClipboard("test text");

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockClipboard.writeText).toHaveBeenCalledWith("test text");

      // Restore
      Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
      Object.defineProperty(globalThis, "window", { value: originalWindow, writable: true });
    });

    test("returns error when clipboard API fails", async () => {
      const originalNavigator = globalThis.navigator;
      const originalWindow = globalThis.window;
      const originalDocument = globalThis.document;

      const failingClipboard = {
        writeText: mock(async () => {
          throw new Error("Clipboard access denied");
        }),
      };

      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: failingClipboard },
        writable: true,
      });
      Object.defineProperty(globalThis, "window", {
        value: { isSecureContext: true },
        writable: true,
      });

      // Mock document for fallback that also fails
      const mockTextArea = {
        value: "",
        style: {},
        focus: mock(() => {}),
        select: mock(() => {}),
      };
      Object.defineProperty(globalThis, "document", {
        value: {
          createElement: () => mockTextArea,
          body: {
            appendChild: mock(() => {}),
            removeChild: mock(() => {}),
          },
          execCommand: () => false, // Fallback also fails
        },
        writable: true,
      });

      const result = await copyToClipboard("test text");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Restore
      Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
      Object.defineProperty(globalThis, "window", { value: originalWindow, writable: true });
      Object.defineProperty(globalThis, "document", { value: originalDocument, writable: true });
    });

    test("uses fallback for non-secure contexts", async () => {
      const originalNavigator = globalThis.navigator;
      const originalWindow = globalThis.window;
      const originalDocument = globalThis.document;

      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: mockClipboard },
        writable: true,
      });
      Object.defineProperty(globalThis, "window", {
        value: { isSecureContext: false }, // Non-secure context
        writable: true,
      });

      const mockTextArea = {
        value: "",
        style: {},
        focus: mock(() => {}),
        select: mock(() => {}),
      };
      Object.defineProperty(globalThis, "document", {
        value: {
          createElement: () => mockTextArea,
          body: {
            appendChild: mock(() => {}),
            removeChild: mock(() => {}),
          },
          execCommand: () => true, // Fallback succeeds
        },
        writable: true,
      });

      const result = await copyToClipboard("test text");

      expect(result.success).toBe(true);
      expect(mockTextArea.value).toBe("test text");

      // Restore
      Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
      Object.defineProperty(globalThis, "window", { value: originalWindow, writable: true });
      Object.defineProperty(globalThis, "document", { value: originalDocument, writable: true });
    });
  });

  describe("showCopyToast", () => {
    test("creates toast element with correct styling", () => {
      const originalDocument = globalThis.document;

      const mockBody = {
        appendChild: mock(() => {}),
      };

      Object.defineProperty(globalThis, "document", {
        value: {
          querySelector: () => null, // No existing toast
          createElement: (_tag: string) => {
            const el = {
              className: "",
              textContent: "",
              style: {
                cssText: "",
              },
              classList: {
                add: mock(() => {}),
              },
            };
            return el;
          },
          body: mockBody,
        },
        writable: true,
      });

      // Mock requestAnimationFrame
      const originalRAF = globalThis.requestAnimationFrame;
      Object.defineProperty(globalThis, "requestAnimationFrame", {
        value: (cb: FrameRequestCallback) => cb(0),
        writable: true,
      });

      const mockElement = {
        getBoundingClientRect: () => ({
          left: 100,
          top: 200,
          width: 50,
        }),
      } as HTMLElement;

      showCopyToast(mockElement, { message: "Test message", type: "success" });

      expect(mockBody.appendChild).toHaveBeenCalled();

      // Restore
      Object.defineProperty(globalThis, "document", { value: originalDocument, writable: true });
      Object.defineProperty(globalThis, "requestAnimationFrame", { value: originalRAF, writable: true });
    });

    test("removes existing toast before creating new one", () => {
      const originalDocument = globalThis.document;

      const existingToast = {
        remove: mock(() => {}),
      };

      const mockBody = {
        appendChild: mock(() => {}),
      };

      Object.defineProperty(globalThis, "document", {
        value: {
          querySelector: () => existingToast, // Existing toast found
          createElement: () => ({
            className: "",
            textContent: "",
            style: { cssText: "" },
            classList: { add: mock(() => {}) },
          }),
          body: mockBody,
        },
        writable: true,
      });

      const originalRAF = globalThis.requestAnimationFrame;
      Object.defineProperty(globalThis, "requestAnimationFrame", {
        value: (cb: FrameRequestCallback) => cb(0),
        writable: true,
      });

      const mockElement = {
        getBoundingClientRect: () => ({ left: 100, top: 200, width: 50 }),
      } as HTMLElement;

      showCopyToast(mockElement, { message: "New message", type: "success" });

      expect(existingToast.remove).toHaveBeenCalled();

      // Restore
      Object.defineProperty(globalThis, "document", { value: originalDocument, writable: true });
      Object.defineProperty(globalThis, "requestAnimationFrame", { value: originalRAF, writable: true });
    });
  });
});

describe("CopyResult Interface", () => {
  test("success result has correct shape", async () => {
    const originalNavigator = globalThis.navigator;
    const originalWindow = globalThis.window;

    Object.defineProperty(globalThis, "navigator", {
      value: { clipboard: { writeText: async () => {} } },
      writable: true,
    });
    Object.defineProperty(globalThis, "window", {
      value: { isSecureContext: true },
      writable: true,
    });

    const result = await copyToClipboard("text");

    expect(result).toHaveProperty("success");
    expect(typeof result.success).toBe("boolean");
    expect(result.success).toBe(true);
    if (!result.success) {
      expect(result).toHaveProperty("error");
    }

    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
    Object.defineProperty(globalThis, "window", { value: originalWindow, writable: true });
  });
});
