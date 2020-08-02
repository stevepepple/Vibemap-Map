import React from "react";
import renderer from "react-test-renderer";
import Main from "../pages/Main";

it("renders Main page correctly", () => {
    const tree = renderer
        .create(
            <Main />
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

test("hello", async () => {
    const yo = await Promise.resolve("hello");
    expect(yo).toEqual("hello");
});