module.exports = function () {
  return {
    presets: [[require.resolve('@babel/preset-env'), { targets: { chrome: '67' }, useBuiltIns: 'usage', corejs: 2 }]],
    env: {
      test: {
        presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' } }]],
      },
    },
  }
}
