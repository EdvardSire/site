export default {
    async fetch(req, env) {
        const key = "data"
        const auth_key = new URL(req.url).searchParams.get("auth")
        
        if (auth_key !== env.AUTH) {
            return new Response("Unauthorized", { status: 401 })
        }

        const data = JSON.parse(await env.KV.get(key)) || {}

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // It's guarded by auth
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders })
        }

        if (req.method === "GET") {
            return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders })

        } else if (req.method === "POST") {
            const value = await req.json()
            const { title, content } = value  
            const timestamp = Date.now()
            data[timestamp] = { title, content, timestamp }
            await env.KV.put(key, JSON.stringify(data))
            return new Response("Created", { status: 201, headers: corsHeaders })

        } else if (req.method === "PUT") {
            const value = await req.json()
            const { title, content, timestamp } = value
            if (!timestamp || !data[timestamp]) {
                return new Response("Entry not found", { status: 404, headers: corsHeaders })
            }
            data[timestamp] = { title, content, timestamp }
            await env.KV.put(key, JSON.stringify(data))
            return new Response("Updated", { status: 200, headers: corsHeaders })

        } else if (req.method === "DELETE") {
            const { timestamp } = await req.json()
            if (!timestamp || !data[timestamp]) {
                return new Response("Entry not found", { status: 404, headers: corsHeaders })
            }
            delete data[timestamp]
            await env.KV.put(key, JSON.stringify(data))
            return new Response("Deleted", { status: 200, headers: corsHeaders })

        } else {
            return new Response("Method Not Allowed", { status: 405, headers: corsHeaders })
        }
    }
}

