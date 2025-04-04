const humanizeDate = (isoDate) => {
    const date = new Date(isoDate);

    // Get time difference in milliseconds
    const now = new Date();
    const diff = now - date;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay && date.toDateString() === now.toDateString()) {
        return `Today at ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    } else if (diff < 2 * oneDay && new Date(now - oneDay).toDateString() === date.toDateString()) {
        return `Yesterday at ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    }

    return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Example usage
// console.log(humanizeDate("2025-04-01T14:41:47.985Z"));
export default humanizeDate;