const humanizeDate = (isoDate, includeTime = false) => {
    const date = new Date(isoDate);

    // Get time difference in milliseconds
    const now = new Date();
    const diff = now - date;
    const oneDay = 24 * 60 * 60 * 1000;

    const formattedTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;

    if (diff < oneDay && date.toDateString() === now.toDateString()) {
        return `Today${includeTime ? ` at ${formattedTime}` : ""}`;
    } else if (diff < 2 * oneDay && new Date(now - oneDay).toDateString() === date.toDateString()) {
        return `Yesterday${includeTime ? ` at ${formattedTime}` : ""}`;
    }

    const dateString = date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return includeTime
        ? `${dateString} at ${formattedTime}`
        : dateString;
};

// Example usage
// console.log(humanizeDate("2025-04-01T14:41:47.985Z", true));  // With time
// console.log(humanizeDate("2025-04-01T14:41:47.985Z", false)); // Without time

export default humanizeDate;
