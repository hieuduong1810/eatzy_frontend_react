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
    plugins: [react(), spaFallback('restaurant.html')],
    appType: 'mpa',
    server: {
        port: 3003,
        open: '/restaurant.html',
    },
    build: {
        rollupOptions: {
            input: 'restaurant.html',
        },
    },
})
