
import { DrupalErrorInterface } from '..';

it('DrupalErrorInterface', () => {
    const state: DrupalErrorInterface = { 
      name: 'Life', 
      message: 'Answer', 
      code: 42, 
      getErrorCode: function(){
        return 42;
      } 
    };
    expect(state.name).toEqual('Life');
    expect(state.message).toEqual('Answer');
    expect(state.code).toEqual(42);
    expect(state.getErrorCode()).toEqual(42);
});
