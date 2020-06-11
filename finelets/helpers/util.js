export default {
    assert: (condition, message) => {
        if (!condition) {
            throw message || "Assertion failed";
        }
    }
}