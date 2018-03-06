module.exports = function(error, req, res, next) {
    if (error instanceof BadRequest)
        common.send(res).badRequest(error);
    common.send(res).serverError(error);
};