module.exports = function Logger(data, label) {
  const doConsoleLog = !process.env.NO_CONSOLE_LOG;

  const dataVal = data;
  const labelVal = label || `LOG_ENTRY_${Date.now()}`;

  if (doConsoleLog) {
    console.log(' ');
    console.log('***************************');
    console.log('***************************');
    console.log(labelVal, new Date());
    console.log(dataVal);
    console.log('***************************');
    console.log('***************************');
    console.log(' ');
  }
};
