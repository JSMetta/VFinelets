import moment from "moment"
export default {
    assert: (condition, message) => {
        if (!condition) {
            throw message || "Assertion failed";
        }
    },
    dateFormat(date, pattern = 'YYYY-MM-DD') {
        return moment(new Date(date)).format(pattern)
    },
}