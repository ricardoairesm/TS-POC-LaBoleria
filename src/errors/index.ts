
function conflictError(message) {
    return {
      name: "ConflictError",
      message,
    };
  }
  
  export default {
    conflictError,
  }