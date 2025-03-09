import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`

    html, body {
        margin: 0;
        padding: 0;
        font-family: "Arial", sans-serif;
        font-size: 12px;
    }

    #root {
        padding: 0;
        margin: 0;
    }

    * {
        box-sizing: border-box;
    }
`
