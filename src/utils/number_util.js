export const isMinus = (text) => {
    if(isNaN(text)) {
        return false;
    } else if(text === "") {
        return false;
    }

    // if(parseInt(text) >= 0)
    //     return false;

    return parseInt(text) < 0;
};