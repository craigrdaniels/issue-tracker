export const colorPalette: string[] = [
  '#ffb3ba',
  '#ffdfba',
  '#ffffba',
  '#baffc9',
  '#bae1ff'
]

export const getRandomColor = (): string =>
  colorPalette[Math.floor(Math.random() * colorPalette.length)]
