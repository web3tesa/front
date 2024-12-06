import { ThemeProvider, createTheme } from '@mui/material'
import React, { HTMLAttributes } from 'react'

const theme = createTheme({
    palette: {
        primary: {

        },
        // add more ...
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    color: 'white',
                    backgroundColor: '#FFA015',
                    boxShadow: "none",
                },
                root: {
                    transition: 'transform 200ms ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        color: 'white',
                        backgroundColor: '#FFA015',
                    },
                    '&:active': {
                        transform: 'scale(0.98)',
                    },
                },
            }
        }
    }
})
export default function Theme(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    )
}
