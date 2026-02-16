import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

// Plugin to serve a custom HTML file as the SPA entry.
// Runs BEFORE Vite's built-in middleware so it intercepts `/` before
// Vite can serve the default `index.html`.
function spaFallback(htmlFile) {
    return {
        name: 'spa-fallback',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = req.url.split('?')[0] // strip query string
                // Only rewrite "page navigation" requests — skip Vite internals & files
                if (
                    !url.includes('.') &&
                    !url.startsWith('/@') &&
                    !url.startsWith('/__') &&
                    !url.startsWith('/src/') &&
                    !url.startsWith('/node_modules/')
                ) {
                    req.url = `/${htmlFile}`
                }
                next()
            })
        },
    }
}

export default defineConfig({
    plugins: [react(), spaFallback('admin.html')],
    appType: 'mpa',
    server: {
        port: 3000,
        open: '/admin.html',
    },
    build: {
        rollupOptions: {
            input: 'admin.html',
        },
    },
})
