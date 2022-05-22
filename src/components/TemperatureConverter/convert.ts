function convertToCeilcius(value: string) {
  return (((parseInt(value) - 32) * 5) / 9).toString();
}

function convertToFahrenheit(value: string) {
  return ((parseInt(value) * 9) / 5 + 32).toString();
}

export { convertToCeilcius, convertToFahrenheit };
