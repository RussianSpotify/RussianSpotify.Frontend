import {formatDuration} from "../formatDuration";

test("formatDurationOnlySeconds", () => {
    expect(formatDuration(15)).toBe("0m 15s");
})

test("formatDurationSecondsAndMinutes", () => {
    expect(formatDuration(111)).toBe("1m 51s");
})