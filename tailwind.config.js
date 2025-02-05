module.exports = {
  theme: {
    extend: {
      colors: {
        chess: {
          dark: 'hsl(217.2 32.6% 17.5%)',
          light: 'hsl(210 40% 98%)',
          border: 'hsl(217.2 32.6% 17.5%)',
          control: 'hsl(217.2 32.6% 17.5% / 0.2)'
        }
      },
      boxShadow: {
        chess: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'chess-inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
      }
    }
  }
}