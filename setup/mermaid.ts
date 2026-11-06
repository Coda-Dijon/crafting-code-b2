import { defineMermaidSetup } from '@slidev/types'

// Diagrammes en noir et blanc, dans la police du thème (sinon les libellés sont mesurés
// avec une autre police et se retrouvent tronqués)
export default defineMermaidSetup(() => ({
  theme: 'neutral',
  themeVariables: {
    fontFamily: "'Lexend Variable', sans-serif",
    fontSize: '16px',
  },
}))
