import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /**
     * Listen on IPv4 as well as IPv6.
     *
     * Vite's default binds only to `[::1]`, and a browser that resolves
     * "localhost" to 127.0.0.1 — which some do, and which every curl of
     * 127.0.0.1 does — gets connection refused on a server that is running
     * perfectly. `host: true` binds both stacks, so http://localhost:5173 and
     * http://127.0.0.1:5173 both work.
     *
     * It also makes the dev server reachable from the local network, which is
     * how you open the prototype on a phone. It serves nothing but this
     * prototype and no real data, so there is nothing here to protect.
     */
    host: true,
    /** Our own lane: another OPA prototype holds 5173 on this machine. */
    port: 5183,
  },
})
