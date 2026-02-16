import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

function spaFallback(htmlFile) {
    return {
        name: 'spa-fallback',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = req.url.split('?')[0]
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
    plugins: [react(), spaFallback('customer.html')],
    appType: 'mpa',
    server: {
        port: 3001,
        open: '/customer.html',
    },
    build: {
        rollupOptions: {
            input: 'customer.html',
        },
    },
})
