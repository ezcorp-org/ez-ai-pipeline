import index from "./index.html";

const PORT = process.env.LANDING_PORT ? parseInt(process.env.LANDING_PORT) : 3001;

const server = Bun.serve({
  port: PORT,
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`
  ███████╗███████╗     █████╗ ██╗    ██████╗ ██╗██████╗ ███████╗██╗     ██╗███╗   ██╗███████╗
  ██╔════╝╚══███╔╝    ██╔══██╗██║    ██╔══██╗██║██╔══██╗██╔════╝██║     ██║████╗  ██║██╔════╝
  █████╗    ███╔╝     ███████║██║    ██████╔╝██║██████╔╝█████╗  ██║     ██║██╔██╗ ██║█████╗
  ██╔══╝   ███╔╝      ██╔══██║██║    ██╔═══╝ ██║██╔═══╝ ██╔══╝  ██║     ██║██║╚██╗██║██╔══╝
  ███████╗███████╗    ██║  ██║██║    ██║     ██║██║     ███████╗███████╗██║██║ ╚████║███████╗
  ╚══════╝╚══════╝    ╚═╝  ╚═╝╚═╝    ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝

  Landing page running at http://localhost:${server.port}

  Make it EZ.
`);
