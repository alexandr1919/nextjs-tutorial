export const delay = (timeout) => new Promise((resolve) => {
    setTimeout(() => resolve(1), timeout);
})