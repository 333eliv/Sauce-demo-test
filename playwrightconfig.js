module.exports = {
  testDir: 'tests',

  use: {
    headless: false,
    trace: 'on',
    screenshot: 'on',
  },
  use: {
    trace: 'on',
  },
  reporter: [
    ['html', { open: 'always' }]
  ]
};