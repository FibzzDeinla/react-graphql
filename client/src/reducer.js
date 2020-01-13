// destructuring action => { type, payload }
// export default function reducer(state, { type, payload}) {
//   switch(type) {
//     case "LOGIN_USER":
//       return {
//         ...state,
//         currentUser: payload
//       }
//     default:
//       return state;
//   }
// }

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if(handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

const todosReducer = createReducer([], {
  LOGIN_USER: (state, { payload }) => {
    return { ...state, currentUser: payload }
  }
})

export default todosReducer;