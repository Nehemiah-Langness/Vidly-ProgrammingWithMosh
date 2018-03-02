function notFound(res) {
    res.status(404).send('The genre with the specified ID does not exist');
}

function badRequest(res, error) {
    res.status(400).send(getErrorMessage(error));
}

function serverError(res, error) {
    res.status(500).send(getErrorMessage(error));
}

function getErrorMessage(error) {
    if (!error) return "";
    return error.details
        .map((e) => e.message)
        .reduce((current, next) => !current ? next : `${current},\n${next}`)
}

module.exports.send = function(response) {
    return {
        notFound: () => notFound(response),
        badRequest: (error) => badRequest(response, error),
        serverError: (error) => serverError(response, error)
    }
};