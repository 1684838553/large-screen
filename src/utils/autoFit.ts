import autofit from 'autofit.js'

export const initAutoFit = () => {
  autofit.init({
    designWidth: 1920,
    designHeight: 1080,
    renderDom: '.app',
    resize: true
  })
}
