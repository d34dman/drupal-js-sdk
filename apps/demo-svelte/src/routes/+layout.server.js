// src/routes/+layout.server.js

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, fetch }) {
    const res = await fetch("/api/menu/main.json");
    const menu = res.ok ? await res.json() : [];
    return {
        session: locals.session.data,
        title: "foo",
        menu,
    };
}