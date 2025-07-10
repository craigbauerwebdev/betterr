import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { FirebaseProvider } from "../contexts/firebase-context";
import Home from "../components/home";

jest.mock("../contexts/firebase-context", () => ({
  useFirebase: jest.fn(() => ({
    database: {},
  })),
}));

describe("Home component", () => {});
