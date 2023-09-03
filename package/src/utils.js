export function getColumnTypes(data, excludingColumn) {
  const types = [];

  if (data.length === 0) {
    return []; // Return empty array if data is empty
  }

  let columns = Object.keys(data[0]);

  if (excludingColumn !== undefined)
    columns = columns.filter((d) => d != excludingColumn);

  columns.forEach((column) => {
    const firstValue = data[0][column];

    if (typeof firstValue === "number") {
      types.push({ name: column, type: "quantitative" });
    } else {
      types.push({ name: column, type: "categorical" });
    }
  });

  return types;
}
