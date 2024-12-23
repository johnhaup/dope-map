export const parseInput = (input) => {
  try {
    return eval(`(${input})`);
  } catch (e) {
    console.warn("Invalid input format, treating as string:", input);
    return input;
  }
};
