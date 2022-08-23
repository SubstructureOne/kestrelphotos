export default {
    async fetch(request, env) {
        let url = new URL(request.url);
        if (url.pathname.startsWith('/album/')) {
            console.log("Redirecting to appropriate URL")
            url.pathname = "/album/[albumId].html"
            request.url = url.toString()
            return env.ASSETS.fetch(request)
        }
        return env.ASSETS.fetch(request);
    },
}
