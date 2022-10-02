export function getCurrentDate(separator = '-') {
    let newDate = new Date(new Date().toUTCString());
    let date = newDate.getUTCDate();
    let month = newDate.getUTCMonth() + 1;
    let year = newDate.getUTCFullYear();

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`;
}
