function notFound(res) {
    res.status(404).send('The genre with the specified ID does not exist');
}

function notAuthorized(res, error) {
    res.status(401).send(error ? getErrorMessage(error) : 'No valid authorizations');
}

function forbidden(res, error) {
    res.status(403).send(error ? getErrorMessage(error) : 'You do not have access to this resource');
}

function badRequest(res, error) {
    res.status(400).send(getErrorMessage(error));
}

function serverError(res, error) {
    res.status(500).send(getErrorMessage(error));
}

function getErrorMessage(error) {
    if (!error) return "";
    if (error.details)
        return error.details
            .map((e) => e.message)
            .reduce((current, next) => !current ? next : `${current},\n${next}`)
    if (error.message)
        return error.message;

    return error;
}

module.exports.send = function(response) {
    return {
        notFound: () => notFound(response),
        badRequest: (error) => badRequest(response, error),
        serverError: (error) => serverError(response, error),
        notAuthorized: (error) => notAuthorized(response, error),
        forbidden: (error) => forbidden(response, error)
    }
};