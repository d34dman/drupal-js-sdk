// src/routes/+layout.server.js

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
    return {
        session: locals.session.data,
        title: 'foo',
    };
}