import {Axios} from 'axios';
it('DrupalClientInstance', () => {
    const foo = new Axios({});
    expect(foo instanceof Axios).toBe(true);
});
