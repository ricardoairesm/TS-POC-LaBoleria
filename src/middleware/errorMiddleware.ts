
export function handleApplicationErrors(err, req, res, next) {
    if (err.name === "ConflictError") {
      return res
        .status(404)
        .send({ message: err.message});
    }

  }