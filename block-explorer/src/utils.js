export function createBlockObject(number = 0, gasLimit = 0, gasUsed = 0, transactions = []) {
    return {"number": number, "gasLimit": parseInt(gasLimit), "gasUsed": parseInt(gasUsed), "transactions": transactions};
}

export function getStatGasUsed(actualBlock) {
    if (actualBlock.gasUsed === 0)
    return 0;
    return actualBlock.gasUsed / actualBlock.gasLimit * 100;
}

export function getStatGasChange(actualBlock, beforeBlock) {
    const gasLimit = actualBlock.gasLimit;
    if (actualBlock.gasUsed === 0 || beforeBlock.gasUsed === 0)
        return 0;
    return getStatGasUsed(actualBlock) - getStatGasUsed(beforeBlock);
}

export function getColorGasUsed(gasUsed) {
    if (gasUsed < 60 && gasUsed > 40) {
    return "green.400";
    } else if (gasUsed < 75 && gasUsed > 25) {
    return "orange.400";
    } else {
    return "red.400";
    }
}
  